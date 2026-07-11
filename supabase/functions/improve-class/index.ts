// Supabase Edge Function: improve-class
//
// Rewrites a class's rough notes into polished, on-voice copy. Given
// { input: { title, subtitle, description, includes, audience } } it returns
// { title, subtitle, description, includes: string[] } in Annalise's voice.
//
// The client (src/lib/improve.js) already strips em dashes and tidies the text
// after this returns, so a slip can never reach the page, but the prompt asks
// the model to avoid them in the first place.
//
// Env required: ANTHROPIC_API_KEY

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM = `You are the copywriter for a modern home bakery run by one woman
who bakes custom cakes and teaches hands-on decorating classes. Rewrite the rough
class notes she gives you into polished, ready-to-publish copy.

Voice: warm, sweet, and a little bubbly, like a friend who genuinely loves this.
First person where it fits ("we will", "I bring"). Real and human. Mix short,
punchy sentences with a longer one. Use contractions. A touch of excitement is
lovely; gushing is not.

Hard rules. Follow every one:
- Never use an em dash or an en dash. Not once. Use commas, periods, or two short
  sentences instead.
- Do not sound like AI. Never use these words or their cousins: elevate, unleash,
  dive in, delve, embark, journey, unlock, seamless, curated, bespoke, nestled,
  boasts, vibrant, tapestry, testament, realm, world of, look no further, whether
  you are, when it comes to, in today's world, rest assured, the perfect, take it
  to the next level, more than just.
- No hashtags, no emojis, and at most one exclamation point per field.
- Keep her real specifics: flavors, what people make, who it is for. Never invent
  facts like prices, dates, addresses, or venues.
- Keep it tight. Title is a short class name. The one-line description is a single
  sentence under about ninety characters. "What you will make" is two to four
  sentences. "Included" is a list of four to six short items.

Return ONLY strict JSON, no code fence, shaped exactly like:
{"title":"...","subtitle":"...","description":"...","includes":["...","..."]}`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const { input } = await req.json();

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": Deno.env.get("ANTHROPIC_API_KEY")!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: 800,
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: `Here are the rough notes. Rewrite all four fields.\n\n${JSON.stringify(input, null, 2)}`,
        },
      ],
    }),
  });

  const data = await res.json();
  const text = (data.content || [])
    .filter((b: any) => b.type === "text")
    .map((b: any) => b.text)
    .join("");

  let out;
  try {
    out = JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch {
    out = { error: "Could not parse model output", raw: text };
  }

  return new Response(JSON.stringify(out), {
    headers: { ...CORS, "Content-Type": "application/json" },
  });
});
