import { MapPin, Route, Trees, AlertTriangle, TrendingUp, CheckCircle2, Sparkles } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import type { CityData } from "@/data/cities";
import { useScenarioStore } from "@/stores/scenarioStore";

interface RightPanelProps {
  city: CityData;
}

const RightPanel = ({ city }: RightPanelProps) => {
  const { aiRecommendations: recs } = city;
  const forecast2030 = city.populationForecast.filter((d) => d.year >= 2024 && d.year <= 2036);
  const navigate = useNavigate();
  const applyAiPlan = useScenarioStore((s) => s.applyAiPlan);
  const setScenarioCity = useScenarioStore((s) => s.setScenarioCity);

  const handleApplyAiPlan = () => {
    setScenarioCity(city);
    applyAiPlan(city);
    navigate("/scenario");
  };

  return (
    <div className="h-full flex flex-col gap-4 p-4 overflow-y-auto">
      {/* Header */}
      <div className="hud-card">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-accent mb-1">
          AI Recommendations
        </h3>
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Note: This is an AI-generated data insight. Official approval, detailed feasibility studies, and regulatory compliance are essential.
        </p>
      </div>

      {/* Warnings */}
      {recs.warnings.length > 0 && (
        <div className="hud-card border-accent-2/30">
          {recs.warnings.map((w, i) => (
            <div key={i} className="flex gap-2 mb-2 last:mb-0">
              <AlertTriangle size={14} className="text-accent-2 shrink-0 mt-0.5" />
              <p className="text-xs text-accent-2/90">{w}</p>
            </div>
          ))}
        </div>
      )}

      {/* Zoning */}
      <div className="hud-card">
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={14} className="text-accent" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Zoning Suggestions</h4>
        </div>
        <ul className="space-y-2">
          {recs.zoning.map((z, i) => (
            <li key={i} className="text-xs text-foreground/80 leading-relaxed pl-3 border-l-2 border-accent/30">
              {z}
            </li>
          ))}
        </ul>
      </div>

      {/* Roads */}
      <div className="hud-card">
        <div className="flex items-center gap-2 mb-3">
          <Route size={14} className="text-accent" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Road Change Proposals</h4>
        </div>
        <ul className="space-y-2">
          {recs.roads.map((r, i) => (
            <li key={i} className="text-xs text-foreground/80 leading-relaxed pl-3 border-l-2 border-accent/30">
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* Green Spaces */}
      <div className="hud-card">
        <div className="flex items-center gap-2 mb-3">
          <Trees size={14} className="text-success" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Green Space Suggestions</h4>
        </div>
        <ul className="space-y-2">
          {recs.greenSpaces.map((g, i) => (
            <li key={i} className="text-xs text-foreground/80 leading-relaxed pl-3 border-l-2 border-success/30">
              {g}
            </li>
          ))}
        </ul>
      </div>

      {/* Population Forecast Chart */}
      <div className="hud-card">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={14} className="text-accent" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Population Density (2030)
          </h4>
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecast2030}>
              <XAxis dataKey="year" tick={{ fontSize: 10, fill: "hsl(215, 20%, 65%)" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "hsl(220, 39%, 12%)",
                  border: "1px solid hsl(191, 100%, 50%, 0.2)",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
                formatter={(value: number) => [(value / 1000000).toFixed(2) + "M", "Population"]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(191, 100%, 50%)"
                strokeWidth={2}
                dot={{ fill: "hsl(191, 100%, 50%)", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Confidence Score */}
      <div className="hud-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-success" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Confidence Score
            </span>
          </div>
          <span className="text-lg font-bold text-success">
            {Math.round(recs.confidence * 100)}%
          </span>
        </div>
        <div className="mt-2 w-full h-2 bg-muted/30 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-success transition-all duration-700"
            style={{ width: `${recs.confidence * 100}%` }}
          />
        </div>
      </div>

      {/* Apply AI Plan Button */}
      <button
        onClick={handleApplyAiPlan}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent text-accent-foreground text-sm font-bold hover:scale-[1.02] transition-transform glow-accent"
      >
        <Sparkles size={16} /> Apply AI Plan
      </button>
    </div>
  );
};

export default RightPanel;
