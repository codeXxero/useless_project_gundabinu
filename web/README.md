# Cosmic Jathakam — Procedural Edition

No Gemini. No Groq. No Ollama. No LLM.

Stack:
- Next.js
- TypeScript
- React
- Open-Meteo
- A deterministic procedural horoscope engine

The same DOB + birthplace produces the same style of destiny because they seed the random generator.

## Run

```bash
npm install
npm run dev
```

Open the local URL printed by Next.js.

The server obtains an approximate current location from IP, fetches current weather from Open-Meteo, and feeds the weather into the procedural generator.

All horoscope text is hard-coded Manglish templates. No AI API key is required.
