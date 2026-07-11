-- ===========================================================================
-- Sweet B's HQ — Supabase schema
-- Mirrors the shapes used by src/lib/db.js. Run in the Supabase SQL editor.
-- ===========================================================================

create extension if not exists "pgcrypto";

-- Classes / events -----------------------------------------------------------
create table if not exists events (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  subtitle     text,
  starts_at    timestamptz not null,
  ends_at      timestamptz,
  venue_name   text not null,
  venue_city   text not null,
  price        integer not null default 0,      -- dollars
  space_cost   integer not null default 0,      -- owner's cost (rental/supplies)
  capacity     integer not null default 12,
  seats_taken  integer not null default 0,
  photo        text,                            -- storage key or public URL
  audience     text,
  description  text,
  includes     jsonb not null default '[]',
  status       text not null default 'published' check (status in ('published','draft')),
  created_at   timestamptz not null default now()
);
create index if not exists events_starts_idx on events (starts_at);

-- Paid signups ---------------------------------------------------------------
create table if not exists signups (
  id             uuid primary key default gen_random_uuid(),
  event_id       uuid not null references events(id) on delete cascade,
  name           text not null,
  email          text not null,
  qty            integer not null default 1,
  stripe_session text,
  paid           boolean not null default false,
  created_at     timestamptz not null default now()
);
create index if not exists signups_event_idx on signups (event_id);

-- Waitlist -------------------------------------------------------------------
create table if not exists waitlist (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references events(id) on delete cascade,
  email      text not null,
  notified   boolean not null default false,
  created_at timestamptz not null default now()
);

-- Quote requests / leads -----------------------------------------------------
create table if not exists quotes (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null check (kind in ('cake','cupcakes','party')),
  name        text not null,
  email       text not null,
  event_date  date,
  servings    text,
  flavors     text,
  theme       text,
  budget      text,
  message     text,
  source      text,
  status      text not null default 'new' check (status in ('new','quoted','booked','lost')),
  draft_reply text,                              -- AI-suggested reply for the owner
  created_at  timestamptz not null default now()
);

-- Newsletter (recipe magnet) -------------------------------------------------
create table if not exists subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
--   Public site: read published events; insert own signups/quotes/subscribers.
--   Owner dashboard: full access via authenticated role.
-- ---------------------------------------------------------------------------
alter table events      enable row level security;
alter table signups     enable row level security;
alter table waitlist    enable row level security;
alter table quotes      enable row level security;
alter table subscribers enable row level security;

-- Public read of published classes
create policy "public reads published events"
  on events for select using (status = 'published');

-- Public can create leads / signups / waitlist / subscribers
create policy "public creates quotes"      on quotes      for insert with check (true);
create policy "public creates signups"     on signups     for insert with check (true);
create policy "public creates waitlist"    on waitlist    for insert with check (true);
create policy "public creates subscribers" on subscribers for insert with check (true);

-- Owner (any authenticated user in this single-tenant app) manages everything
create policy "owner manages events"      on events      for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "owner reads signups"       on signups     for select using (auth.role() = 'authenticated');
create policy "owner reads waitlist"      on waitlist    for select using (auth.role() = 'authenticated');
create policy "owner manages quotes"      on quotes      for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "owner reads subscribers"   on subscribers for select using (auth.role() = 'authenticated');

-- Note: seats_taken should be incremented server-side (edge function) after a
-- successful Stripe payment, not by the public client. Consider a SECURITY
-- DEFINER function `book_seats(event_id, qty)` invoked from the webhook.
