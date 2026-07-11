import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import Scallop from "../components/Scallop.jsx";
import EventCard from "../components/EventCard.jsx";
import { upcomingEvents } from "../lib/db.js";
import { hero, counter, cakeHelloKitty, cupcakesBloom, classGroup } from "../assets/index.js";

export default function Home() {
  const classes = upcomingEvents(3);

  return (
    <>
      <SiteHeader />

      {/* HERO */}
      <div className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="kicker">Home bakery · Lincolnshire, IL</p>
            <h1>
              Life is short.
              <br />
              <em>Make it sweet.</em>
            </h1>
            <p className="lede">
              Custom cakes and cupcakes baked from my home kitchen, and hands-on decorating classes
              where everyone — yes, everyone — leaves with something beautiful.
            </p>
            <div className="ctas">
              <Link className="btn" to="/cakes">Order a custom cake</Link>
              <Link className="btn line" to="/classes">Join a class</Link>
            </div>
            <p className="meta">Made to order with 2 weeks' notice · Serving Chicagoland's northern suburbs</p>
          </div>
          <div className="hero-photo">
            <div className="main">
              <img src={hero} alt="Annalise of Sweet B's holding a custom butterfly cake" />
            </div>
            <div className="tag">
              <b>Made by hand</b>
              Every cake is designed around your celebration — buttercream, fresh florals, a little gold leaf.
            </div>
          </div>
        </div>
      </div>

      <Scallop />

      {/* CLASSES */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <p className="kicker">Upcoming classes</p>
              <h2>Pick a night. I'll bring the buttercream.</h2>
              <p className="sub soft">
                Small, hands-on classes for adults and kids — every tool, every cupcake, every
                sprinkle provided. Sign up right here; seats are counted live.
              </p>
            </div>
            <Link className="btn line sm" to="/classes">See all classes</Link>
          </div>
          <div className="cards">
            {classes.map((ev) => (
              <EventCard key={ev.id} ev={ev} />
            ))}
          </div>
        </div>
      </section>

      {/* MENU */}
      <section className="menu-sec">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <p className="kicker">Custom cakes &amp; cupcakes</p>
              <h2>The menu board</h2>
              <p className="sub soft">
                Start with the basics, then make it yours — every cake is baked fresh and decorated
                by hand for your celebration.
              </p>
            </div>
          </div>
          <div className="menu">
            <div className="board">
              <h3>Cakes</h3>
              <Mi n="6&quot; round · 3 layers" s="serves 12–14" p="$70" />
              <Mi n="6&quot; round · 4 layers" s="serves 14–20" p="$85" />
              <Mi n="6&quot; heart · 3 layers" s="serves 12–14" p="$80" />
              <Mi n="9&quot; round · 3 layers" s="serves 20–30" p="$100" />
              <Mi n="Letter &amp; number cakes" s="serves 20+" p="from $100" />
              <p className="fine">
                Included flavors: vanilla, chocolate, funfetti. Specialty flavors +$10 · fillings
                +$15–30 · custom decoration from +$25.
              </p>
            </div>
            <div className="board">
              <h3>Cupcakes</h3>
              <Mi n="Custom cupcakes" s="min. one dozen per flavor" p="$45/dz" />
              <Mi n="Specialty decoration" s="themes, toppers, florals" p="+$15–25/dz" />
              <p className="fine" style={{ marginTop: 20 }}>
                Everything is baked to order in my licensed home kitchen under the Illinois Cottage
                Food Law — the way homemade should taste.
              </p>
            </div>
          </div>
          <div className="menu-cta">
            <Link className="btn" to="/cakes#quote">Request a quote</Link>
            <p className="note">Takes about 2 minutes — date, servings, flavors, and your inspiration.</p>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <p className="kicker">My work</p>
              <h2>No two are ever the same.</h2>
              <p className="sub soft">
                A few from the kitchen lately — every one designed around someone's celebration.
              </p>
            </div>
            <Link className="btn line sm" to="/cakes">See more</Link>
          </div>
          <div className="gal-grid">
            <Gal img={cakeHelloKitty} cap="Hello Kitty birthday cake" />
            <Gal img={hero} cap="Butterfly floral cake" />
            <Gal img={cupcakesBloom} cap="Buttercream bloom cupcakes" />
          </div>
        </div>
      </section>

      {/* STORY */}
      <section id="story">
        <div className="wrap story-grid">
          <div className="story-photo">
            <img src={counter} alt="Annalise at the Sweet B's counter" />
          </div>
          <div>
            <p className="kicker">Baking with heart</p>
            <h2>From a corporate job to a kitchen full of sprinkles.</h2>
            <p style={{ marginTop: 18 }}>
              When my son was born in 2020, watching him grow reminded me how fleeting life is — and
              how important it is to spend it doing what you love. So in 2021 I took the leap and left
              my corporate job to bake full time.
            </p>
            <p>
              What started with hot cocoa bombs grew into cake pops, then custom cakes and cupcakes —
              and now decorating classes across Lake County, where I get to watch someone pipe their
              first buttercream rose every single week.
            </p>
            <p className="story">
              <q>Because life is short… so why not make it sweet?</q>
            </p>
            <p style={{ marginTop: 6 }}>
              <b>— Annalise</b>, owner &amp; baker, 5+ years self-taught
            </p>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="quote-sec" style={{ paddingTop: 10 }}>
        <div className="wrap">
          <p className="kicker">From a recent class</p>
          <blockquote>"She's a fantastic teacher who made it fun and easy — even for beginners."</blockquote>
          <p className="who">
            Class attendee · as featured on{" "}
            <a href="https://mykidlist.com/sweet-bs-bake-shop/" target="_blank" rel="noopener">Kidlist</a>
          </p>
        </div>
      </section>

      {/* PARTIES */}
      <section className="party">
        <div className="wrap party-grid">
          <div>
            <p className="kicker">Private decorating parties</p>
            <h2>I come to you — cupcakes, tools, sprinkles, and all.</h2>
            <p style={{ marginTop: 16, color: "#E8DCCF" }}>
              Birthdays, showers, team nights, or a "grown-up and me" afternoon with the littles. I
              bring everything, you bring the people, and cleanup is barely a thing.
            </p>
            <div className="facts">
              <div className="fact"><b>$40–60</b><span>per person</span></div>
              <div className="fact"><b>Up to 16</b><span>guests</span></div>
              <div className="fact"><b>Ages 2+</b><span>grown-up &amp; me</span></div>
            </div>
            <Link className="btn gold" to="/parties">Plan a private party</Link>
          </div>
          <div>
            <img src={classGroup} alt="A private cupcake decorating party" />
          </div>
        </div>
      </section>

      {/* RECIPE CAPTURE */}
      <section className="recipe">
        <div className="wrap recipe-grid">
          <div>
            <p className="kicker">A gift from my kitchen</p>
            <h2>Get my buttercream recipe — the one from class.</h2>
            <p style={{ marginTop: 14 }}>
              It's the exact recipe I use on every cake and teach in every class. I'll send it over,
              plus a note when new class dates open up.
            </p>
            <RecipeForm />
            <p className="fine">No spam, ever — just the recipe and first dibs on class seats.</p>
          </div>
          <div className="recipe-card" aria-hidden="true">
            <span className="rc-k">From Sweet B's kitchen</span>
            <h3>Signature Vanilla Buttercream</h3>
            <ul>
              <li>The butter temperature trick nobody tells you</li>
              <li>Why I whip it longer than the box says</li>
              <li>The one-ingredient fix for grainy frosting</li>
            </ul>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}

function Mi({ n, s, p }) {
  return (
    <div className="mi">
      <div className="n">
        <b dangerouslySetInnerHTML={{ __html: n }} />
        <span dangerouslySetInnerHTML={{ __html: s }} />
      </div>
      <div className="p">{p}</div>
    </div>
  );
}

function Gal({ img, cap }) {
  return (
    <Link className="gal" to="/cakes">
      <img src={img} alt={cap} loading="lazy" />
      <span className="cap">{cap}</span>
    </Link>
  );
}

import { useState } from "react";
function RecipeForm() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  return ok ? (
    <div className="notice" style={{ marginTop: 22 }}>
      On its way! Check your inbox for the recipe.
    </div>
  ) : (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (email.includes("@")) setOk(true);
      }}
    >
      <input
        type="email"
        required
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email address"
      />
      <button className="btn" type="submit">Send the recipe</button>
    </form>
  );
}
