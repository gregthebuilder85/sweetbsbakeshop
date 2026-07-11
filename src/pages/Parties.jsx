import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import QuoteForm from "../components/QuoteForm.jsx";
import { classGroup, classPiping } from "../assets/index.js";

export default function Parties() {
  return (
    <>
      <SiteHeader />

      <section className="party" style={{ borderRadius: 0 }}>
        <div className="wrap party-grid">
          <div>
            <p className="kicker">Private decorating parties</p>
            <h2>I bring the whole class to you.</h2>
            <p style={{ marginTop: 16, color: "#E8DCCF" }}>
              Birthdays, showers, team nights, girls' nights, or a "grown-up and me" afternoon with
              the littles. I bring the cupcakes, buttercream, tools, and sprinkles — you bring the
              people. Everyone learns a few real techniques, and cleanup is barely a thing.
            </p>
            <div className="facts">
              <div className="fact"><b>$40–60</b><span>per person</span></div>
              <div className="fact"><b>Up to 16</b><span>guests</span></div>
              <div className="fact"><b>Ages 2+</b><span>grown-up &amp; me</span></div>
            </div>
          </div>
          <div>
            <img src={classGroup} alt="A private cupcake decorating party in progress" />
          </div>
        </div>
      </section>

      <section>
        <div className="wrap split">
          <div>
            <p className="kicker">How it works</p>
            <h2 style={{ marginBottom: 18 }}>Three easy steps.</h2>
            <ul className="nice">
              <li><b>Tell me the details.</b> Date, headcount, ages, and the vibe you're after.</li>
              <li><b>I bring everything.</b> Cupcakes, frosting, tips, tools, and a plan for the group.</li>
              <li><b>Everyone decorates &amp; takes home.</b> Real techniques, big laughs, boxes of treats.</li>
            </ul>
            <img
              src={classPiping}
              alt="Decorating at a private class"
              style={{ borderRadius: 16, marginTop: 24, height: 300, width: "100%", objectFit: "cover" }}
            />
          </div>
          <div id="quote">
            <p className="kicker">Request a date</p>
            <h2 style={{ marginBottom: 18 }}>Let's plan yours.</h2>
            <QuoteForm defaultKind="party" compact />
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
