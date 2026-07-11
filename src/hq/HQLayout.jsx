import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { resetDemo } from "../lib/db.js";

const AUTH_KEY = "sweetbs_hq_auth";
// Demo passcode only. Real deploy uses Supabase Auth (see README) — this gate is
// a stand-in so the dashboard isn't wide open in the prototype.
const PASSCODE = "sweet";

export default function HQLayout() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === "1");
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  function unlock(e) {
    e.preventDefault();
    if (code.trim().toLowerCase() === PASSCODE) {
      sessionStorage.setItem(AUTH_KEY, "1");
      setAuthed(true);
    } else {
      setErr("That's not it — try again.");
    }
  }

  if (!authed) {
    return (
      <div className="gate">
        <p className="kicker" style={{ justifyContent: "center" }}>Sweet B's HQ</p>
        <h2>Owner sign-in</h2>
        <form className="form-card" onSubmit={unlock}>
          <div className="field">
            <label>Passcode</label>
            <input
              autoFocus
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Demo passcode: sweet"
            />
            {err && <span className="hint" style={{ color: "var(--berry)" }}>{err}</span>}
          </div>
          <button className="btn block" type="submit">Enter HQ</button>
        </form>
        <p className="soft" style={{ fontSize: 13, marginTop: 16 }}>
          Demo passcode is <b>sweet</b>. Real deploy uses proper login.
        </p>
      </div>
    );
  }

  return (
    <div className="hq">
      <aside className="hq-side">
        <div className="logo">Sweet B's HQ</div>
        <NavLink end to="/hq">Dashboard</NavLink>
        <NavLink to="/hq/events">Classes &amp; Events</NavLink>
        <NavLink to="/hq/quotes">Quote Inbox</NavLink>
        <NavLink to="/hq/content">Content Studio</NavLink>
        <div className="spacer" />
        <button className="link-btn" style={{ textAlign: "left", color: "#CBB6A9" }} onClick={() => nav("/")}>
          ← View public site
        </button>
        <button className="link-btn" style={{ textAlign: "left", color: "#9b8478" }} onClick={resetDemo}>
          Reset demo data
        </button>
        <div className="out">Signed in · demo</div>
      </aside>
      <main className="hq-main">
        <Outlet />
      </main>
    </div>
  );
}
