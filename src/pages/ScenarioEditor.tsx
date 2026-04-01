import { useState, useEffect, useCallback, useRef } from "react";
import { PenTool, Route, Trees, AlertTriangle, Undo, Redo, Save, Loader2, Info, CheckCircle, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import MapComponent from "@/components/MapComponent";
import DrawControls from "@/components/DrawControls";
import { CITIES, type CityData } from "@/data/cities";
import { useScenarioStore } from "@/stores/scenarioStore";
import { computeUrbanInsights, type UrbanEngineInput } from "@/services/urbanEngine";
import { motion, AnimatePresence } from "framer-motion";

type Tool = "zone" | "road" | "green" | null;

const ScenarioEditor = () => {
  const [activeTool, setActiveTool] = useState<Tool>(null);
  const [city] = useState<CityData>(CITIES.hyderabad);
  const [activeLayers] = useState({ traffic: true, population: false, landUse: true, pollution: false });

  const {
    features, addFeature, undo, redo, clearFeatures,
    undoStack, redoStack,
    insights, setInsights, isComputingInsights, setIsComputingInsights,
    aiPlanApplied, setAiPlanApplied,
    setScenarioCity,
  } = useScenarioStore();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setScenarioCity(city);
  }, [city, setScenarioCity]);

  // Debounced AI recomputation on feature changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setIsComputingInsights(true);
      const input: UrbanEngineInput = {
        cityName: city.name,
        cityCoordinates: city.coordinates,
        population: city.population,
        area: city.area,
        currentAqi: city.aqi,
        currentTrafficIndex: city.trafficIndex,
        features,
      };
      try {
        const result = await computeUrbanInsights(input);
        setInsights(result);
      } catch (err) {
        console.error("Failed to compute insights:", err);
      } finally {
        setIsComputingInsights(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [features, city, setInsights, setIsComputingInsights]);

  const handleDrawComplete = useCallback(() => {
    setActiveTool(null);
  }, []);

  const tools = [
    { key: "zone" as Tool, label: "Draw Zoning Polygon", icon: PenTool },
    { key: "road" as Tool, label: "Add Street Segment", icon: Route },
    { key: "green" as Tool, label: "Place Green Space", icon: Trees },
  ];

  const feedbackIcon = (type: string) => {
    if (type === "warning") return <AlertTriangle size={14} className="shrink-0 mt-0.5 text-accent-2" />;
    if (type === "success") return <CheckCircle size={14} className="shrink-0 mt-0.5 text-success" />;
    return <Info size={14} className="shrink-0 mt-0.5 text-accent" />;
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar />

      {/* AI Plan Applied Banner */}
      <AnimatePresence>
        {aiPlanApplied && (
          <motion.div
            className="fixed top-14 left-0 right-0 z-40 bg-accent/15 border-b border-accent/30 px-4 py-2 flex items-center justify-center gap-3"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
          >
            <span className="text-sm font-medium text-accent">
              ✨ AI Plan Applied — Review and Modify
            </span>
            <button
              onClick={() => setAiPlanApplied(false)}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 pt-14 flex">
        {/* Left - Editing Tools */}
        <div className="w-[20%] min-w-[260px] h-[calc(100vh-56px)] glass border-r border-border/50 p-4 flex flex-col gap-4 overflow-y-auto">
          <div className="hud-card">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Editing Tools
            </h3>
            <div className="space-y-2">
              {tools.map((tool) => (
                <button
                  key={tool.key}
                  onClick={() => setActiveTool(activeTool === tool.key ? null : tool.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTool === tool.key
                      ? "bg-accent/15 border border-accent/30 text-accent glow-accent"
                      : "bg-muted/20 border border-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  }`}
                >
                  <tool.icon size={18} />
                  {tool.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hud-card">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Actions
            </h3>
            <div className="flex gap-2">
              <button
                onClick={undo}
                disabled={undoStack.length === 0}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-muted/30 text-muted-foreground hover:text-foreground text-xs transition-colors disabled:opacity-40"
              >
                <Undo size={14} /> Undo
              </button>
              <button
                onClick={redo}
                disabled={redoStack.length === 0}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-muted/30 text-muted-foreground hover:text-foreground text-xs transition-colors disabled:opacity-40"
              >
                <Redo size={14} /> Redo
              </button>
            </div>
            {features.length > 0 && (
              <button
                onClick={clearFeatures}
                className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-xs hover:bg-destructive/20 transition-colors"
              >
                <Trash2 size={14} /> Clear All ({features.length})
              </button>
            )}
            <button className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:scale-[1.02] transition-transform">
              <Save size={14} /> Save Scenario
            </button>
          </div>

          {/* Feature List */}
          {features.length > 0 && (
            <div className="hud-card flex-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Features ({features.length})
              </h3>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {features.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-muted/20 text-xs"
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          f.type === "zone" ? "#818CF8" : f.type === "road" ? "#FF6B6B" : "#22C55E",
                      }}
                    />
                    <span className="flex-1 text-foreground/80 truncate">
                      {f.geojson.properties?.name || f.type}
                    </span>
                    {f.geojson.properties?.source === "ai" && (
                      <span className="text-[10px] text-accent font-medium">AI</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center - Map */}
        <div className="flex-1 h-[calc(100vh-56px)] relative">
          <MapComponent city={city} activeLayers={activeLayers} showScenarioFeatures>
            <DrawControls activeTool={activeTool} onDrawComplete={handleDrawComplete} />
          </MapComponent>
          {activeTool && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] glass px-4 py-2 rounded-xl">
              <p className="text-sm text-accent font-medium">
                {activeTool === "zone" && "Click on map to draw zoning polygon vertices. Double-click to finish."}
                {activeTool === "road" && "Click to place road segment points. Double-click to finish."}
                {activeTool === "green" && "Click and drag to place green space circle."}
              </p>
            </div>
          )}
        </div>

        {/* Right - Live AI Feedback */}
        <div className="w-[25%] min-w-[300px] h-[calc(100vh-56px)] glass border-l border-border/50 p-4 overflow-y-auto">
          <div className="hud-card mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-accent mb-1">
                Live AI Feedback
              </h3>
              {isComputingInsights && (
                <Loader2 size={12} className="text-accent animate-spin" />
              )}
            </div>
            <p className="text-[10px] text-muted-foreground">
              Real-time analysis of your edits
            </p>
          </div>

          {/* Feedback items */}
          <div className="space-y-3">
            {(insights?.feedback || []).map((fb, i) => (
              <motion.div
                key={`${fb.type}-${i}`}
                className={`hud-card ${
                  fb.type === "warning"
                    ? "border-accent-2/30"
                    : fb.type === "success"
                    ? "border-success/30"
                    : "border-accent/20"
                }`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex gap-2">
                  {feedbackIcon(fb.type)}
                  <p
                    className={`text-xs leading-relaxed ${
                      fb.type === "warning"
                        ? "text-accent-2/90"
                        : fb.type === "success"
                        ? "text-success/90"
                        : "text-foreground/80"
                    }`}
                  >
                    {fb.text}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Warnings */}
            {insights?.warnings?.filter(Boolean).map((w, i) => (
              <div key={`warn-${i}`} className="hud-card border-accent-2/30">
                <div className="flex gap-2">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5 text-accent-2" />
                  <p className="text-xs leading-relaxed text-accent-2/90">{w}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Impact Summary */}
          <div className="mt-6 hud-card">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Impact Summary
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Congestion Score</span>
                <span className="text-xs font-semibold text-foreground">
                  {insights ? insights.congestion_score.toFixed(1) : city.trafficIndex}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Pollution Index</span>
                <span className="text-xs font-semibold text-foreground">
                  {insights ? insights.pollution_index.toFixed(1) : city.aqi}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Property Value</span>
                <span className="text-xs font-semibold text-success">
                  {insights ? `+${insights.economic_projection.property_value_change.toFixed(1)}%` : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Job Creation</span>
                <span className="text-xs font-semibold text-accent">
                  {insights ? `+${(insights.economic_projection.job_creation / 1000).toFixed(0)}K` : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Confidence</span>
                <span className="text-xs font-semibold text-accent">
                  {insights ? `${(insights.confidence_score * 100).toFixed(0)}%` : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* AI Suggestions */}
          {insights && (insights.zoning_suggestions.length > 0 || insights.road_proposals.length > 0) && (
            <div className="mt-4 hud-card">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                AI Suggestions
              </h4>
              <div className="space-y-2">
                {insights.zoning_suggestions.slice(0, 2).map((s, i) => (
                  <p key={`z-${i}`} className="text-[11px] text-foreground/70 leading-relaxed">
                    🏗️ {s}
                  </p>
                ))}
                {insights.road_proposals.slice(0, 2).map((s, i) => (
                  <p key={`r-${i}`} className="text-[11px] text-foreground/70 leading-relaxed">
                    🛣️ {s}
                  </p>
                ))}
                {insights.green_recommendations.slice(0, 1).map((s, i) => (
                  <p key={`g-${i}`} className="text-[11px] text-foreground/70 leading-relaxed">
                    🌳 {s}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScenarioEditor;
