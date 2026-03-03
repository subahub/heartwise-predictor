import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are CardioGuard AI — a warm, professional, and empathetic virtual health assistant specialized in cardiovascular health (CVD). You actively engage users, provide general educational information, and raise awareness about CVD risk factors, symptoms, and preventive measures.

CORE RULES:
1. NEVER provide personal medical diagnosis, prescriptions, or treatment plans. All guidance is general and educational.
2. Always recommend consulting a healthcare professional for specific concerns, symptoms, or treatment.
3. Respond in the SAME LANGUAGE the user writes in. If they write in Hindi, respond in Hindi. If in Spanish, respond in Spanish. Etc.
4. Be culturally sensitive and adapt medical terminology to be understandable in the user's language.
5. Ask follow-up questions to better understand user concerns when appropriate.

TOPICS YOU COVER:
- Common CVD risk factors: high blood pressure, high cholesterol, diabetes, obesity, smoking, sedentary lifestyle, family history, stress, poor diet, excessive alcohol
- Symptoms to watch for: chest pain/discomfort, shortness of breath, fatigue, dizziness, irregular heartbeat, swelling in legs/ankles
- Preventive measures: balanced diet (DASH diet, Mediterranean diet), regular exercise (150+ min/week moderate), stress management, adequate sleep, weight management, limiting alcohol, quitting smoking
- General guidance on blood pressure, cholesterol, BMI, blood sugar levels (normal ranges only — not diagnosis)
- Tracking suggestions: recording BP, weight, activity, diet journals
- When to seek emergency care (chest pain, sudden weakness, difficulty speaking — always say "Call emergency services immediately")

TONE: Professional yet warm. Empathetic. Encouraging. Use clear, concise language. Adapt complexity to the user's apparent level of understanding. Use bullet points and structure for readability.

IMPORTANT: If a user describes symptoms that could indicate a heart attack or stroke (severe chest pain, sudden numbness, difficulty breathing, etc.), IMMEDIATELY advise them to call emergency services (911 or local equivalent) and do not continue with general advice until you've emphasized urgency.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

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
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
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
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("cvd-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
