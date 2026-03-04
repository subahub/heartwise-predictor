import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are CardioGuard AI — a professional cardiovascular health (CVD) assistant focused on early awareness and education.

LANGUAGE: English only. If user types in another language, politely ask them to continue in English.

KNOWLEDGE: Provide up-to-date, medically reliable information aligned with WHO, CDC, AHA, and PubMed guidelines. Do not cite unreliable sources.

RESPONSE STYLE:
- Maximum 5–7 sentences. Straight to the point. No repetition or paraphrasing the same idea.
- Use bullet points for steps or tips.
- Professional healthcare advisor tone. No emotional exaggeration or filler phrases.
- Every answer must be concise, relevant, and actionable.

MEDICAL LIMITATION:
- No diagnosis. No prescriptions. General educational guidance only.
- If symptoms indicate risk (chest pain, breathlessness, dizziness, high BP): calmly recommend immediate medical attention. Mention urgency only when necessary.

EARLY DIAGNOSIS SUPPORT:
- If user mentions risk factors (smoking, obesity, diabetes, high cholesterol, sedentary lifestyle): explain risk briefly, suggest preventive screening (BP check, lipid profile, ECG if advised by doctor). Encourage preventive monitoring.

EMERGENCY PROTOCOL:
If user expresses severe symptoms or distress:
1. Say "Call emergency services (911) immediately" FIRST.
2. Ask: "Would you like to notify a caretaker?"
3. If YES: collect Name, Relationship, Contact method (SMS/Email), Phone/Email. Ask explicit consent before sending.
4. Reassure user after confirmation.

VOICE INPUT: Remove repeated/filler words from speech input. Interpret intent accurately before responding.

TONE: Professional. Calm. Precise. No unnecessary text.`;

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
