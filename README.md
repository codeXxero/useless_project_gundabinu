# Cosmic Jathakam

A deliberately useless AI horoscope website powered by Gemini, Open-Meteo and browser geolocation.

## Run locally

```bash
npm install
cp .env.example .env.local
```

Add your Gemini API key to `.env.local`:

```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash-lite
```

Then:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Vercel

Add `GEMINI_API_KEY` and `GEMINI_MODEL` under Vercel Project Settings → Environment Variables, then redeploy. Never expose the Gemini key through a `NEXT_PUBLIC_` variable.
