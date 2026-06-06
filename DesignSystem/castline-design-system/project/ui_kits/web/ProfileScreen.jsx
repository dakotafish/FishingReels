// Castline UI Kit — Angler profile screen
function ProfileScreen({ anglerId, onOpenAngler, onNav }) {
  const a = window.ANGLERS.find(x => x.id === anglerId) || window.ANGLERS[0];
  const moments = [
    { cap: "Day 2 · Morning flurry", img: "../../assets/stock-boats.jpg" },
    { cap: "5.2 lb kicker", img: "../../assets/stock-openwater.png" },
    { cap: "Locking down the bank", img: "../../assets/stock-flyfishing.jpg" },
  ];
  const discColor = a.discText;

  return (
    <div className="screen">
      {/* COVER */}
      <div className="pcover" style={{ backgroundImage: `url('${a.photo}')` }} />

      <div className="wrap">
        <div className="phead-card">
          <div className="pavatar" style={{ background: a.accent }}>
            <div className="pavatar-disc" style={{ background: a.disc, color: discColor }}>{a.initials}</div>
          </div>
          <div style={{ paddingBottom: 10, flex: 1 }}>
            <h1 className="pname">{a.first} {a.last}</h1>
            <div className="ploc"><Icon name="map-pin" size={16} /> {a.state}</div>
          </div>
          <div style={{ paddingBottom: 14, display: "flex", gap: 12 }}>
            <button className="cl-btn"><Icon name="plus" size={16} /> Follow</button>
            <button className="cl-btn cl-btn--ghost"><Icon name="share-2" size={16} /> Share</button>
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          <span className="acard-tag" style={{ fontSize: 26 }}>{a.tag}</span>
        </div>

        {/* STATS */}
        <div className="stat-row">
          <div className="stat-box"><b>{a.seasonLb.toFixed(2)}</b><span>LB · Season Total</span></div>
          <div className="stat-box"><b>#{a.rank}</b><span>Season Rank</span></div>
          <div className="stat-box"><b>{a.events}</b><span>Events Fished</span></div>
          <div className="stat-box"><b>{a.bigBag.toFixed(2)}</b><span>LB · Biggest Bag</span></div>
        </div>
      </div>

      {/* RECENT MOMENTS — video thumbnails sit flush, no hard shadow */}
      <section className="band band--sand" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="section-head" style={{ marginBottom: 28 }}>
            <h2 className="section-title" style={{ fontSize: 40 }}>Recent casts</h2>
            <span className="section-link">All clips</span>
          </div>
          <div className="moment-grid">
            {moments.map((m, i) => (
              <VideoPlayer key={i} image={m.img} caption={m.cap} live={false} />
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="band band--sky" style={{ paddingTop: 56, paddingBottom: 56 }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 48, alignItems: "start" }}>
          <h2 className="section-title">About<br />{a.first}</h2>
          <div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 19, lineHeight: 1.6, color: "var(--ink)", margin: "6px 0 0", maxWidth: 600 }}>{a.bio}</p>
            <div style={{ display: "flex", gap: 12, marginTop: 26, flexWrap: "wrap" }}>
              {a.disciplines.map(d => (
                <span key={d} className="eyebrow" style={{ fontSize: 12, padding: "9px 16px", borderRadius: 999, border: "2px solid var(--ink)", color: "var(--ink)" }}>{d}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
window.ProfileScreen = ProfileScreen;
