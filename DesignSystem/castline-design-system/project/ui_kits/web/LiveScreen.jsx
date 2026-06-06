// Castline UI Kit — Live tournament screen
const { useState: useStateLive, useEffect: useEffectLive, useRef: useRefLive } = React;

// today's swing vs. the previous standing — drives the +/- delta column
const LIVE_DELTAS = {
  "austin-cranford": 1.92, "dana-whitfield": 0.41, "marcus-vinroe": -0.18,
  "priya-nandakumar": 0.62, "wyatt-boudreaux": 0.05, "cole-rasmussen": -0.40,
  "harlan-pope": 0.21, "sofia-marchetti": -1.10,
};

function fmtClock(d) {
  return d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
function ordSuffix(n) {
  const v = n % 100;
  if (v >= 11 && v <= 13) return "th";
  return ["th", "st", "nd", "rd"][n % 10] || "th";
}

function LiveScreen({ onOpenAngler }) {
  const t = window.TOURNAMENT;
  const [board, setBoard] = useStateLive(window.LIVE_BOARD);
  const [filter, setFilter] = useStateLive("top");          // top | follows | all
  const [activeId, setActiveId] = useStateLive(window.LIVE_BOARD[0].id);
  const [clock, setClock] = useStateLive(() => new Date());
  const scrollerRef = useRefLive(null);

  // ticking wall clock for the header + video timecode
  useEffectLive(() => {
    const id = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // gentle "live" jitter so weights re-rank in real time
  useEffectLive(() => {
    const id = setInterval(() => {
      setBoard(b => {
        const next = b.map(r => ({ ...r, today: Math.max(0, r.today + (r.live ? Math.random() * 0.05 : 0)) }));
        return next.sort((x, y) => y.today - x.today);
      });
    }, 2400);
    return () => clearInterval(id);
  }, []);

  // overall standing → id-keyed rank map (kept correct even when filtering)
  const rankMap = {};
  board.forEach((r, i) => { rankMap[r.id] = i + 1; });

  const active = board.find(r => r.id === activeId) || board[0];
  const liveRows = board.filter(r => r.live);
  const shown = filter === "follows" ? board.filter(r => r.follow) : board;

  const scrollBy = (dx) => scrollerRef.current && scrollerRef.current.scrollBy({ left: dx, behavior: "smooth" });

  const segs = [
    { key: "top", label: "Top 10" },
    { key: "follows", label: "Following" },
    { key: "all", label: "All 62" },
  ];

  return (
    <div className="screen">
      {/* ---- COMPACT TOURNAMENT BAR ---- */}
      <section className="livebar" data-screen-label="Live · tournament bar">
        <div className="livebar-inner">
          <div className="livebar-id">
            <span className="cl-badge-live">Live</span>
            <h1 className="livebar-title">{t.short}</h1>
            <span className="livebar-day">{t.day}</span>
          </div>
          <div className="livebar-meta">
            <Icon name="map-pin" size={14} /> <b>{t.lake}</b>
            <span className="sep">·</span> {t.boats} boats
            <span className="sep">·</span> Cut <b>{t.cut.toFixed(2)} lb</b>
          </div>
          <div className="livebar-right">
            <span className="livebar-wx"><Icon name="sun" size={16} /> <b>{t.weather.temp}°</b> {t.weather.cond}</span>
            <span className="livebar-wx"><Icon name="wind" size={15} /> {t.weather.wind}</span>
            <span className="livebar-clock">{fmtClock(clock)}<small>{t.tz}</small></span>
          </div>
        </div>
      </section>

      {/* ---- STAGE ---- */}
      <section className="band band--sand livestage">
        <div className="wrap livestage-grid">

          {/* LEFT — feature video + multi-cam scroller */}
          <div>
            <VideoPlayer
              flat
              image={active.img}
              boat={active.boat}
              live={active.live}
              views={active.viewers}
              timestamp={fmtClock(clock)}
            />

            {/* watched-boat callout */}
            <div className="tbar live-callout" style={{ gap: 20 }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 15, minWidth: 0 }}>
                <div className="board-disc" style={{ width: 52, height: 52, fontSize: 17, flex: "none",
                  background: active.disc, color: active.discText }}>{active.initials}</div>
                <div style={{ minWidth: 0 }}>
                  <div className="eyebrow" style={{ color: "var(--paper)", fontSize: 10.5, opacity: .9 }}>
                    Watching · Boat {active.boat} · {active.state}
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26,
                    color: "var(--paper)", lineHeight: 1.05, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {active.name}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 32, color: "var(--paper)", lineHeight: 1 }}>
                  {active.today.toFixed(2)}
                </div>
                <div className="eyebrow" style={{ color: "var(--paper)", fontSize: 10, opacity: .9 }}>LB Today</div>
              </div>
              <div style={{ background: "var(--ink)", borderRadius: "var(--r-md)", padding: "10px 16px", textAlign: "center", flex: "none" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "var(--paper)", lineHeight: 1 }}>
                  {rankMap[active.id]}<span style={{ fontSize: 13, verticalAlign: "super" }}>{ordSuffix(rankMap[active.id])}</span>
                </div>
                <div className="eyebrow" style={{ color: "var(--seafoam)", fontSize: 9, marginTop: 3 }}>Position</div>
              </div>
            </div>

            {/* multi-cam scroller */}
            <div className="mcam">
              <div className="mcam-head">
                <span className="mcam-label">
                  <span className="board-live-dot" style={{ marginLeft: 0 }} />
                  Multi-cam · <span className="ct">{liveRows.length} live boats</span>
                </span>
                <div className="mcam-nav">
                  <button className="mcam-arrow" aria-label="Scroll left" onClick={() => scrollBy(-460)}><Icon name="chevron-left" size={18} /></button>
                  <button className="mcam-arrow" aria-label="Scroll right" onClick={() => scrollBy(460)}><Icon name="chevron-right" size={18} /></button>
                </div>
              </div>
              <div className="vcam-row" ref={scrollerRef}>
                {liveRows.map(r => (
                  <VCam key={r.id} row={r} rank={rankMap[r.id]} active={r.id === activeId} onClick={() => setActiveId(r.id)} />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — live board */}
          <div>
            <div className="board-panel-title">
              <h2 className="section-title" style={{ fontSize: 30 }}>Live board</h2>
              <span className="board-panel-eyebrow">
                <span className="board-live-dot" style={{ marginLeft: 0 }} /> Updating
              </span>
            </div>

            <div className="seg" role="tablist">
              {segs.map(s => (
                <button key={s.key} className={"seg-btn" + (filter === s.key ? " is-active" : "")}
                  onClick={() => setFilter(s.key)}>{s.label}</button>
              ))}
            </div>

            <Leaderboard rows={shown} onOpen={onOpenAngler} activeId={activeId} deltas={LIVE_DELTAS} rankMap={rankMap} />

            <a className="cl-btn cl-btn--ghost board-all" onClick={() => onOpenAngler && onOpenAngler(board[0].id)}>
              View all {t.boats} boats
              <Icon name="arrow-right" size={17} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
window.LiveScreen = LiveScreen;
