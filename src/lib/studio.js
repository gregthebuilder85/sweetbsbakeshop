// ---------------------------------------------------------------------------
// Sweet B's Content Studio — generation engine
//
// Rebuilt from a 12-agent B2B suite into a single baking-tuned engine. The old
// "agents" (trend scout, angles, draft writer, voice, SEO, distribution,
// engagement, strategist, red-team/scrub) are folded into the helpers below:
//   angles + hooks  -> HOOKS / STORY beats
//   voice           -> BIZ voice + sign-off, first-person, no corporate "we"
//   SEO / local      -> buildTags() local + niche hashtags
//   distribution    -> per-platform formatting (IG / FB / Story / reply / email)
//   engagement       -> ready-to-send replies + Story interaction ideas
//   strategist       -> WEEK plan
//   red-team / scrub -> smartReminders() (allergen, 2-week notice, cottage law)
//
// Deterministic + varied: pass a `variant` number to rotate hooks/CTAs so
// "Make another version" always feels fresh. Zero dependencies, zero API keys.
// To go live with AI, swap generate() for a call to the generate-content edge
// function — it returns the same { blocks, hashtags, reminders } shape.
// ---------------------------------------------------------------------------
import { fmtDate, fmtTime, seatsLeft, money } from "./format.js";

export const BIZ = {
  name: "Sweet B's Bake Shop",
  owner: "Annalise",
  handle: "@sweetbsbakeshop",
  town: "Lincolnshire, IL",
  area: "Chicagoland's northern suburbs",
  tagline: "Life is short, make it sweet.",
  notice: "Custom orders need about 2 weeks' notice.",
  kitchen: "Everything's baked fresh in my licensed home kitchen.",
  allergens: "Made in a home kitchen that handles wheat, dairy, eggs, and nuts.",
};

const pick = (arr, v = 0) => arr[((v % arr.length) + arr.length) % arr.length];
const clean = (s) => s.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();

// House rule: this copy goes out in Annalise's voice and must never sound like
// AI. The one hard, checkable tell is the em dash, so every generated string is
// run through sanitize() before it leaves generate(). Em dashes, en dashes, and
// spaced hyphen runs become commas, and the leftover punctuation is tidied up.
// Paragraph breaks (blank lines) are preserved so posts keep their shape.
export function sanitize(text = "") {
  let s = String(text).replace(/\r\n/g, "\n");
  // A dash hugging a line break is just dropped, keeping the break, so a post's
  // paragraphs don't collapse and no stray comma is left dangling at line end.
  s = s.replace(/[ \t]*[—–][ \t]*\n/g, "\n");
  s = s.replace(/\n[ \t]*[—–][ \t]*/g, "\n");
  // A dash in the middle of a line becomes a comma.
  s = s.replace(/[ \t]*[—–][ \t]*/g, ", ");
  s = s.replace(/ +-+ +/g, ", "); // spaced hyphen run ("-", "--", "---") -> comma
  // Tidy the leftover punctuation from the swaps.
  s = s
    .replace(/,[ \t]*,/g, ", ")
    .replace(/[ \t]+,/g, ",")
    .replace(/,[ \t]*([.!?;:])/g, "$1")
    .replace(/[ \t]+([.!?,;:])/g, "$1")
    .replace(/([.!?])\1{1,}/g, "$1")
    .replace(/[ \t]{2,}/g, " ");
  return s
    .split("\n")
    .map((l) => l.replace(/[ \t]+$/, ""))
    .join("\n")
    .trim();
}

// Sanitize every string a result carries, without disturbing its shape.
function finalizeResult(res) {
  if (!res) return res;
  const out = { ...res };
  if (out.title) out.title = sanitize(out.title);
  if (out.empty) out.empty = sanitize(out.empty);
  if (out.hashtags) out.hashtags = sanitize(out.hashtags);
  if (Array.isArray(out.reminders)) out.reminders = out.reminders.map((r) => sanitize(r));
  if (Array.isArray(out.blocks)) {
    out.blocks = out.blocks.map((b) => ({
      ...b,
      text: sanitize(b.text || ""),
      hint: b.hint ? sanitize(b.hint) : b.hint,
    }));
  }
  return out;
}

// --- hashtags --------------------------------------------------------------
const TAGS = {
  local: ["#LincolnshireIL", "#LakeCountyIL", "#LibertyvilleIL", "#VernonHills", "#LakeForestIL", "#NorthShoreChicago", "#ChicagoSuburbs", "#ChicagolandEats"],
  cake: ["#customcakes", "#cakesofinstagram", "#buttercreamcake", "#birthdaycake", "#cakedesign", "#cakedecorating"],
  cupcake: ["#cupcakes", "#cupcakesofinstagram", "#buttercreamflowers", "#cupcakedecorating"],
  class: ["#cakeclass", "#cupcakedecorating", "#decoratingclass", "#girlsnightout", "#thingstodochicago", "#datenightidea"],
  home: ["#homebaker", "#cottagebakery", "#shopsmall", "#supportsmallbusiness", "#madefromscratch"],
  sweet: ["#sweettreats", "#desserttable", "#bakedwithlove"],
};

export function buildTags(kind) {
  const base = [...TAGS.local.slice(0, 6)];
  if (kind === "class") base.push(...TAGS.class, ...TAGS.cupcake.slice(0, 2));
  else if (kind === "cupcakes") base.push(...TAGS.cupcake, ...TAGS.cake.slice(0, 2));
  else if (kind === "cake") base.push(...TAGS.cake, ...TAGS.cupcake.slice(0, 1));
  else base.push(...TAGS.cake.slice(0, 3), ...TAGS.cupcake.slice(0, 2));
  base.push(...TAGS.home.slice(0, 3), ...TAGS.sweet.slice(0, 2));
  return [...new Set(base)].slice(0, 18).join(" ");
}

// --- CTAs by goal ----------------------------------------------------------
const CTA = {
  classes: [
    "Save your seat at the link in my bio.",
    "Comment JOIN and I'll send you the signup link.",
    "Seats are limited and they go fast — grab yours at the link in my bio.",
    "Tap the link in my bio to book your spot.",
  ],
  cakes: [
    "Send me a message to start your order.",
    "I'm booking custom orders now — DM me your date.",
    "Tap the link in my bio to request a quote.",
    "Message me and let's design something sweet together.",
  ],
};
const cta = (goal, v) => {
  if (goal === "classes") return pick(CTA.classes, v);
  if (goal === "cakes") return pick(CTA.cakes, v);
  return pick([...CTA.classes, ...CTA.cakes], v);
};

const SIGN = `xo ${BIZ.owner}, ${BIZ.name}`;

// --- smart reminders (the quiet red-team/scrub agent) ----------------------
function smartReminders(type) {
  const r = [];
  if (type === "class") r.push("All tools and treats are included — students just bring themselves.");
  if (type === "cake" || type === "cupcakes" || type === "work") {
    r.push(BIZ.notice);
    r.push("Consider adding your allergen line when food is the star.");
  }
  if (type === "promo") r.push("Add a real order-by date so people act.");
  r.push("Post the photo first, paste the caption, then drop hashtags in the first comment.");
  return r;
}

// ---------------------------------------------------------------------------
// MAIN
// generate({ type, event, details, vibe, goal, variant }) -> { title, blocks, hashtags, reminders }
// ---------------------------------------------------------------------------
export function generate(input) {
  return finalizeResult(rawGenerate(input));
}

function rawGenerate(input) {
  const { type, vibe = "warm", goal = "both", variant = 0 } = input;
  switch (type) {
    case "class": return genClass(input, vibe, goal, variant);
    case "work": return genWork(input, vibe, goal, variant);
    case "review": return genReview(input, vibe, goal, variant);
    case "bts": return genBTS(input, vibe, goal, variant);
    case "promo": return genPromo(input, vibe, goal, variant);
    default: return genIdea(input, vibe, goal, variant);
  }
}

// --- class -----------------------------------------------------------------
function genClass({ event, angle = "announce", details = {} }, vibe, goal, v) {
  if (!event) {
    return {
      title: "Promote a class",
      empty: "You don't have any upcoming classes yet. Add one under Classes & Events, then come back and it'll show up here.",
      blocks: [], hashtags: "", reminders: [],
    };
  }
  const when = `${fmtDate(event.starts_at)} at ${fmtTime(event.starts_at)}`;
  const where = `${event.venue_name} in ${event.venue_city}`;
  const left = seatsLeft(event);
  const price = money(event.price);

  const hooks = {
    announce: [
      "New class on the calendar!",
      "Come decorate with me!",
      "Let's play with buttercream.",
      "Guess what just got added to the class schedule?",
    ],
    lastcall: [
      left <= 0 ? "This one's officially full —" : `Only ${left} seat${left === 1 ? "" : "s"} left!`,
      "Last call for this class —",
      "Almost sold out!",
    ],
    reminder: ["See you soon!", "Tomorrow's the day!", "Quick reminder for my class friends —"],
  };
  const hook = pick(hooks[angle] || hooks.announce, v);

  const seatLine =
    left <= 0
      ? "This class is full — comment WAITLIST and I'll save you a spot for the next date."
      : left <= 3
      ? `Only ${left} seat${left === 1 ? "" : "s"} left, so don't wait.`
      : "Seats are open now.";

  const igBody = clean(
    `${hook}\n\n` +
      `${event.title} — ${when}, at ${where}. ${classPitch(event, vibe)} ` +
      `No experience needed and everything's provided; you just bring yourself.\n\n` +
      `${seatLine} ${goal === "cakes" ? cta("both", v) : cta("classes", v)}`
  );

  const fbBody = clean(
    `${event.title} — a hands-on decorating class\n${when} · ${where}\n\n` +
      `${classPitch(event, vibe)} All the tools, buttercream, and treats are included, and no experience is needed — I walk everyone through it step by step.\n\n` +
      `${seatLine} ${cta("classes", v)}\n\n${SIGN}`
  );

  const story = clean(
    `NEW CLASS\n${event.title}\n${fmtDate(event.starts_at)} · ${event.venue_city}\n${price} / seat\n\n➜ Link in bio to book`
  ).replace("➜", "»");

  const storyIdea =
    left <= 0
      ? "Story idea: add a Question sticker — \"Want the next date?\""
      : `Story idea: add a Countdown sticker to ${fmtDate(event.starts_at)} and a "Book now" link sticker.`;

  const reminderMsg = clean(
    `Hi! Quick reminder that ${event.title} is ${fmtDate(event.starts_at)} at ${fmtTime(event.starts_at)}, ` +
      `${event.venue_name}. Everything's provided — just bring yourself and maybe a friend. Can't wait to see you! ${SIGN}`
  );

  return {
    title: `Promote: ${event.title}`,
    blocks: [
      { id: "ig", label: "Instagram caption", text: igBody },
      { id: "tags", label: "Hashtags (paste as first comment)", text: buildTags("class"), mono: true },
      { id: "fb", label: "Facebook post", text: fbBody },
      { id: "story", label: "Instagram Story", text: story, hint: storyIdea },
      { id: "reminder", label: "Text / email reminder (day before)", text: reminderMsg },
    ],
    hashtags: buildTags("class"),
    reminders: smartReminders("class"),
  };
}

function classPitch(event, vibe) {
  const t = (event.title || "").toLowerCase();
  const base =
    t.includes("kid") ? "It's a fun, hands-on class made just for younger decorators."
    : t.includes("puppy") ? "We'll pipe buttercream into the sweetest little puppy faces."
    : t.includes("bloom") || t.includes("flower") || t.includes("floral") ? "We'll pipe buttercream flowers you'll be so proud of."
    : "It's a relaxed, hands-on class where everyone leaves with something beautiful.";
  if (vibe === "playful") return base + " Bring a friend and let's make a mess (the good kind).";
  if (vibe === "elegant") return base + " Cozy, unhurried, and genuinely fun.";
  return base;
}

// --- work (a cake / cupcakes) ---------------------------------------------
function genWork({ details = {}, vibe, goal }, _v, _g, v) {
  const what = (details.what || "this custom cake").trim();
  const occasion = (details.occasion || "").trim();
  const isCup = details.kind === "cupcakes";
  const forLine = occasion ? ` for ${occasion}` : "";

  const hooks = [
    "Officially obsessed with this one.",
    "Look what left the kitchen this week.",
    "This might be a new favorite.",
    "I had way too much fun with this one.",
    "Swipe to see how this one turned out.",
  ];
  const hook = pick(hooks, v);

  const ig = clean(
    `${hook}\n\n` +
      `${cap(what)}${forLine} — every detail piped and painted by hand. ${workVoice(vibe)}\n\n` +
      `Every order is designed from scratch around your colors, flavors, and theme. ${cta(goal === "classes" ? "both" : "cakes", v)}`
  );

  const fb = clean(
    `${cap(what)}${forLine}. ${workVoice(vibe)} Every cake I make is custom — your colors, your flavors, your celebration.\n\n` +
      `${BIZ.notice} ${cta("cakes", v)}\n\n${SIGN}`
  );

  const story = clean(`Fresh from the kitchen\n${cap(what)}${forLine}\n\n» DM to order yours`);

  const dmReply = clean(
    `Hi, thank you so much! For ${what.replace(/^a /, "")}, pricing starts around ` +
      `${isCup ? "$45/dozen" : "$70"} and depends on size, flavors, and design. ` +
      `If you tell me your date, guest count, and the vibe you're going for, I'll send you a quote. ${BIZ.notice} ${SIGN}`
  );

  return {
    title: "Show your work",
    blocks: [
      { id: "ig", label: "Instagram caption", text: ig },
      { id: "tags", label: "Hashtags (paste as first comment)", text: buildTags(isCup ? "cupcakes" : "cake"), mono: true },
      { id: "fb", label: "Facebook post", text: fb },
      { id: "story", label: "Instagram Story", text: story, hint: "Story idea: add a \"DM to order\" link sticker and a poll — \"Which flavor?\"" },
      { id: "dm", label: "Ready reply for \"how much?\" DMs", text: dmReply },
    ],
    hashtags: buildTags(isCup ? "cupcakes" : "cake"),
    reminders: smartReminders("work"),
  };
}
function workVoice(vibe) {
  if (vibe === "playful") return "I may have done a little happy dance when it came together.";
  if (vibe === "elegant") return "Soft, detailed, and made to be the centerpiece.";
  return "Little moments like these are exactly why I love what I do.";
}

// --- review ----------------------------------------------------------------
function genReview({ details = {} }, vibe, goal, v) {
  const review = (details.review || "").trim();
  const name = (details.name || "").trim();
  if (!review) {
    return {
      title: "Share a review",
      empty: "Paste a customer's review or kind message above, and I'll turn it into a post you can share.",
      blocks: [], hashtags: "", reminders: [],
    };
  }
  const quote = review.length > 220 ? review.slice(0, 217).trim() + "…" : review;
  const who = name ? ` — ${name}` : "";

  const hooks = [
    "Kind words like these mean everything.",
    "This made my whole week.",
    "I'm saving this one forever.",
    "Reviews like this are why I do this.",
  ];
  const hook = pick(hooks, v);

  const ig = clean(
    `${hook}\n\n"${quote}"${who}\n\nThank you for trusting me with your celebration — it truly means so much. ${cta(goal, v)}`
  );
  const fb = clean(
    `A little note that made my day:\n\n"${quote}"${who}\n\nThank you for letting me be part of your sweet moments. ${cta(goal, v)}\n\n${SIGN}`
  );
  const story = clean(`"${quote}"${who}\n\nThank you so much`);
  const replyToThem = clean(
    `${name ? name + ", t" : "T"}hank you so much for this — it honestly made my day. It was such a joy making this for you, and I hope I get to bake for your family again soon! ${SIGN}`
  );

  return {
    title: "Share a review",
    blocks: [
      { id: "ig", label: "Instagram caption", text: ig },
      { id: "tags", label: "Hashtags (paste as first comment)", text: buildTags(), mono: true },
      { id: "fb", label: "Facebook post", text: fb },
      { id: "story", label: "Instagram Story", text: story, hint: "Story idea: screenshot their message and add it behind this text." },
      { id: "reply", label: "A warm reply to leave them", text: replyToThem },
    ],
    hashtags: buildTags(),
    reminders: ["Ask permission before sharing a private message or a photo of someone's child."],
  };
}

// --- behind the scenes -----------------------------------------------------
function genBTS({ details = {} }, vibe, goal, v) {
  const note = (details.note || "").trim();
  const beats = [
    "Some mornings start before the sun — just me, the mixer, and a very long to-do list.",
    "People ask how I got here. The short version: I left my corporate job in 2021 to do the thing I love most.",
    "Flour on the apron, buttercream on my cheek, exactly where I'm meant to be.",
    "Every cake starts as a messy sketch and a lot of taste-testing (someone has to).",
    "My favorite part of this job isn't the baking — it's being part of your happiest days.",
  ];
  const beat = note || pick(beats, v);
  const hook = pick(["A little behind the scenes for you.", "The part you don't usually see.", "Real talk from the kitchen:"], v);

  const ig = clean(
    `${hook}\n\n${beat}\n\nThat's the whole reason behind Sweet B's — ${BIZ.tagline.toLowerCase()} ${cta(goal, v + 1)}`
  );
  const fb = clean(`${beat}\n\nThank you for following along and cheering me on — it means more than you know.\n\n${SIGN}`);
  const story = clean(`${hook}\n\n${beat}`);

  return {
    title: "Behind the scenes",
    blocks: [
      { id: "ig", label: "Instagram caption", text: ig },
      { id: "tags", label: "Hashtags (paste as first comment)", text: buildTags(), mono: true },
      { id: "fb", label: "Facebook post", text: fb },
      { id: "story", label: "Instagram Story", text: story, hint: "Story idea: film a 10-second clip of what you're doing right now and add this as a caption." },
    ],
    hashtags: buildTags(),
    reminders: smartReminders("bts"),
  };
}

// --- promo / seasonal ------------------------------------------------------
const OCCASIONS = {
  "Valentine's Day": "Treat someone you love (or yourself).",
  "Mother's Day": "Make Mom's day extra sweet.",
  "Father's Day": "Something sweet for the dads.",
  Easter: "Sweeten up your Easter table.",
  Halloween: "Spooky-cute treats are back.",
  Thanksgiving: "Save room for dessert.",
  Christmas: "Holiday orders are open.",
  "Weekend pickup": "Weekend treats, ready for pickup.",
  "Now booking": "My calendar is open.",
  "Just because": "No occasion needed.",
};

function genPromo({ details = {} }, vibe, goal, v) {
  const occasion = details.occasion || "Now booking";
  const detail = (details.detail || "").trim();
  const line = OCCASIONS[occasion] || "Something sweet is coming.";
  const orderBy = detail || "Message me to lock in your date.";

  const hook = pick([`${occasion} is coming up!`, line, `Let's talk about ${occasion}.`], v);

  const ig = clean(
    `${hook}\n\n${line} I'm taking custom cake and cupcake orders now${occasion !== "Now booking" ? ` for ${occasion}` : ""}. ` +
      `${orderBy}\n\n${BIZ.notice} ${cta(goal === "classes" ? "both" : "cakes", v)}`
  );
  const fb = clean(
    `${line}\n\nI'm booking custom orders${occasion !== "Now booking" ? ` for ${occasion}` : ""} — cakes, cupcakes, and treats, all made from scratch. ${orderBy}\n\n` +
      `${BIZ.notice} ${cta("cakes", v)}\n\n${SIGN}`
  );
  const story = clean(`${occasion.toUpperCase()}\n${line}\n\n» DM or link in bio to order`);
  const email = clean(
    `Subject: ${occasion !== "Now booking" ? occasion + " orders are open" : "My calendar is open"}\n\n` +
      `Hi friend,\n\n${line} I'm taking custom orders now${occasion !== "Now booking" ? ` for ${occasion}` : ""}. ${orderBy}\n\n` +
      `Just reply to this email or text me and we'll get your date on the calendar. ${BIZ.notice}\n\nSweetly,\n${BIZ.owner}\n${BIZ.name}`
  );

  return {
    title: `Special: ${occasion}`,
    blocks: [
      { id: "ig", label: "Instagram caption", text: ig },
      { id: "tags", label: "Hashtags (paste as first comment)", text: buildTags(), mono: true },
      { id: "fb", label: "Facebook post", text: fb },
      { id: "story", label: "Instagram Story", text: story, hint: "Story idea: add a Countdown sticker to the order-by date." },
      { id: "email", label: "Email / broadcast", text: email },
    ],
    hashtags: buildTags(),
    reminders: smartReminders("promo"),
  };
}
export const PROMO_OCCASIONS = Object.keys(OCCASIONS);

// --- free idea -------------------------------------------------------------
function genIdea({ details = {} }, vibe, goal, v) {
  const text = (details.text || "").trim();
  if (!text) {
    return {
      title: "Something else",
      empty: "Tell me what's on your mind above — a flavor of the month, a fun fact, an announcement — and I'll write it up.",
      blocks: [], hashtags: "", reminders: [],
    };
  }
  const hook = pick(["Had to share this with you.", "A little something:", "Okay, real quick —"], v);
  const ig = clean(`${hook}\n\n${cap(text)}\n\n${cta(goal, v)}`);
  const fb = clean(`${cap(text)}\n\n${SIGN}`);
  const story = clean(`${cap(text)}`);
  return {
    title: "Something else",
    blocks: [
      { id: "ig", label: "Instagram caption", text: ig },
      { id: "tags", label: "Hashtags (paste as first comment)", text: buildTags(), mono: true },
      { id: "fb", label: "Facebook post", text: fb },
      { id: "story", label: "Instagram Story", text: story },
    ],
    hashtags: buildTags(),
    reminders: smartReminders("idea"),
  };
}

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

// --- newsletter (a short email in Annalise's voice) ------------------------
export const NEWSLETTER_PURPOSES = [
  { id: "whatsnew", label: "What's new this month" },
  { id: "classes",  label: "New classes are open" },
  { id: "seasonal", label: "Order for a holiday or season" },
  { id: "story",    label: "A sweet story from the kitchen" },
  { id: "recap",    label: "Class recap + what's next" },
  { id: "hello",    label: "Just checking in / thank you" },
  { id: "own",      label: "My own idea (use my topics)" },
];

// What the notes box should ask for, per purpose. "primary" purposes are the
// ones whose whole point is her own words (a story, a recap), so the box leads
// the screen and her notes become the body instead of generic filler.
export const NL_ASK = {
  whatsnew: { label: "What's new this month? (optional)", placeholder: "a new flavor, a new class spot, a fun milestone…" },
  classes:  { label: "Anything to add about the classes? (optional)", placeholder: "a theme, who it's perfect for, a special guest…" },
  seasonal: { label: "Which holiday or season, and any order-by date?", placeholder: "Mother's Day, order by May 8…", primary: true },
  story:    { label: "What's the story? Tell me what happened.", placeholder: "the moment, who it was for, why it stuck with you…", primary: true },
  recap:    { label: "How did the last class go? What should I mention?", placeholder: "what you made, a sweet moment, what's coming next…", primary: true },
  hello:    { label: "Anything you want to say? (optional)", placeholder: "a thank-you, what you're grateful for…" },
  own:      { label: "What do you want this email to say?", placeholder: "write your idea in a few words or full sentences…", primary: true },
};

const NL_SUBJECTS = {
  whatsnew: ["A few sweet things this month", "Fresh from my kitchen this month", "What's new at Sweet B's", "Grab a coffee, here's what's baking", "A little sweetness for your inbox"],
  classes:  ["New class dates just opened", "Come decorate with me", "Let's play with buttercream", "Seats are open (they go fast)", "New classes on the calendar"],
  seasonal: ["Let's make this season sweet", "My order book is open", "Save room for something sweet", "Order early for the big day", "The sweetest time of year is coming"],
  story:    ["A little story from my kitchen", "The moment that made my week", "Why I do this", "Life is short, make it sweet", "A sweet moment I had to share"],
  recap:    ["What a sweet class that was", "Thank you, and what's next", "Our last class and what's coming", "You all amazed me", "Buttercream and big smiles"],
  hello:    ["Just saying hi", "A little thank-you from me", "A little sweetness for your day", "Hi from my kitchen", "Thinking of you this week"],
  own:      ["A little note from my kitchen", "Something sweet to share", "From Sweet B's, with love", "A quick hello from Annalise", "Fresh from the kitchen"],
};

const NL_PREVIEWS = {
  whatsnew: ["A quick peek at what I've been baking and what's next.", "Fresh flavors, new dates, and a little hello."],
  classes:  ["New dates, small classes, and a seat with your name on it.", "Come get your hands in the buttercream with me."],
  seasonal: ["My order book is open for the season ahead.", "Let's make the big day a little sweeter."],
  story:    ["A small moment from behind the counter.", "The little reason I love this so much."],
  recap:    ["Thank you for decorating with me, here's what's next.", "A quick look back and what's coming up."],
  hello:    ["No sales pitch, just a warm hello.", "A little thank-you from my kitchen."],
  own:      ["A little something from my kitchen to yours.", "A quick note I wanted to send your way."],
};

const NL_OPENERS = {
  whatsnew: [
    "A few sweet things are happening in my kitchen this month, and I wanted you to be the first to know.",
    "Happy new month! Here's a little peek at what I've been baking and what's coming up.",
    "I've got a few fresh things to share this month, so grab your coffee and let's catch up.",
  ],
  classes: [
    "New class dates are on the calendar, and I would love to save you a seat.",
    "I just opened up new decorating classes, and the cozy little spots always go first.",
    "Class season is here, and I'm so excited to get in the kitchen with you.",
  ],
  seasonal: [
    "The sweetest time of year is almost here, and my order book is open.",
    "A special season is coming up, and I'm already dreaming up treats for it.",
    "It's almost time to make this holiday a little sweeter.",
  ],
  story: [
    "I want to share a little moment from the kitchen that stuck with me this week.",
    "Every so often a day in the kitchen reminds me exactly why I do this.",
    "Here's a small story from behind the counter that made me smile.",
  ],
  recap: [
    "What a joy the last class was. Here's a quick recap and what's coming next.",
    "Thank you to everyone who came to decorate with me. Here's what's next on the calendar.",
    "Our last class was so much fun, so let me recap it and show you what's coming up.",
  ],
  hello: [
    "No news to sell today, I just wanted to say hello and thank you for being here.",
    "Just a little check-in from my kitchen to say I'm grateful you're here.",
    "Popping in to say hi and thank you for following along with Sweet B's.",
  ],
  own: [
    "I wanted to share something with you this month.",
    "Here's what's on my heart from the kitchen this month.",
    "A little note from my kitchen to yours.",
  ],
};

const NL_BEATS = {
  whatsnew: [
    "I've been playing with new flavors and a few fun designs, and this might be my favorite season in the kitchen yet.",
    "Between custom cakes and class nights it's been a busy, buttercream-covered few weeks, and I wouldn't have it any other way.",
    "There's something so happy about a fresh month and a full oven.",
  ],
  classes: [
    "The classes stay small and cozy on purpose, so everyone gets plenty of hands-on time with me and leaves with something beautiful.",
    "No experience needed, ever. I walk you through every step, and there's a lot of laughing along the way.",
    "Bring a friend, bring your mom, bring your favorite coworker. These nights are always better together.",
  ],
  seasonal: [
    "Whether it's a cake for the table or a box of treats to share, I'd love to make your celebration a little sweeter.",
    "Dates fill up quickly this time of year, so the earlier you reach out, the better I can take care of you.",
    "Everything is baked fresh in my little home kitchen, the way homemade should taste.",
  ],
  story: [
    "Moments like that are the whole reason I left my old job to do this. Life really is short, so I try to make it sweet.",
    "It's never really about the cake. It's about the people gathered around it, and I don't take that for granted.",
    "I started with hot cocoa bombs at my kitchen table, and some days I still can't believe this is my job.",
  ],
  recap: [
    "Watching everyone pipe their very first buttercream flower never gets old. You all amaze me every single time.",
    "There were a few happy messes and a lot of proud faces, exactly how a good class should go.",
    "Thank you for trusting me with your night out. It filled my whole cup.",
  ],
  hello: [
    "Thank you for letting me be a tiny part of your celebrations. It means more to me than a newsletter can really say.",
    "No agenda today, just a little gratitude coming your way from my kitchen to yours.",
    "I hope this note finds you well, and I hope there's something sweet in your week.",
  ],
};

const NL_CLOSERS = [
  "As always, thank you for being here. Life is short, so let's make it sweet.",
  "Thank you for reading, friend. Life is short, make it sweet.",
  "Sending you a little sweetness today. Life is short, so make it sweet.",
];

const pick3 = (pool, v) => {
  const n = pool.length;
  return [0, 1, 2].map((i) => pool[(((v + i) % n) + n) % n]);
};

// generateNewsletter({ purpose, topics, events, includeClasses, vibe, goal, variant })
// -> { title, blocks, reminders } — the same shape <Output> already renders, so
// the UI needs no changes. Mirrors generate() so it can be swapped for the
// generate-content edge function later with no UI work.
export function generateNewsletter({ purpose = "whatsnew", topics = "", events = [], includeClasses = true, vibe = "warm", goal = "both", variant = 0 }) {
  const label = NEWSLETTER_PURPOSES.find((p) => p.id === purpose)?.label || "Newsletter";

  const subjectsArr = pick3(NL_SUBJECTS[purpose] || NL_SUBJECTS.whatsnew, variant);
  const subjects = subjectsArr.map((s, i) => `${i + 1}) ${s}`).join("\n");
  const preview = pick(NL_PREVIEWS[purpose] || NL_PREVIEWS.whatsnew, variant);

  const opener = pick(NL_OPENERS[purpose] || NL_OPENERS.whatsnew, variant);
  const t = (topics || "").trim();
  const topicsPara = t ? cap(/[.!?]$/.test(t) ? t : `${t}.`) : "";

  const primary = NL_ASK[purpose]?.primary;
  const intro = [opener];
  if (purpose === "own") {
    intro.push(topicsPara || "I just wanted to say a quick hello from my kitchen and thank you for being here.");
  } else if (primary) {
    // Her own words are the point here; fall back to a gentle beat only if she left it blank.
    intro.push(topicsPara || pick(NL_BEATS[purpose] || [], variant));
  } else {
    const beat = pick(NL_BEATS[purpose] || [], variant);
    if (beat) intro.push(beat);
    if (topicsPara) intro.push(topicsPara);
  }

  const calendar =
    includeClasses && events && events.length
      ? {
          items: events.slice(0, 3).map((e) => ({ title: e.title, date: fmtDate(e.starts_at), city: e.venue_city })),
          nudge: "Save your seat with the button below, or just reply and I'll hold one for you.",
        }
      : null;

  // A warm tie-back to the tagline. "story" already lands it, so skip the echo there.
  const closer = purpose !== "story" ? pick(NL_CLOSERS, variant) : "";
  const emailCta = EMAIL_CTA[goal] || EMAIL_CTA.both;

  // Plain-text version (the copy-anywhere block). Email-appropriate wording:
  // reply-or-link, never "link in my bio" and never "the button below".
  const parts = ["Hi friend,", ...intro];
  if (calendar) {
    const lines = calendar.items.map((c, i) => `${i + 1}) ${c.title}, ${c.date} in ${c.city}`);
    parts.push(`On the calendar:\n${lines.join("\n")}\n\nReply to this email and I'll hold your spot, or grab it here: [your class link]`);
  }
  if (closer) parts.push(closer);
  parts.push(emailCta.text);
  parts.push(`Sweetly,\n${BIZ.owner}\n${BIZ.name}`);
  const body = clean(parts.join("\n\n"));

  // Premium, email-client-safe HTML version (renders in Gmail, Outlook, Apple Mail, etc.).
  const html = buildNewsletterHTML({
    preview: sanitize(preview),
    intro: intro.map((p) => sanitize(p)),
    calendar: calendar
      ? {
          items: calendar.items.map((c) => ({ title: sanitize(c.title), date: sanitize(c.date), city: sanitize(c.city) })),
          nudge: sanitize(calendar.nudge),
        }
      : null,
    closer: sanitize(closer),
    ctaLead: emailCta.lead,
    buttonLabel: emailCta.label,
    buttonHref: "[your link]",
  });

  return finalizeResult({
    title: `Newsletter: ${label}`,
    subject: sanitize(subjectsArr[0]),
    preview: sanitize(preview),
    html,
    blocks: [
      { id: "subjects", label: "Subject line options (pick one)", text: subjects },
      { id: "preview", label: "Preview text (the gray line under the subject)", text: preview },
      { id: "body", label: "Your newsletter", text: body },
    ],
    reminders: [
      "Copy the ready-to-send email below into Gmail, or the HTML into Mailchimp, Flodesk, etc.",
      "Add one nice photo at the top, and swap [your link] for your real signup or order link.",
      "Keep it short, people skim, so the subject line does the heavy lifting.",
    ],
  });
}

// Tidy rough notes into clean, on-voice sentences (offline, deterministic).
// Capitalizes, fixes spacing and end punctuation, keeps her paragraphs, and
// strips em dashes via sanitize(). It polishes her words; it never invents facts.
// (Swap for the generate-content edge function later for a fuller AI rewrite.)
export function polishNote(text) {
  const raw = String(text || "").trim();
  if (!raw) return "";
  const tidy = raw
    .split(/\n+/)
    .map((para) => {
      let s = para.replace(/\s+/g, " ").trim();
      if (!s) return "";
      s = s.replace(/([.!?])([A-Za-z])/g, "$1 $2"); // add a missing space after a sentence end
      s = s.charAt(0).toUpperCase() + s.slice(1);
      s = s.replace(/([.!?])\s+([a-z])/g, (_m, punct, ch) => `${punct} ${ch.toUpperCase()}`);
      if (!/[.!?]$/.test(s)) s += ".";
      return s;
    })
    .filter(Boolean)
    .join("\n\n");
  return sanitize(tidy);
}

// Email-appropriate CTA (a real button / reply, not "link in bio"), by goal.
// lead + label drive the HTML button; text is the plain-text version's line.
const EMAIL_CTA = {
  classes: {
    lead: "The classes stay cozy and small on purpose, so grab your seat whenever you're ready.",
    label: "Save your seat",
    text: "Whenever you're ready, just reply to this email or grab your seat here: [your link]",
  },
  cakes: {
    lead: "Whenever you're ready, I would love to start your order.",
    label: "Start your order",
    text: "Whenever you're ready, just reply to this email or start your order here: [your link]",
  },
  both: {
    lead: "Whenever you're ready, come save a seat or start something sweet.",
    label: "Book a seat or order",
    text: "Whenever you're ready, just reply to this email or use my link: [your link]",
  },
};

const esc = (s) =>
  String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
const nl2br = (s) => esc(s).replace(/\n/g, "<br />");

// Table-based, fully inline-styled HTML email. No external CSS, no background
// images, bulletproof button, brand colors and type mirrored from the website
// (theme.css tokens). Degrades cleanly in Outlook (square corners) and shows
// Georgia / Arial where Fraunces / Karla can't load.
function buildNewsletterHTML({ preview, intro, calendar, closer, ctaLead, buttonLabel, buttonHref }) {
  const C = { butter: "#FDF8F0", cocoa: "#3B2A24", berry: "#B23A5E", blush: "#F6E3E6", line: "#EAC9CF", soft: "#8A7268", white: "#FFFFFF" };
  const serif = "'Fraunces', Georgia, 'Times New Roman', serif";
  const sans = "'Karla', 'Helvetica Neue', Helvetica, Arial, sans-serif";

  const introHTML = intro.map((p) => `<p style="margin:0 0 18px;">${nl2br(p)}</p>`).join("");

  const calendarHTML = calendar
    ? `<tr><td class="px" style="padding:8px 40px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.blush}" style="background-color:${C.blush};border:1px solid ${C.line};border-radius:14px;">
<tr><td style="padding:18px 22px 10px;font-family:${serif};font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${C.berry};font-weight:600;">On the calendar</td></tr>
${calendar.items
        .map(
          (c) => `<tr><td style="padding:10px 22px;border-top:1px solid ${C.line};font-family:${sans};">
<div style="font-size:16px;font-weight:700;color:${C.cocoa};">${esc(c.title)}</div>
<div style="font-size:13px;color:${C.soft};padding-top:2px;">${esc(c.date)} &middot; ${esc(c.city)}</div>
</td></tr>`
        )
        .join("")}
<tr><td style="padding:12px 22px 18px;border-top:1px solid ${C.line};font-family:${sans};font-size:14px;line-height:1.55;color:${C.cocoa};">${esc(calendar.nudge)}</td></tr>
</table>
</td></tr>`
    : "";

  const closerHTML = closer
    ? `<p style="margin:0 0 18px;font-family:${serif};font-style:italic;font-size:18px;line-height:1.5;color:${C.berry};text-align:center;">${esc(closer)}</p>`
    : "";

  const ctaHTML = `<tr><td class="px" align="center" style="padding:16px 40px 30px;">
${closerHTML}
${ctaLead ? `<p style="margin:0 0 20px;font-family:${sans};font-size:16px;line-height:1.6;color:${C.cocoa};text-align:center;">${esc(ctaLead)}</p>` : ""}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr>
<td align="center" bgcolor="${C.berry}" style="background-color:${C.berry};border-radius:999px;padding:15px 38px;">
<a href="${esc(buttonHref)}" target="_blank" style="font-family:${sans};font-size:15px;font-weight:700;letter-spacing:.3px;color:${C.white};text-decoration:none;display:inline-block;">${esc(buttonLabel)}</a>
</td>
</tr></table>
</td></tr>`;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>Sweet B's Bake Shop</title>
<!--[if mso]><style type="text/css">body,table,td,a,p,div{font-family:Georgia,'Times New Roman',serif !important;}</style><![endif]-->
<style type="text/css">
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;0,600;1,500&family=Karla:wght@400;500;700&display=swap');
body{margin:0;padding:0;width:100% !important;background-color:${C.butter};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;}
table{border-collapse:collapse !important;}
a{color:${C.berry};}
@media only screen and (max-width:620px){
.container{width:100% !important;}
.px{padding-left:24px !important;padding-right:24px !important;}
}
</style>
</head>
<body style="margin:0;padding:0;background-color:${C.butter};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;font-size:1px;line-height:1px;color:${C.butter};">${esc(preview)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.butter}" style="background-color:${C.butter};">
<tr><td align="center" style="padding:28px 12px;">
<table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:${C.white};border:1px solid ${C.line};border-radius:18px;overflow:hidden;">
<tr><td align="center" bgcolor="${C.berry}" style="background-color:${C.berry};padding:32px 24px;">
<div style="font-family:${serif};font-size:12px;letter-spacing:4px;text-transform:uppercase;color:${C.blush};">Sweet B's</div>
<div style="font-family:${serif};font-size:32px;font-weight:600;color:${C.white};padding-top:2px;">Bake Shop</div>
<div style="font-family:${sans};font-size:13px;font-style:italic;color:${C.blush};padding-top:10px;">Life is short, make it sweet.</div>
</td></tr>
<tr><td class="px" style="padding:34px 40px 6px;font-family:${sans};font-size:16px;line-height:1.65;color:${C.cocoa};">
<p style="margin:0 0 18px;">Hi friend,</p>
${introHTML}
</td></tr>
${calendarHTML}
${ctaHTML}
<tr><td class="px" style="padding:6px 40px 34px;font-family:${sans};font-size:16px;line-height:1.6;color:${C.cocoa};">
<p style="margin:0;">Sweetly,</p>
<p style="margin:2px 0 0;font-family:${serif};font-size:21px;color:${C.berry};">Annalise</p>
<p style="margin:0;font-size:14px;color:${C.soft};">Sweet B's Bake Shop</p>
</td></tr>
<tr><td align="center" bgcolor="${C.blush}" style="background-color:${C.blush};padding:24px 30px;font-family:${sans};font-size:12px;line-height:1.6;color:${C.soft};">
<div style="font-family:${serif};font-size:16px;color:${C.cocoa};">Sweet B's Bake Shop</div>
<div style="padding-top:5px;">Lincolnshire, IL &middot; Serving Chicagoland's northern suburbs</div>
<div style="padding-top:6px;">Custom orders need about 2 weeks' notice.</div>
<div style="padding-top:12px;"><a href="[unsubscribe]" style="color:${C.soft};text-decoration:underline;">Unsubscribe</a></div>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

// --- weekly plan (the strategist, simplified) ------------------------------
export const WEEK_PLAN = [
  { day: "Monday", type: "bts", label: "Behind the scenes", why: "Start the week human, show the real you." },
  { day: "Tuesday", type: "class", label: "This week's class", why: "Fill seats early in the week." },
  { day: "Wednesday", type: "work", label: "Show a cake", why: "Midweek eye candy that sells custom orders." },
  { day: "Thursday", type: "idea", label: "Flavor or fun", why: "A poll, a flavor of the month, a quick tip." },
  { day: "Friday", type: "promo", label: "Weekend / booking", why: "Push weekend pickups and open dates." },
  { day: "Saturday", type: "review", label: "Share a review", why: "Let happy customers sell for you." },
  { day: "Sunday", type: "bts", label: "Sweet moment", why: "\"Life is short, make it sweet.\"" },
];
