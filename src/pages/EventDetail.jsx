import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import BookingCard from "../components/BookingCard.jsx";
import { getEvent } from "../lib/db.js";
import { PHOTOS, face, cupcakesBloom, classGroup, counter } from "../assets/index.js";
import { fmtDate, fmtTime, seatsLeft } from "../lib/format.js";

export default function EventDetail() {
  const { slug } = useParams();
  const [, force] = useState(0);
  const ev = getEvent(slug);

  if (!ev) {
    return (
      <>
        <SiteHeader />
        <section className="wrap">
          <p className="kicker">Not found</p>
          <h2>That class isn't on the calendar.</h2>
          <p className="soft" style={{ marginTop: 12 }}>It may have wrapped up or been rescheduled.</p>
          <Link className="btn" to="/classes">See upcoming classes</Link>
        </section>
        <SiteFooter />
      </>
    );
  }

  const left = seatsLeft(ev);
  const flag = left <= 0 ? "ev-flag out" : left <= 3 ? "ev-flag low" : "ev-flag";
  const flagText = left <= 0 ? "Sold out" : left <= 3 ? `${left} left` : `${left} seats open`;

  return (
    <>
      <SiteHeader />
      <div className="wrap">
        <p className="crumb" style={{ paddingTop: 18 }}>
          <Link to="/classes">Classes</Link> / {ev.title}
        </p>
      </div>

      <main className="wrap event-grid">
        <div>
          <div className="ev-hero">
            <span className={flag}>{flagText}</span>
            <img src={PHOTOS[ev.photo]} alt={ev.title} />
          </div>

          <h1 className="ev-title">{ev.title}</h1>
          <p className="ev-sub">{ev.subtitle}</p>

          <div className="ev-facts">
            <div className="ev-fact">
              <b>{fmtDate(ev.starts_at)}</b>
              <span>{fmtTime(ev.starts_at)}{ev.ends_at ? `–${fmtTime(ev.ends_at)}` : ""}</span>
            </div>
            <div className="ev-fact">
              <b>{ev.venue_name}</b>
              <span>{ev.venue_city}</span>
            </div>
            <div className="ev-fact">
              <b>{ev.audience || "All levels"}</b>
              <span>beginners welcome</span>
            </div>
          </div>

          <div className="blk">
            <h2>What you'll make</h2>
            <p>{ev.description}</p>
            <div className="mini-gal" style={{ marginTop: 18 }}>
              <div className="g"><img src={cupcakesBloom} alt="Cupcakes from a past class" loading="lazy" /></div>
              <div className="g"><img src={classGroup} alt="A class group with their cupcakes" loading="lazy" /></div>
              <div className="g"><img src={counter} alt="Finished cupcakes boxed to take home" loading="lazy" /></div>
            </div>
          </div>

          {ev.includes?.length > 0 && (
            <div className="blk">
              <h2>What's included</h2>
              <ul className="nice">
                {ev.includes.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="blk">
            <div className="instructor">
              <img src={face} alt="Annalise, your instructor" />
              <div>
                <b>Your teacher, Annalise</b>
                <p style={{ margin: "4px 0 0", fontSize: 14.5, color: "#5b4a42" }}>
                  Self-taught baker and owner of Sweet B's, teaching cupcake classes across Lake
                  County. Patient with total beginners — that's kind of the whole point.
                </p>
              </div>
            </div>
          </div>

          <div className="blk">
            <h2>Good to know</h2>
            <ul className="nice">
              <li>All tools, buttercream, and cupcakes are provided — just bring yourself.</li>
              <li>Baked in a home kitchen that handles wheat, dairy, eggs, and nuts. Not suitable for severe allergies.</li>
              <li>Cancel up to 72 hours before for a full refund; inside 72 hours your seat becomes credit toward a future class.</li>
            </ul>
          </div>
        </div>

        <BookingCard ev={ev} onChange={() => force((n) => n + 1)} />
      </main>

      <SiteFooter />
    </>
  );
}
