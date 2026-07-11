import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import QuoteForm from "../components/QuoteForm.jsx";
import { cakeHelloKitty, hero, cupcakesBloom, classGroup, counter } from "../assets/index.js";

export default function Cakes() {
  const loc = useLocation();
  useEffect(() => {
    if (loc.hash === "#quote") {
      const el = document.getElementById("quote");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [loc.hash]);

  return (
    <>
      <SiteHeader />
      <section>
        <div className="wrap">
          <p className="kicker">Custom cakes &amp; cupcakes</p>
          <h2>Truly custom, one-of-a-kind, and made to taste homemade — because it is.</h2>
          <p className="sub soft" style={{ maxWidth: "60ch", marginTop: 12 }}>
            Every cake is baked fresh and decorated by hand for your theme, colors, and guest count.
            Here's where pricing starts; the quote form below turns your idea into a real number.
          </p>
        </div>
      </section>

      <section className="menu-sec" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="menu">
            <div className="board">
              <h3>Cakes</h3>
              <Mi n="6&quot; round · 3 layers" s="serves 12–14" p="$70" />
              <Mi n="6&quot; round · 4 layers" s="serves 14–20" p="$85" />
              <Mi n="6&quot; heart · 3 layers" s="serves 12–14" p="$80" />
              <Mi n="9&quot; round · 3 layers" s="serves 20–30" p="$100" />
              <Mi n="9&quot; heart · 3 layers" s="serves 20–30" p="$110" />
              <Mi n="Letter &amp; number cakes" s="serves 20+" p="from $100" />
              <p className="fine">
                Included: vanilla, chocolate, funfetti · vanilla, chocolate, lemon, or cream cheese
                buttercream. Specialty flavors +$10 · fillings +$15–30 · custom decoration from +$25.
              </p>
            </div>
            <div className="board">
              <h3>Cupcakes</h3>
              <Mi n="Custom cupcakes" s="chocolate, vanilla, funfetti, lemon · min. one dozen per flavor" p="$45/dz" />
              <Mi n="Specialty decoration" s="themes, toppers, florals, logos" p="+$15–25/dz" />
              <p className="fine" style={{ marginTop: 20 }}>
                Everything is baked to order in my licensed home kitchen under the Illinois Cottage
                Food Law.
              </p>
              <p className="fine">
                <b style={{ color: "var(--berry)" }}>Planning something?</b> Custom work needs a
                minimum of 2 weeks' notice. Tell me your date, guest count, and theme below and I'll
                send a real quote — usually within a day.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <p className="kicker">Gallery</p>
              <h2>A few from the kitchen.</h2>
            </div>
          </div>
          <div className="gal-grid">
            <Gal img={cakeHelloKitty} cap="Hello Kitty birthday cake" />
            <Gal img={hero} cap="Butterfly floral cake" />
            <Gal img={cupcakesBloom} cap="Buttercream bloom cupcakes" />
            <Gal img={classGroup} cap="Puppy-face cupcakes" />
            <Gal img={counter} cap="Cupcake boxes" />
          </div>
        </div>
      </section>

      <section id="quote" className="menu-sec" style={{ paddingTop: 60 }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          <div className="sec-head">
            <div>
              <p className="kicker">Get a custom quote</p>
              <h2>Tell me about your celebration.</h2>
              <p className="sub soft">Two minutes now saves a back-and-forth later. I read every request myself.</p>
            </div>
          </div>
          <QuoteForm defaultKind="cake" />
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
    <div className="gal">
      <img src={img} alt={cap} loading="lazy" />
      <span className="cap">{cap}</span>
    </div>
  );
}
