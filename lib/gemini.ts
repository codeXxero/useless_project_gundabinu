import { GoogleGenAI } from "@google/genai";
import { Weather } from "./weather";

type JathakamInput = {
  dob: string;
  birthplace: string;
  weather: Weather;
};

export async function generateJathakamWithGemini({
  dob,
  birthplace,
  weather,
}: JathakamInput): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is missing. Add it to .env.local for local development or Vercel Environment Variables for deployment."
    );
  }

  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
Nee aanu Cosmic Jathakam Department le overconfident chief astrologer.

DOB: ${dob}
Birthplace: ${birthplace}

Current weather:
Temperature: ${weather.temperature}°C
Feels like: ${weather.feelsLike}°C
Humidity: ${weather.humidity}%
Rain: ${weather.precipitation} mm
Wind: ${weather.wind} km/h

Oru SHORT, hilarious, completely useless whole-life jathakam undakkuka.

STYLE:
- ONLY Manglish: Malayalam English/Latin letters-il ezhuthuka.
- Malayalam Unicode characters use cheyyaruthu.
- Natural Kerala slang venam.
- English essay pole ezhutharuthu.
- Confidence 100%, logic 0%.
- Astrology + random stupid predictions mix cheyyuka.
- Current weather-ne cosmic influence aakki comedy cheyyuka.
- Every section-il different joke venam.
- Overly poetic or serious aakaruthu.
- AI assistant pole samsarikkaruthu.
- Serious medical, legal or financial advice venda.
- Coordinates, IP, technical location information onnum mention cheyyaruthu.

VERY IMPORTANT:
Output ONLY the final jathakam.
Thinking process, analysis, planning, reasoning, explanations onnum output cheyyaruthu.
"Here's my thinking process" pole thudangaruthu.
"Let's analyze" ennum parayaruthu.
Directly horoscope start cheyyuka.

FORMAT:

🔮 YOUR WHOLE LIFE JATHAKAM

PERSONALITY
1-2 short funny sentences.

 CHILDHOOD
1-2 short funny sentences.

TEENAGE YEARS
1-2 short funny sentences.

 EDUCATION
1-2 short funny sentences.

CAREER
1-2 short funny sentences.

20s
1-2 short funny sentences.

 MONEY
1-2 short funny sentences.

LOVE LIFE
1-2 short funny sentences.

 MARRIAGE
1-2 short funny sentences.

FAMILY
1-2 short funny sentences.

📈 30s
1-2 short funny sentences.

📊 40s
1-2 short funny sentences.

💎 50s
1-2 short funny sentences.

OLD AGE
1-2 short funny sentences.

 FINAL DESTINY
1-2 short funny sentences.

 LUCKY COLOR
Exactly one color.

LUCKY NUMBER
Exactly one number between 10 and 99.

WEATHER-BASED PREDICTION
Make one ridiculous prediction using the actual weather numbers above.

MOST ABSURD PREDICTION
One extremely specific and stupid prediction.

FINAL COSMIC VERDICT
Exactly 3 short, confident Manglish sentences.

Total length: around 350-500 words.
`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction:
        "Nee oru overconfident Kerala astrologer aanu. Output only the final funny Manglish jathakam. Never output reasoning, analysis, planning, or meta-commentary. Use only Latin letters for Malayalam words.",
      temperature: 1.1,
      maxOutputTokens: 2200,
      thinkingConfig: {
        thinkingBudget: 0,
      },
    },
  });

  const result = response.text?.trim();

  if (!result) {
    throw new Error("Gemini returned an empty horoscope.");
  }

  return result;
}
