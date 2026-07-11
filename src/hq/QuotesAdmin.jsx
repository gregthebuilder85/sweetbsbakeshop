import { useState } from "react";
import { listQuotes, setQuoteStatus } from "../lib/db.js";

const STATUSES = ["new", "quoted", "booked", "lost"];

export default function QuotesAdmin() {
  const [rev, setRev] = useState(0);
  const [open, setOpen] = useState(null);
  const [filter, setFilter] = useState("all");
  const quotes = listQuotes().filter((q) => filter === "all" || q.status === filter);

  function move(id, status) {
    setQuoteStatus(id, status);
    setRev((n) => n + 1);
  }

  return (
    <>
      <div className="hq-h">
        <div>
          <p className="kicker">Quote inbox</p>
          <h1>Requests &amp; leads</h1>
        </div>
        <div className="hq-actions">
          {["all", ...STATUSES].map((s) => (
            <button
              key={s}
              className="btn sm"
              onClick={() => setFilter(s)}
              style={
                filter === s
                  ? {}
                  : { background: "transparent", color: "var(--cocoa)", boxShadow: "inset 0 0 0 2px var(--blush-line)" }
              }
            >
              {s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="banner-hint">
        In the live app, each new request arrives here already drafted with a suggested price from
        your menu — you review, tweak, and send. For now, move cards through the pipeline to see how
        it flows.
      </div>

      <div className="panel">
        {quotes.length ? (
          <table className="tbl">
            <thead>
              <tr><th>From</th><th>For</th><th>Date</th><th>Source</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.id}>
                  <td style={{ fontWeight: 600 }}>{q.name}</td>
                  <td className="soft">{q.kind}{q.servings ? ` · ${q.servings}` : ""}</td>
                  <td className="soft">{q.event_date || "flexible"}</td>
                  <td className="soft">{q.source}</td>
                  <td><span className={`pill ${q.status}`}>{q.status}</span></td>
                  <td><button className="link-btn" onClick={() => setOpen(q)}>Open</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty">Nothing here yet.</p>
        )}
      </div>

      {open && (
        <div className="panel" style={{ maxWidth: 640 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <div>
              <h3 style={{ marginBottom: 4 }}>{open.name}</h3>
              <p className="soft" style={{ margin: 0 }}>
                <a href={`mailto:${open.email}`}>{open.email}</a> · via {open.source}
              </p>
            </div>
            <span className={`pill ${open.status}`}>{open.status}</span>
          </div>

          <table className="tbl" style={{ marginTop: 18 }}>
            <tbody>
              <Row k="Wants" v={open.kind} />
              <Row k="Event date" v={open.event_date || "flexible"} />
              <Row k="Servings" v={open.servings || "—"} />
              <Row k="Flavors" v={open.flavors || "—"} />
              <Row k="Theme" v={open.theme || "—"} />
              <Row k="Budget" v={open.budget || "—"} />
              <Row k="Note" v={open.message || "—"} />
            </tbody>
          </table>

          <div className="hq-actions" style={{ marginTop: 18 }}>
            {STATUSES.map((s) => (
              <button
                key={s}
                className="btn sm"
                onClick={() => { move(open.id, s); setOpen({ ...open, status: s }); }}
                style={
                  open.status === s
                    ? {}
                    : { background: "transparent", color: "var(--cocoa)", boxShadow: "inset 0 0 0 2px var(--blush-line)" }
                }
              >
                Mark {s}
              </button>
            ))}
            <a className="btn sm line" href={`mailto:${open.email}?subject=Your Sweet B's quote`}>Reply by email</a>
          </div>
          <button className="link-btn" style={{ marginTop: 12 }} onClick={() => setOpen(null)}>Close</button>
        </div>
      )}
    </>
  );
}

function Row({ k, v }) {
  return (
    <tr>
      <td className="soft" style={{ width: 130 }}>{k}</td>
      <td>{v}</td>
    </tr>
  );
}
