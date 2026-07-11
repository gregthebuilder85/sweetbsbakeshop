// ---------------------------------------------------------------------------
// Data layer for Sweet B's HQ.
//
// This version persists to localStorage so the whole app is clickable with no
// backend. Every function is written to map 1:1 onto a Supabase table, so going
// live means swapping the bodies for supabase-js calls (see README + schema.sql)
// while the components keep calling the same functions.
//
//   events    -> table "events"
//   signups   -> table "signups"
//   waitlist  -> table "waitlist"
//   quotes    -> table "quotes"
// ---------------------------------------------------------------------------
import { SEED_EVENTS, SEED_QUOTES } from "./seed.js";
import { slugify } from "./format.js";

const KEY = "sweetbs_hq_v1";

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    /* ignore */
  }
  const initial = {
    events: SEED_EVENTS,
    quotes: SEED_QUOTES,
    signups: [],
    waitlist: [],
  };
  save(initial);
  return initial;
}

function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    /* ignore */
  }
}

const state = load();
const uid = (p) => p + "_" + Math.random().toString(36).slice(2, 9);
const commit = () => save(state);

// ---- events ---------------------------------------------------------------
export function listEvents({ publishedOnly = false } = {}) {
  let rows = [...state.events];
  if (publishedOnly) rows = rows.filter((e) => e.status === "published");
  return rows.sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at));
}

export function upcomingEvents(limit) {
  const now = Date.now();
  const rows = listEvents({ publishedOnly: true }).filter(
    (e) => new Date(e.starts_at).getTime() > now
  );
  return limit ? rows.slice(0, limit) : rows;
}

export function getEvent(slug) {
  return state.events.find((e) => e.slug === slug) || null;
}

export function getEventById(id) {
  return state.events.find((e) => e.id === id) || null;
}

export function createEvent(data) {
  const ev = {
    id: uid("evt"),
    slug: slugify(data.title) || uid("class"),
    seats_taken: 0,
    space_cost: 0,
    photo: "cupcakes-bloom",
    includes: [],
    status: "published",
    ...data,
  };
  // guard against slug collisions
  if (state.events.some((e) => e.slug === ev.slug)) ev.slug += "-" + uid("").slice(-3);
  state.events.unshift(ev);
  commit();
  return ev;
}

export function updateEvent(id, patch) {
  const ev = getEventById(id);
  if (!ev) return null;
  Object.assign(ev, patch);
  commit();
  return ev;
}

export function deleteEvent(id) {
  const i = state.events.findIndex((e) => e.id === id);
  if (i >= 0) {
    state.events.splice(i, 1);
    commit();
  }
}

// ---- signups / booking ----------------------------------------------------
export function bookEvent(eventId, { name, email, qty }) {
  const ev = getEventById(eventId);
  if (!ev) return { ok: false, error: "Class not found." };
  const left = ev.capacity - ev.seats_taken;
  if (qty > left) return { ok: false, error: `Only ${left} seat(s) left.` };
  ev.seats_taken += qty;
  const row = { id: uid("sg"), event_id: eventId, name, email, qty, created_at: new Date().toISOString() };
  state.signups.push(row);
  commit();
  // In production this returns a Stripe Checkout URL from an edge function.
  return { ok: true, signup: row };
}

export function signupsFor(eventId) {
  return state.signups.filter((s) => s.event_id === eventId);
}

export function joinWaitlist(eventId, email) {
  const row = { id: uid("wl"), event_id: eventId, email, created_at: new Date().toISOString() };
  state.waitlist.push(row);
  commit();
  return row;
}

export function waitlistFor(eventId) {
  return state.waitlist.filter((w) => w.event_id === eventId);
}

// ---- quotes / leads -------------------------------------------------------
export function listQuotes() {
  return [...state.quotes].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export function createQuote(data) {
  const row = {
    id: uid("q"),
    status: "new",
    created_at: new Date().toISOString(),
    ...data,
  };
  state.quotes.unshift(row);
  commit();
  return row;
}

export function setQuoteStatus(id, status) {
  const q = state.quotes.find((x) => x.id === id);
  if (q) {
    q.status = status;
    commit();
  }
  return q;
}

// ---- dashboard stats ------------------------------------------------------
export function stats() {
  const up = upcomingEvents();
  const seatsOpen = up.reduce((n, e) => n + Math.max(0, e.capacity - e.seats_taken), 0);
  const newQuotes = state.quotes.filter((q) => q.status === "new").length;
  const waitlisted = state.waitlist.length;
  return {
    upcoming: up.length,
    seatsOpen,
    newQuotes,
    waitlisted,
    revenueBooked: up.reduce((n, e) => n + e.seats_taken * e.price, 0),
  };
}

export function resetDemo() {
  localStorage.removeItem(KEY);
  window.location.reload();
}
