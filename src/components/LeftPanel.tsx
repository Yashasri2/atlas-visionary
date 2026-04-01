import { Layers, Car, Users, Trees, Wind, Activity } from "lucide-react";
import type { CityData } from "@/data/cities";

interface LeftPanelProps {
  city: CityData;
  activeLayers: Record<string, boolean>;
  onToggleLayer: (layer: string) => void;
}

const layers = [
  { key: "traffic", label: "Traffic", icon: Car, color: "text-yellow-400", source: "TomTom Traffic Index 2024" },
  { key: "population", label: "Population", icon: Users, color: "text-accent-2", source: "Census of India 2011 (projected)" },
  { key: "landUse", label: "Land Use", icon: Layers, color: "text-purple-400", source: "ISRO LULC / Municipal Master Plans" },
  { key: "pollution", label: "Pollution", icon: Wind, color: "text-violet-400", source: "CPCB / WAQI Real-time AQI" },
];

const LeftPanel = ({ city, activeLayers, onToggleLayer }: LeftPanelProps) => {
  const formatNum = (n: number) => {
    if (n >= 10000000) return (n / 10000000).toFixed(1) + " Cr";
    if (n >= 100000) return (n / 100000).toFixed(1) + " L";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return n.toString();
  };

  return (
    <div className="h-full flex flex-col gap-4 p-4 overflow-y-auto">
      {/* City Stats */}
      <div className="hud-card">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          City Overview
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/30 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Users size={12} className="text-accent" />
              <span className="text-[10px] text-muted-foreground uppercase">Population</span>
            </div>
            <p className="text-lg font-bold text-foreground">{formatNum(city.population)}</p>
          </div>
          <div className="bg-muted/30 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Activity size={12} className="text-accent-2" />
              <span className="text-[10px] text-muted-foreground uppercase">AQI</span>
            </div>
            <p className={`text-lg font-bold ${city.aqi > 150 ? "text-accent-2" : city.aqi > 100 ? "text-yellow-400" : "text-success"}`}>
              {city.aqi}
            </p>
          </div>
          <div className="bg-muted/30 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Car size={12} className="text-yellow-400" />
              <span className="text-[10px] text-muted-foreground uppercase">Traffic Idx</span>
            </div>
            <p className="text-lg font-bold text-foreground">{city.trafficIndex}/100</p>
          </div>
          <div className="bg-muted/30 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Trees size={12} className="text-success" />
              <span className="text-[10px] text-muted-foreground uppercase">Green Cover</span>
            </div>
            <p className="text-lg font-bold text-success">{city.greenCover}%</p>
          </div>
        </div>
      </div>

      {/* Dataset Layers */}
      <div className="hud-card">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Data Layers
        </h3>
        <div className="space-y-2">
          {layers.map((layer) => (
            <button
              key={layer.key}
              onClick={() => onToggleLayer(layer.key)}
              className={`w-full flex flex-col px-3 py-2.5 rounded-xl transition-all duration-200 ${
                activeLayers[layer.key]
                  ? "bg-accent/10 border border-accent/30"
                  : "bg-muted/20 border border-transparent hover:bg-muted/40"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2.5">
                  <layer.icon size={16} className={activeLayers[layer.key] ? "text-accent" : "text-muted-foreground"} />
                  <span className={`text-sm font-medium ${activeLayers[layer.key] ? "text-foreground" : "text-muted-foreground"}`}>
                    {layer.label}
                  </span>
                </div>
                <div
                  className={`w-9 h-5 rounded-full transition-colors relative ${
                    activeLayers[layer.key] ? "bg-accent" : "bg-muted"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-foreground absolute top-0.5 transition-transform ${
                      activeLayers[layer.key] ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </div>
              </div>
              {activeLayers[layer.key] && (
                <span className="text-[9px] text-muted-foreground mt-1 ml-6">
                  Source: {layer.source}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Data Sources */}
      <div className="hud-card">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Data Sources
        </h3>
        <ul className="space-y-1.5">
          <li className="text-[10px] text-muted-foreground leading-relaxed">
            📊 Population — Census of India 2011, UN World Urbanization Prospects 2024
          </li>
          <li className="text-[10px] text-muted-foreground leading-relaxed">
            🌫️ AQI — Central Pollution Control Board (CPCB), WAQI.info
          </li>
          <li className="text-[10px] text-muted-foreground leading-relaxed">
            🚗 Traffic — TomTom Traffic Index 2024
          </li>
          <li className="text-[10px] text-muted-foreground leading-relaxed">
            🗺️ Land Use — ISRO Bhuvan LULC, Municipal Master Plans
          </li>
          <li className="text-[10px] text-muted-foreground leading-relaxed">
            🌿 Green Cover — Forest Survey of India (FSI) 2023
          </li>
        </ul>
      </div>

      {/* Economic Snapshot */}
      <div className="hud-card">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Economic Snapshot
        </h3>
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Avg Property Value</span>
            <span className="text-sm font-semibold text-foreground">₹{formatNum(city.economicData.avgPropertyValue)}/sqft</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Tax Revenue</span>
            <span className="text-sm font-semibold text-foreground">₹{formatNum(city.economicData.taxRevenue)} Cr</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Job Creation Potential</span>
            <span className="text-sm font-semibold text-success">{formatNum(city.economicData.jobCreation)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Infra Cost Estimate</span>
            <span className="text-sm font-semibold text-accent-2">₹{formatNum(city.economicData.infrastructureCost)} Cr</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
