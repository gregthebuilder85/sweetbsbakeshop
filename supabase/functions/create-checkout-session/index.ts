// Supabase Edge Function: create-checkout-session
// Creates a Stripe Checkout session for N seats of a class, then returns the URL.
// Deploy: supabase functions deploy create-checkout-session
//
// Env required: STRIPE_SECRET_KEY, SITE_URL
//
// The public site calls this instead of writing seats directly. Seats are only
// committed after Stripe confirms payment (see stripe-webhook, not included).

import Stripe from "https://esm.sh/stripe@16?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2024-06-20" });
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
  try {
    const { eventId, qty, name, email } = await req.json();

    const { data: ev, error } = await supabase
      .from("events")
      .select("id, title, price, capacity, seats_taken")
      .eq("id", eventId)
      .single();
    if (error || !ev) return json({ error: "Class not found" }, 404);

    const left = ev.capacity - ev.seats_taken;
    if (qty > left) return json({ error: `Only ${left} seat(s) left` }, 409);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          quantity: qty,
          price_data: {
            currency: "usd",
            unit_amount: ev.price * 100,
            product_data: { name: `${ev.title} — class seat` },
          },
        },
      ],
      metadata: { eventId, qty: String(qty), name, email },
      success_url: `${Deno.env.get("SITE_URL")}/classes?booked=1`,
      cancel_url: `${Deno.env.get("SITE_URL")}/classes/${ev.id}`,
    });

    return json({ url: session.url });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
