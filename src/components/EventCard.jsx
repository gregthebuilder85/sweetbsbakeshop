import { Link } from "react-router-dom";
import { PHOTOS } from "../assets/index.js";
import { money, fmtDateTime, seatsLeft } from "../lib/format.js";

export default function EventCard({ ev }) {
  const left = seatsLeft(ev);
  const seatClass = left <= 0 ? "seats out" : left <= 3 ? "seats low" : "seats";
  const seatText = left <= 0 ? "Sold out" : left <= 3 ? `${left} seat${left === 1 ? "" : "s"} left` : `${left} seats open`;
  const unit = ev.title.toLowerCase().includes("kid") ? "child" : "person";

  return (
    <article className="event">
      <Link to={`/classes/${ev.slug}`} className="ph">
        <span className={seatClass}>{seatText}</span>
        <img src={PHOTOS[ev.photo]} alt={ev.title} loading="lazy" />
      </Link>
      <div className="bd">
        <p className="when">{fmtDateTime(ev.starts_at)}</p>
        <h3>{ev.title}</h3>
        <p className="where">
          {ev.venue_name} · {ev.venue_city}
        </p>
        <div className="row">
          <span className="price">
            {money(ev.price)} <span>/ {unit}</span>
          </span>
          <Link className="btn sm" to={`/classes/${ev.slug}`}>
            {left <= 0 ? "Join waitlist" : "Save a seat"}
          </Link>
        </div>
      </div>
    </article>
  );
}
