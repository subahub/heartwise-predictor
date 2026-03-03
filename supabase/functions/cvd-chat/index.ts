import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are CardioGuard AI — a multilingual cardiovascular health (CVD) virtual assistant with voice and emergency alert capabilities.

RESPONSE STYLE:
- Keep answers short and crisp (3–6 sentences max). No repeating words/phrases.
- Use bullet points for tips. Start with a brief greeting ONLY on first interaction or emotional distress.
- Never give medical diagnosis. Clarify advice is general; recommend professional consultation.

MULTILINGUAL:
- Detect language automatically or use selected language. Respond in the same language as user input.
- Maintain clarity of medical terms in that language. Be culturally sensitive.

CVD AWARENESS:
- Provide short lifestyle tips (diet, exercise, stress, sleep).
- If user mentions symptoms (chest pain, breathlessness, high BP, dizziness): calmly highlight possible risk, advise seeking medical care if severe. Never create panic.
- Cover: risk factors, warning signs, prevention, normal ranges (BP, cholesterol, BMI), tracking suggestions.

EMERGENCY PROTOCOL:
If user expresses distress, severe symptoms, or requests help:
1. For immediate danger (heart attack/stroke signs): Say "Call emergency services (911) immediately" FIRST.
2. Then ask: "Would you like to notify a caretaker?"
3. If YES: Ask for caretaker Name, Relationship, Contact method (SMS/Email), Phone/Email. Ask explicit consent: "Do I have your consent to send this alert?"
4. Confirm before sending. Reassure user afterward.
5. Example SMS: "Alert: [User] may be experiencing possible heart-related symptoms. Please contact them immediately."

VOICE INPUT:
- Remove repeated/filler words from speech input (e.g., "I I feel feel tired" → "I feel tired").
- Interpret user intent accurately before responding.

PRIVACY: Caretaker details are stored securely, used only for emergency notification, never shared without consent.

TONE: Professional. Calm. Supportive. Precise. No unnecessary text.`;

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
