import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { upcomingEvents } from "../lib/db.js";
import { generate, generateNewsletter, WEEK_PLAN, PROMO_OCCASIONS, NEWSLETTER_PURPOSES, BIZ } from "../lib/studio.js";

const CFG_KEY = "sweetbs_studio_cfg";
const SAVED_KEY = "sweetbs_studio_saved";
const load = (k, f) => { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : f; } catch { return f; } };
const store = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } };

const TILES = [
  { id: "class",  title: "Fill a class",       sub: "Announce or remind about a class",  icon: "calendar" },
  { id: "work",   title: "Show your work",      sub: "A cake or cupcakes you made",       icon: "cake" },
  { id: "review", title: "Share a review",      sub: "Turn kind words into a post",       icon: "heart" },
  { id: "bts",    title: "Behind the scenes",   sub: "Show the real you",                 icon: "camera" },
  { id: "promo",  title: "Run a special",       sub: "Holidays, weekends, open dates",    icon: "tag" },
  { id: "idea",   title: "Something else",       sub: "Write anything in your voice",      icon: "spark" },
];

export default function ContentStudio() {
  const [tab, setTab] = useState("make");
  const [cfg, setCfg] = useState(() => load(CFG_KEY, { goal: "both", vibe: "warm" }));
  const [saved, setSaved] = useState(() => load(SAVED_KEY, []));
  const [showCfg, setShowCfg] = useState(false);

  const [type, setType] = useState(null);
  const [details, setDetails] = useState({});
  const [eventId, setEventId] = useState("");
  const [angle, setAngle] = useState("announce");
  const [variant, setVariant] = useState(0);
  const [out, setOut] = useState(null);

  const [nlPurpose, setNlPurpose] = useState("whatsnew");
  const [nlTopics, setNlTopics] = useState("");
  const [nlIncludeClasses, setNlIncludeClasses] = useState(true);
  const [nlVariant, setNlVariant] = useState(0);
  const [nlOut, setNlOut] = useState(null);

  const events = upcomingEvents();
  useEffect(() => { if (!eventId && events[0]) setEventId(events[0].id); }, [events, eventId]);
  useEffect(() => store(CFG_KEY, cfg), [cfg]);
  useEffect(() => store(SAVED_KEY, saved), [saved]);

  function run(nextVariant = 0, tOverride) {
    const t = tOverride || type;
    const event = events.find((e) => e.id === eventId) || events[0] || null;
    const res = generate({ type: t, event, angle, details, vibe: cfg.vibe, goal: cfg.goal, variant: nextVariant });
    setVariant(nextVariant);
    setOut(res);
  }

  function chooseTile(id) {
    setType(id);
    setDetails({});
    setOut(null);
    setAngle("announce");
    // types that can generate with no typing
    if (id === "class" || id === "bts") run(0, id);
  }

  function fromPlan(t) {
    setTab("make");
    setType(t);
    setDetails({});
    setOut(null);
    if (t === "class" || t === "bts") setTimeout(() => run(0, t), 0);
  }

  function runNewsletter(v = 0) {
    const events = upcomingEvents();
    setNlOut(generateNewsletter({ purpose: nlPurpose, topics: nlTopics, events, includeClasses: nlIncludeClasses, vibe: cfg.vibe, goal: cfg.goal, variant: v }));
    setNlVariant(v);
  }

  function savePost(b) {
    const row = { id: Math.random().toString(36).slice(2), title: out.title, label: b.label, text: b.text, ts: Date.now(), posted: false };
    setSaved((s) => [row, ...s]);
  }

  return (
    <>
      <div className="hq-h">
        <div>
          <p className="kicker">Content Studio</p>
          <h1>Make a post in a few clicks.</h1>
        </div>
        <button className="link-btn" onClick={() => setShowCfg((s) => !s)}>Settings</button>
      </div>

      {showCfg && (
        <div className="panel" style={{ maxWidth: 620 }}>
          <div className="field">
            <label>Right now I most want more…</label>
            <div className="chips">
              {[["classes", "Class signups"], ["cakes", "Cake orders"], ["both", "Both"]].map(([k, l]) => (
                <button key={k} className={"chip" + (cfg.goal === k ? " active" : "")} onClick={() => setCfg({ ...cfg, goal: k })}>{l}</button>
              ))}
            </div>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>My vibe</label>
            <div className="chips">
              {[["warm", "Warm"], ["playful", "Playful"], ["elegant", "Elegant"]].map(([k, l]) => (
                <button key={k} className={"chip" + (cfg.vibe === k ? " active" : "")} onClick={() => setCfg({ ...cfg, vibe: k })}>{l}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="studio-tabs">
        {[["make", "Make a post"], ["plan", "Weekly plan"], ["newsletter", "Newsletter"], ["saved", `Saved${saved.length ? ` (${saved.length})` : ""}`]].map(([k, l]) => (
          <button key={k} className={"stab" + (tab === k ? " active" : "")} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {tab === "make" && (
        <>
          <p className="soft" style={{ marginTop: 4, marginBottom: 16 }}>1 · What do you want to post about?</p>
          <div className="tile-grid">
            {TILES.map((t) => (
              <button key={t.id} className={"tile" + (type === t.id ? " active" : "")} onClick={() => chooseTile(t.id)}>
                <Ico name={t.icon} />
                <b>{t.title}</b>
                <span>{t.sub}</span>
              </button>
            ))}
          </div>

          {type && (
            <div className="panel" style={{ maxWidth: 720, marginTop: 22 }}>
              <p className="soft" style={{ marginTop: 0 }}>2 · A quick detail (optional for most)</p>
              <Inputs
                type={type} details={details} setDetails={setDetails}
                events={events} eventId={eventId} setEventId={setEventId}
                angle={angle} setAngle={setAngle}
              />
              <button className="btn" onClick={() => run(0)}>Make my posts</button>
            </div>
          )}

          {out && <Output out={out} onRegen={() => run(variant + 1)} onSave={savePost} onReset={() => { setType(null); setOut(null); }} />}
        </>
      )}

      {tab === "plan" && (
        <>
          <div className="banner-hint">A simple rhythm to follow. Not sure what to post today? Find the day, click <b>Make this post</b>, and you're done.</div>
          <div className="plan-grid">
            {WEEK_PLAN.map((d) => (
              <div className="plan-card" key={d.day}>
                <div className="pd">{d.day}</div>
                <b>{d.label}</b>
                <span className="soft">{d.why}</span>
                <button className="btn sm" onClick={() => fromPlan(d.type)}>Make this post</button>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "newsletter" && (
        <>
          <p className="soft" style={{ marginTop: 4, marginBottom: 16 }}>Pick what this email is about, and I'll write it for you.</p>
          <div className="panel" style={{ maxWidth: 720 }}>
            <div className="field">
              <label>What's this newsletter about?</label>
              <div className="chips">
                {NEWSLETTER_PURPOSES.map((p) => (
                  <button key={p.id} className={"chip" + (nlPurpose === p.id ? " active" : "")} onClick={() => setNlPurpose(p.id)}>{p.label}</button>
                ))}
              </div>
            </div>
            <div className="field">
              <label>Anything to include? (optional)</label>
              <textarea value={nlTopics} onChange={(e) => setNlTopics(e.target.value)} placeholder="a new flavor, a thank-you, a photo you're featuring…" />
            </div>
            <label className="nl-check">
              <input type="checkbox" checked={nlIncludeClasses} onChange={(e) => setNlIncludeClasses(e.target.checked)} />
              <span>Include this month's classes</span>
            </label>
            <button className="btn" onClick={() => runNewsletter(0)}>Write my newsletter</button>
          </div>
          {nlOut && <Output out={nlOut} onRegen={() => runNewsletter(nlVariant + 1)} onSave={savePost} onReset={() => setNlOut(null)} />}
        </>
      )}

      {tab === "saved" && (
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Saved posts</h3>
          {saved.length ? saved.map((s) => (
            <div className="copybox" key={s.id}>
              <div className="ck">
                <span className="cl">{s.title} · {s.label}{s.posted ? " · posted" : ""}</span>
                <span className="hq-actions">
                  <Copy text={s.text} />
                  <button className="link-btn" onClick={() => setSaved((x) => x.map((r) => r.id === s.id ? { ...r, posted: !r.posted } : r))}>{s.posted ? "Unmark" : "Mark posted"}</button>
                  <button className="link-btn" style={{ color: "#b23a3a" }} onClick={() => setSaved((x) => x.filter((r) => r.id !== s.id))}>Delete</button>
                </span>
              </div>
              <pre>{s.text}</pre>
            </div>
          )) : <p className="empty">Nothing saved yet. Make a post, then tap <b>Save</b> on the ones you love.</p>}
        </div>
      )}
    </>
  );
}

function Inputs({ type, details, setDetails, events, eventId, setEventId, angle, setAngle }) {
  const set = (k) => (e) => setDetails({ ...details, [k]: e.target.value });
  if (type === "class") {
    if (!events.length) return <p className="empty">No upcoming classes yet. <Link to="/hq/events">Add one →</Link></p>;
    return (
      <>
        <div className="field">
          <label>Which class?</label>
          <select value={eventId} onChange={(e) => setEventId(e.target.value)}>
            {events.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>
        <div className="field">
          <label>What kind of post?</label>
          <div className="chips">
            {[["announce", "Announce it"], ["lastcall", "Almost full"], ["reminder", "Reminder"]].map(([k, l]) => (
              <button key={k} className={"chip" + (angle === k ? " active" : "")} onClick={() => setAngle(k)}>{l}</button>
            ))}
          </div>
        </div>
      </>
    );
  }
  if (type === "work") {
    return (
      <>
        <div className="field">
          <label>What did you make?</label>
          <input value={details.what || ""} onChange={set("what")} placeholder="e.g. a two-tier Hello Kitty birthday cake" />
        </div>
        <div className="grid2">
          <div className="field">
            <label>For what occasion? (optional)</label>
            <input value={details.occasion || ""} onChange={set("occasion")} placeholder="a 7th birthday" />
          </div>
          <div className="field">
            <label>Cake or cupcakes?</label>
            <select value={details.kind || "cake"} onChange={set("kind")}>
              <option value="cake">Cake</option>
              <option value="cupcakes">Cupcakes</option>
            </select>
          </div>
        </div>
      </>
    );
  }
  if (type === "review") {
    return (
      <>
        <div className="field">
          <label>Paste the review or kind message</label>
          <textarea value={details.review || ""} onChange={set("review")} placeholder="Annalise made my daughter's birthday so special…" />
        </div>
        <div className="field">
          <label>Who said it? (first name, optional)</label>
          <input value={details.name || ""} onChange={set("name")} placeholder="Jordan" />
        </div>
      </>
    );
  }
  if (type === "bts") {
    return (
      <div className="field">
        <label>What's happening right now? (optional)</label>
        <input value={details.note || ""} onChange={set("note")} placeholder="Leave blank and I'll write one for you" />
      </div>
    );
  }
  if (type === "promo") {
    return (
      <>
        <div className="field">
          <label>What's the occasion?</label>
          <select value={details.occasion || "Now booking"} onChange={set("occasion")}>
            {PROMO_OCCASIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Order-by date or detail (optional)</label>
          <input value={details.detail || ""} onChange={set("detail")} placeholder="Order by May 8 for Mother's Day" />
        </div>
      </>
    );
  }
  return (
    <div className="field">
      <label>What's on your mind?</label>
      <textarea value={details.text || ""} onChange={set("text")} placeholder="This month's flavor is brown butter…" />
    </div>
  );
}

function Output({ out, onRegen, onSave, onReset }) {
  if (out.empty) {
    return <div className="panel" style={{ maxWidth: 720, marginTop: 22 }}><p className="empty" style={{ margin: 0 }}>{out.empty}</p></div>;
  }
  return (
    <div style={{ maxWidth: 760, marginTop: 26 }}>
      <div className="out-actions">
        <p className="kicker" style={{ margin: 0 }}>Ready to post</p>
        <span className="hq-actions">
          <button className="btn sm line" onClick={onRegen}>Make another version</button>
          <button className="link-btn" onClick={onReset}>Start over</button>
        </span>
      </div>
      {out.reminders?.length > 0 && (
        <div className="rem">
          {out.reminders.map((r, i) => <div key={i}>· {r}</div>)}
        </div>
      )}
      {out.blocks.map((b) => (
        <div className="copybox" key={b.id}>
          <div className="ck">
            <span className="cl">{b.label}</span>
            <span className="hq-actions">
              <Copy text={b.text} />
              <button className="link-btn" onClick={() => onSave(b)}>Save</button>
            </span>
          </div>
          <pre style={b.mono ? { fontFamily: "ui-monospace,Menlo,monospace", fontSize: 13.5, color: "var(--berry-deep)" } : undefined}>{b.text}</pre>
          {b.hint && <p className="soft" style={{ fontSize: 13, margin: "8px 0 0" }}>{b.hint}</p>}
        </div>
      ))}
    </div>
  );
}

function Copy({ text }) {
  const [done, setDone] = useState(false);
  return (
    <button className="link-btn" onClick={() => { navigator.clipboard?.writeText(text).then(() => { setDone(true); setTimeout(() => setDone(false), 1300); }, () => {}); }}>
      {done ? "Copied" : "Copy"}
    </button>
  );
}

function Ico({ name }) {
  const p = {
    calendar: "M7 3v3M17 3v3M4 8h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z",
    cake: "M4 20h16M5 20v-7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7M12 4v3M12 7c-1.5 0-2 1.2-2 2h4c0-.8-.5-2-2-2z",
    heart: "M12 20s-7-4.5-9.3-8.5C1 8 3 4.5 6.5 5 9 5.4 12 8 12 8s3-2.6 5.5-3c3.5-.5 5.5 3 3.8 6.5C19 15.5 12 20 12 20z",
    camera: "M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z",
    tag: "M12 3H5a2 2 0 0 0-2 2v7l9 9 9-9-9-9zM7.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
    spark: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z",
  }[name];
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={p} />
    </svg>
  );
}
