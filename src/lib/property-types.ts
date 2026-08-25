export type PropertyType = "apartment" | "independent-house" | "villa" | "plot" | "farmhouse";
export type PropertyStatus = "ready-to-move" | "under-construction" | "resale" | "new-launch";
export type BHK = "1 BHK" | "2 BHK" | "3 BHK" | "4 BHK" | "5+ BHK";
export type Facing = "North" | "South" | "East" | "West" | "North-East" | "South-East" | "North-West" | "South-West";

export interface PropertyLocation {
  city: string;
  area: string;
  locality: string;
  landmark?: string;
  lat: number;
  lng: number;
}

export interface PropertyAmenities {
  parking: boolean;
  lift: boolean;
  gym: boolean;
  swimmingPool: boolean;
  security: boolean;
  powerBackup: boolean;
  garden: boolean;
  clubhouse: boolean;
  childrenPlayArea: boolean;
  joggingTrack: boolean;
}

export interface NeighborhoodScore {
  schools: number;
  hospitals: number;
  grocery: number;
  transit: number;
  restaurants: number;
  parks: number;
  overall: number;
}

export interface PropertyItem {
  id: string;
  title: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  pricePerSqft: number;
  area: number;
  builtUpArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  bhk?: BHK;
  facing: Facing;
  location: PropertyLocation;
  description: string;
  images: string[];
  amenities: PropertyAmenities;
  neighborhood: NeighborhoodScore;
  yearBuilt?: number;
  age?: string;
  ownerName: string;
  ownerVerified: boolean;
  featured: boolean;
  newListed: boolean;
  priceDrop?: number;
  estimatedPrice: number;
  investmentScore: number;
  appreciationRate: number;
  tags: string[];
  createdAt: number;
}

export interface PropertyFilters {
  query: string;
  type: PropertyType | "all";
  status: PropertyStatus | "all";
  priceRange: "all" | "under-50l" | "50l-1cr" | "1cr-2cr" | "2cr-5cr" | "above-5cr";
  areaRange: "all" | "under-1000" | "1000-2000" | "2000-3000" | "above-3000";
  bhk: BHK | "all";
  city: string | "all";
  sort: "price-low" | "price-high" | "newest" | "popular" | "investment";
}

export interface KarnatakaDistrict {
  name: string;
  cities: string[];
}
