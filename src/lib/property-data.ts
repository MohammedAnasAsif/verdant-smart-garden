import type { PropertyItem, KarnatakaDistrict } from "./property-types";

export const KARNATAKA_DISTRICTS: KarnatakaDistrict[] = [
  { name: "Bengaluru Urban", cities: ["Whitefield", "Koramangala", "HSR Layout", "Indiranagar", "Sarjapur Road", "Electronic City", "Hebbal", "Yelahanka", "JP Nagar", "Banashankari", "Rajajinagar", "Marathahalli", "Bellandur", "Outer Ring Road"] },
  { name: "Bengaluru Rural", cities: ["Devanahalli", "Hoskote", "Tumakuru Road", "Nelamangala"] },
  { name: "Mysuru", cities: ["Vani Mohalla", "Jayalakshmipuram", "Hebbal", "Saraswathipuram", "Kuvempunagar", "Hootagalli", "Nanjangud"] },
  { name: "Mangaluru", cities: ["Bejai", "Kadri", "Surathkal", "Mangaladevi", "Bajpe", "Kankanady"] },
  { name: "Hubli-Dharwad", cities: ["Hubli", "Dharwad", "Vidyanagar", "Unkal", "Gokul Road"] },
  { name: "Belagavi", cities: ["Tilakwadi", "Sadashivnagar", "Camp", "Angol", "Kankanady"] },
  { name: "Shivamogga", cities: ["Shivamogga", "Bhadravati", "Sagara"] },
  { name: "Kalaburagi", cities: ["Kalaburagi", "Sedam", "Chincholi"] },
  { name: "Davanagere", cities: ["Davanagere", "Harihar", "Tigalapura"] },
  { name: "Ballari", cities: ["Ballari", "Hospet", "Sandur"] },
  { name: "Vijayapura", cities: ["Vijayapura", "Basavakalyan", "Indi"] },
  { name: "Uttara Kannada", cities: ["Karwar", "Sirsi", "Honnavar", "Bhatkal"] },
  { name: "Hassan", cities: ["Hassan", "Arsikere", "Belur"] },
  { name: "Tumakuru", cities: ["Tumakuru", "Tiptur", "Koratagere"] },
  { name: "Kolar", cities: ["Kolar", "Bangarpet", "Mulbagal"] },
  { name: "Chikkaballapur", cities: ["Chikkaballapur", "Gauribidanur"] },
  { name: "Ramanagara", cities: ["Ramanagara", "Channapatna", "Kanakapura"] },
  { name: "Chamarajanagar", cities: ["Chamarajanagar", "Gundlupet"] },
  { name: "Kodagu", cities: ["Madikeri", "Kushalnagar", "Virajpet"] },
  { name: "Dakshina Kannada", cities: ["Puttur", "Sullia", "Bantwal"] },
  { name: "Udupi", cities: ["Udupi", "Kundapura", "Manipal"] },
  { name: "Chitradurga", cities: ["Chitradurga", "Hiriyur"] },
  { name: "Davangere", cities: ["Davangere"] },
  { name: "Gadag", cities: ["Gadag", "Betageri"] },
  { name: "Haveri", cities: ["Haveri", "Ranebennur"] },
  { name: "Koppal", cities: ["Koppal", "Gangavathi"] },
  { name: "Raichur", cities: ["Raichur", "Yadgir"] },
  { name: "Bagalkot", cities: ["Bagalkot", "Bijapur Road"] },
  { name: "Chikkamagaluru", cities: ["Chikkamagaluru", "Kadur", "Ajjampura"] },
  { name: "Mandya", cities: ["Mandya", "Srirangapatna", "Pandavapura"] },
];

export const ALL_CITIES = KARNATAKA_DISTRICTS.flatMap((d) => d.cities).sort();

const KARNATAKA_AREAS: Record<string, string[]> = {
  "Whitefield": ["ITPL Main Road", "Whitefield Main Road", "Hope Farm", "KR Puram", "Brookefield"],
  "Koramangala": ["1st Block", "2nd Block", "3rd Block", "4th Block", "5th Block", "6th Block", "7th Block", "8th Block"],
  "HSR Layout": ["Sector 1", "Sector 2", "Sector 3", "Sector 4", "Sector 5", "Sector 6", "Sector 7"],
  "Indiranagar": ["100 Feet Road", "HAL 2nd Stage", "Thippasandra", "New Thippasandra"],
  "Sarjapur Road": ["Before Wipro", "Near ORR", "Kodathi Gate", "Chandapura", "Dommasandra"],
  "Electronic City": ["Phase 1", "Phase 2", "Hosur Road", "Neeladri Road"],
  "Hebbal": ["Hebbal AK Complex", "Bellary Road", "Rajajinagar Extension"],
  "Yelahanka": ["New Town", "Old Town", "Ankanahalli", "Dodda Gubbi"],
  "JP Nagar": ["1st Phase", "2nd Phase", "3rd Phase", "4th Phase", "5th Phase", "6th Phase", "7th Phase"],
  "Banashankari": ["2nd Stage", "3rd Stage", "5th Stage", "Jayanagar Extension"],
  "Rajajinagar": ["1st Block", "2nd Block", "3rd Block", "4th Block", "5th Block"],
  "Marathahalli": ["Marathahalli Bridge", "Munnekollal", "Kadubeesanahalli"],
  "Bellandur": ["Bellandur Main Road", "Sarjapur Road Junction", "Outer Ring Road"],
  "Outer Ring Road": ["Kundalahalli", "Brookefield", "Marathahalli", "Silk Board"],
  "Mysuru": ["VV Mohalla", "Jayalakshmipuram", "Hebbal II Stage", "Kuvempunagar", "Saraswathipuram", "Vani Vilas Mohalla"],
  "Mangaluru": ["Bejai", "Kadri", "Surathkal", "Kankanady", "Bajpe", "Padil"],
  "Hubli-Dharwad": ["Vidyanagar", "Unkal", "Gokul Road", "Desur", "Tarihal"],
  "Belagavi": ["Tilakwadi", "Sadashivnagar", "Camp", "Angol", "Mahantesh Nagar"],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateId(): string {
  return `prop-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function calcInvestmentScore(appreciation: number, price: number, area: number): number {
  const priceScore = Math.max(0, 100 - (price / 100000));
  const appreciationScore = appreciation * 10;
  return Math.min(100, Math.round((priceScore * 0.3 + appreciationScore * 0.5 + 20)));
}

function generateProperty(index: number): PropertyItem {
  const isPlot = index % 4 === 0;
  const city = pick(["Bengaluru Urban", "Mysuru", "Mangaluru", "Hubli-Dharwad"]);
  const district = KARNATAKA_DISTRICTS.find((d) => d.name === city)!;
  const areaName = pick(district.cities);
  const areas = KARNATAKA_AREAS[areaName] || ["Main Road"];
  const locality = pick(areas);

  const type = isPlot ? pick(["plot" as const, "farmhouse" as const]) : pick(["apartment" as const, "independent-house" as const, "villa" as const]);
  const bhkOptions: Array<{ bhk: string; bed: number; bath: number }> = [
    { bhk: "1 BHK", bed: 1, bath: 1 },
    { bhk: "2 BHK", bed: 2, bath: 2 },
    { bhk: "3 BHK", bed: 3, bath: 2 },
    { bhk: "4 BHK", bed: 4, bath: 3 },
    { bhk: "5+ BHK", bed: 5, bath: 4 },
  ];
  const bhkPick = pick(bhkOptions);
  const area_sqft = isPlot ? randBetween(1200, 5000) : randBetween(650, 3500);
  const pricePerSqft = type === "plot" ? randBetween(2500, 8000) : randBetween(3500, 12000);
  const price = area_sqft * pricePerSqft;
  const estimatedPrice = Math.round(price * (1 + (Math.random() * 0.2 - 0.05)));
  const appreciation = parseFloat((Math.random() * 15 + 2).toFixed(1));
  const facing = pick(["North" as const, "South" as const, "East" as const, "West" as const, "North-East" as const, "South-East" as const]);
  const status = pick(["ready-to-move" as const, "under-construction" as const, "resale" as const, "new-launch" as const]);
  const owner = pick(["Rajesh Kumar", "Priya Sharma", "Mohammed Irfan", "Sunita Reddy", "Anand Patel", "Lakshmi Devi", "Vijay Singh", "Deepa Nair"]);
  const landmark = pick(["Near Metro Station", "Opposite Park", "Behind Mall", "Near Tech Park", "Near Hospital", "Main Road Facing", "Corner Plot", "Near School"]);

  return {
    id: generateId(),
    title: isPlot ? `${area_sqft} sq.ft ${type === "farmhouse" ? "Farm Land" : "Residential Plot"} in ${areaName}` : `${bhkPick.bhk} ${type.replace("-", " ")} in ${areaName}`,
    type,
    status,
    price,
    pricePerSqft,
    area: area_sqft,
    builtUpArea: isPlot ? undefined : area_sqft,
    bedrooms: isPlot ? undefined : bhkPick.bed,
    bathrooms: isPlot ? undefined : bhkPick.bath,
    bhk: isPlot ? undefined : bhkPick.bhk as PropertyItem["bhk"],
    facing,
    location: {
      city: city,
      area: areaName,
      locality,
      landmark,
      lat: 12.97 + (Math.random() * 2 - 1),
      lng: 77.59 + (Math.random() * 2 - 1),
    },
    description: isPlot
      ? `${type === "farmhouse" ? "Agricultural" : "Residential"} ${type} land spread across ${area_sqft} sq.ft in ${areaName}, ${locality}. ${landmark}. Clear title, well-demarcated boundaries, ${facing} facing. Ideal for ${type === "farmhouse" ? "farm stays and agriculture" : "building your dream home"}. Close to major roads and civic amenities.`
      : `Spacious ${bhkPick.bhk} ${type.replace("-", " ")} with ${bhkPick.bath} bathrooms in prime ${areaName} location. ${landmark}. ${facing} facing, ${status === "ready-to-move" ? "ready to move in" : "under construction"}. Modern amenities, good ventilation, and ample natural light. Near IT parks, schools, and hospitals.`,
    images: [],
    amenities: {
      parking: Math.random() > 0.2,
      lift: type === "apartment" ? true : Math.random() > 0.5,
      gym: Math.random() > 0.6,
      swimmingPool: Math.random() > 0.7,
      security: Math.random() > 0.3,
      powerBackup: Math.random() > 0.4,
      garden: Math.random() > 0.5,
      clubhouse: Math.random() > 0.65,
      childrenPlayArea: Math.random() > 0.5,
      joggingTrack: Math.random() > 0.7,
    },
    neighborhood: {
      schools: randBetween(60, 98),
      hospitals: randBetween(55, 95),
      grocery: randBetween(70, 99),
      transit: randBetween(50, 95),
      restaurants: randBetween(60, 98),
      parks: randBetween(40, 90),
      overall: 0,
    },
    yearBuilt: isPlot ? undefined : randBetween(2015, 2025),
    age: status === "resale" ? pick(["1-3 years", "3-5 years", "5-10 years", "10+ years"]) : undefined,
    ownerName: owner,
    ownerVerified: Math.random() > 0.3,
    featured: index < 3,
    newListed: Math.random() > 0.7,
    priceDrop: Math.random() > 0.8 ? randBetween(1, 10) : undefined,
    estimatedPrice,
    investmentScore: 0,
    appreciationRate: appreciation,
    tags: [
      type === "plot" ? "Investment Ready" : "Premium",
      status === "ready-to-move" ? "Ready to Move" : "Under Construction",
      facing + " Facing",
      landmark,
    ],
    createdAt: Date.now() - randBetween(0, 30 * 24 * 60 * 60 * 1000),
  };
}

function finalizeProperties(props: PropertyItem[]): PropertyItem[] {
  return props.map((p) => {
    const n = p.neighborhood;
    n.overall = Math.round((n.schools + n.hospitals + n.grocery + n.transit + n.restaurants + n.parks) / 6);
    p.investmentScore = calcInvestmentScore(p.appreciationRate, p.price, p.area);
    return p;
  });
}

const raw = Array.from({ length: 24 }, (_, i) => generateProperty(i));
export const PROPERTIES: PropertyItem[] = finalizeProperties(raw);

export function searchProperties(query: string, props: PropertyItem[]): PropertyItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return props;
  return props.filter((p) => {
    const searchStr = `${p.title} ${p.type} ${p.status} ${p.bhk || ""} ${p.location.city} ${p.location.area} ${p.location.locality} ${p.description} ${p.tags.join(" ")}`.toLowerCase();
    return q.split(/\s+/).every((word) => searchStr.includes(word));
  });
}
