import { NextResponse } from "next/server";
import { getWeather } from "@/lib/weather";
import { generateJathakam } from "@/lib/engine";

type Coordinates = {
  latitude: number;
  longitude: number;
  name: string;
};

async function geocodeBirthplace(place: string): Promise<Coordinates | null> {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", place);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!response.ok) return null;

  const data = await response.json();
  const result = data?.results?.[0];

  if (
    !result ||
    !Number.isFinite(Number(result.latitude)) ||
    !Number.isFinite(Number(result.longitude))
  ) {
    return null;
  }

  const name = [result.name, result.admin1, result.country]
    .filter(Boolean)
    .join(", ");

  return {
    latitude: Number(result.latitude),
    longitude: Number(result.longitude),
    name: name || place,
  };
}

async function getCurrentLocation(): Promise<Coordinates | null> {
  try {
    const response = await fetch("https://ipapi.co/json/", {
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data = await response.json();
    const latitude = Number(data.latitude);
    const longitude = Number(data.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return null;
    }

    return {
      latitude,
      longitude,
      name:
        [data.city, data.region, data.country_name]
          .filter(Boolean)
          .join(", ") || "Current location",
    };
  } catch {
    return null;
  }
}

function validateDob(dob: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    return "Please enter a valid date of birth.";
  }

  const date = new Date(`${dob}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return "Please enter a valid date of birth.";
  }

  const year = date.getFullYear();
  const now = new Date();
  const currentYear = now.getFullYear();

  if (year < 1900 || year > currentYear) {
    return `Date of birth must be between 1900 and ${currentYear}.`;
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const dob = String(body.dob ?? "").trim();
    const birthplace = String(body.birthplace ?? "").trim();

    if (!dob || !birthplace) {
      return NextResponse.json(
        { error: "DOB and birthplace are required." },
        { status: 400 }
      );
    }

    const dobError = validateDob(dob);
    if (dobError) {
      return NextResponse.json({ error: dobError }, { status: 400 });
    }

    // Birthplace is the primary location because it is already supplied
    // by the user. This avoids failing just because IP geolocation is blocked.
    let coordinates = await geocodeBirthplace(birthplace);
    let locationSource = "birthplace";

    // If birthplace geocoding fails, fall back to the user's approximate
    // current IP location instead of immediately failing.
    if (!coordinates) {
      coordinates = await getCurrentLocation();
      locationSource = "current location";
    }

    if (!coordinates) {
      return NextResponse.json(
        {
          error:
            "Could not find that birthplace. Try a more specific place, such as 'Kochi, Kerala'.",
        },
        { status: 400 }
      );
    }

    const weather = await getWeather(
      coordinates.latitude,
      coordinates.longitude
    );

    const horoscope = generateJathakam({
      dob,
      birthplace,
      weather,
    });

    return NextResponse.json({
      horoscope,
      weather,
      location: coordinates.name,
      locationSource,
    });
  } catch (error) {
    console.error("Jathakam API error:", error);

    return NextResponse.json(
      { error: "Something went wrong while generating the jathakam." },
      { status: 500 }
    );
  }
}
