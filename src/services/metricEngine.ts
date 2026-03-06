export interface AreaMetrics {
  population_density: number;
  road_density: number;
  green_cover_ratio: number;
  commercial_ratio: number;
  pollution_index: number;
  congestion_index: number;
}

export interface AreaBaseData {
  population: number;
  area_sq_km: number;
  road_length_km: number;
  green_area_sq_km: number;
  commercial_area_sq_km: number;
  pollution_index: number;
  congestion_index: number;
}

export function computeAreaMetrics(base: AreaBaseData): AreaMetrics {
  const safeArea = base.area_sq_km > 0 ? base.area_sq_km : 1;

  return {
    population_density: base.population / safeArea,
    road_density: base.road_length_km / safeArea,
    green_cover_ratio: base.green_area_sq_km / safeArea,
    commercial_ratio: base.commercial_area_sq_km / safeArea,
    pollution_index: base.pollution_index,
    congestion_index: base.congestion_index,
  };
}
