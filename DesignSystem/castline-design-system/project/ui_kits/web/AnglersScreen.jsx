// Castline UI Kit — Anglers list screen
const { useState: useStateAnglers } = React;

function AnglersScreen({ onOpenAngler }) {
  const [q, setQ] = useStateAnglers("");
  const [view, setView] = useStateAnglers(typeof window !== "undefined" && window.innerWidth <= 640 ? "list" : "grid");
  const all = window.ANGLERS;

  const filtered = all.filter(a =>
    !q || (a.first + " " + a.last + " " + a.state).toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="screen">
      <section className="phead">
        <div className="wrap phead-inner">
          <div className="eyebrow" style={{ color: "var(--flame)", fontSize: 14 }}>The Field · 2026 Season</div>
          <h1 className="phead-title">Anglers</h1>
          <div className="phead-sub">62 competitors · every angler, every cast, every story</div>

          <div className="filters">
            <div className="search-box" style={{ marginLeft: 0 }}>
              <Icon name="search" size={17} />
              <input placeholder="Search anglers or states" value={q} onChange={e => setQ(e.target.value)} />
            </div>
          </div>
        </div>
      </section>

      <section className="band band--sand">
        <div className="wrap">
          <div className="section-head" style={{ marginBottom: 26 }}>
            <span className="eyebrow" style={{ color: "var(--deep-blue)", fontSize: 13 }}>
              {filtered.length} {filtered.length === 1 ? "angler" : "anglers"}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <span className="eyebrow" style={{ color: "var(--ink)", fontSize: 13, display: "flex", gap: 8, alignItems: "center" }}>
                <Icon name="arrow-down-wide-narrow" size={16} /> Season Weight
              </span>
              <div className="view-toggle" role="group" aria-label="View mode">
                <button className={"view-btn" + (view === "grid" ? " is-active" : "")} onClick={() => setView("grid")} aria-label="Grid view" aria-pressed={view === "grid"}>
                  <Icon name="layout-grid" size={16} />
                </button>
                <button className={"view-btn" + (view === "list" ? " is-active" : "")} onClick={() => setView("list")} aria-label="List view" aria-pressed={view === "list"}>
                  <Icon name="list" size={16} />
                </button>
              </div>
            </div>
          </div>
          {filtered.length ? (
            view === "grid" ? (
              <div className="cards-grid">
                {filtered.map(a => <AnglerCard key={a.id} angler={a} onOpen={onOpenAngler} />)}
              </div>
            ) : (
              <div className="alist">
                <div className="alist-head">
                  <span>Rank</span>
                  <span></span>
                  <span>Angler</span>
                  <span>Discipline</span>
                  <span style={{ textAlign: "right" }}>Season</span>
                  <span></span>
                </div>
                {filtered.map(a => <AnglerRow key={a.id} angler={a} onOpen={onOpenAngler} />)}
              </div>
            )
          ) : (
            <div style={{ padding: "60px 0", textAlign: "center", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, color: "var(--ink)" }}>
              No anglers match — cast a wider line.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
window.AnglersScreen = AnglersScreen;
