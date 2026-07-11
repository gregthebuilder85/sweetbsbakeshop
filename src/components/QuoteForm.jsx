import { useState } from "react";
import { createQuote } from "../lib/db.js";

const EMPTY = {
  kind: "cake",
  name: "",
  email: "",
  event_date: "",
  servings: "",
  flavors: "",
  theme: "",
  budget: "",
  message: "",
  source: "Instagram",
};

export default function QuoteForm({ defaultKind = "cake", compact = false }) {
  const [f, setF] = useState({ ...EMPTY, kind: defaultKind });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  function submit() {
    setErr("");
    if (!f.name || !f.email.includes("@")) {
      setErr("Please add your name and a valid email.");
      return;
    }
    // Production: insert into "quotes"; edge function drafts a priced reply for Annalise.
    createQuote(f);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="form-card">
        <div className="notice">
          Got it, {f.name.split(" ")[0]}! Your request is in. I read every one myself and usually
          reply with a quote within a day.
        </div>
        <p className="soft" style={{ fontSize: 14, marginTop: 14, marginBottom: 0 }}>
          Custom orders need at least two weeks' notice — if your date is sooner, I'll let you know
          what's possible.
        </p>
      </div>
    );
  }

  return (
    <div className="form-card">
      <div className="field">
        <label>What can I make for you?</label>
        <select value={f.kind} onChange={set("kind")}>
          <option value="cake">Custom cake</option>
          <option value="cupcakes">Custom cupcakes</option>
          <option value="party">Private class / party</option>
        </select>
      </div>
      <div className="grid2">
        <div className="field">
          <label>Your name</label>
          <input value={f.name} onChange={set("name")} placeholder="First and last" />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" value={f.email} onChange={set("email")} placeholder="you@email.com" />
        </div>
      </div>
      <div className="grid2">
        <div className="field">
          <label>Event date</label>
          <input type="date" value={f.event_date} onChange={set("event_date")} />
          <span className="hint">Custom orders need 2 weeks' notice.</span>
        </div>
        <div className="field">
          <label>Servings / guests</label>
          <input value={f.servings} onChange={set("servings")} placeholder="e.g. 20–30, or 10 kids" />
        </div>
      </div>
      {!compact && (
        <div className="grid2">
          <div className="field">
            <label>Flavors</label>
            <input value={f.flavors} onChange={set("flavors")} placeholder="Cake, filling, frosting" />
          </div>
          <div className="field">
            <label>Budget (optional)</label>
            <input value={f.budget} onChange={set("budget")} placeholder="e.g. $120" />
          </div>
        </div>
      )}
      <div className="field">
        <label>Theme &amp; inspiration</label>
        <textarea
          value={f.theme}
          onChange={set("theme")}
          placeholder="Colors, occasion, a photo you love… tell me the vibe."
        />
      </div>
      <div className="grid2">
        <div className="field">
          <label>Anything else?</label>
          <input value={f.message} onChange={set("message")} placeholder="Optional note" />
        </div>
        <div className="field">
          <label>How did you find me?</label>
          <select value={f.source} onChange={set("source")}>
            <option>Instagram</option>
            <option>Facebook</option>
            <option>Google</option>
            <option>Referral</option>
            <option>A class</option>
            <option>Other</option>
          </select>
        </div>
      </div>
      {err && <p style={{ color: "var(--berry)", fontSize: 14, margin: "0 0 12px" }}>{err}</p>}
      <button className="btn" onClick={submit}>
        Send my request
      </button>
    </div>
  );
}
