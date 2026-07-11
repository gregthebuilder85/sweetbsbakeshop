import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import EventCard from "../components/EventCard.jsx";
import { upcomingEvents } from "../lib/db.js";

export default function Classes() {
  const classes = upcomingEvents();
  return (
    <>
      <SiteHeader />
      <section>
        <div className="wrap">
          <p className="kicker">Decorating classes</p>
          <h2>Learn to decorate — and have a really good time doing it.</h2>
          <p className="sub soft" style={{ maxWidth: "60ch", marginTop: 12, marginBottom: 34 }}>
            Hands-on cake and cupcake classes for adults and kids, at local venues and private
            studio nights. Every tool and treat is provided; no experience needed. Seats are counted
            live, so what you see is what's open.
          </p>
          {classes.length ? (
            <div className="cards">
              {classes.map((ev) => (
                <EventCard key={ev.id} ev={ev} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <p>No public classes on the calendar right now.</p>
              <Link className="btn" to="/parties">Book a private party instead</Link>
            </div>
          )}

          <div style={{ marginTop: 46, textAlign: "center" }}>
            <p className="kicker" style={{ justifyContent: "center" }}>Want your own?</p>
            <h2 style={{ marginBottom: 14 }}>Gather your people for a private class.</h2>
            <Link className="btn" to="/parties">Plan a private party</Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
