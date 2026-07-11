import { useState } from "react";
import { listEvents } from "../lib/db.js";
import { generate } from "../lib/content.js";

export default function ContentStudio() {
  const events = listEvents();
  const [id, setId] = useState(events[0]?.id || "");
  const ev = events.find((e) => e.id === id);
  const out = ev ? generate(ev) : null;

  return (
    <>
      <div className="hq-h">
        <div>
          <p className="kicker">Content studio</p>
          <h1>Announce it everywhere in one click.</h1>
        </div>
      </div>

      <div className="banner-hint">
        Pick a class and get an Instagram caption, a Facebook post, an email, and a day-before
        reminder — written in your voice. In the live app this runs on AI and can post for you; here
        it uses on-voice templates so you can see the shape.
      </div>

      <div className="panel" style={{ maxWidth: 720 }}>
        <div className="field">
          <label>Class to promote</label>
          <select value={id} onChange={(e) => setId(e.target.value)}>
            {events.map((e) => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
        </div>

        {out ? (
          <>
            <Copy label="Instagram caption" text={out.instagram} />
            <Copy label="Facebook post" text={out.facebook} />
            <Copy label={`Email — ${out.email.subject}`} text={out.email.body} />
            <Copy label="Day-before reminder (text/DM)" text={out.reminder} />
          </>
        ) : (
          <p className="empty">Create a class first, then come back to announce it.</p>
        )}
      </div>
    </>
  );
}

function Copy({ label, text }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard?.writeText(text).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      },
      () => {}
    );
  }
  return (
    <div className="copybox">
      <div className="ck">
        <span className="cl">{label}</span>
        <button className="link-btn" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
      </div>
      <pre>{text}</pre>
    </div>
  );
}
