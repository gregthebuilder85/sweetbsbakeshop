import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home.jsx";
import Classes from "./pages/Classes.jsx";
import EventDetail from "./pages/EventDetail.jsx";
import Cakes from "./pages/Cakes.jsx";
import Parties from "./pages/Parties.jsx";
import About from "./pages/About.jsx";
import HQLayout from "./hq/HQLayout.jsx";
import Dashboard from "./hq/Dashboard.jsx";
import EventsAdmin from "./hq/EventsAdmin.jsx";
import QuotesAdmin from "./hq/QuotesAdmin.jsx";
import ContentStudio from "./hq/ContentStudio.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* public site */}
        <Route path="/" element={<Home />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/classes/:slug" element={<EventDetail />} />
        <Route path="/cakes" element={<Cakes />} />
        <Route path="/parties" element={<Parties />} />
        <Route path="/about" element={<About />} />

        {/* owner dashboard */}
        <Route path="/hq" element={<HQLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="events" element={<EventsAdmin />} />
          <Route path="quotes" element={<QuotesAdmin />} />
          <Route path="content" element={<ContentStudio />} />
        </Route>

        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}
