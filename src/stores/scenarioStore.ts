import { create } from "zustand";
import type { CityData } from "@/data/cities";
import type { UrbanInsights } from "@/services/urbanEngine";

export interface ScenarioFeature {
  id: string;
  type: "zone" | "road" | "green";
  geojson: GeoJSON.Feature;
  timestamp: number;
}

interface ScenarioState {
  // Drawn features
  features: ScenarioFeature[];
  addFeature: (f: Omit<ScenarioFeature, "id" | "timestamp">) => void;
  removeFeature: (id: string) => void;
  clearFeatures: () => void;
  undoStack: ScenarioFeature[][];
  redoStack: ScenarioFeature[][];
  undo: () => void;
  redo: () => void;

  // AI insights
  insights: UrbanInsights | null;
  setInsights: (i: UrbanInsights | null) => void;
  isComputingInsights: boolean;
  setIsComputingInsights: (v: boolean) => void;

  // AI plan injection
  aiPlanApplied: boolean;
  setAiPlanApplied: (v: boolean) => void;
  applyAiPlan: (city: CityData) => void;

  // City context
  scenarioCity: CityData | null;
  setScenarioCity: (c: CityData) => void;
}

let featureCounter = 0;

export const useScenarioStore = create<ScenarioState>((set, get) => ({
  features: [],
  undoStack: [],
  redoStack: [],

  addFeature: (f) => {
    const state = get();
    const newFeature: ScenarioFeature = {
      ...f,
      id: `feat-${++featureCounter}`,
      timestamp: Date.now(),
    };
    set({
      undoStack: [...state.undoStack, state.features],
      redoStack: [],
      features: [...state.features, newFeature],
    });
  },

  removeFeature: (id) => {
    const state = get();
    set({
      undoStack: [...state.undoStack, state.features],
      redoStack: [],
      features: state.features.filter((f) => f.id !== id),
    });
  },

  clearFeatures: () => {
    const state = get();
    set({
      undoStack: [...state.undoStack, state.features],
      redoStack: [],
      features: [],
    });
  },

  undo: () => {
    const state = get();
    if (state.undoStack.length === 0) return;
    const prev = state.undoStack[state.undoStack.length - 1];
    set({
      features: prev,
      undoStack: state.undoStack.slice(0, -1),
      redoStack: [...state.redoStack, state.features],
    });
  },

  redo: () => {
    const state = get();
    if (state.redoStack.length === 0) return;
    const next = state.redoStack[state.redoStack.length - 1];
    set({
      features: next,
      redoStack: state.redoStack.slice(0, -1),
      undoStack: [...state.undoStack, state.features],
    });
  },

  insights: null,
  setInsights: (i) => set({ insights: i }),
  isComputingInsights: false,
  setIsComputingInsights: (v) => set({ isComputingInsights: v }),

  aiPlanApplied: false,
  setAiPlanApplied: (v) => set({ aiPlanApplied: v }),

  applyAiPlan: (city) => {
    const state = get();
    const center = city.coordinates;
    const zonePoly: ScenarioFeature = {
      id: `feat-${++featureCounter}`,
      type: "zone",
      geojson: {
        type: "Feature",
        properties: { name: "AI Suggested Zone", source: "ai" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [center[1] - 0.015, center[0] + 0.01],
            [center[1] + 0.015, center[0] + 0.01],
            [center[1] + 0.015, center[0] - 0.005],
            [center[1] - 0.015, center[0] - 0.005],
            [center[1] - 0.015, center[0] + 0.01],
          ]],
        },
      },
      timestamp: Date.now(),
    };
    const roadLine: ScenarioFeature = {
      id: `feat-${++featureCounter}`,
      type: "road",
      geojson: {
        type: "Feature",
        properties: { name: "AI Suggested Road", source: "ai" },
        geometry: {
          type: "LineString",
          coordinates: [
            [center[1] - 0.02, center[0] + 0.005],
            [center[1] + 0.02, center[0] - 0.005],
          ],
        },
      },
      timestamp: Date.now(),
    };
    const greenCircle: ScenarioFeature = {
      id: `feat-${++featureCounter}`,
      type: "green",
      geojson: {
        type: "Feature",
        properties: { name: "AI Suggested Green Space", source: "ai", radius: 300 },
        geometry: {
          type: "Point",
          coordinates: [center[1] + 0.008, center[0] + 0.012],
        },
      },
      timestamp: Date.now(),
    };

    set({
      undoStack: [...state.undoStack, state.features],
      redoStack: [],
      features: [...state.features, zonePoly, roadLine, greenCircle],
      aiPlanApplied: true,
    });
  },

  scenarioCity: null,
  setScenarioCity: (c) => set({ scenarioCity: c }),
}));
