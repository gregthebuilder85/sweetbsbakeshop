import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import { counter, hero } from "../assets/index.js";

export default function About() {
  return (
    <>
      <SiteHeader />
      <section>
        <div className="wrap story-grid">
          <div className="story-photo">
            <img src={counter} alt="Annalise at the Sweet B's counter" />
          </div>
          <div>
            <p className="kicker">My story</p>
            <h2>Hi, I'm Annalise.</h2>
            <p style={{ marginTop: 18 }}>
              I'm a proud mom, a passionate baker, and the creator of Sweet B's Bake Shop here in
              Lincolnshire, IL. When my son was born in 2020, everything changed. Watching him grow
              so quickly reminded me how fleeting life is — and how important it is to spend it doing
              what you truly love.
            </p>
            <p>
              By February 2021, I took a leap of faith and left my corporate job to follow a dream I'd
              carried for as long as I can remember: sharing my love of baking with others. What
              started with hot cocoa bombs grew into cake pops, and now into custom cakes and cupcakes
              for birthdays, weddings, baby showers, and everything in between.
            </p>
            <p>
              In Fall 2025 I started teaching cupcake decorating classes, and I've been blessed by the
              excitement the local community has shown. Every dessert is made with care, creativity,
              and a whole lot of heart — because life is short, so why not make it sweet?
            </p>
          </div>
        </div>
      </section>

      <section className="menu-sec">
        <div className="wrap" style={{ textAlign: "center" }}>
          <p className="kicker" style={{ justifyContent: "center" }}>Where to find me</p>
          <h2 style={{ marginBottom: 14 }}>Baking from my home kitchen, teaching all over Lake County.</h2>
          <p className="soft" style={{ maxWidth: "56ch", margin: "0 auto 22px" }}>
            I bake under the Illinois Cottage Food Law from my home in Lincolnshire, and teach classes
            at local partners including Elawa Farm, Le Laurelli, and The Joyful Gourmet — plus private
            parties anywhere you gather your people.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link className="btn" to="/cakes#quote">Order a cake</Link>
            <Link className="btn line" to="/classes">Join a class</Link>
          </div>
        </div>
      </section>

      <section className="quote-sec">
        <div className="wrap">
          <img
            src={hero}
            alt="Annalise holding a custom cake"
            style={{ width: 260, maxWidth: "100%", aspectRatio: "13 / 16", objectFit: "cover", borderRadius: 18, display: "block", margin: "0 auto 26px", boxShadow: "0 20px 50px -28px rgba(59,42,36,.5)" }}
          />
          <blockquote>"I believe in celebrating the sweet moments — big or small."</blockquote>
          <p className="who">Annalise · Sweet B's Bake Shop</p>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
