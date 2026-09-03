"use client";

import { FormEvent, useMemo, useState } from "react";

type Weather = {
  temperature: number;
  feelsLike: number;
  humidity: number;
  precipitation: number;
  wind: number;
  code: number;
};

export default function JathakamApp() {
  const [dob, setDob] = useState("");
  const [birthplace, setBirthplace] = useState("");
  const [loading, setLoading] = useState(false);
  const [horoscope, setHoroscope] = useState("");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [location, setLocation] = useState("");
  const [locationSource, setLocationSource] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const maxDob = useMemo(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }, []);

  async function generate(e: FormEvent) {
    e.preventDefault();

    setError("");
    setHoroscope("");
    setWeather(null);
    setLocation("");
    setLocationSource("");
    setCopied(false);

    if (!dob || !birthplace.trim()) {
      setError("Enter both your date of birth and birthplace.");
      return;
    }

    const year = Number(dob.slice(0, 4));
    const currentYear = new Date().getFullYear();

    if (!Number.isInteger(year) || year < 1900 || year > currentYear) {
      setError(`Date of birth must be between 1900 and ${currentYear}.`);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/jathakam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dob,
          birthplace: birthplace.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed.");
      }

      setHoroscope(data.horoscope);
      setWeather(data.weather);
      setLocation(data.location);
      setLocationSource(data.locationSource || "birthplace");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!horoscope) return;

    try {
      await navigator.clipboard.writeText(horoscope);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setError("Could not copy the jathakam.");
    }
  }

  return (
    <main className="page">
      <section className="hero">
        <div className="eyebrow">COSMIC WEATHER DEPARTMENT • EST. NEVER</div>

        <h1>🔮 Cosmic Jathakam</h1>

        <p>
          Ninte DOB-um birthplace-um kodukku. Current weather nokki cosmic
          department ninte entire life predict cheyyum.
        </p>
      </section>

      <section className="panel">
        <form onSubmit={generate}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="dob">Date of Birth</label>

              <input
                id="dob"
                type="date"
                value={dob}
                min="1900-01-01"
                max={maxDob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="birthplace">Birthplace</label>

              <input
                id="birthplace"
                type="text"
                value={birthplace}
                onChange={(e) => setBirthplace(e.target.value)}
                placeholder="Kochi, Kerala"
                maxLength={120}
                required
              />
            </div>
          </div>

          <button className="generate" disabled={loading} type="submit">
            {loading
              ? "🔮 Consulting Cosmic Department..."
              : "🔮 Reveal My Destiny"}
          </button>
        </form>

        {loading && (
          <div className="status" aria-live="polite">
            <div className="spinner" />
            <div>Grahangal calculate cheyyunnu...</div>
            <div>Weather cosmic signal aakki maattunnu...</div>
            <div>Destiny unnecessarily investigate cheyyunnu...</div>
          </div>
        )}

        {error && <div className="error">{error}</div>}

        {weather && (
          <section className="weather">
            <div className="weather-card">
              <span>Weather Location</span>
              <strong>{location}</strong>
              <small>
                {locationSource === "birthplace"
                  ? "Based on birthplace"
                  : "Based on approximate current location"}
              </small>
            </div>

            <div className="weather-card">
              <span>Temperature</span>
              <strong>{weather.temperature}°C</strong>
            </div>

            <div className="weather-card">
              <span>Humidity</span>
              <strong>{weather.humidity}%</strong>
            </div>

            <div className="weather-card">
              <span>Wind</span>
              <strong>{weather.wind} km/h</strong>
            </div>
          </section>
        )}

        {horoscope && (
          <section className="result">
            <div className="result-head">
              <h2>🔮 Ninte Destiny</h2>

              <button className="copy" type="button" onClick={copy}>
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <article className="horoscope">{horoscope}</article>
          </section>
        )}
      </section>

      <div className="footer">
        Scientifically questionable. Cosmically confident. Completely
        fictional.
      </div>
    </main>
  );
}
