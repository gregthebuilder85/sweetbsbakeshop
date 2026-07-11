// Supabase Edge Function: generate-content
// Given an event, returns { instagram, facebook, email, reminder } in Annalise's
// voice. Swap the template fallback (src/lib/content.js) for this in production.
//
// Env required: ANTHROPIC_API_KEY
//
// Calibrate voice by pasting 3–5 of Annalise's real captions into VOICE_SAMPLES.

const VOICE = `You write social copy for Sweet B's Bake Shop, a solo home baker named
Annalise in Lincolnshire, IL. Voice: warm, first-person, family-anchored, plain and
sincere, never salesy or corporate. She signs off as "Annalise". Avoid hype words.`;

const VOICE_SAMPLES = `-- paste 3-5 of Annalise's real Instagram captions here for calibration --`;

Deno.serve(async (req) => {
  const { event } = await req.json();

  const prompt = `${VOICE}\n\nHer past captions:\n${VOICE_SAMPLES}\n\n` +
    `Write promo copy for this class as strict JSON with keys ` +
    `"instagram", "facebook", "email" (object with "subject" and "body"), "reminder".\n\n` +
    `Class: ${JSON.stringify(event)}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": Deno.env.get("ANTHROPIC_API_KEY")!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();
  const text = (data.content || []).filter((b: any) => b.type === "text").map((b: any) => b.text).join("");
  let out;
  try {
    out = JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch {
    out = { error: "Could not parse model output", raw: text };
  }
  return new Response(JSON.stringify(out), { headers: { "Content-Type": "application/json" } });
});
