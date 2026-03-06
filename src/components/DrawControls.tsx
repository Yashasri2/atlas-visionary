import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { useScenarioStore } from "@/stores/scenarioStore";

type ActiveTool = "zone" | "road" | "green" | null;

interface DrawControlsProps {
  activeTool: ActiveTool;
  onDrawComplete: () => void;
}

const DrawControls = ({ activeTool, onDrawComplete }: DrawControlsProps) => {
  const map = useMap();
  const addFeature = useScenarioStore((s) => s.addFeature);

  useEffect(() => {
    if (!activeTool) return;

    let handler: any;

    if (activeTool === "zone") {
      handler = new (L.Draw as any).Polygon(map, {
        shapeOptions: {
          color: "#818CF8",
          fillColor: "#818CF8",
          fillOpacity: 0.25,
          weight: 2,
        },
        allowIntersection: false,
      });
    } else if (activeTool === "road") {
      handler = new (L.Draw as any).Polyline(map, {
        shapeOptions: {
          color: "#FF6B6B",
          weight: 3,
          dashArray: "10, 5",
        },
      });
    } else if (activeTool === "green") {
      handler = new (L.Draw as any).Circle(map, {
        shapeOptions: {
          color: "#22C55E",
          fillColor: "#22C55E",
          fillOpacity: 0.3,
          weight: 2,
        },
      });
    }

    if (handler) {
      handler.enable();
    }

    const onCreated = (e: any) => {
      const layer = e.layer;
      let geojson: GeoJSON.Feature;

      if (activeTool === "green" && layer instanceof L.Circle) {
        // Circle → convert to Point + radius property
        const center = layer.getLatLng();
        const radius = layer.getRadius();
        geojson = {
          type: "Feature",
          properties: { radius, name: "Green Space" },
          geometry: {
            type: "Point",
            coordinates: [center.lng, center.lat],
          },
        };
      } else {
        geojson = layer.toGeoJSON() as GeoJSON.Feature;
        geojson.properties = geojson.properties || {};
        geojson.properties.name =
          activeTool === "zone" ? "Zoning Polygon" : "Road Segment";
      }

      addFeature({ type: activeTool!, geojson });
      
      // Remove the temporary draw layer — we render from state
      map.removeLayer(layer);
      onDrawComplete();
    };

    map.on(L.Draw.Event.CREATED, onCreated);

    return () => {
      if (handler) {
        try { handler.disable(); } catch { /* already disabled */ }
      }
      map.off(L.Draw.Event.CREATED, onCreated);
    };
  }, [activeTool, map, addFeature, onDrawComplete]);

  return null;
};

export default DrawControls;
