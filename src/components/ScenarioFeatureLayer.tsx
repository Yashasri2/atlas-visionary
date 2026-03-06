import { Polygon, Polyline, CircleMarker, Popup } from "react-leaflet";
import { useScenarioStore } from "@/stores/scenarioStore";

const typeStyles = {
  zone: { color: "#818CF8", fillColor: "#818CF8", fillOpacity: 0.2, weight: 2 },
  road: { color: "#FF6B6B", weight: 3, dashArray: "10, 5", fillOpacity: 0 },
  green: { color: "#22C55E", fillColor: "#22C55E", fillOpacity: 0.3, weight: 2 },
};

const ScenarioFeatureLayer = () => {
  const features = useScenarioStore((s) => s.features);

  return (
    <>
      {features.map((feat) => {
        const geom = feat.geojson.geometry;
        const props = feat.geojson.properties || {};
        const style = typeStyles[feat.type];
        const isAi = props.source === "ai";

        if (geom.type === "Polygon") {
          const coords = (geom as GeoJSON.Polygon).coordinates[0].map(
            (c) => [c[1], c[0]] as [number, number]
          );
          return (
            <Polygon
              key={feat.id}
              positions={coords}
              pathOptions={{
                ...style,
                dashArray: isAi ? "6, 4" : undefined,
              }}
            >
              <Popup>
                <div className="text-sm">
                  <strong>{props.name || "Zone"}</strong>
                  {isAi && <span className="ml-1 text-xs text-accent">(AI Suggested)</span>}
                </div>
              </Popup>
            </Polygon>
          );
        }

        if (geom.type === "LineString") {
          const coords = (geom as GeoJSON.LineString).coordinates.map(
            (c) => [c[1], c[0]] as [number, number]
          );
          return (
            <Polyline
              key={feat.id}
              positions={coords}
              pathOptions={{
                ...style,
                dashArray: isAi ? "4, 8" : "10, 5",
              }}
            >
              <Popup>
                <div className="text-sm">
                  <strong>{props.name || "Road"}</strong>
                  {isAi && <span className="ml-1 text-xs text-accent">(AI Suggested)</span>}
                </div>
              </Popup>
            </Polyline>
          );
        }

        if (geom.type === "Point") {
          const [lng, lat] = (geom as GeoJSON.Point).coordinates;
          const radius = props.radius ? Math.min(props.radius / 30, 30) : 15;
          return (
            <CircleMarker
              key={feat.id}
              center={[lat, lng]}
              radius={radius}
              pathOptions={{
                ...style,
                dashArray: isAi ? "4, 4" : undefined,
              }}
            >
              <Popup>
                <div className="text-sm">
                  <strong>{props.name || "Green Space"}</strong>
                  {isAi && <span className="ml-1 text-xs text-accent">(AI Suggested)</span>}
                </div>
              </Popup>
            </CircleMarker>
          );
        }

        return null;
      })}
    </>
  );
};

export default ScenarioFeatureLayer;
