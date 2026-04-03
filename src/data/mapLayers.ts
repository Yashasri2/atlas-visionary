/**
 * Granular map layer data for all cities.
 * Traffic road segments, population density zones, pollution stations, land use areas.
 */
import type { CityData } from "./cities";
import { CITIES } from "./cities";

// ── Traffic ──────────────────────────────────────────────────────────
export interface TrafficSegment {
  id: string;
  name: string;
  coordinates: [number, number][];
  congestionLevel: "low" | "moderate" | "heavy";
  avgSpeed: number; // km/h
  congestionIndex: number; // 0-100
  peakHour: string;
}

// ── Population Density ──────────────────────────────────────────────
export interface DensityZone {
  id: string;
  name: string;
  center: [number, number];
  radius: number; // meters conceptually, rendered proportionally
  density: number; // people per sq km
  totalPopulation: number;
  growthRate: number; // % annual
  level: "low" | "medium" | "high" | "very-high";
}

// ── Land Use ────────────────────────────────────────────────────────
export interface LandUseArea {
  id: string;
  name: string;
  type: "residential" | "commercial" | "industrial" | "green" | "mixed";
  coordinates: [number, number][];
  percentage: number; // % of city area
}

// ── Pollution Stations ──────────────────────────────────────────────
export interface PollutionStation {
  id: string;
  name: string;
  coordinates: [number, number];
  aqi: number;
  pm25: number;
  pm10: number;
  hourlyVariation: number[]; // 24 values, index = hour
}

export function getAqiCategory(aqi: number): { label: string; color: string } {
  if (aqi <= 50) return { label: "Good", color: "#22C55E" };
  if (aqi <= 100) return { label: "Moderate", color: "#EAB308" };
  if (aqi <= 150) return { label: "Unhealthy (Sensitive)", color: "#F97316" };
  if (aqi <= 200) return { label: "Unhealthy", color: "#EF4444" };
  if (aqi <= 300) return { label: "Very Unhealthy", color: "#A855F7" };
  return { label: "Hazardous", color: "#7F1D1D" };
}

export function getCongestionColor(level: "low" | "moderate" | "heavy"): string {
  if (level === "low") return "#22C55E";
  if (level === "moderate") return "#EAB308";
  return "#EF4444";
}

export function getDensityColor(level: "low" | "medium" | "high" | "very-high"): string {
  if (level === "low") return "#93C5FD";
  if (level === "medium") return "#FBBF24";
  if (level === "high") return "#F97316";
  return "#EF4444";
}

export function getLandUseColor(type: LandUseArea["type"]): string {
  switch (type) {
    case "residential": return "#818CF8";
    case "commercial": return "#00D1FF";
    case "industrial": return "#F97316";
    case "green": return "#22C55E";
    case "mixed": return "#A78BFA";
  }
}

// ── Generate data for any city dynamically ──────────────────────────
function generateTrafficSegments(city: CityData): TrafficSegment[] {
  const [lat, lng] = city.coordinates;
  const ti = city.trafficIndex;
  const segments: TrafficSegment[] = [];
  
  // Generate 8-12 road segments around city center
  const roads = [
    { name: "Main Highway (N-S)", offsets: [[0.02, 0], [0.01, 0.002], [0, 0.004], [-0.01, 0.002], [-0.02, 0]] },
    { name: "Ring Road (East)", offsets: [[0.01, 0.02], [0.005, 0.025], [0, 0.028], [-0.005, 0.025], [-0.01, 0.02]] },
    { name: "Central Avenue", offsets: [[-0.005, -0.015], [0, -0.005], [0.005, 0.005], [0.01, 0.015]] },
    { name: "IT Corridor", offsets: [[0.015, -0.02], [0.012, -0.01], [0.008, 0], [0.005, 0.01]] },
    { name: "Old City Road", offsets: [[-0.012, 0.005], [-0.008, 0.01], [-0.005, 0.015], [-0.002, 0.02]] },
    { name: "Industrial Belt Road", offsets: [[-0.02, -0.01], [-0.015, -0.005], [-0.01, 0], [-0.005, 0.005]] },
    { name: "Station Road", offsets: [[0.005, 0.01], [0.003, 0.015], [0, 0.02], [-0.003, 0.025]] },
    { name: "Bypass Road (West)", offsets: [[0.015, -0.025], [0.01, -0.028], [0.005, -0.03], [0, -0.028], [-0.005, -0.025]] },
  ];

  roads.forEach((road, i) => {
    const congestionScore = Math.min(100, Math.max(0, ti + (Math.sin(i * 2.1) * 20)));
    const level: TrafficSegment["congestionLevel"] = congestionScore < 40 ? "low" : congestionScore < 70 ? "moderate" : "heavy";
    const avgSpeed = level === "low" ? 45 + Math.round(Math.random() * 15) : level === "moderate" ? 25 + Math.round(Math.random() * 10) : 8 + Math.round(Math.random() * 12);
    
    segments.push({
      id: `traffic-${i}`,
      name: road.name,
      coordinates: road.offsets.map(([dlat, dlng]) => [lat + dlat, lng + dlng] as [number, number]),
      congestionLevel: level,
      avgSpeed,
      congestionIndex: Math.round(congestionScore),
      peakHour: congestionScore > 60 ? "8-10 AM, 5-8 PM" : "5-7 PM",
    });
  });

  return segments;
}

function generateDensityZones(city: CityData): DensityZone[] {
  const [lat, lng] = city.coordinates;
  const baseDensity = city.populationDensity;
  const zones: DensityZone[] = [];

  const areas = [
    { name: "City Core", dLat: 0, dLng: 0, factor: 1.8, pop: 0.25 },
    { name: "North District", dLat: 0.02, dLng: 0.005, factor: 1.2, pop: 0.15 },
    { name: "South District", dLat: -0.018, dLng: 0.003, factor: 1.0, pop: 0.12 },
    { name: "East Suburbs", dLat: 0.005, dLng: 0.025, factor: 0.7, pop: 0.1 },
    { name: "West Suburbs", dLat: 0.003, dLng: -0.025, factor: 0.8, pop: 0.1 },
    { name: "Tech Hub Area", dLat: 0.015, dLng: -0.015, factor: 1.4, pop: 0.1 },
    { name: "Industrial Zone", dLat: -0.015, dLng: -0.012, factor: 0.5, pop: 0.05 },
    { name: "Outer Ring", dLat: -0.025, dLng: 0.02, factor: 0.3, pop: 0.08 },
    { name: "Growth Corridor", dLat: 0.008, dLng: -0.03, factor: 0.6, pop: 0.05 },
  ];

  areas.forEach((area, i) => {
    const density = Math.round(baseDensity * area.factor);
    const level: DensityZone["level"] = density < 5000 ? "low" : density < 12000 ? "medium" : density < 20000 ? "high" : "very-high";
    zones.push({
      id: `density-${i}`,
      name: area.name,
      center: [lat + area.dLat, lng + area.dLng],
      radius: Math.sqrt(area.pop) * 800,
      density,
      totalPopulation: Math.round(city.population * area.pop),
      growthRate: +(1.2 + Math.sin(i) * 1.5).toFixed(1),
      level,
    });
  });

  return zones;
}

function generateLandUseAreas(city: CityData): LandUseArea[] {
  const [lat, lng] = city.coordinates;
  const areas: LandUseArea[] = [];
  const size = city.population > 10000000 ? 0.015 : city.population > 1000000 ? 0.012 : 0.008;

  const defs: { name: string; type: LandUseArea["type"]; dLat: number; dLng: number; pct: number }[] = [
    { name: "Central Residential", type: "residential", dLat: 0.005, dLng: 0.01, pct: 32 },
    { name: "CBD / Commercial Core", type: "commercial", dLat: -0.002, dLng: -0.005, pct: 18 },
    { name: "Industrial District", type: "industrial", dLat: -0.02, dLng: -0.015, pct: 14 },
    { name: "Green Belt / Parks", type: "green", dLat: 0.015, dLng: 0.005, pct: Math.round(city.greenCover) },
    { name: "Mixed Use Zone", type: "mixed", dLat: 0.008, dLng: -0.02, pct: 22 },
    { name: "Outer Residential", type: "residential", dLat: -0.015, dLng: 0.02, pct: 14 - Math.round(city.greenCover / 3) },
  ];

  defs.forEach((d, i) => {
    const s = size * (0.8 + d.pct / 50);
    areas.push({
      id: `landuse-${i}`,
      name: d.name,
      type: d.type,
      coordinates: [
        [lat + d.dLat, lng + d.dLng],
        [lat + d.dLat + s, lng + d.dLng],
        [lat + d.dLat + s, lng + d.dLng + s * 1.2],
        [lat + d.dLat, lng + d.dLng + s * 1.2],
      ],
      percentage: d.pct,
    });
  });

  return areas;
}

function generatePollutionStations(city: CityData): PollutionStation[] {
  const [lat, lng] = city.coordinates;
  const baseAqi = city.aqi;
  const stations: PollutionStation[] = [];

  const points = [
    { name: "Central Monitor", dLat: 0, dLng: 0, factor: 1.0 },
    { name: "Industrial Area", dLat: -0.015, dLng: -0.012, factor: 1.4 },
    { name: "Residential North", dLat: 0.02, dLng: 0.005, factor: 0.8 },
    { name: "Highway Junction", dLat: 0.008, dLng: 0.02, factor: 1.2 },
    { name: "Green Zone", dLat: 0.015, dLng: -0.01, factor: 0.6 },
    { name: "Commercial Hub", dLat: -0.005, dLng: 0.015, factor: 1.1 },
    { name: "Suburban East", dLat: 0.005, dLng: 0.028, factor: 0.7 },
  ];

  points.forEach((p, i) => {
    const aqi = Math.round(baseAqi * p.factor);
    const hourly = Array.from({ length: 24 }, (_, h) => {
      // AQI varies by hour: peaks at 8-10 AM and 6-8 PM (traffic), lowest at 3-5 AM
      const timeVariation = Math.sin((h - 3) * Math.PI / 12) * 0.3;
      return Math.max(10, Math.round(aqi * (1 + timeVariation)));
    });

    stations.push({
      id: `pollution-${i}`,
      name: p.name,
      coordinates: [lat + p.dLat, lng + p.dLng],
      aqi,
      pm25: Math.round(aqi * 0.6),
      pm10: Math.round(aqi * 1.2),
      hourlyVariation: hourly,
    });
  });

  return stations;
}

// ── Exported accessors ──────────────────────────────────────────────
export interface CityMapLayers {
  traffic: TrafficSegment[];
  density: DensityZone[];
  landUse: LandUseArea[];
  pollution: PollutionStation[];
}

const cache: Record<string, CityMapLayers> = {};

export function getCityMapLayers(cityKey: string): CityMapLayers {
  if (cache[cityKey]) return cache[cityKey];
  
  const city = CITIES[cityKey];
  if (!city) {
    return { traffic: [], density: [], landUse: [], pollution: [] };
  }

  const layers: CityMapLayers = {
    traffic: generateTrafficSegments(city),
    density: generateDensityZones(city),
    landUse: generateLandUseAreas(city),
    pollution: generatePollutionStations(city),
  };

  cache[cityKey] = layers;
  return layers;
}
