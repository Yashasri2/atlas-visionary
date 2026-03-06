import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const input = await req.json();

    const systemPrompt = `You are an urban planning analytics engine. Given city data and proposed map features (zoning polygons, road segments, green spaces) plus what-if scenario parameters, compute structured impact metrics.

RESPOND ONLY with a JSON object using this exact schema — no markdown, no explanation:
{
  "zoning_suggestions": ["string"],
  "road_proposals": ["string"],
  "green_recommendations": ["string"],
  "density_projection": number,
  "congestion_score": number (0-100),
  "pollution_index": number (0-300),
  "economic_projection": {
    "property_value_change": number (percentage),
    "tax_revenue_change": number (percentage),
    "job_creation": number
  },
  "confidence_score": number (0-1),
  "warnings": ["string"],
  "feedback": [{"type": "warning"|"info"|"success", "text": "string"}]
}

Rules:
- Each zoning polygon drawn increases density in that area
- Road segments improve connectivity, reduce congestion
- Green spaces reduce PM2.5 and improve livability
- EV adoption reduces pollution, slightly reduces congestion
- Drone delivery reduces road congestion, increases airspace risk
- Work from home reduces CBD congestion, lowers commercial density
- Metro expansion improves connectivity, increases property values nearby
- If any zone overlaps coordinates near a river (lat within 0.005 of water bodies), add a flood risk warning
- Generate 2-4 feedback items based on what changed
- All numbers must be realistic and proportional to city size`;

    const userPrompt = JSON.stringify({
      city: input.cityName,
      coordinates: input.cityCoordinates,
      population: input.population,
      area: input.area,
      current_aqi: input.currentAqi,
      current_traffic: input.currentTrafficIndex,
      features_count: {
        zones: input.features?.filter((f: any) => f.type === "zone").length || 0,
        roads: input.features?.filter((f: any) => f.type === "road").length || 0,
        green: input.features?.filter((f: any) => f.type === "green").length || 0,
      },
      features_geojson: input.features?.map((f: any) => f.geojson) || [],
      what_if: input.whatIf,
    });

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.3,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error [${response.status}]: ${errorText}`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Parse JSON from the response (handle possible markdown wrapping)
    let parsed;
    try {
      const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse AI response:", content);
      throw new Error("AI returned invalid JSON");
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("urban-insights error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
