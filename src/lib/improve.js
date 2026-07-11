// ---------------------------------------------------------------------------
// "Improve for me" — turns rough class notes into sweet, bubbly, on-voice copy.
//
// Rewrites four fields from whatever the user typed: the class name, the
// one-line description, "what you'll make", and "what's included".
//
// Works with zero setup. If the Supabase edge function isn't configured it
// falls back to a deterministic on-voice rewrite, so the button always does
// something useful. When VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY are set it
// calls the "improve-class" edge function (real AI, same output shape).
//
// Voice: a modern home baker who is warm, sweet, and a little bubbly. First
// person, plain and real, never corporate.
//
// House rule enforced on EVERY path by sanitize(): never an em dash or en dash,
// and none of the stiff, AI-sounding filler that gives copy away.
//
// Output shape: { title, subtitle, description, includes: string[] }
// ---------------------------------------------------------------------------

// Optional chaining keeps this safe in the single-file (IIFE) build, where
// import.meta is empty — it degrades to the local rewrite instead of throwing.
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY;

export async function improveClass(input) {
  const cleaned = normalizeInput(input);
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      const out = await callEdge(cleaned);
      if (out && out.title) return finalize(out);
    } catch (e) {
      // Fall through to the local rewrite so the button never dead-ends.
    }
  }
  return finalize(localImprove(cleaned));
}

// --- edge function ---------------------------------------------------------
async function callEdge(input) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/improve-class`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ input }),
  });
  if (!res.ok) throw new Error(`improve-class ${res.status}`);
  return res.json();
}

// --- deterministic fallback ------------------------------------------------
function localImprove(input) {
  const hay = `${input.title} ${input.subtitle} ${input.description}`.toLowerCase();
  const has = (...words) => words.some((w) => hay.includes(w));
  const theme = has("flower", "floral", "bloom", "rose", "bouquet")
    ? "flowers"
    : has("cookie")
    ? "cookies"
    : has("cake pop", "cakepop")
    ? "cakepops"
    : has("cupcake")
    ? "cupcakes"
    : has("cake")
    ? "cake"
    : "treats";
  const kids = has("kid", "child", "little", "toddler", "family", "grown up", "grown-up", "mommy", "daddy");

  return {
    title: improveTitle(input, theme, kids),
    subtitle: improveSubtitle(input, theme, kids),
    description: improveDescription(input, theme, kids),
    includes: improveIncludes(input, theme),
  };
}

function improveTitle(input, theme, kids) {
  const given = input.title.trim().replace(/\s+/g, " ");
  if (given) return titleCase(given);
  const base = {
    flowers: "Buttercream Blooms",
    cookies: "Sugar Cookie Decorating",
    cupcakes: "Cupcake Decorating",
    cakepops: "Cake Pop Decorating",
    cake: "Little Cake Decorating",
    treats: "Sweet Treats Decorating",
  }[theme];
  return kids ? `${base} for Little Hands` : `${base} Class`;
}

function improveSubtitle(input, theme, kids) {
  const given = input.subtitle.trim();
  if (given) return endSentence(capitalize(given));
  if (kids) return "A sweet, hands on afternoon made just for little decorators.";
  return {
    flowers: "Pipe a whole bunch of buttercream flowers and take every one home.",
    cookies: "Decorate a set of sugar cookies almost too cute to eat.",
    cupcakes: "Frost a half dozen cupcakes you will not believe you made yourself.",
    cakepops: "Dip and decorate a batch of cake pops from start to finish.",
    cake: "Design your own little cake and decorate every inch of it.",
    treats: "Roll up your sleeves and make a batch of treats to be proud of.",
  }[theme];
}

function improveDescription(input, theme, kids) {
  const closer = kids
    ? "No experience needed, just bring your smiles and I will walk everyone through every single step."
    : "No experience needed, I promise. I walk you through every step and you leave with something you are proud of.";
  const given = input.description.trim();
  if (given) {
    const polished = given
      .split(/\n+/)
      .map((p) => endSentence(capitalize(p.trim())))
      .filter(Boolean)
      .join(" ");
    return polished.length < 140 ? `${polished} ${closer}` : polished;
  }
  const opener = {
    flowers:
      "We will start with the piping bags and work our way through leaves, rosettes, and the prettiest little blooms.",
    cookies:
      "We will flood, pipe, and add all the tiny details until every cookie looks like its own little work of art.",
    cupcakes:
      "We will practice a few piping styles, pile on sprinkles and toppers, and make every cupcake your own.",
    cakepops: "We will shape, dip, and decorate cake pops in your favorite colors and toppings.",
    cake: "We will stack, frost, and decorate a little cake, from the crumb coat all the way to the finishing touches.",
    treats: "We will decorate a batch of sweet treats together, step by step, at your own pace.",
  }[theme];
  return `${opener} ${closer}`;
}

function improveIncludes(input, theme) {
  const given = toLines(input.includes);
  if (given.length) {
    return given.map((l) => capitalize(l.replace(/^[-*•—–\s]+/, "").trim())).filter(Boolean);
  }
  const treat = {
    flowers: "All the buttercream and cupcakes to decorate",
    cookies: "Baked sugar cookies and every color of icing",
    cupcakes: "Fresh cupcakes and all the buttercream",
    cakepops: "Cake pops and all the toppings",
    cake: "A little cake and all the frosting",
    treats: "All the treats and toppings",
  }[theme];
  return [
    "Every tool and piping tip you will need",
    treat,
    "An apron so you stay nice and clean",
    "Everything you make, boxed up to take home",
    "My go to buttercream recipe card",
  ];
}

// --- shaping + the no-em-dash guarantee ------------------------------------
function finalize(out) {
  return {
    title: sanitize(out.title || "").replace(/[.]+$/, ""),
    subtitle: sanitize(out.subtitle || ""),
    description: sanitize(out.description || ""),
    includes: toList(out.includes),
  };
}

// Strip em dashes, en dashes, and spaced hyphens used as punctuation, then tidy
// up whatever the swap leaves behind. This runs on model output AND on any text
// the user pasted in, so an em dash can never reach the published copy.
export function sanitize(text = "") {
  let s = String(text).replace(/\r\n/g, "\n");
  s = s.replace(/\s*[—–]\s*/g, ", "); // em / en dash -> comma
  s = s.replace(/ +-+ +/g, ", "); // spaced hyphen run ("-", "--", "---") -> comma
  s = s
    .replace(/,\s*,/g, ", ")
    .replace(/\s+,/g, ",")
    .replace(/,\s*([.!?;:])/g, "$1")
    .replace(/\s+([.!?,;:])/g, "$1")
    .replace(/([.!?])\1{1,}/g, "$1")
    .replace(/^\s*,\s*/gm, "")
    .replace(/[ \t]{2,}/g, " ");
  return s
    .split("\n")
    .map((l) => l.trim())
    .join("\n")
    .trim();
}

function toList(v) {
  const arr = Array.isArray(v) ? v : String(v || "").split("\n");
  return arr
    .map((s) => sanitize(String(s).replace(/^[-*•—–\s]+/, "")))
    .filter(Boolean);
}

// --- small text helpers ----------------------------------------------------
const SMALL = new Set(["a", "an", "and", "the", "for", "of", "to", "with", "in", "on", "at", "by", "&"]);

function titleCase(s) {
  const words = s.split(" ");
  return words
    .map((w, i) => {
      if (i !== 0 && i !== words.length - 1 && SMALL.has(w.toLowerCase())) return w.toLowerCase();
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");
}

function capitalize(s) {
  s = String(s).trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function endSentence(s) {
  s = String(s).trim();
  if (!s) return s;
  return /[.!?]$/.test(s) ? s : `${s}.`;
}

function toLines(v) {
  return Array.isArray(v)
    ? v.map((x) => String(x).trim()).filter(Boolean)
    : String(v || "")
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean);
}

function normalizeInput(input = {}) {
  return {
    title: String(input.title || "").trim(),
    subtitle: String(input.subtitle || "").trim(),
    description: String(input.description || "").trim(),
    includes: String(input.includes || "").trim(),
    audience: String(input.audience || "").trim(),
  };
}
