import { Weather } from "./weather";

type BirthInfo={dob:string;birthplace:string;weather:Weather};

const pick=(arr:string[],r:()=>number)=>arr[Math.floor(r()*arr.length)];

const personality=[
  "Nee childhood muthal thanne oru '5 minute kazhinju cheyyam' type aanu.",
  "Nee oru karyam decide cheythal athu cheyyum. Pakshe first athine kurichu 47 pravashyam alochikkum.",
  "Ninte brain full-time active aanu, pakshe battery percentage pole motivation random aanu.",
  "Nee generally calm aanu. Pakshe Wi-Fi slow aayal ninte inner villain purathu varum.",
  "Ninte jathakathil curiosity valare strong aanu. Athukond unnecessary aaya karyangal polum research cheyyum."
];

const childhood=[
  "Cheruppathil nee oru normal kutti allaayirunnu. Oru toy kittiyal athu kalikkunnathinu munpu engane work cheyyunnu ennu nokkum.",
  "Childhood-il oru point-il nee oru valiya secret discovery nadathi: remote-il battery illenkil remote work cheyyilla.",
  "School days-il nee homework complete cheythathinekkal homework cheyyanulla perfect time plan cheythittundu.",
  "Cheruppathil ninte room-il oru object undayirunnu, athinte purpose innu vare cosmic department-inu ariyilla."
];

const education=[
  "Padanathil nee last minute energy use cheyyunna aal aanu. Deadline adukkumbol brain suddenly turbo mode-il pokum.",
  "Oru subject ninakku ishtappedum. Pinne athinte syllabus kandappol aa sneham kurayum.",
  "Examinu munpu nee 'ellam padichu' enna confidence kaanikkum. Pinne first question kandappol universe-ne question cheyyum.",
  "Ninte education journey-il oru random topic aanu future-il unexpectedly useful aavuka."
];

const career=[
  "Career-il oru stage-il nee job description nokki 'ithu njan cheyyam' ennu parayum. Pinne actual work kandappol vere opinion undaakum.",
  "Oru major opportunity varum. Nee first athu ignore cheyyum. Pinne athu important aanu ennu manassilaakki serious aakum.",
  "Future-il nee oru skill padikkum just curiosity kond. Pinne athu paisa undaakkan use cheyyum.",
  "Ninte career straight line alla. Oru random side quest eventually main quest aayi maarum."
];

const money=[
  "Paisa varum. Paisa pokum. Pakshe paisa poyathinte reason 'small purchase' ennanu nee parayuka.",
  "Oru expensive item vangiya sesham nee athu daily use cheyyilla. Pakshe athu kandappol satisfaction kittum.",
  "Budget undaakkum. Budget follow cheyyan cosmic department ippozhum investigation nadathunnu.",
  "Future-il oru purchase undaakum. Athu avashyam undo ennu nee purchase kazhinjittu aanu chinthikkuka."
];

const love=[
  "Love life-il oru point-il nee message type cheythu delete cheyyum. Ithaanu cosmic romance.",
  "Ninte soulmate ninakku opposite personality aayirikkum. Nee overthink cheyyumbol avar 'entha scene?' ennu chodikkum.",
  "Oru unexpected conversation future-il valiya importance edukkum.",
  "Nee feelings hide cheyyan try cheyyum. Pakshe ninte face already spoiler kodukkum."
];

const future=[
  "27 vayassinu aduth oru unexpected opportunity varum. Athinte first sign oru random phone call aayirikkum.",
  "31 vayassinu aduth nee oru old hobby thirichu edukkum.",
  "36 vayassinu aduth oru trip ninte normal routine-ne temporarily destroy cheyyum. Good way-il.",
  "43 vayassinu aduth nee 'ithu njan enthina cheythathu?' ennu parayunna oru purchase undaakum.",
  "52 vayassinu aduth technology-ne kurichu younger generation-ne lecture cheyyum, pinne avar parayunnathu correct aanu ennu manassilaakum.",
  "60 kazhinjalum curiosity pokilla. Puthiya gadgets nokki irikkum."
];

function seedFrom(dob:string,birthplace:string){
  let h=2166136261;
  for(const c of dob+"|"+birthplace){
    h^=c.charCodeAt(0);
    h=Math.imul(h,16777619);
  }
  return (h>>>0)||1;
}

export function generateJathakam({dob,birthplace,weather}:BirthInfo){
  let state=seedFrom(dob,birthplace);
  const r=()=>{state=(Math.imul(1664525,state)+1013904223)>>>0;return state/4294967296;};

  const temp=weather.temperature;
  const rain=weather.precipitation;
  const wind=weather.wind;

  let weatherPrediction="";
  if(rain>0){
    weatherPrediction=`Innathe mazha ninte jathakathil oru serious signal aanu. Future-il nee umbrella edukkan marakkunna oru divasam undaakum. Aa divasam thanne oru important realization varum.`;
  }else if(temp>=33){
    weatherPrediction=`Ippozhathe choodinte cosmic influence valare strong aanu. Future-il nee AC illatha room-il 20 minute irunnittu ninte life decisions ellam question cheyyum.`;
  }else if(wind>=25){
    weatherPrediction=`Ee kaattu kandittu grahangal oru warning thannittundu: future-il nee oru important decision edukkum, pakshe decision eduthathu enthinaanu ennu pinne nee thanne marakkum.`;
  }else{
    weatherPrediction=`Ippozhathe peaceful weather kandittu cosmic department parayunnathu: oru calm day future-il valiya chaos-inte munpu varum. Nee athu enjoy cheyyanam.`;
  }

  const absurd=[
    "2037-il nee oru spoon nashtappeduthum. Aa spoon pinne orikkalum kittilla.",
    "Oru divasam oru poocha ninne nokki 7 seconds nilkkum. Athu ninte destiny-ne silently judge cheyyunnathaanu.",
    "Future-il nee oru important meeting-il pokumbol phone 3% battery-il aayirikkum. Somehow nee survive cheyyum.",
    "Oru random Tuesday-il nee fridge thurannu 10 seconds blank aayi nilkkum. Cosmic reset aanu.",
    "Ninte jeevithathile oru major decision edukkunnathu oru tea kudichathinu sesham aayirikkum."
  ];

  const luckyColors=["lavender","black","sky blue","dark green","purple","silver"];
  const sections=[
    `🧬 PERSONALITY\n\n${pick(personality,r)}`,
    `👶 CHILDHOOD\n\n${pick(childhood,r)} ${pick(childhood,r)}`,
    `🧑 TEENAGE YEARS\n\n${pick(education,r)} ${pick(personality,r)}`,
    `🎓 EDUCATION\n\n${pick(education,r)} ${pick(education,r)}`,
    `💼 EARLY CAREER\n\n${pick(career,r)} ${pick(career,r)}`,
    `🚀 20s\n\n${pick(future,r)} ${pick(career,r)}`,
    `💰 MONEY\n\n${pick(money,r)} ${pick(money,r)}`,
    `❤️ LOVE LIFE\n\n${pick(love,r)} ${pick(love,r)}`,
    `💍 MARRIAGE\n\nMarriage kazhinjittum nee remote evide vechennu marakkunna type aayirikkum. Pakshe partner aanu athu kandupidikkuka. Cosmic compatibility strong aanu.`,
    `🏠 FAMILY\n\nFamily-il oru aal ninne 'nee ithokke enthina cheyyunnathu?' ennu regularly chodikkum. Nee answer parayilla. Because ninakkum ariyilla.`,
    `📈 30s\n\n${pick(future,r)} ${pick(future,r)}`,
    `📊 40s\n\n${pick(future,r)} ${pick(money,r)}`,
    `💎 50s\n\n${pick(future,r)} ${pick(career,r)}`,
    `👴 OLD AGE\n\n${pick(future,r)} Pinneyum puthiya gadgets padikkanulla curiosity undaakum. Retirement enna concept ninakku suspicious aayirikkum.`,
    `🌌 FINAL DESTINY\n\nNinte destiny oru straight road alla. Oru main quest undaakum, athinte idayil 19 side quests undaakum. Athil randennam accidental aayirikkum, moonennam food related aayirikkum.`,
    `🍀 LUCKY COLOR\n\n${pick(luckyColors,r)}`,
    `🔢 LUCKY NUMBER\n\n${Math.floor(r()*90)+10}`,
    `🌧️ WEATHER-BASED PREDICTION\n\n${weatherPrediction}`,
    `🎯 MOST ABSURD PREDICTION\n\n${pick(absurd,r)}`
  ];

  return `========================================
🔮 NINTE WHOLE LIFE JATHAKAM
========================================

Date of Birth: ${dob}
Birthplace: ${birthplace}

${sections.join("\n\n")}

========================================
FINAL COSMIC VERDICT
========================================

Ninte life-il valiya sambhavangal undaakum.
Chila sambhavangal valare important aayirikkum.
Chila sambhavangal completely unnecessary aayirikkum.

Pakshe randinum nee same seriousness kodukkum.

Cosmic department officially declare cheyyunnu:

Nee oru normal life jeevikkum...
pakshe normal aayittu thonnilla.

========================================`;
}
