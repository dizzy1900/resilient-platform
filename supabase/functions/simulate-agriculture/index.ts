import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Validation schema for agriculture simulation
const requestSchema = z.object({
  lat: z.number().min(-90, "Latitude must be >= -90").max(90, "Latitude must be <= 90"),
  lon: z.number().min(-180, "Longitude must be >= -180").max(180, "Longitude must be <= 180"),
  crop: z.string().min(1, "Crop type is required").max(50, "Crop type must be 50 characters or less"),
  temp_increase: z.number().optional(),
  rain_change: z.number().optional(),
  project_params: z.object({
    capex: z.number().min(0).max(1000000),
    opex: z.number().min(0).max(1000000),
    yield_benefit: z.number().min(0).max(100),
    crop_price: z.number().min(0).max(1000000),
  }).optional(),
});

const RAILWAY_API_URL = "https://primary-production-679e.up.railway.app/webhook/simulate";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  console.log("simulate-agriculture: Request received");

  try {
    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch {
      console.log("simulate-agriculture: Invalid JSON body");
      return new Response(
        JSON.stringify({ error: "Invalid request", message: "Invalid JSON body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validationResult = requestSchema.safeParse(body);
    if (!validationResult.success) {
      console.log("simulate-agriculture: Validation failed", validationResult.error.errors);
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          message: "Invalid simulation parameters",
          details: validationResult.error.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { lat, lon, crop, temp_increase, rain_change, project_params } = validationResult.data;
    console.log("simulate-agriculture: Validated request", { lat, lon, crop, temp_increase, rain_change, project_params: !!project_params });

    // Build payload for Railway API
    const payload: Record<string, unknown> = { lat, lon, crop };
    if (temp_increase !== undefined) payload.temp_increase = temp_increase;
    if (rain_change !== undefined) payload.rain_change = rain_change;
    if (project_params) payload.project_params = project_params;

    // Call Railway API
    const response = await fetch(RAILWAY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("simulate-agriculture: Railway API error", {
        status: response.status,
        statusText: response.statusText,
      });
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ error: "Simulation failed", message: `API error: ${response.status}`, details: errorText }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("simulate-agriculture: Success");

    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("simulate-agriculture: Unexpected error", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: "Internal server error", message: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
