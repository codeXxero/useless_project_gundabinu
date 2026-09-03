import { NextResponse } from "next/server";
import { getWeather } from "@/lib/weather";
import { generateJathakamWithGemini } from "@/lib/gemini";

type Coordinates = {
  latitude: number;
  longitude: number;
};

async function geocodeBirthplace(place: string): Promise<Coordinates | null> {
  try {
    const url = new URL(
      "https://geocoding-api.open-meteo.com/v1/search"
    );
    url.searchParams.set("name", place);
    url.searchParams.set("count", "1");
    url.searchParams.set("language", "en");
    url.searchParams.set("format", "json");

    const response = await fetch(url.toString(), { cache: "no-store" });

    if (!response.ok) return null;

    const data = await response.json();
    const result = data?.results?.[0];

    const latitude = Number(result?.latitude);
    const longitude = Number(result?.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return null;
    }

    return { latitude, longitude };
  } catch {
    return null;
  }
}

function validateCoordinates(
  latitude: unknown,
  longitude: unknown
): Coordinates | null {
  const lat = Number(latitude);
  const lon = Number(longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return null;
  }

  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return null;
  }

  return {
    latitude: lat,
    longitude: lon,
  };
}

function validateDob(dob: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    return "Please enter a valid date of birth.";
  }

  const [year, month, day] = dob.split("-").map(Number);
  const date = new Date(`${dob}T00:00:00Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month ||
    date.getUTCDate() !== day
  ) {
    return "Please enter a valid date of birth.";
  }

  const currentYear = new Date().getUTCFullYear();

  if (year < 1900 || year > currentYear) {
    return `Date of birth must be between 1900 and ${currentYear}.`;
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const dob = String(body?.dob ?? "").trim();
    const birthplace = String(body?.birthplace ?? "").trim();

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

    // Prefer the user's browser location. On Vercel, server-side IP
    // geolocation would locate the Vercel server rather than the user.
    let coordinates = validateCoordinates(
      body?.latitude,
      body?.longitude
    );
    let locationSource = coordinates
      ? "current location"
      : "birthplace";

    // If location permission is denied or unavailable, use birthplace.
    if (!coordinates) {
      coordinates = await geocodeBirthplace(birthplace);
    }

    if (!coordinates) {
      return NextResponse.json(
        {
          error:
            "Could not locate that birthplace. Try a more specific place, such as 'Kochi, Kerala'.",
        },
        { status: 400 }
      );
    }

    const weather = await getWeather(
      coordinates.latitude,
      coordinates.longitude
    );

    const horoscope = await generateJathakamWithGemini({
      dob,
      birthplace,
      weather,
    });

    return NextResponse.json({
      horoscope,
      weather,
      locationSource,
    });
  } catch (error) {
    console.error("Jathakam API error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong while generating the jathakam.",
      },
      { status: 500 }
    );
  }
}
