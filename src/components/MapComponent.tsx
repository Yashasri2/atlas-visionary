import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Polygon, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import type { CityData } from "@/data/cities";
import ScenarioFeatureLayer from "./ScenarioFeatureLayer";

interface MapComponentProps {
  city: CityData;
  activeLayers: Record<string, boolean>;
  showScenarioFeatures?: boolean;
  children?: React.ReactNode;
}

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

const typeColors: Record<string, string> = {
  heritage: "#F59E0B",
  tech: "#00D1FF",
  park: "#22C55E",
  residential: "#818CF8",
  commercial: "#00D1FF",
  transport: "#FF6B6B",
};

const MapComponent = ({ city, activeLayers, showScenarioFeatures = false, children }: MapComponentProps) => {
  const zoom = city.population > 5000000 ? 12 : city.population > 1000000 ? 13 : 14;

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

        {/* Zone polygons */}
        {activeLayers.landUse && city.zones.map((zone, i) => (
          <Polygon
            key={i}
            positions={zone.coordinates.map(c => [c[0], c[1]] as [number, number])}
            pathOptions={{
              color: zone.color,
              fillColor: zone.color,
              fillOpacity: 0.2,
              weight: 1.5,
            }}
          >
            <Popup>
              <div className="text-sm">
                <strong>{zone.name}</strong>
                <br />
                <span className="capitalize">{zone.type}</span>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* Landmark markers */}
        {city.landmarks.map((lm, i) => (
          <CircleMarker
            key={i}
            center={lm.coordinates}
            radius={8}
            pathOptions={{
              color: typeColors[lm.type] || "#00D1FF",
              fillColor: typeColors[lm.type] || "#00D1FF",
              fillOpacity: 0.7,
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-sm">
                <strong>{lm.name}</strong>
                <br />
                {lm.info}
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Population density heatmap simulation */}
        {activeLayers.population && (
          <>
            <CircleMarker center={city.coordinates} radius={40}
              pathOptions={{ color: "transparent", fillColor: "#FF6B6B", fillOpacity: 0.15 }} />
            <CircleMarker center={city.coordinates} radius={25}
              pathOptions={{ color: "transparent", fillColor: "#FF6B6B", fillOpacity: 0.25 }} />
            <CircleMarker center={city.coordinates} radius={12}
              pathOptions={{ color: "transparent", fillColor: "#FF6B6B", fillOpacity: 0.4 }} />
          </>
        )}

        {/* Traffic overlay */}
        {activeLayers.traffic && (
          <>
            <CircleMarker center={[city.coordinates[0] + 0.015, city.coordinates[1] + 0.01]} radius={18}
              pathOptions={{ color: "transparent", fillColor: "#F59E0B", fillOpacity: 0.3 }} />
            <CircleMarker center={[city.coordinates[0] - 0.01, city.coordinates[1] - 0.015]} radius={22}
              pathOptions={{ color: "transparent", fillColor: "#EF4444", fillOpacity: 0.25 }} />
            <CircleMarker center={[city.coordinates[0] + 0.005, city.coordinates[1] - 0.02]} radius={15}
              pathOptions={{ color: "transparent", fillColor: "#F59E0B", fillOpacity: 0.35 }} />
          </>
        )}

        {/* Pollution overlay */}
        {activeLayers.pollution && (
          <>
            <CircleMarker center={[city.coordinates[0] - 0.008, city.coordinates[1] + 0.012]} radius={30}
              pathOptions={{ color: "transparent", fillColor: "#8B5CF6", fillOpacity: 0.15 }} />
            <CircleMarker center={[city.coordinates[0] + 0.012, city.coordinates[1] - 0.008]} radius={20}
              pathOptions={{ color: "transparent", fillColor: "#8B5CF6", fillOpacity: 0.2 }} />
          </>
        )}

        {/* Scenario drawn features */}
        {showScenarioFeatures && <ScenarioFeatureLayer />}

        {/* Additional children (e.g. DrawControls) */}
        {children}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
