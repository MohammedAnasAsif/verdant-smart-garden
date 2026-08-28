import type { BHK, PropertyItem, PropertyType, PropertyStatus, KarnatakaDistrict, SearchIntent, SmartSearchResult } from "./property-types";

export const KARNATAKA_DISTRICTS: KarnatakaDistrict[] = [
  { name: "Bengaluru Urban", lat: 12.9716, lng: 77.5946, border: "Tamil Nadu", cities: ["Whitefield", "Koramangala", "HSR Layout", "Indiranagar", "Sarjapur Road", "Electronic City", "Hebbal", "Yelahanka", "JP Nagar", "Banashankari", "Rajajinagar", "Marathahalli", "Bellandur", "Jayanagar", "Malleshwaram", "Puttenahalli"] },
  { name: "Bengaluru Rural", lat: 13.2206, lng: 77.7047, border: "Andhra Pradesh", cities: ["Devanahalli", "Hoskote", "Doddaballapura", "Nelamangala", "Vijayapura"] },
  { name: "Chikkaballapur", lat: 13.4351, lng: 77.7311, border: "Andhra Pradesh", cities: ["Chikkaballapur", "Gauribidanur", "Bagepalli", "Chintamani", "Sidlaghatta"] },
  { name: "Kolar", lat: 13.1365, lng: 78.1292, border: "Andhra Pradesh", cities: ["Kolar", "Bangarpet", "Mulbagal", "Srinivaspur", "Malur"] },
  { name: "Ramanagara", lat: 12.7227, lng: 77.2809, border: "Tamil Nadu", cities: ["Ramanagara", "Channapatna", "Kanakapura", "Magadi", "Harohalli"] },
  { name: "Tumakuru", lat: 13.3379, lng: 77.1173, cities: ["Tumakuru", "Tiptur", "Gubbi", "Madhugiri", "Kunigal"] },
  { name: "Mysuru", lat: 12.2958, lng: 76.6394, border: "Kerala", cities: ["Vani Vilas Mohalla", "Jayanagar", "Hebbal", "Saraswathipuram", "Kuvempunagar", "Hootagalli", "Nanjangud", "H.D. Kote", "Kollegal", "Bannur"] },
  { name: "Chamarajanagar", lat: 11.9261, lng: 76.9437, border: "Tamil Nadu", cities: ["Chamarajanagar", "Gundlupet", "Yelandur", "Kollegal Road"] },
  { name: "Mandya", lat: 12.5223, lng: 76.8954, cities: ["Mandya", "Srirangapatna", "Pandavapura", "Maddur", "Nagamangala"] },
  { name: "Hassan", lat: 13.0072, lng: 76.0951, cities: ["Hassan", "Arsikere", "Belur", "Halebidu", "Channarayapatna"] },
  { name: "Chikkamagaluru", lat: 13.3161, lng: 75.7720, cities: ["Chikkamagaluru", "Kadur", "Tarikere", "Mudigere", "Sakleshpur"] },
  { name: "Shivamogga", lat: 13.9299, lng: 75.5681, cities: ["Shivamogga", "Bhadravati", "Sagara", "Shikaripura", "Tirthahalli"] },
  { name: "Davanagere", lat: 14.4644, lng: 75.9218, cities: ["Davanagere", "Harihar", "Jagalur", "Honnali"] },
  { name: "Chitradurga", lat: 14.2300, lng: 76.3999, cities: ["Chitradurga", "Hiriyur", "Challakere", "Holalkere"] },
  { name: "Udupi", lat: 13.3409, lng: 74.7421, cities: ["Udupi", "Manipal", "Kundapura", "Karkala", "Brahmavar"] },
  { name: "Dakshina Kannada", lat: 12.9134, lng: 74.8541, border: "Kerala", cities: ["Mangaluru", "Surathkal", "Puttur", "Sullia", "Bantwal", "Moodabidri"] },
  { name: "Uttara Kannada", lat: 14.8159, lng: 74.4987, border: "Goa", cities: ["Karwar", "Sirsi", "Honnavar", "Bhatkal", "Kumta", "Ankola", "Dandeli"] },
  { name: "Kodagu", lat: 12.4244, lng: 75.7382, border: "Kerala", cities: ["Madikeri", "Kushalnagar", "Virajpet", "Gonikoppal", "Siddapura"] },
  { name: "Belagavi", lat: 15.8497, lng: 74.4977, border: "Maharashtra", cities: ["Belagavi", "Nippani", "Chikodi", "Sankeshwar", "Ramdurg", "Khanapur"] },
  { name: "Bijapur", lat: 16.8302, lng: 75.7100, border: "Maharashtra", cities: ["Vijayapura", "Basavakalyan", "Indi", "Sindgi", "Muddebihal"] },
  { name: "Bagalkot", lat: 16.1860, lng: 75.6961, cities: ["Bagalkot", "Jamkhandi", "Mudhol", "Ilkal"] },
  { name: "Dharwad", lat: 15.4586, lng: 75.0078, cities: ["Hubballi", "Dharwad", "Kalghatgi", "Navalgund"] },
  { name: "Haveri", lat: 14.7944, lng: 75.3978, cities: ["Haveri", "Ranebennur", "Byadgi", "Savanur"] },
  { name: "Gadag", lat: 15.4295, lng: 75.6313, cities: ["Gadag", "Naregal", "Mulgund", "Ron"] },
  { name: "Koppal", lat: 15.3453, lng: 76.1549, cities: ["Koppal", "Gangavathi", "Yelburga"] },
  { name: "Ballari", lat: 15.1394, lng: 76.9214, border: "Andhra Pradesh", cities: ["Ballari", "Hospet", "Sandur", "Kampli", "Siruguppa"] },
  { name: "Raichur", lat: 16.2085, lng: 77.3431, border: "Telangana", cities: ["Raichur", "Sindhanur", "Manvi", "Lingsugur"] },
  { name: "Yadgir", lat: 16.7709, lng: 77.1389, border: "Telangana", cities: ["Yadgir", "Shahapur", "Gurumitkal"] },
  { name: "Kalaburagi", lat: 17.3297, lng: 76.8343, border: "Maharashtra", cities: ["Kalaburagi", "Sedam", "Chincholi", "Aland", "Afzalpur"] },
  { name: "Bidar", lat: 17.9138, lng: 77.5301, border: "Telangana", cities: ["Bidar", "Bhalki", "Aurad", "Basavakalyan Road"] },
];

export const ALL_CITIES = KARNATAKA_DISTRICTS.flatMap((d) => d.cities).sort();

const BORDER_STATES = ["Goa", "Kerala", "Tamil Nadu", "Maharashtra", "Andhra Pradesh", "Telangana"];

const CITY_ALIASES: Record<string, string> = {
  bangalore: "Bengaluru Urban",
  bengaluru: "Bengaluru Urban",
  mysore: "Mysuru",
  mysuur: "Mysuru",
  mangalore: "Dakshina Kannada",
  mangaluru: "Dakshina Kannada",
  hubli: "Dharwad",
  hubballi: "Dharwad",
  bellary: "Ballari",
  bijapur: "Bijapur",
  gulbarga: "Kalaburagi",
  coorg: "Kodagu",
  madikeri: "Kodagu",
};

const TYPE_SYNONYMS: Record<string, PropertyType[]> = {
  flat: ["apartment"],
  apartment: ["apartment"],
  apartments: ["apartment"],
  flats: ["apartment"],
  house: ["independent-house"],
  houses: ["independent-house"],
  home: ["independent-house"],
  homes: ["independent-house"],
  bungalow: ["independent-house"],
  independent: ["independent-house"],
  villa: ["villa"],
  villas: ["villa"],
  plot: ["plot"],
  plots: ["plot"],
  land: ["plot"],
  site: ["plot"],
  gadi: ["plot"],
  acre: ["plot"],
  acres: ["plot"],
  agricultural: ["farmhouse"],
  farm: ["farmhouse"],
  farmhouse: ["farmhouse"],
  farmhouses: ["farmhouse"],
  farmland: ["farmhouse"],
  plantation: ["farmhouse"],
};

const STATUS_SYNONYMS: Record<string, PropertyStatus> = {
  ready: "ready-to-move",
  "ready-to-move": "ready-to-move",
  resale: "resale",
  "second-hand": "resale",
  "under construction": "under-construction",
  construction: "under-construction",
  "new launch": "new-launch",
  launch: "new-launch",
  new: "new-launch",
};

const STOP_WORDS = new Set([
  "a", "an", "the", "in", "near", "at", "on", "of", "for", "to", "with", "and", "or",
  "my", "i", "me", "we", "want", "looking", "find", "show", "get", "need", "under",
  "over", "below", "above", "within", "less", "than", "around", "approx", "around",
  "budget", "price", "total", "worth", "search", "please", "for", "have", "has",
  "border", "side", "by", "room", "rooms", "here", "there",
]);

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(1337);

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function randBetween(min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function generateId(index: number): string {
  return `prop-${String(index + 1).padStart(3, "0")}-${(index * 7919).toString(36)}`;
}

function calcInvestmentScore(appreciation: number, price: number): number {
  const priceScore = Math.max(0, 100 - price / 100000);
  const appreciationScore = appreciation * 10;
  return Math.min(100, Math.round(priceScore * 0.35 + appreciationScore * 0.45 + 20));
}

const OWNERS = [
  "Rajesh Kumar", "Priya Sharma", "Mohammed Irfan", "Sunita Reddy",
  "Anand Patel", "Lakshmi Devi", "Vijay Singh", "Deepa Nair",
  "Kavitha Rao", "Suresh Hegde", "Nisha Kulkarni", "Arjun Shetty",
];

const LANDMARKS = [
  "Near Bus Stand", "Opposite Park", "Behind Mall", "Near Public School",
  "Near Government Hospital", "Main Road Facing", "Corner Plot", "Near Temple",
  "Close to Railway Station", "Near Lake", "Opposite Government Office", "Near Ring Road",
];

const LOCALITY_SUFFIX = [
  "Layout", "Extension", "Nagar", "Main Road", "1st Cross", "2nd Cross",
  "Pete", "Road", "Colony", "Halli",
];

function buildTitle(type: PropertyType, bhk: string, area: number, city: string, isPlot: boolean): string {
  if (isPlot) {
    const kind = type === "farmhouse" ? "Farm Land" : "Residential Plot";
    return `${area} sq.ft ${kind} in ${city}`;
  }
  return `${bhk} ${type.replace("-", " ")} in ${city}`;
}

function buildDescription(type: PropertyType, bhk: string, area: number, city: string, locality: string, landmark: string, facing: string, isPlot: boolean, borderState?: string): string {
  if (isPlot) {
    const kind = type === "farmhouse" ? "Agricultural land" : "Residential plot";
    return `${kind} spread across ${area} sq.ft in ${locality}, ${city}. ${landmark}. Clear title, well-demarcated ${facing} facing boundary. Ideal for ${type === "farmhouse" ? "farming, orchard, or agro-tourism" : "building your dream home"}.${borderState ? ` Located close to the ${borderState} border with easy highway access.` : " Close to major roads and civic amenities."}`;
  }
  return `Spacious ${bhk} ${type.replace("-", " ")} in prime ${locality}, ${city}. ${landmark}. ${facing} facing with good ventilation and natural light. Modern amenities, secure surroundings, and near schools, hospitals, and transit.`;
}

function makeTag(type: PropertyType, status: PropertyStatus, facing: string, landmark: string, borderState?: string): string[] {
  const tags = [
    type === "plot" || type === "farmhouse" ? "Investment Ready" : "Premium",
    status === "ready-to-move" ? "Ready to Move" : status === "resale" ? "Resale" : "Under Construction",
    `${facing} Facing`,
    landmark,
  ];
  if (borderState) tags.push(`${borderState} Border`);
  return tags;
}

function generateProperty(index: number): PropertyItem {
  const district = KARNATAKA_DISTRICTS[index % KARNATAKA_DISTRICTS.length];
  const city = pick(district.cities);
  const remainder = index % 5;
  const isPlot = remainder === 3 || remainder === 4;
  const isFarm = remainder === 4;

  const borderRoll = district.border ? rng() : 0;
  const borderState = district.border && borderRoll > 0.45 ? district.border : undefined;

  const type: PropertyType = isPlot
    ? (isFarm ? "farmhouse" : "plot")
    : pick(["apartment" as const, "independent-house" as const, "villa" as const]);

  const isMetro = district.name === "Bengaluru Urban" || district.name === "Mysuru" || district.name === "Dakshina Kannada";
  const isTier2 = district.name === "Dharwad" || district.name === "Belagavi" || district.name === "Kalaburagi" || district.name === "Ballari" || district.name === "Udupi";

  const bhkOptions: Array<{ bhk: string; bed: number; bath: number }> = [
    { bhk: "1 BHK", bed: 1, bath: 1 },
    { bhk: "2 BHK", bed: 2, bath: 2 },
    { bhk: "3 BHK", bed: 3, bath: 2 },
    { bhk: "4 BHK", bed: 4, bath: 3 },
    { bhk: "5+ BHK", bed: 5, bath: 4 },
  ];
  const bhkPick = pick(bhkOptions);

  const area = isPlot
    ? randBetween(isFarm ? 2400 : 1200, isFarm ? 10000 : 5000)
    : randBetween(650, isMetro ? 3500 : 2500);

  const pricePerSqftBase = isPlot
    ? randBetween(isMetro ? 2500 : 800, isMetro ? 6000 : 2800)
    : randBetween(isMetro ? 4000 : 1800, isMetro ? 12000 : 6500);

  const tierFactor = isMetro ? 1.25 : isTier2 ? 0.75 : 1;
  const price = Math.round(area * pricePerSqftBase * tierFactor);
  const estimatedPrice = Math.round(price * (1 + (rng() * 0.2 - 0.05)));
  const appreciation = parseFloat((rng() * 15 + 2).toFixed(1));
  const facing = pick(["North" as const, "South" as const, "East" as const, "West" as const, "North-East" as const, "South-East" as const]);
  const status = pick(["ready-to-move" as const, "under-construction" as const, "resale" as const, "new-launch" as const]);
  const owner = pick(OWNERS);
  const landmark = pick(LANDMARKS);
  const locality = `${city} ${pick(LOCALITY_SUFFIX)}`;

  return {
    id: generateId(index),
    title: buildTitle(type, bhkPick.bhk, area, city, isPlot),
    type,
    status,
    price,
    pricePerSqft: Math.round(pricePerSqftBase * tierFactor),
    area,
    builtUpArea: isPlot ? undefined : area,
    bedrooms: isPlot ? undefined : bhkPick.bed,
    bathrooms: isPlot ? undefined : bhkPick.bath,
    bhk: isPlot ? undefined : bhkPick.bhk as BHK,
    facing,
    location: {
      city: district.name,
      area: city,
      locality,
      landmark,
      lat: district.lat + (rng() * 0.16 - 0.08),
      lng: district.lng + (rng() * 0.16 - 0.08),
    },
    description: buildDescription(type, bhkPick.bhk, area, city, locality, landmark, facing, isPlot, borderState),
    images: [],
    amenities: {
      parking: rng() > 0.2,
      lift: type === "apartment" ? true : rng() > 0.5,
      gym: rng() > 0.6,
      swimmingPool: rng() > 0.7,
      security: rng() > 0.3,
      powerBackup: rng() > 0.4,
      garden: rng() > 0.5,
      clubhouse: rng() > 0.65,
      childrenPlayArea: rng() > 0.5,
      joggingTrack: rng() > 0.7,
    },
    neighborhood: {
      schools: randBetween(40, 98),
      hospitals: randBetween(35, 95),
      grocery: randBetween(55, 99),
      transit: randBetween(35, 95),
      restaurants: randBetween(40, 98),
      parks: randBetween(30, 90),
      overall: 0,
    },
    yearBuilt: isPlot ? undefined : randBetween(2015, 2025),
    age: status === "resale" ? pick(["1-3 years", "3-5 years", "5-10 years", "10+ years"]) : undefined,
    ownerName: owner,
    ownerVerified: rng() > 0.3,
    featured: index < 3,
    newListed: rng() > 0.7,
    priceDrop: rng() > 0.8 ? randBetween(1, 10) : undefined,
    estimatedPrice,
    investmentScore: 0,
    appreciationRate: appreciation,
    tags: makeTag(type, status, facing, landmark, borderState),
    createdAt: 1750000000000 - randBetween(0, 30 * 24 * 60 * 60 * 1000),
    borderState,
  };
}

function finalizeProperties(props: PropertyItem[]): PropertyItem[] {
  return props.map((p) => {
    const n = p.neighborhood;
    n.overall = Math.round((n.schools + n.hospitals + n.grocery + n.transit + n.restaurants + n.parks) / 6);
    p.investmentScore = calcInvestmentScore(p.appreciationRate, p.price);
    return p;
  });
}

const PROPERTY_COUNT = 90;
const raw = Array.from({ length: PROPERTY_COUNT }, (_, i) => generateProperty(i));

export const PROPERTIES: PropertyItem[] = finalizeProperties(raw);

function normalizeQuery(query: string): string {
  return query.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function parsePriceIntent(tokens: string[]): { priceMin?: number; priceMax?: number; tokens: string[] } {
  let priceMin: number | undefined;
  let priceMax: number | undefined;
  const remaining: string[] = [];

  const directionOf = (word: string): "under" | "above" | "none" => {
    const w = word.toLowerCase();
    if (["under", "below", "within", "upto", "up", "less", "max", "at", "by"].includes(w)) return "under";
    if (["above", "over", "min", "atleast", "at least", "more", "exceed"].includes(w)) return "above";
    return "none";
  };

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    const compact = tok.match(/^(\d+(?:\.\d+)?)(l|lakh|lakhs|lac|lacs|cr|crore|crores|k|thousand)$/);

    if (!compact && /^\d+$/.test(tok) && i + 1 < tokens.length && ["lakh", "lakhs", "lac", "lacs", "cr", "crore", "crores", "k", "thousand"].includes(tokens[i + 1])) {
      const num = Number(tok);
      const unit = tokens[i + 1];
      const value = unit.startsWith("cr") ? num * 10000000 : unit === "k" || unit === "thousand" ? num * 1000 : num * 100000;
      const dir = i > 0 ? directionOf(tokens[i - 1]) : "none";
      if (dir === "under") priceMax = value;
      else if (dir === "above") priceMin = value;
      else priceMax = value;
      i++;
      continue;
    }

    if (compact) {
      const num = Number(compact[1]);
      const unit = compact[2];
      const value = unit.startsWith("cr") ? num * 10000000 : unit === "k" || unit === "thousand" ? num * 1000 : num * 100000;
      const dir = i > 0 ? directionOf(tokens[i - 1]) : "none";
      if (dir === "under") priceMax = value;
      else if (dir === "above") priceMin = value;
      else priceMax = value;
      continue;
    }

    remaining.push(tok);
  }
  return { priceMin, priceMax, tokens: remaining };
}

function parseBhkIntent(tokens: string[]): { bhk?: BHK; tokens: string[] } {
  let bhk: BHK | undefined;
  const remaining: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i].toLowerCase();
    const comp = tok.match(/^(\d+)(bhk|bed|bdrm|br|room|rooms)$/);
    const unitOnly = tok === "bhk" || tok === "bed" || tok === "bedroom" || tok === "bedrooms";
    if (comp) {
      const n = Number(comp[1]);
      bhk = (n >= 5 ? "5+ BHK" : `${n} BHK`) as BHK;
    } else if (unitOnly && remaining.length > 0 && /^\d+$/.test(remaining[remaining.length - 1])) {
      const n = Number(remaining.pop());
      bhk = (n >= 5 ? "5+ BHK" : `${n} BHK`) as BHK;
    } else {
      remaining.push(tok);
    }
  }
  return { bhk, tokens: remaining };
}

function statusKeyToToken(token: string): boolean {
  return Object.keys(STATUS_SYNONYMS).some((s) => s === token && token.length > 3);
}

export function smartSearch(query: string, props: PropertyItem[]): SmartSearchResult {
  const intent: SearchIntent = { keywords: [] };
  const q = normalizeQuery(query);
  if (!q) return { list: props, intent };

  let tokens = q.split(" ");

  const bhkParsed = parseBhkIntent(tokens);
  intent.bhk = bhkParsed.bhk;
  tokens = bhkParsed.tokens;

  const priceParsed = parsePriceIntent(tokens);
  intent.priceMin = priceParsed.priceMin;
  intent.priceMax = priceParsed.priceMax;
  tokens = priceParsed.tokens;

  const types: PropertyType[] = [];
  const status = Object.keys(STATUS_SYNONYMS).find((s) => q.includes(s));

  const borderState = BORDER_STATES.find((b) => {
    const bl = b.toLowerCase();
    return q.includes(bl) || q.includes(bl.replace(" ", "")) || q.includes(bl.split(" ")[0]);
  });

  const locations: string[] = [];

  const allNames = [...ALL_CITIES, ...KARNATAKA_DISTRICTS.map((d) => d.name)];
  for (const name of allNames) {
    const nl = name.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
    if (nl.length >= 3 && q.includes(nl)) {
      locations.push(name);
      break;
    }
  }
  if (locations.length === 0) {
    const aliasHit = q.split(" ").find((t) => CITY_ALIASES[t]);
    if (aliasHit) locations.push(CITY_ALIASES[aliasHit]);
  }
  if (locations.length > 0) intent.locations = [...new Set(locations)];

  tokens = tokens.filter((t) => {
    if (TYPE_SYNONYMS[t]) {
      for (const ty of TYPE_SYNONYMS[t]) if (!types.includes(ty)) types.push(ty);
      return false;
    }
    if (statusKeyToToken(t)) return false;
    if (t in CITY_ALIASES || ALL_CITIES.some((c) => c.toLowerCase() === t) || KARNATAKA_DISTRICTS.some((d) => d.name.toLowerCase() === t || d.name.toLowerCase().replace(/\s+/g, "") === t.replace(/\s+/g, ""))) {
      return false;
    }
    if (STOP_WORDS.has(t)) return false;
    return true;
  });

  let borderValue = borderState;
  for (const t of tokens) {
    const hit = BORDER_STATES.find((b) => t === b.toLowerCase() || t === b.toLowerCase().replace(/\s+/g, "") || t === b.toLowerCase().split(" ")[0]);
    if (hit) {
      borderValue = hit;
      break;
    }
  }
  if (borderValue) {
    intent.border = borderValue;
    tokens = tokens.filter((t) => {
      const low = t.toLowerCase();
      return !BORDER_STATES.some((b) => low === b.toLowerCase() || low === b.toLowerCase().replace(/\s+/g, "") || low === b.toLowerCase().split(" ")[0]);
    });
  }

  const keywordTokens = tokens.filter((t) => t.length >= 2);
  if (keywordTokens.length > 0) {
    intent.keywords = keywordTokens;
  }

  if (types.length > 0) intent.types = types;
  if (status) intent.status = STATUS_SYNONYMS[status];

  const searchStr = (p: PropertyItem): string => `${p.title} ${p.type} ${p.status} ${p.location.city} ${p.location.area} ${p.location.locality} ${p.location.landmark} ${p.description} ${p.tags.join(" ")} ${p.borderState || ""}`.toLowerCase();

  const list = props.filter((p) => {
    if (intent.bhk && p.bhk !== intent.bhk) return false;
    if (intent.types && intent.types.length > 0 && !intent.types.includes(p.type)) return false;
    if (intent.status && p.status !== intent.status) return false;
    if (intent.priceMin !== undefined && p.price < intent.priceMin) return false;
    if (intent.priceMax !== undefined && p.price > intent.priceMax) return false;
    if (intent.border && p.borderState !== intent.border) return false;
    if (intent.locations && intent.locations.length > 0) {
      const locs = intent.locations.map((l) => l.toLowerCase());
      const matches = locs.some((l) => p.location.city.toLowerCase().includes(l) || p.location.area.toLowerCase().includes(l) || p.location.locality.toLowerCase().includes(l));
      if (!matches) return false;
    }
    if (intent.keywords && intent.keywords.length > 0) {
      const haystack = searchStr(p);
      if (!intent.keywords.every((k) => haystack.includes(k))) return false;
    }
    return true;
  });

  if (intent.border && intent.keywords) {
    const borderWords = intent.border.toLowerCase().split(" ").flatMap((w) => [w, w.replace(" ", "")]);
    intent.keywords = intent.keywords.filter((k) => !borderWords.includes(k) && k !== "border");
  }

  return { list, intent };
}

export function searchProperties(query: string, props: PropertyItem[]): PropertyItem[] {
  return smartSearch(query, props).list;
}