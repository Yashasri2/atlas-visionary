import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Polygon, Polyline, useMap, Tooltip as LeafletTooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import type { CityData } from "@/data/cities";
import { CITY_NAMES, CITIES } from "@/data/cities";
import { getCityMapLayers, getCongestionColor, getDensityColor, getLandUseColor, getAqiCategory } from "@/data/mapLayers";
import ScenarioFeatureLayer from "./ScenarioFeatureLayer";
import MapLegend from "./MapLegend";
import MapSummaryCards from "./MapSummaryCards";

interface MapComponentProps {
  city: CityData;
  activeLayers: Record<string, boolean>;
  showScenarioFeatures?: boolean;
  showSummary?: boolean;
  children?: React.ReactNode;
}

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

// Find city key from CityData
function getCityKey(city: CityData): string {
  return CITY_NAMES.find((k) => CITIES[k].name === city.name) || "hyderabad";
}

const MapComponent = ({ city, activeLayers, showScenarioFeatures = false, showSummary = true, children }: MapComponentProps) => {
  const zoom = city.population > 5000000 ? 12 : city.population > 1000000 ? 13 : 14;
  const [pollutionHour, setPollutionHour] = useState(12);

  const cityKey = getCityKey(city);
  const layers = useMemo(() => getCityMapLayers(cityKey), [cityKey]);

  return (
    <div className="absolute inset-0">
      <MapContainer
        key={city.name}
        center={city.coordinates}
        zoom={zoom}
        className="w-full h-full"
        zoomControl={true}
        attributionControl={true}
      >
        <MapUpdater center={city.coordinates} zoom={zoom} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* ── TRAFFIC LAYER ─────────────────────────────────── */}
        {activeLayers.traffic && layers.traffic.map((seg) => (
          <Polyline
            key={seg.id}
            positions={seg.coordinates}
            pathOptions={{
              color: getCongestionColor(seg.congestionLevel),
              weight: seg.congestionLevel === "heavy" ? 5 : seg.congestionLevel === "moderate" ? 3.5 : 2,
              opacity: 0.85,
              dashArray: seg.congestionLevel === "heavy" ? "8 4" : undefined,
            }}
          >
            <Popup>
              <div className="text-xs space-y-1 min-w-[160px]">
                <p className="font-bold text-sm">{seg.name}</p>
                <p>🚗 Avg Speed: <strong>{seg.avgSpeed} km/h</strong></p>
                <p>📊 Congestion: <strong style={{ color: getCongestionColor(seg.congestionLevel) }}>{seg.congestionIndex}/100</strong></p>
                <p>⏰ Peak: {seg.peakHour}</p>
              </div>
            </Popup>
          </Polyline>
        ))}

        {/* ── POPULATION DENSITY LAYER ──────────────────────── */}
        {activeLayers.population && layers.density.map((zone) => (
          <CircleMarker
            key={zone.id}
            center={zone.center}
            radius={Math.max(12, Math.min(50, zone.radius / 20))}
            pathOptions={{
              color: getDensityColor(zone.level),
              fillColor: getDensityColor(zone.level),
              fillOpacity: 0.3,
              weight: 1.5,
              opacity: 0.6,
            }}
          >
            <LeafletTooltip permanent direction="center" className="density-label">
              <span style={{ fontSize: "9px", fontWeight: 700, color: getDensityColor(zone.level) }}>
                {(zone.density / 1000).toFixed(0)}K
              </span>
            </LeafletTooltip>
            <Popup>
              <div className="text-xs space-y-1 min-w-[150px]">
                <p className="font-bold text-sm">{zone.name}</p>
                <p>👥 Population: <strong>{(zone.totalPopulation / 1000).toFixed(0)}K</strong></p>
                <p>📏 Density: <strong>{zone.density.toLocaleString()}/km²</strong></p>
                <p>📈 Growth: <strong>{zone.growthRate > 0 ? "+" : ""}{zone.growthRate}%/yr</strong></p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* ── LAND USE LAYER ────────────────────────────────── */}
        {activeLayers.landUse && layers.landUse.map((area) => (
          <Polygon
            key={area.id}
            positions={area.coordinates}
            pathOptions={{
              color: getLandUseColor(area.type),
              fillColor: getLandUseColor(area.type),
              fillOpacity: 0.25,
              weight: 1.5,
            }}
          >
            <LeafletTooltip direction="center" className="landuse-label">
              <span style={{ fontSize: "9px", fontWeight: 600 }}>
                {area.type.charAt(0).toUpperCase() + area.type.slice(1)}
              </span>
            </LeafletTooltip>
            <Popup>
              <div className="text-xs space-y-1 min-w-[150px]">
                <p className="font-bold text-sm">{area.name}</p>
                <p>🏷️ Type: <strong className="capitalize">{area.type}</strong></p>
                <p>📊 Area Share: <strong>{area.percentage}%</strong></p>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* ── POLLUTION LAYER ───────────────────────────────── */}
        {activeLayers.pollution && layers.pollution.map((station) => {
          const currentAqi = station.hourlyVariation[pollutionHour] || station.aqi;
          const cat = getAqiCategory(currentAqi);
          const radius = Math.max(15, Math.min(40, currentAqi / 5));

          return (
            <CircleMarker
              key={station.id}
              center={station.coordinates}
              radius={radius}
              pathOptions={{
                color: cat.color,
                fillColor: cat.color,
                fillOpacity: 0.35,
                weight: 2,
                opacity: 0.8,
              }}
            >
              <LeafletTooltip permanent direction="center" className="aqi-label">
                <span style={{ fontSize: "10px", fontWeight: 800, color: cat.color }}>
                  {currentAqi}
                </span>
              </LeafletTooltip>
              <Popup>
                <div className="text-xs space-y-1 min-w-[160px]">
                  <p className="font-bold text-sm">{station.name}</p>
                  <p>🌫️ AQI: <strong style={{ color: cat.color }}>{currentAqi} ({cat.label})</strong></p>
                  <p>PM2.5: <strong>{Math.round(station.pm25 * (currentAqi / station.aqi))}</strong> µg/m³</p>
                  <p>PM10: <strong>{Math.round(station.pm10 * (currentAqi / station.aqi))}</strong> µg/m³</p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* Scenario drawn features */}
        {showScenarioFeatures && <ScenarioFeatureLayer />}

        {/* Additional children (e.g. DrawControls) */}
        {children}
      </MapContainer>

      {/* Legends */}
      <MapLegend activeLayers={activeLayers} />

      {/* Summary Cards */}
      {showSummary && <MapSummaryCards city={city} />}

      {/* Pollution Time Slider */}
      {activeLayers.pollution && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[400] glass-strong rounded-xl px-4 py-2 flex items-center gap-3 min-w-[280px]">
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">🕐 {pollutionHour}:00</span>
          <input
            type="range"
            min={0}
            max={23}
            value={pollutionHour}
            onChange={(e) => setPollutionHour(Number(e.target.value))}
            className="flex-1 h-1 accent-accent cursor-pointer"
          />
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">AQI by Hour</span>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
