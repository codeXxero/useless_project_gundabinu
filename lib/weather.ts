export type Weather = {
  temperature:number;
  feelsLike:number;
  humidity:number;
  precipitation:number;
  wind:number;
  code:number;
};

export async function getWeather(lat:number,lon:number):Promise<Weather>{
  const url=new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude",String(lat));
  url.searchParams.set("longitude",String(lon));
  url.searchParams.set("current","temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m");
  url.searchParams.set("timezone","auto");
  const r=await fetch(url.toString(),{cache:"no-store"});
  if(!r.ok) throw new Error("Weather service unavailable.");
  const d=await r.json();
  return {
    temperature:d.current.temperature_2m,
    feelsLike:d.current.apparent_temperature,
    humidity:d.current.relative_humidity_2m,
    precipitation:d.current.precipitation,
    wind:d.current.wind_speed_10m,
    code:d.current.weather_code
  };
}
