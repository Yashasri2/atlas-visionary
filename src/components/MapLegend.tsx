import { getCongestionColor, getDensityColor, getLandUseColor, getAqiCategory } from "@/data/mapLayers";

interface MapLegendProps {
  activeLayers: Record<string, boolean>;
}

const MapLegend = ({ activeLayers }: MapLegendProps) => {
  const anyActive = Object.values(activeLayers).some(Boolean);
  if (!anyActive) return null;

  return (
    <div className="absolute top-20 right-4 z-[400] flex flex-col gap-2 max-w-[180px]">
      {activeLayers.traffic && (
        <div className="glass-strong rounded-xl p-3">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Traffic</h4>
          <div className="space-y-1">
            {(["low", "moderate", "heavy"] as const).map((level) => (
              <div key={level} className="flex items-center gap-2">
                <div className="w-6 h-[3px] rounded-full" style={{ backgroundColor: getCongestionColor(level), height: level === "heavy" ? 5 : level === "moderate" ? 3 : 2 }} />
                <span className="text-[10px] text-foreground/80 capitalize">{level}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeLayers.population && (
        <div className="glass-strong rounded-xl p-3">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Density (/km²)</h4>
          <div className="space-y-1">
            {([
              { level: "low" as const, label: "< 5K" },
              { level: "medium" as const, label: "5K–12K" },
              { level: "high" as const, label: "12K–20K" },
              { level: "very-high" as const, label: "> 20K" },
            ]).map((item) => (
              <div key={item.level} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getDensityColor(item.level), opacity: 0.7 }} />
                <span className="text-[10px] text-foreground/80">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeLayers.landUse && (
        <div className="glass-strong rounded-xl p-3">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Land Use</h4>
          <div className="space-y-1">
            {(["residential", "commercial", "industrial", "green", "mixed"] as const).map((type) => (
              <div key={type} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: getLandUseColor(type), opacity: 0.6 }} />
                <span className="text-[10px] text-foreground/80 capitalize">{type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeLayers.pollution && (
        <div className="glass-strong rounded-xl p-3">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">AQI Scale</h4>
          <div className="space-y-1">
            {[30, 75, 125, 175, 250, 350].map((val) => {
              const cat = getAqiCategory(val);
              return (
                <div key={val} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-[10px] text-foreground/80">{cat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapLegend;
