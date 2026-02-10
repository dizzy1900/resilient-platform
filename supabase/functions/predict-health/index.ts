import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lon, workforce_size, daily_wage, temp_increase } = await req.json();

    // Heat stress model: WBGT-based productivity loss
    // Base ambient temp estimated from latitude
    const baseTemp = 28 + (Math.abs(lat) < 15 ? 4 : lat < 25 ? 2 : 0);
    const projectedTemp = baseTemp + (temp_increase ?? 0);

    // WBGT approximation (simplified)
    const wbgt = projectedTemp * 0.7 + 8; // rough WBGT from dry-bulb

    // Productivity loss curve (ISO 7243 inspired)
    let productivity_loss_pct = 0;
    if (wbgt > 25) {
      productivity_loss_pct = Math.min(50, Math.round((wbgt - 25) * 5));
    }

    const economic_loss_daily = Math.round(
      (workforce_size ?? 100) * (daily_wage ?? 15) * (productivity_loss_pct / 100)
    );

    // Malaria transmission risk based on temperature and latitude
    // Optimal transmission: 25-30°C, tropical latitudes
    let malaria_risk: "High" | "Medium" | "Low" = "Low";
    if (Math.abs(lat) < 25 && projectedTemp >= 22 && projectedTemp <= 33) {
      malaria_risk = projectedTemp >= 25 && projectedTemp <= 30 ? "High" : "Medium";
    }

    // Dengue risk
    let dengue_risk: "High" | "Medium" | "Low" = "Low";
    if (Math.abs(lat) < 35 && projectedTemp >= 20) {
      dengue_risk = projectedTemp >= 25 && projectedTemp <= 35 ? "High" : "Medium";
    }

    return new Response(
      JSON.stringify({
        data: {
          productivity_loss_pct,
          economic_loss_daily,
          wbgt: Math.round(wbgt * 10) / 10,
          projected_temp: Math.round(projectedTemp * 10) / 10,
          malaria_risk,
          dengue_risk,
          workforce_size: workforce_size ?? 100,
          daily_wage: daily_wage ?? 15,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Health prediction error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
