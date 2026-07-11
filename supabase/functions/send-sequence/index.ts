// Supabase Edge Function: send-sequence
// Sends the transactional + follow-up emails that make the business run:
//   - booking confirmation (after Stripe payment)
//   - waitlist "a seat opened" notification
//   - quote follow-up (24h nudge if a lead hasn't been replied to)
//   - class reminder (day before)
// Deploy: supabase functions deploy send-sequence
//
// Env required: RESEND_API_KEY (or swap for your provider), FROM_EMAIL, SITE_URL
//
// Trigger via Supabase webhooks / pg_cron, or call directly from other functions.

interface Payload {
  type: "booking_confirmation" | "waitlist_open" | "quote_followup" | "class_reminder";
  to: string;
  data: Record<string, unknown>;
}

const FROM = Deno.env.get("FROM_EMAIL") ?? "Annalise <hello@sweetbsbakeshop.com>";

function render(p: Payload): { subject: string; html: string } {
  const d = p.data as any;
  switch (p.type) {
    case "booking_confirmation":
      return {
        subject: `You're booked — ${d.title}`,
        html: `<p>Hi ${d.name?.split(" ")[0] ?? "there"},</p>
<p>Your seat${d.qty > 1 ? "s are" : " is"} saved for <b>${d.title}</b> on ${d.when} at ${d.venue}.
Everything's provided — just bring yourself.</p>
<p>Can't wait,<br/>Annalise · Sweet B's Bake Shop</p>`,
      };
    case "waitlist_open":
      return {
        subject: `A seat just opened — ${d.title}`,
        html: `<p>Good news! A seat opened for <b>${d.title}</b> on ${d.when}.
Grab it here before someone else does: <a href="${d.link}">${d.link}</a></p>
<p>— Annalise</p>`,
      };
    case "quote_followup":
      return {
        subject: `Following up on your Sweet B's request`,
        html: `<p>Hi ${d.name?.split(" ")[0] ?? "there"}, just making sure my quote reached you —
happy to tweak anything. Reply here anytime.</p><p>— Annalise</p>`,
      };
    case "class_reminder":
      return {
        subject: `Tomorrow: ${d.title}`,
        html: `<p>See you tomorrow at ${d.time} for <b>${d.title}</b> (${d.venue})!
Everything's provided — bring yourself and maybe a friend.</p><p>— Annalise</p>`,
      };
  }
}

Deno.serve(async (req) => {
  try {
    const payload = (await req.json()) as Payload;
    const { subject, html } = render(payload);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to: payload.to, subject, html }),
    });

    if (!res.ok) return new Response(await res.text(), { status: 502 });
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
