# Sweet B's HQ

An all-in-one operating system for Sweet B's Bake Shop — a **public website** plus a
private **owner dashboard** where creating a class publishes it to the live site,
counts seats in real time, collects quote requests, and drafts the announcement copy.

Built with Vite + React + React Router. Ships with a localStorage data layer so the
whole thing runs with **zero backend**, and a Supabase schema + edge functions for
when you're ready to go live.

---

## Run it

```bash
npm install
npm run dev
```

- Public site → http://localhost:5173
- Owner dashboard → http://localhost:5173/hq  (demo passcode: **sweet**)

### The core loop to try
1. Open **/hq** → **Classes & Events** → **+ New class**. Fill it in, publish.
2. Open **/classes** on the public site — your class is live and bookable.
3. Book a seat (name + email). Seat count drops; sell out to see the waitlist.
4. Submit a quote on **/cakes** → it lands in **/hq → Quote Inbox**.
5. **/hq → Content Studio** → pick the class → copy the caption / email.

Reset everything from the dashboard sidebar → **Reset demo data**.

---

## Single-file preview
`sweet-bs-hq-preview.html` (built with `npm run build:single`) is the entire app
inlined into one file — double-click to open, no server needed. Great for sharing.

---

## Project map

```
src/
  pages/        public site (Home, Classes, EventDetail, Cakes, Parties, About)
  hq/           owner dashboard (Dashboard, EventsAdmin, QuotesAdmin, ContentStudio)
  components/   SiteHeader, SiteFooter, EventCard, BookingCard, QuoteForm, Scallop
  lib/
    db.js       data layer — localStorage now, 1:1 with Supabase tables
    seed.js     starter classes + quotes
    content.js  on-voice copy generator (template now, AI-ready)
    format.js   date/money helpers
  assets/       Annalise's real photos + logo (bundled)
supabase/
  schema.sql    tables + RLS
  functions/    create-checkout-session (Stripe), generate-content (AI), send-sequence (email)
```

The whole app talks to `src/lib/db.js`. Every function there maps to one Supabase
table, so going live is swapping the bodies — the components don't change.

---

## Going live (checklist)

1. **Supabase** — create a project, run `supabase/schema.sql`.
2. **Data layer** — install `@supabase/supabase-js`; replace the localStorage bodies
   in `src/lib/db.js` with queries against the matching tables. Set `VITE_SUPABASE_URL`
   and `VITE_SUPABASE_ANON_KEY` (see `.env.example`).
3. **Auth** — swap the passcode gate in `src/hq/HQLayout.jsx` for Supabase Auth
   (single owner account).
4. **Payments** — deploy `create-checkout-session`, add a Stripe webhook that
   confirms payment and increments `seats_taken` (a `SECURITY DEFINER` `book_seats`
   function is the safe way — see note at the bottom of `schema.sql`).
5. **Email** — deploy `send-sequence`; wire booking confirmations, waitlist
   notifications, quote follow-ups, and day-before reminders.
6. **Content AI** — deploy `generate-content` and point `content.js` at it. Paste a
   few of Annalise's real captions into `VOICE_SAMPLES` to calibrate the voice.
7. **Images** — move `src/assets` into Supabase Storage (or keep bundled); store the
   key/URL in `events.photo`.
8. **Domain** — build (`npm run build`), deploy `dist/` (Vercel/Netlify/Cloudflare),
   point sweetbsbakeshop.com at it. Preserve existing URLs with redirects.

---

## Honest notes

- **Backend is scaffolded, not wired.** Supabase, Stripe, and email need Annalise's
  own accounts/keys. The schema, edge functions, and swap points are all here; the
  connection is the go-live work above.
- **Content generator** uses on-voice templates today; it's structured so the AI
  function is a drop-in.
- **Class names, dates, prices, and the refund policy** in the seed data are sensible
  placeholders — confirm with Annalise before launch.
- **The passcode gate is a demo stand-in**, not real security. Replace with Supabase
  Auth before going live.
- A few of her 7 photos repeat across sections; drop more shots into `src/assets` and
  update `assets/index.js` to diversify.
