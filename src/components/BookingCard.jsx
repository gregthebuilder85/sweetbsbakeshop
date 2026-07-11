import { useState } from "react";
import { money, seatsLeft } from "../lib/format.js";
import { bookEvent, joinWaitlist } from "../lib/db.js";

export default function BookingCard({ ev, onChange }) {
  const left = seatsLeft(ev);
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(null); // {name} after booking
  const [wl, setWl] = useState({ email: "", joined: false });
  const [err, setErr] = useState("");
  const [buyer, setBuyer] = useState({ name: "", email: "" });

  const soldOut = left <= 0;
  const seatClass = soldOut ? "seatline out" : left <= 3 ? "seatline low" : "seatline ok";
  const seatText = soldOut
    ? "Sold out"
    : left <= 3
    ? `Only ${left} seat${left === 1 ? "" : "s"} left`
    : `${left} seats open`;

  function checkout() {
    setErr("");
    if (!buyer.name || !buyer.email.includes("@")) {
      setErr("Add your name and email to continue.");
      return;
    }
    // Production: POST to create-checkout-session -> redirect to Stripe.
    const res = bookEvent(ev.id, { name: buyer.name, email: buyer.email, qty });
    if (!res.ok) return setErr(res.error);
    setDone({ name: buyer.name });
    onChange && onChange();
  }

  function doWaitlist() {
    if (!wl.email.includes("@")) return;
    joinWaitlist(ev.id, wl.email);
    setWl({ ...wl, joined: true });
  }

  if (done) {
    return (
      <aside className="book">
        <div className="notice">
          You're in, {done.name.split(" ")[0]}! A confirmation is on its way to your inbox, and your
          seat is saved for {ev.title}.
        </div>
        <p className="includes" style={{ borderTop: "none", paddingTop: 14 }}>
          <b>Demo note:</b> in the live app this hands off to Stripe Checkout, then emails the
          confirmation and adds you to the class roster automatically.
        </p>
      </aside>
    );
  }

  return (
    <aside className="book" aria-label="Book this class">
      <div className="price">
        <b>{money(ev.price)}</b>
        <span>per person</span>
      </div>
      <div className={seatClass}>
        <span className="pip" aria-hidden="true" />
        <span>{seatText}</span>
      </div>

      {soldOut ? (
        <div>
          {wl.joined ? (
            <div className="notice">You're on the list! I'll email you the moment a seat opens.</div>
          ) : (
            <>
              <p style={{ fontWeight: 700, marginBottom: 8 }}>This class is full — join the waitlist</p>
              <p className="soft" style={{ fontSize: 14, marginBottom: 12 }}>
                If a seat opens you're first to know, and you get first dibs on the next date.
              </p>
              <div className="field">
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={wl.email}
                  onChange={(e) => setWl({ ...wl, email: e.target.value })}
                />
              </div>
              <button className="btn block" onClick={doWaitlist}>
                Join the waitlist
              </button>
            </>
          )}
        </div>
      ) : (
        <div>
          <div className="qty">
            <label htmlFor="qty" style={{ fontWeight: 700, fontSize: 14.5 }}>
              Seats
            </label>
            <div className="ctrl">
              <button type="button" aria-label="One fewer seat" disabled={qty <= 1} onClick={() => setQty(qty - 1)}>
                −
              </button>
              <span className="n" id="qty" aria-live="polite">
                {qty}
              </span>
              <button type="button" aria-label="One more seat" disabled={qty >= left} onClick={() => setQty(qty + 1)}>
                +
              </button>
            </div>
          </div>
          <div className="field">
            <input
              placeholder="Your name"
              value={buyer.name}
              onChange={(e) => setBuyer({ ...buyer, name: e.target.value })}
            />
          </div>
          <div className="field">
            <input
              type="email"
              placeholder="you@email.com"
              value={buyer.email}
              onChange={(e) => setBuyer({ ...buyer, email: e.target.value })}
            />
          </div>
          <div className="total">
            <span>Total at checkout</span>
            <b>{money(qty * ev.price)}</b>
          </div>
          {err && (
            <p style={{ color: "var(--berry)", fontSize: 14, margin: "0 0 12px" }}>{err}</p>
          )}
          <button className="btn block" onClick={checkout}>
            Save my seat{qty > 1 ? "s" : ""} — pay with card
          </button>
          <p className="secure">Secure checkout by Stripe · instant email confirmation</p>
        </div>
      )}

      <p className="includes">
        <b>Every seat includes</b> — all tools and buttercream, the recipe card, and a take-home box.
      </p>
    </aside>
  );
}
