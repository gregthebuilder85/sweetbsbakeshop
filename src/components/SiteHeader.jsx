import { NavLink, Link } from "react-router-dom";
import { logo } from "../assets/index.js";

export default function SiteHeader() {
  return (
    <header className="mast">
      <div className="wrap nav">
        <Link to="/" className="brand" aria-label="Sweet B's Bake Shop — home">
          <img src={logo} alt="Sweet B's Bake Shop" />
        </Link>
        <nav className="nav-links" aria-label="Main">
          <NavLink to="/cakes">Custom Cakes</NavLink>
          <NavLink to="/classes">Classes</NavLink>
          <NavLink to="/parties">Private Parties</NavLink>
          <NavLink to="/about">My Story</NavLink>
        </nav>
        <Link className="btn sm" to="/cakes#quote">
          Get a quote
        </Link>
      </div>
    </header>
  );
}
