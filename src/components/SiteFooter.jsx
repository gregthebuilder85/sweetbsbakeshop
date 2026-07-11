import { Link } from "react-router-dom";

export default function SiteFooter() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="fname">Sweet B's Bake Shop</div>
            <p className="soft">
              Custom cakes, cupcakes, and decorating classes.
              <br />
              Baked with heart in Lincolnshire, IL — serving Chicagoland's northern suburbs.
            </p>
          </div>
          <div>
            <h4>Visit</h4>
            <ul>
              <li><Link to="/cakes">Custom cakes &amp; cupcakes</Link></li>
              <li><Link to="/classes">Decorating classes</Link></li>
              <li><Link to="/parties">Private parties</Link></li>
              <li><Link to="/about">My story</Link></li>
            </ul>
          </div>
          <div>
            <h4>Say hello</h4>
            <ul>
              <li><a href="mailto:sweetbsbakeshopil@gmail.com">sweetbsbakeshopil@gmail.com</a></li>
              <li><a href="tel:+12245234199">(224) 523-4199</a></li>
              <li><a href="https://www.instagram.com/sweetbsbakeshop" target="_blank" rel="noopener">Instagram</a></li>
              <li><a href="https://www.facebook.com/sweetbsbakeshopIL" target="_blank" rel="noopener">Facebook</a></li>
            </ul>
          </div>
        </div>
        <div className="legal">
          <span>© 2026 Sweet B's Bake Shop LLC. All rights reserved.</span>
          <span>Baked in a home kitchen under the Illinois Cottage Food Law.</span>
        </div>
      </div>
    </footer>
  );
}
