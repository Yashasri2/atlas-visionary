/**
 * Urban Engine Service
 * Abstracted AI service — currently calls Lovable AI.
 * Replace computeUrbanInsights internals with REST API call later without changing UI.
 */

import { supabase } from "@/integrations/supabase/client";
import type { ScenarioFeature, WhatIfScenario } from "@/stores/scenarioStore";

export interface UrbanInsights {
  zoning_suggestions: string[];
  road_proposals: string[];
  green_recommendations: string[];
  density_projection: number;
  congestion_score: number;
  pollution_index: number;
  economic_projection: {
    property_value_change: number;
    tax_revenue_change: number;
    job_creation: number;
  };
  confidence_score: number;
  warnings: string[];
  feedback: Array<{
    type: "warning" | "info" | "success";
    text: string;
  }>;
}

export interface UrbanEngineInput {
  cityName: string;
  cityCoordinates: [number, number];
  population: number;
  area: number;
  currentAqi: number;
  currentTrafficIndex: number;
  features: ScenarioFeature[];
  whatIf: WhatIfScenario;
}

export async function computeUrbanInsights(
  input: UrbanEngineInput
): Promise<UrbanInsights> {
  try {
    const { data, error } = await supabase.functions.invoke("urban-insights", {
      body: input,
    });

    if (error) {
      console.error("Urban insights error:", error);
      return getFallbackInsights(input);
    }

    return data as UrbanInsights;
  } catch (err) {
    console.error("Urban insights network error:", err);
    return getFallbackInsights(input);
  }
}

/** Deterministic fallback when AI is unavailable */
function getFallbackInsights(input: UrbanEngineInput): UrbanInsights {
  const zoneCount = input.features.filter((f) => f.type === "zone").length;
  const roadCount = input.features.filter((f) => f.type === "road").length;
  const greenCount = input.features.filter((f) => f.type === "green").length;

  const congestionDelta =
    -roadCount * 8 -
    input.whatIf.evAdoption * 0.05 -
    input.whatIf.workFromHome * 0.15 -
    input.whatIf.metroExpansion * 0.12 +
    input.whatIf.droneDelivery * 0.02;

  const pollutionDelta =
    -greenCount * 12 -
    input.whatIf.evAdoption * 0.25 +
    input.whatIf.droneDelivery * 0.01 -
    input.whatIf.workFromHome * 0.08;

  const feedback: UrbanInsights["feedback"] = [];
  if (zoneCount > 0)
    feedback.push({
      type: "info",
      text: `${zoneCount} zoning polygon(s) added — density recalculated.`,
    });
  if (roadCount > 0)
    feedback.push({
      type: "success",
      text: `${roadCount} road segment(s) improve connectivity score by ${(roadCount * 0.12).toFixed(2)}.`,
    });
  if (greenCount > 0)
    feedback.push({
      type: "success",
      text: `${greenCount} green space(s) projected to reduce PM2.5 by ~${(greenCount * 12).toFixed(0)}% locally.`,
    });
  if (input.whatIf.evAdoption > 30)
    feedback.push({
      type: "info",
      text: `${input.whatIf.evAdoption}% EV adoption reduces pollution index by ${(input.whatIf.evAdoption * 0.25).toFixed(1)}%.`,
    });
  if (feedback.length === 0)
    feedback.push({ type: "info", text: "Draw features on the map to see live analysis." });

  return {
    zoning_suggestions: [
      "Consider mixed-use zoning near transit nodes",
      "Buffer zones recommended along water bodies",
    ],
    road_proposals: [
      "Connectivity can be improved with east-west arterial road",
    ],
    green_recommendations: [
      "Urban forest planting within 2km of high-density residential areas",
    ],
    density_projection: input.population / input.area + zoneCount * 200,
    congestion_score: Math.max(0, Math.min(100, input.currentTrafficIndex + congestionDelta)),
    pollution_index: Math.max(0, Math.min(300, input.currentAqi + pollutionDelta)),
    economic_projection: {
      property_value_change: zoneCount * 5 + greenCount * 3 + roadCount * 2,
      tax_revenue_change: zoneCount * 3 + roadCount * 1.5,
      job_creation: zoneCount * 15000 + roadCount * 8000 + greenCount * 5000,
    },
    confidence_score: 0.65,
    warnings:
      zoneCount === 0 && roadCount === 0 && greenCount === 0
        ? ["No changes detected — add features to see impact analysis."]
        : [],
    feedback,
  };
}
