// ---------------------------------------------------------------------------
// Content generator.
//
// Ships as deterministic, on-voice templates so it works with zero setup.
// To go live with AI, replace generate() with a call to the "generate-content"
// edge function (see supabase/functions/generate-content). The function returns
// the same shape { instagram, facebook, email, reminder }.
//
// Voice profile (from Annalise's site + press): first-person, warm,
// family-anchored, sweet-moments framing, signs off as Annalise. No corporate "we".
// ---------------------------------------------------------------------------
import { fmtDate, fmtTime, seatsLeft } from "./format.js";

export function generate(ev) {
  const left = seatsLeft(ev);
  const when = `${fmtDate(ev.starts_at)} at ${fmtTime(ev.starts_at)}`;
  const place = `${ev.venue_name} in ${ev.venue_city}`;
  const seatLine =
    left <= 0
      ? "This one's full — comment WAITLIST and I'll save you a spot for the next date."
      : left <= 3
      ? `Only ${left} seats left — grab one before they're gone.`
      : "Seats are open now.";

  const instagram =
    `New class on the calendar! ${ev.title} — ${when}, at ${place}. ` +
    `${firstLine(ev)} ${seatLine} ` +
    `Everything's provided; you just bring yourself. Link in bio to save your seat. ` +
    `\n\n#SweetBsBakeShop #CupcakeDecorating #${ev.venue_city.split(",")[0].replace(/\s+/g, "")} #BakingClass #ThingsToDo`;

  const facebook =
    `${ev.title} — ${when}\n${place}\n\n` +
    `${ev.description}\n\n` +
    `${seatLine} All tools and treats are included, and no experience is needed. ` +
    `Save your seat on my website — hope to see you there!\n\n— Annalise, Sweet B's Bake Shop`;

  const email = {
    subject: `New class: ${ev.title} on ${fmtDate(ev.starts_at)}`,
    body:
      `Hi friend,\n\n` +
      `I just added a new class and wanted you to have first dibs: ${ev.title}, ` +
      `${when} at ${place}.\n\n` +
      `${firstLine(ev)} I bring all the tools, buttercream, and cupcakes — you just show up ready to have fun. ` +
      `${seatLine}\n\n` +
      `Save your seat here: [your class link]\n\n` +
      `Can't wait,\nAnnalise\nSweet B's Bake Shop`,
  };

  const reminder =
    `Hi! Quick reminder that ${ev.title} is tomorrow, ${fmtTime(ev.starts_at)} at ` +
    `${ev.venue_name}. Everything's provided — just bring yourself and maybe a friend. ` +
    `See you there! — Annalise`;

  return { instagram, facebook, email, reminder };
}

function firstLine(ev) {
  const t = (ev.title || "").toLowerCase();
  if (t.includes("kid")) return "It's a fun, hands-on class made just for younger decorators.";
  if (t.includes("puppy")) return "We'll pipe buttercream into the sweetest little puppy faces.";
  if (t.includes("bloom") || t.includes("floral") || t.includes("flower"))
    return "We'll pipe buttercream flowers you'll be amazed you made yourself.";
  return "It's a relaxed, hands-on class where everyone leaves with something beautiful.";
}
