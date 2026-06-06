// Castline UI Kit — shared components
// Loaded as Babel script. Exports to window for use by screens.

const { useState, useEffect, useRef } = React;

// ---- Icon (Lucide via CDN) ----
function Icon({ name, size = 20, className = "", style = {} }) {
  return (
    <span className={"ic " + className} style={{ fontSize: size, ...style }}>
      <i data-lucide={name}></i>
    </span>
  );
}

// ---- Racing-stripe rule ----
function Stripe() { return <div className="stripe" />; }

// ---- Header ----
function Header({ active, onNav }) {
  const [menuOpen, setMenuOpen] = useState(false);
  // lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);
  const go = (key) => { setMenuOpen(false); onNav(key); };
  const link = (key, label) => (
    <button className={"hdr-link" + (active === key ? " is-active" : "")} onClick={() => onNav(key)}>{label}</button>
  );
  // drawer link — same Epilogue all-caps label vocabulary as the web nav, sized up for touch
  const dlink = (key, label, icon, badge) => (
    <button className={"hdr-drawer-link" + (active === key ? " is-active" : "")} onClick={() => go(key)}>
      <Icon name={icon} size={20} />{label}
      {badge && <span className="cl-badge-live hdr-drawer-badge">{badge}</span>}
    </button>
  );
  return (
    <header className="hdr">
      <div className="wrap hdr-inner">
        <img className="hdr-logo" src="../../assets/logo-blue.png" alt="Castline" onClick={() => onNav("home")} />
        <nav className="hdr-nav">
          {link("tournaments", "Tournaments")}
          {link("anglers", "Anglers")}
          {link("expos", "Expos")}
          {link("about", "About")}
          <span className="hdr-divider" />
          <button className="hdr-link" onClick={() => onNav("signin")}>Sign In</button>
          <span className="cl-badge-live hdr-live" onClick={() => onNav("live")} style={{ cursor: "pointer" }}>LIVE · DAY 2</span>
          <button className="hdr-icon" aria-label="Search"><Icon name="search" size={19} /></button>
        </nav>
        {/* mobile-only: pinned LIVE badge + hamburger */}
        <div className="hdr-mobile">
          <span className="cl-badge-live hdr-live" onClick={() => onNav("live")} style={{ cursor: "pointer" }}>LIVE · DAY 2</span>
          <button className="hdr-burger" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Icon name="menu" size={22} /></button>
        </div>
      </div>
      <Stripe />
      {menuOpen && (
        <div className="hdr-drawer" role="dialog" aria-modal="true">
          <div className="hdr-drawer-bar">
            <img className="hdr-drawer-logo" src="../../assets/logo-blue.png" alt="Castline" onClick={() => go("home")} />
            <button className="hdr-drawer-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}><Icon name="menu" size={22} /></button>
          </div>
          <nav className="hdr-drawer-links">
            {dlink("tournaments", "Tournaments", "trophy")}
            {dlink("anglers", "Anglers", "users")}
            {dlink("expos", "Expos", "store")}
            {dlink("live", "Live", "radio", "On Air")}
            {dlink("about", "About", "info")}
            {dlink("signin", "Sign In", "log-in")}
          </nav>
          <div className="hdr-drawer-foot">
            <button className="hdr-drawer-search" onClick={() => go("anglers")}><Icon name="search" size={18} /> Search anglers, events…</button>
          </div>
        </div>
      )}
    </header>
  );
}

// ---- Footer ----
function Footer({ onNav }) {
  return (
    <footer className="ftr">
      <div className="wrap ftr-inner">
        <img className="ftr-logo" src="../../assets/logo-blue.png" alt="Castline" />
        <span className="ftr-copy">2026 Castline Media</span>
        <span className="ftr-link">Terms</span>
        <span className="ftr-link">Privacy</span>
        <div className="ftr-links">
          <span className="ftr-link" onClick={() => onNav("tournaments")}>Tournaments</span>
          <span className="ftr-link" onClick={() => onNav("anglers")}>Anglers</span>
          <span className="ftr-link" onClick={() => onNav("expos")}>Expos</span>
          <span className="ftr-link" onClick={() => onNav("about")}>About</span>
        </div>
      </div>
      <Stripe />
    </footer>
  );
}

// ---- Angler avatar (disc on accent square) ----
function AnglerAvatar({ angler, square = 96, disc = 66, fontSize = 24 }) {
  return (
    <div className="acard-avatar" style={{ width: square, height: square, background: angler.accent }}>
      <div className="acard-disc" style={{ width: disc, height: disc, background: angler.disc, fontSize,
        color: angler.discText }}>
        {angler.initials}
      </div>
    </div>
  );
}

// ---- Angler card ----
function AnglerCard({ angler, onOpen }) {
  return (
    <article className="acard" onClick={() => onOpen(angler.id)}>
      <div className="acard-top">
        <AnglerAvatar angler={angler} />
        <div className="acard-stat">
          <b>{angler.seasonLb.toFixed(2)}</b>
          <span>LB · SEASON</span>
        </div>
      </div>
      <h3 className="acard-name">{angler.first} {angler.last}</h3>
      <div className="acard-loc">{angler.state}</div>
      <div className="acard-foot">
        <span className="acard-tag">{angler.tag}</span>
        <button className="acard-profile" onClick={(e) => { e.stopPropagation(); onOpen(angler.id); }}>PROFILE</button>
      </div>
    </article>
  );
}

// ---- Angler list row (list-view variant of the card) ----
function AnglerRow({ angler, onOpen }) {
  return (
    <div className="arow" onClick={() => onOpen(angler.id)}>
      <span className="arow-rank">{angler.rank}</span>
      <AnglerAvatar angler={angler} square={56} disc={38} fontSize={15} />
      <div className="arow-id">
        <h3 className="arow-name">{angler.first} {angler.last}</h3>
        <div className="arow-meta">
          <span className="arow-loc">{angler.state}</span>
          <span className="arow-tag arow-tag-m">{angler.tag}</span>
        </div>
      </div>
      <span className="arow-tag">{angler.tag}</span>
      <div className="arow-stat">
        <b>{angler.seasonLb.toFixed(2)}</b>
        <span>LB · Season</span>
      </div>
      <button className="acard-profile arow-profile" onClick={(e) => { e.stopPropagation(); onOpen(angler.id); }}>PROFILE</button>
    </div>
  );
}

// ---- viewer-count formatter (12483 -> "12.5k") ----
function fmtViews(n) {
  return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "k" : String(n);
}

// ---- Video player (flush — NO hard offset shadow, per brand rule) ----
// flat=true  -> squared corners (standard rectangular video)
// timestamp  -> live timecode shown in the control bar
// boat       -> boat-number chip beside the LIVE badge
function VideoPlayer({ image, caption = "PRIMETIME BASS · LIVE FEED", live = true, views, flat = false, timestamp, boat }) {
  return (
    <div className={"player" + (flat ? " player--flat" : "")}>
      <img className="player-img" src={image} alt="" />
      <div className="player-scrim" />
      <div style={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 10, alignItems: "center" }}>
        {live && <span className="cl-badge-live">LIVE</span>}
        {boat && <span className="player-boat">Boat {boat}</span>}
      </div>
      {views != null && (
        <div className="player-views"><Icon name="eye" size={15} /> {views.toLocaleString()} watching</div>
      )}
      <button className="player-play" aria-label="Play"><Icon name="play" size={32} /></button>
      <div className="player-bar">
        <button className="player-iconbtn" aria-label="Mute"><Icon name="volume-2" size={18} /></button>
        <div className="player-track"><i /></div>
        {timestamp
          ? <span className="player-time">{timestamp}<span className="lv">LIVE</span></span>
          : <span className="player-caption">{caption}</span>}
        <button className="player-iconbtn" aria-label="Fullscreen"><Icon name="maximize" size={18} /></button>
      </div>
    </div>
  );
}

// ---- Multi-cam tile (live boat thumbnail in the scroller) ----
function VCam({ row, rank, active, onClick }) {
  const shortName = row.name.split(" ").slice(-1)[0];
  return (
    <div className={"vcam" + (active ? " is-active" : "")} onClick={onClick}>
      <div className="vcam-thumb">
        <img src={row.img} alt="" />
        <div className="vcam-scrim" />
        {row.live && <span className="cl-badge-live vcam-live">LIVE</span>}
        <span className="vcam-views"><Icon name="eye" size={13} /> {fmtViews(row.viewers)}</span>
      </div>
      <div className="vcam-meta">
        <span className="vcam-rank">{rank}</span>
        <span className="vcam-name">{shortName}</span>
        <span className="vcam-wt">{row.today.toFixed(2)}</span>
      </div>
    </div>
  );
}

// ---- Live leaderboard ----
function Leaderboard({ rows, onOpen, activeId, deltas, rankMap }) {
  const showDelta = !!deltas;
  return (
    <div className="board">
      <div className={"board-head" + (showDelta ? " has-delta" : "")}>
        <span>Rank</span><span>Angler</span>
        {!showDelta && <span>Fish</span>}
        <span style={{ textAlign: "right" }}>Today</span>
      </div>
      {rows.map((r, i) => {
        const rank = rankMap ? rankMap[r.id] : i + 1;
        return (
        <div className={"board-row" + (showDelta ? " has-delta" : "") + (r.id === activeId ? " is-watching" : "")}
          key={r.id} onClick={() => onOpen && onOpen(r.id)}>
          <span className={"board-rank" + (rank === 1 ? " top" : "")}>{rank}</span>
          <div className="board-angler">
            <div className="board-disc" style={{ background: r.disc, color: r.discText }}>{r.initials}</div>
            <div className="board-name">
              {r.name}
              <small>{r.fish != null && <span className="board-fish-m">{r.fish}/5 · </span>}{r.boat ? "Boat " + r.boat + " · " : ""}{r.state}{r.live && <span className="board-live-dot" />}</small>
            </div>
          </div>
          {!showDelta && <span className="board-fish">{r.fish}/5</span>}
          {showDelta ? (
            <div className="board-wt-wrap">
              <span className="board-wt">{r.today.toFixed(2)}</span>
              {deltas[r.id] != null && (
                <div className={"board-delta " + (deltas[r.id] >= 0 ? "up" : "down")}>
                  {deltas[r.id] >= 0 ? "+" : ""}{deltas[r.id].toFixed(2)}
                </div>
              )}
            </div>
          ) : (
            <span className="board-wt">{r.today.toFixed(2)}</span>
          )}
        </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { Icon, Stripe, Header, Footer, AnglerAvatar, AnglerCard, AnglerRow, VideoPlayer, VCam, Leaderboard, fmtViews });
