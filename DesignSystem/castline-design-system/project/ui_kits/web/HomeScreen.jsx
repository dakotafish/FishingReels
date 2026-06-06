// Castline UI Kit — Home screen (recreation of the Figma homepage)
const { useState: useStateHome } = React;

function HomeScreen({ onNav, onOpenAngler }) {
  const featured = window.ANGLERS.slice(0, 6);
  const t = window.TOURNAMENT;
  return (
    <div className="screen">
      {/* HERO */}
      <section className="hero">
        <div className="wrap hero-inner">
          <div>
            <h1 className="hero-title">Every Angler. Every Cast. Every Story.</h1>
            <p className="hero-lede">For too long, competitive fishing has only shown fans a fraction of the action. Castline changes that — connecting viewers to every angler, every moment, and every story unfolding on the water in real time.</p>
          </div>
          <img className="hero-emblem" src="../../assets/emblem-blue.png" alt="Castline Fishing · Cast On" />
        </div>

        {/* TOURNAMENT BAR */}
        <div className="wrap tbar-wrap">
          <div className="tbar">
            <h2 className="tbar-title">Primetime Bass<br />Fishing Tournament</h2>
            <span className="tbar-meta">{t.day}</span>
            <span className="tbar-meta">{t.boats} Boats</span>
            <button className="cl-btn cl-btn--ghost" onClick={() => onNav("live")}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--flame)", animation: "cl-pulse 1.4s ease-in-out infinite" }} /> Watch Tournament
            </button>
          </div>
        </div>
      </section>

      {/* FEATURED ANGLERS */}
      <section className="band band--sky">
        <div className="wrap">
          <div className="section-head">
            <h2 className="section-title">Featured Anglers</h2>
            <span className="section-link" onClick={() => onNav("anglers")}>View all 62 anglers</span>
          </div>
          <div className="cards-grid only-desktop">
            {featured.map(a => <AnglerCard key={a.id} angler={a} onOpen={onOpenAngler} />)}
          </div>
          <div className="alist only-mobile">
            {featured.map(a => <AnglerRow key={a.id} angler={a} onOpen={onOpenAngler} />)}
          </div>
        </div>
      </section>

      {/* SEE EVERY CAST FEATURE */}
      <section className="feature">
        <div className="feature-text">
          <h2 className="feature-title">See every cast</h2>
          <p className="feature-copy">For too long, competitive fishing has only shown fans a fraction of the action. Castline changes that, connecting viewers to every angler, every moment, and every story unfolding on the water in real time.</p>
          <div>
            <button className="cl-btn cl-btn--outline" onClick={() => onNav("about")}>About</button>
          </div>
        </div>
        <div className="feature-img" style={{ backgroundImage: "url('../../assets/stock-flyfishing.jpg')" }} />
      </section>
    </div>
  );
}
window.HomeScreen = HomeScreen;
