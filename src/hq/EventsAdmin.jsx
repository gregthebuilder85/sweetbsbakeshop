import { useState } from "react";
import { Link } from "react-router-dom";
import {
  listEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  signupsFor,
  waitlistFor,
} from "../lib/db.js";
import { PHOTO_OPTIONS } from "../assets/index.js";
import { money, fmtDateTime, seatsLeft } from "../lib/format.js";

const BLANK = {
  title: "",
  subtitle: "",
  date: "",
  time: "18:00",
  end_time: "20:00",
  venue_name: "",
  venue_city: "",
  price: 65,
  capacity: 12,
  space_cost: 0,
  photo: "cupcakes-bloom",
  audience: "Adults & teens 13+",
  description: "",
  includes: "All tools and buttercream\nEverything you make, boxed to take home\nMy buttercream recipe card",
};

export default function EventsAdmin() {
  const [rev, setRev] = useState(0);
  const [form, setForm] = useState(null); // null | BLANK-like | existing
  const events = listEvents();
  const refresh = () => setRev((n) => n + 1);

  function openNew() {
    setForm({ ...BLANK });
  }
  function openEdit(ev) {
    const d = new Date(ev.starts_at);
    const e = ev.ends_at ? new Date(ev.ends_at) : null;
    setForm({
      _id: ev.id,
      title: ev.title,
      subtitle: ev.subtitle || "",
      date: d.toISOString().slice(0, 10),
      time: d.toTimeString().slice(0, 5),
      end_time: e ? e.toTimeString().slice(0, 5) : "",
      venue_name: ev.venue_name,
      venue_city: ev.venue_city,
      price: ev.price,
      capacity: ev.capacity,
      space_cost: ev.space_cost || 0,
      photo: ev.photo,
      audience: ev.audience || "",
      description: ev.description || "",
      includes: (ev.includes || []).join("\n"),
    });
  }

  function save() {
    const startISO = new Date(`${form.date}T${form.time || "18:00"}`).toISOString();
    const endISO = form.end_time ? new Date(`${form.date}T${form.end_time}`).toISOString() : null;
    const payload = {
      title: form.title,
      subtitle: form.subtitle,
      starts_at: startISO,
      ends_at: endISO,
      venue_name: form.venue_name,
      venue_city: form.venue_city,
      price: Number(form.price),
      capacity: Number(form.capacity),
      space_cost: Number(form.space_cost),
      photo: form.photo,
      audience: form.audience,
      description: form.description,
      includes: form.includes.split("\n").map((s) => s.trim()).filter(Boolean),
      status: "published",
    };
    if (form._id) updateEvent(form._id, payload);
    else createEvent(payload);
    setForm(null);
    refresh();
  }

  function remove(ev) {
    if (confirm(`Delete "${ev.title}"? This can't be undone.`)) {
      deleteEvent(ev.id);
      refresh();
    }
  }

  if (form) {
    const valid = form.title && form.date && form.venue_name;
    return (
      <>
        <div className="hq-h">
          <div>
            <p className="kicker">{form._id ? "Edit class" : "New class"}</p>
            <h1>{form._id ? "Edit the details" : "Create a class"}</h1>
          </div>
          <button className="btn line sm" onClick={() => setForm(null)}>Cancel</button>
        </div>

        <div className="banner-hint">
          Fill this once and Sweet B's HQ builds the public event page, the signup form, and the
          social + email copy for you. Estimated time: about two minutes.
        </div>

        <div className="panel" style={{ maxWidth: 760 }}>
          <F label="Class name">
            <input value={form.title} onChange={set(form, setForm, "title")} placeholder="Buttercream Bloom Cupcakes" />
          </F>
          <F label="One-line description">
            <input value={form.subtitle} onChange={set(form, setForm, "subtitle")} placeholder="Leave with six cupcakes you piped yourself." />
          </F>
          <div className="grid2">
            <F label="Date"><input type="date" value={form.date} onChange={set(form, setForm, "date")} /></F>
            <F label="Photo">
              <select value={form.photo} onChange={set(form, setForm, "photo")}>
                {PHOTO_OPTIONS.map((p) => (
                  <option key={p.key} value={p.key}>{p.label}</option>
                ))}
              </select>
            </F>
          </div>
          <div className="grid2">
            <F label="Start time"><input type="time" value={form.time} onChange={set(form, setForm, "time")} /></F>
            <F label="End time"><input type="time" value={form.end_time} onChange={set(form, setForm, "end_time")} /></F>
          </div>
          <div className="grid2">
            <F label="Venue name"><input value={form.venue_name} onChange={set(form, setForm, "venue_name")} placeholder="The Joyful Gourmet" /></F>
            <F label="City"><input value={form.venue_city} onChange={set(form, setForm, "venue_city")} placeholder="Libertyville, IL" /></F>
          </div>
          <div className="grid2">
            <F label="Price / seat ($)"><input type="number" value={form.price} onChange={set(form, setForm, "price")} /></F>
            <F label="Seats available"><input type="number" value={form.capacity} onChange={set(form, setForm, "capacity")} /></F>
          </div>
          <div className="grid2">
            <F label="Your cost for this class ($)" hint="Space rental, supplies — used to show profit.">
              <input type="number" value={form.space_cost} onChange={set(form, setForm, "space_cost")} />
            </F>
            <F label="Who it's for"><input value={form.audience} onChange={set(form, setForm, "audience")} placeholder="Adults & teens 13+" /></F>
          </div>
          <F label="What you'll make">
            <textarea value={form.description} onChange={set(form, setForm, "description")} placeholder="Describe the class in your own words…" />
          </F>
          <F label="What's included" hint="One item per line.">
            <textarea value={form.includes} onChange={set(form, setForm, "includes")} />
          </F>

          {form.price && form.capacity ? (
            <p className="soft" style={{ fontSize: 14 }}>
              Sold out this class earns{" "}
              <b>{money(form.price * form.capacity - (form.space_cost || 0))}</b> after your{" "}
              {money(form.space_cost || 0)} cost.
            </p>
          ) : null}

          <button className="btn" disabled={!valid} onClick={save}>
            {form._id ? "Save changes" : "Publish class"}
          </button>
          {!valid && <span className="hint" style={{ marginLeft: 12 }}>Name, date, and venue are required.</span>}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="hq-h">
        <div>
          <p className="kicker">Classes &amp; events</p>
          <h1>Your classes</h1>
        </div>
        <button className="btn sm" onClick={openNew}>+ New class</button>
      </div>

      <div className="panel">
        {events.length ? (
          <table className="tbl">
            <thead>
              <tr>
                <th>Class</th><th>When</th><th>Venue</th><th>Seats</th><th>Waitlist</th><th></th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => {
                const left = seatsLeft(e);
                const past = new Date(e.starts_at).getTime() < Date.now();
                return (
                  <tr key={e.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{e.title}</div>
                      <div className="soft" style={{ fontSize: 13 }}>
                        {money(e.price)} · <Link to={`/classes/${e.slug}`}>view page ↗</Link>
                      </div>
                    </td>
                    <td className="soft">{fmtDateTime(e.starts_at)}{past && " · past"}</td>
                    <td className="soft">{e.venue_city}</td>
                    <td>
                      {left <= 0 ? <span className="pill lost">Full</span> : <span>{e.seats_taken}/{e.capacity}</span>}
                    </td>
                    <td>{waitlistFor(e.id).length || "—"}</td>
                    <td className="hq-actions">
                      <button className="link-btn" onClick={() => openEdit(e)}>Edit</button>
                      <button className="link-btn" onClick={() => remove(e)} style={{ color: "#b23a3a" }}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="empty">No classes yet. <button className="link-btn" onClick={openNew}>Create your first →</button></p>
        )}
      </div>
    </>
  );
}

function F({ label, hint, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}
const set = (form, setForm, key) => (e) => setForm({ ...form, [key]: e.target.value });
