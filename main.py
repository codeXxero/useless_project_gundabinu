import requests
from google import genai


# ============================================================
# GEMINI CLIENT
# ============================================================

client = genai.Client()


# ============================================================
# GET CURRENT LOCATION
# ============================================================

def get_location():

    response = requests.get(
        "https://ipinfo.io/json"
    )

    response.raise_for_status()

    data = response.json()

    latitude, longitude = data["loc"].split(",")

    return (
        latitude,
        longitude,
        data["city"],
        data["country"]
    )


# ============================================================
# GET WEATHER
# ============================================================

def get_weather(latitude, longitude):

    url = (
        "https://api.open-meteo.com/v1/forecast"
        f"?latitude={latitude}"
        f"&longitude={longitude}"
        "&current="
        "temperature_2m,"
        "relative_humidity_2m,"
        "apparent_temperature,"
        "precipitation,"
        "weather_code,"
        "wind_speed_10m"
        "&timezone=auto"
    )

    response = requests.get(url)

    response.raise_for_status()

    return response.json()


# ============================================================
# GENERATE HOROSCOPE
# ============================================================

def generate_horoscope(dob, birthplace, current):

    prompt = f"""
You are a highly entertaining fictional astrologer.

You are NOT giving a scientifically accurate prediction.
You are generating a completely fictional and humorous
horoscope for entertainment.

The person has given you:

DATE OF BIRTH:
{dob}

PLACE OF BIRTH:
{birthplace}


CURRENT WEATHER:

Temperature:
{current['temperature_2m']} °C

Feels like:
{current['apparent_temperature']} °C

Humidity:
{current['relative_humidity_2m']} %

Rain:
{current['precipitation']} mm

Wind:
{current['wind_speed_10m']} km/h

Weather code:
{current['weather_code']}


YOUR TASK:

Generate a COMPLETE LIFE HOROSCOPE for this person.

This should NOT be only today's horoscope.

Talk about their fictional personality, childhood,
education, career, money, love life, friendships,
future, old age and general destiny.

Make it feel like an elaborate traditional horoscope,
but make the predictions absurd, unexpected and funny.

Use the date of birth and place of birth as creative
inputs.

Also use the CURRENT WEATHER as a strange cosmic influence.

For example:

If it is very hot:
"The temperature indicates that this person's
patience will disappear faster than ice cream."

If humidity is high:
"Their relationships may become emotionally sticky."

If there is rain:
"Important decisions may arrive when they are
standing under a leaking roof."

If there is strong wind:
"Their career may change direction without warning,
much like a plastic cover in Kerala wind."

These are examples only.
Create your own jokes.


IMPORTANT LANGUAGE RULE:

Write the entire horoscope in MANGlish.

MANGlish means Malayalam written using English
alphabet/Latin characters.

Example:

"Innu ninte jeevithathil oru valiya maattam
varaan chance undu."

"Nee oru karyam decide cheythal athu complete
cheyyum... usually moonnu divasam kazhinju."

DO NOT use Malayalam Unicode script.

DO NOT write the horoscope in English.

Use Malayalam vocabulary and sentence structure,
but write everything using English letters.

English words commonly used in Malayalam conversation
are allowed.

For example:

"career", "money", "future", "phone", "relationship",
"college", "job" etc.


STRUCTURE:

================================
🔮 NINTE LIFE JATHAKAM
================================

🧬 PERSONALITY

Describe the person's fictional personality.

👶 CHILDHOOD

Give a funny fictional description of childhood.

📚 EDUCATION

Predict their education life.

💼 CAREER

Predict their career and professional life.

💰 MONEY

Predict their financial future.

❤️ LOVE LIFE

Predict their romantic life.

👥 FRIENDSHIP

Predict their friendships.

🏠 FAMILY

Predict their family life.

🚀 FUTURE

Give predictions about their future.

👴 OLD AGE

Give a ridiculous prediction about their old age.

🌌 DESTINY

Give a dramatic but funny final prediction.

🍀 LUCKY COLOR

Choose a random lucky color.

🔢 LUCKY NUMBER

Choose a random lucky number.

🎯 MOST ABSURD PREDICTION

Give one completely ridiculous prediction.

================================

Make the horoscope long enough to feel like a
COMPLETE LIFE READING.

Make it funny.

Make it unpredictable.

Make it sound confident.

Do not explain your reasoning.

Do not mention that you are an AI.

Do not use Malayalam Unicode characters.
"""


    response = client.models.generate_content(
        model="gemini-3.7-flash",
        contents=prompt
    )

    return response.text


# ============================================================
# MAIN PROGRAM
# ============================================================

def main():

    print()
    print("==========================================")
    print("       WEATHER JATHAKAM MACHINE")
    print("==========================================")


    # --------------------------------------------------------
    # USER INPUT
    # --------------------------------------------------------

    dob = input(
        "\nDate of birth (DD/MM/YYYY): "
    )

    birthplace = input(
        "Place of birth: "
    )


    # --------------------------------------------------------
    # LOCATION
    # --------------------------------------------------------

    print(
        "\n📍 Finding your current location..."
    )

    latitude, longitude, city, country = get_location()

    print(
        f"Current location: {city}, {country}"
    )


    # --------------------------------------------------------
    # WEATHER
    # --------------------------------------------------------

    print(
        "🌤️ Fetching current weather..."
    )

    weather = get_weather(
        latitude,
        longitude
    )

    current = weather["current"]


    # --------------------------------------------------------
    # WEATHER DISPLAY
    # --------------------------------------------------------

    print()
    print("==========================================")
    print("             CURRENT WEATHER")
    print("==========================================")

    print(
        f"Temperature : "
        f"{current['temperature_2m']} °C"
    )

    print(
        f"Feels like  : "
        f"{current['apparent_temperature']} °C"
    )

    print(
        f"Humidity    : "
        f"{current['relative_humidity_2m']}%"
    )

    print(
        f"Rain        : "
        f"{current['precipitation']} mm"
    )

    print(
        f"Wind        : "
        f"{current['wind_speed_10m']} km/h"
    )

    print("==========================================")


    # --------------------------------------------------------
    # GEMINI
    # --------------------------------------------------------

    print(
        "\n🔮 Consulting the cosmic weather department..."
    )

    horoscope = generate_horoscope(
        dob,
        birthplace,
        current
    )


    # --------------------------------------------------------
    # OUTPUT
    # --------------------------------------------------------

    print()
    print("==========================================")
    print("              YOUR JATHAKAM")
    print("==========================================")

    print(horoscope)

    print("==========================================")


# ============================================================
# START
# ============================================================

if __name__ == "__main__":
    main()