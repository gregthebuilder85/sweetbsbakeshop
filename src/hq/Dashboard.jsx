import { Link } from "react-router-dom";
import { stats, upcomingEvents, listQuotes } from "../lib/db.js";
import { money, fmtDateTime, seatsLeft } from "../lib/format.js";

export default function Dashboard() {
  const s = stats();
  const classes = upcomingEvents(5);
  const newQuotes = listQuotes().filter((q) => q.status === "new");

  return (
    <>
      <div className="hq-h">
        <div>
          <p className="kicker">Good morning, Annalise</p>
          <h1>Here's your week.</h1>
        </div>
        <Link className="btn sm" to="/hq/events">+ New class</Link>
      </div>

      <div className="banner-hint">
        This dashboard runs on demo data saved in your browser. Everything you create here shows up on
        the public site instantly — try adding a class, then open the Classes page.
      </div>

      <div className="stat-row">
        <div className="stat"><div className="v">{s.upcoming}</div><div className="l">Upcoming classes</div></div>
        <div className="stat"><div className="v">{s.seatsOpen}</div><div className="l">Seats still open</div></div>
        <div className="stat"><div className="v">{s.newQuotes}</div><div className="l">New quote requests</div></div>
        <div className="stat"><div className="v">{money(s.revenueBooked)}</div><div className="l">Booked (upcoming)</div></div>
      </div>

      <div className="split">
        <div className="panel">
          <h3>Next classes</h3>
          {classes.length ? (
            <table className="tbl">
              <thead>
                <tr><th>Class</th><th>When</th><th>Seats</th></tr>
              </thead>
              <tbody>
                {classes.map((e) => {
                  const left = seatsLeft(e);
                  return (
                    <tr key={e.id}>
                      <td><Link to={`/hq/events`} style={{ fontWeight: 600 }}>{e.title}</Link></td>
                      <td className="soft">{fmtDateTime(e.starts_at)}</td>
                      <td>
                        {left <= 0 ? (
                          <span className="pill lost">Sold out</span>
                        ) : (
                          <span>{e.seats_taken}/{e.capacity}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="empty">No upcoming classes. <Link to="/hq/events">Add one →</Link></p>
          )}
        </div>

        <div className="panel">
          <h3>New quote requests</h3>
          {newQuotes.length ? (
            <table className="tbl">
              <thead>
                <tr><th>From</th><th>For</th><th></th></tr>
              </thead>
              <tbody>
                {newQuotes.map((q) => (
                  <tr key={q.id}>
                    <td style={{ fontWeight: 600 }}>{q.name}</td>
                    <td className="soft">{q.kind} · {q.event_date || "flexible"}</td>
                    <td><Link className="link-btn" to="/hq/quotes">Open</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty">You're all caught up.</p>
          )}
        </div>
      </div>
    </>
  );
}
