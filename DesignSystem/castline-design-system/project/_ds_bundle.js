/* @ds-bundle: {"format":3,"namespace":"CastlineDesignSystem_b8ac29","components":[],"sourceHashes":{"mobile-options/design-canvas.jsx":"bd8746af6e58","ui_kits/web/AnglersScreen.jsx":"42ba85fd5a27","ui_kits/web/HomeScreen.jsx":"7354d9351660","ui_kits/web/LiveScreen.jsx":"c1df0b49d067","ui_kits/web/ProfileScreen.jsx":"fda41440b56f","ui_kits/web/app.jsx":"af9cc6be5f50","ui_kits/web/components.jsx":"5cb77c45c798","ui_kits/web/data.jsx":"b3226cdc9eda"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CastlineDesignSystem_b8ac29 = window.CastlineDesignSystem_b8ac29 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// mobile-options/design-canvas.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// DesignCanvas.jsx — Figma-ish design canvas wrapper
// Warm gray grid bg + Sections + Artboards + PostIt notes.
// Exports (to window): DesignCanvas, DCSection, DCArtboard, DCPostIt.
// Artboards are reorderable (grip-drag), deletable, labels/titles are
// inline-editable, and any artboard can be opened in a fullscreen focus
// overlay (←/→/Esc). State persists to a .design-canvas.state.json sidecar
// via the host bridge. No assets, no deps.
//
// Usage:
//   <DesignCanvas>
//     <DCSection id="onboarding" title="Onboarding" subtitle="First-run variants">
//       <DCArtboard id="a" label="A · Dusk" width={260} height={480}>…</DCArtboard>
//       <DCArtboard id="b" label="B · Minimal" width={260} height={480}>…</DCArtboard>
//     </DCSection>
//   </DesignCanvas>
//
// Artboards are static design frames, not scroll regions — never use
// height: 100% + overflow: auto/scroll on inner elements; size each artboard
// to fit its content (explicit pixel height, or let it grow).
/* END USAGE */

const DC = {
  bg: '#f0eee9',
  grid: 'rgba(0,0,0,0.06)',
  label: 'rgba(60,50,40,0.7)',
  title: 'rgba(40,30,20,0.85)',
  subtitle: 'rgba(60,50,40,0.6)',
  postitBg: '#fef4a8',
  postitText: '#5a4a2a',
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
};

// One-time CSS injection (classes are dc-prefixed so they don't collide with
// the hosted design's own styles).
if (typeof document !== 'undefined' && !document.getElementById('dc-styles')) {
  const s = document.createElement('style');
  s.id = 'dc-styles';
  s.textContent = ['.dc-editable{cursor:text;outline:none;white-space:nowrap;border-radius:3px;padding:0 2px;margin:0 -2px}', '.dc-editable:focus{background:#fff;box-shadow:0 0 0 1.5px #c96442}', '[data-dc-slot]{transition:transform .18s cubic-bezier(.2,.7,.3,1)}', '[data-dc-slot].dc-dragging{transition:none;z-index:10;pointer-events:none}', '[data-dc-slot].dc-dragging .dc-card{box-shadow:0 12px 40px rgba(0,0,0,.25),0 0 0 2px #c96442;transform:scale(1.02)}',
  // isolation:isolate contains artboard content's z-indexes so a
  // z-indexed child (sticky navbar etc.) can't paint over .dc-header or
  // the .dc-menu popover that drops into the top of the card.
  '.dc-card{isolation:isolate;transition:box-shadow .15s,transform .15s}', '.dc-card *{scrollbar-width:none}', '.dc-card *::-webkit-scrollbar{display:none}',
  // Per-artboard header: grip + label on the left, delete/expand on the
  // right. Single flex row; when the artboard's on-screen width is too
  // narrow for both the label yields (ellipsis, then hidden entirely below
  // ~4ch via the container query) and the buttons stay on the row.
  '.dc-header{position:absolute;bottom:100%;left:-4px;margin-bottom:calc(4px * var(--dc-inv-zoom,1));z-index:2;', '  display:flex;align-items:center;container-type:inline-size}', '.dc-labelrow{display:flex;align-items:center;gap:4px;height:24px;flex:1 1 auto;min-width:0}', '.dc-grip{flex:0 0 auto;cursor:grab;display:flex;align-items:center;padding:5px 4px;border-radius:4px;transition:background .12s,opacity .12s}', '.dc-grip:hover{background:rgba(0,0,0,.08)}', '.dc-grip:active{cursor:grabbing}', '.dc-labeltext{flex:1 1 auto;min-width:0;cursor:pointer;border-radius:4px;padding:3px 6px;', '  display:flex;align-items:center;transition:background .12s;overflow:hidden}',
  // Below ~4ch of label room: hide the label entirely, and drop the grip to
  // hover-only (same reveal rule as .dc-btns) so a narrow header is clean
  // until the card is moused.
  '@container (max-width: 110px){', '  .dc-labeltext{display:none}', '  .dc-grip{opacity:0}', '  [data-dc-slot]:hover .dc-grip{opacity:1}', '}', '.dc-labeltext:hover{background:rgba(0,0,0,.05)}', '.dc-labeltext .dc-editable{overflow:hidden;text-overflow:ellipsis;max-width:100%}', '.dc-labeltext .dc-editable:focus{overflow:visible;text-overflow:clip}', '.dc-btns{flex:0 0 auto;margin-left:auto;display:flex;gap:2px;opacity:0;transition:opacity .12s}', '[data-dc-slot]:hover .dc-btns,.dc-btns:has(.dc-menu){opacity:1}', '.dc-expand,.dc-kebab{width:22px;height:22px;border-radius:5px;border:none;cursor:pointer;padding:0;', '  background:transparent;color:rgba(60,50,40,.7);display:flex;align-items:center;justify-content:center;', '  font:inherit;transition:background .12s,color .12s}', '.dc-expand:hover,.dc-kebab:hover{background:rgba(0,0,0,.06);color:#2a251f}',
  // Slot hosting an open menu floats above later siblings (which otherwise
  // paint on top — same z-index:auto, later DOM order) so the popup isn't
  // clipped by the next card.
  '[data-dc-slot]:has(.dc-menu){z-index:10}', '.dc-menu{position:absolute;top:100%;right:0;margin-top:4px;background:#fff;border-radius:8px;', '  box-shadow:0 8px 28px rgba(0,0,0,.18),0 0 0 1px rgba(0,0,0,.05);padding:4px;min-width:160px;z-index:10}', '.dc-menu button{display:block;width:100%;padding:7px 10px;border:0;background:transparent;', '  border-radius:5px;font-family:inherit;font-size:13px;font-weight:500;line-height:1.2;', '  color:#29261b;cursor:pointer;text-align:left;transition:background .12s;white-space:nowrap}', '.dc-menu button:hover{background:rgba(0,0,0,.05)}', '.dc-menu hr{border:0;border-top:1px solid rgba(0,0,0,.08);margin:4px 2px}', '.dc-menu .dc-danger{color:#c96442}', '.dc-menu .dc-danger:hover{background:rgba(201,100,66,.1)}',
  // Chrome (titles / labels / buttons) counter-scales against the viewport
  // zoom so it stays a constant on-screen size. --dc-inv-zoom is set by
  // DCViewport on every transform update and inherits to all descendants —
  // any overlay inside the world (e.g. a TweaksPanel on an artboard) can use
  // it the same way.
  //
  // The header uses transform:scale (out-of-flow, so layout impact doesn't
  // matter) with its world-space width set to card-width / inv-zoom so that
  // after counter-scaling its on-screen width exactly matches the card's —
  // that's what lets the container query + text-overflow behave against the
  // card's visible edge at every zoom level.
  //
  // The section head uses CSS zoom instead of transform so its layout box
  // grows with the counter-scale, pushing the card row down — otherwise the
  // constant-screen-size title would overflow into the (shrinking) world-
  // space gap and overlap the artboard headers at low zoom.
  '.dc-header{width:calc((100% + 4px) / var(--dc-inv-zoom,1));', '  transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom left}', '.dc-sectionhead{zoom:var(--dc-inv-zoom,1)}'].join('\n');
  document.head.appendChild(s);
}
const DCCtx = React.createContext(null);

// Recursively unwrap React.Fragment so <>…</> grouping doesn't hide
// DCSection/DCArtboard children from the type-based walks below.
function dcFlatten(children) {
  const out = [];
  React.Children.forEach(children, c => {
    if (c && c.type === React.Fragment) out.push(...dcFlatten(c.props.children));else out.push(c);
  });
  return out;
}

// ─────────────────────────────────────────────────────────────
// DesignCanvas — stateful wrapper around the pan/zoom viewport.
// Owns runtime state (per-section order, renamed titles/labels, hidden
// artboards, focused artboard). Order/titles/labels/hidden persist to a
// .design-canvas.state.json
// sidecar next to the HTML. Reads go via plain fetch() so the saved
// arrangement is visible anywhere the HTML + sidecar are served together
// (omelette preview, direct link, downloaded zip). Writes go through the
// host's window.omelette bridge — editing requires the omelette runtime.
// Focus is ephemeral.
// ─────────────────────────────────────────────────────────────
const DC_STATE_FILE = '.design-canvas.state.json';
function DesignCanvas({
  children,
  minScale,
  maxScale,
  style
}) {
  const [state, setState] = React.useState({
    sections: {},
    focus: null
  });
  // Hold rendering until the sidecar read settles so the saved order/titles
  // appear on first paint (no source-order flash). didRead gates writes until
  // the read settles so the empty initial state can't clobber a slow read;
  // skipNextWrite suppresses the one echo-write that would otherwise follow
  // hydration.
  const [ready, setReady] = React.useState(false);
  const didRead = React.useRef(false);
  const skipNextWrite = React.useRef(false);
  React.useEffect(() => {
    let off = false;
    fetch('./' + DC_STATE_FILE).then(r => r.ok ? r.json() : null).then(saved => {
      if (off || !saved || !saved.sections) return;
      skipNextWrite.current = true;
      setState(s => ({
        ...s,
        sections: saved.sections
      }));
    }).catch(() => {}).finally(() => {
      didRead.current = true;
      if (!off) setReady(true);
    });
    const t = setTimeout(() => {
      if (!off) setReady(true);
    }, 150);
    return () => {
      off = true;
      clearTimeout(t);
    };
  }, []);
  React.useEffect(() => {
    if (!didRead.current) return;
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
    const t = setTimeout(() => {
      window.omelette?.writeFile(DC_STATE_FILE, JSON.stringify({
        sections: state.sections
      })).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [state.sections]);

  // Build registries synchronously from children so FocusOverlay can read
  // them in the same render. Fragments are flattened; wrapping in other
  // elements still opts out of focus/reorder.
  const registry = {}; // slotId -> { sectionId, artboard }
  const sectionMeta = {}; // sectionId -> { title, subtitle, slotIds[] }
  const sectionOrder = [];
  dcFlatten(children).forEach(sec => {
    if (!sec || sec.type !== DCSection) return;
    const sid = sec.props.id ?? sec.props.title;
    if (!sid) return;
    sectionOrder.push(sid);
    const persisted = state.sections[sid] || {};
    const abs = [];
    dcFlatten(sec.props.children).forEach(ab => {
      if (!ab || ab.type !== DCArtboard) return;
      const aid = ab.props.id ?? ab.props.label;
      if (aid) abs.push([aid, ab]);
    });
    // hidden is scoped to one source revision — when the agent regenerates
    // (artboard-ID set changes), prior deletes don't apply to new content.
    const srcKey = abs.map(([k]) => k).join('\x1f');
    const hidden = persisted.srcKey === srcKey ? persisted.hidden || [] : [];
    const srcIds = [];
    abs.forEach(([aid, ab]) => {
      if (hidden.includes(aid)) return;
      registry[`${sid}/${aid}`] = {
        sectionId: sid,
        artboard: ab
      };
      srcIds.push(aid);
    });
    const kept = (persisted.order || []).filter(k => srcIds.includes(k));
    sectionMeta[sid] = {
      title: persisted.title ?? sec.props.title,
      subtitle: sec.props.subtitle,
      slotIds: [...kept, ...srcIds.filter(k => !kept.includes(k))]
    };
  });
  const api = React.useMemo(() => ({
    state,
    section: id => state.sections[id] || {},
    patchSection: (id, p) => setState(s => ({
      ...s,
      sections: {
        ...s.sections,
        [id]: {
          ...s.sections[id],
          ...(typeof p === 'function' ? p(s.sections[id] || {}) : p)
        }
      }
    })),
    setFocus: slotId => setState(s => ({
      ...s,
      focus: slotId
    }))
  }), [state]);

  // Esc exits focus; any outside pointerdown commits an in-progress rename.
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') api.setFocus(null);
    };
    const onPd = e => {
      const ae = document.activeElement;
      if (ae && ae.isContentEditable && !ae.contains(e.target)) ae.blur();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPd, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPd, true);
    };
  }, [api]);
  return /*#__PURE__*/React.createElement(DCCtx.Provider, {
    value: api
  }, /*#__PURE__*/React.createElement(DCViewport, {
    minScale: minScale,
    maxScale: maxScale,
    style: style
  }, ready && children), state.focus && registry[state.focus] && /*#__PURE__*/React.createElement(DCFocusOverlay, {
    entry: registry[state.focus],
    sectionMeta: sectionMeta,
    sectionOrder: sectionOrder
  }));
}

// ─────────────────────────────────────────────────────────────
// DCViewport — transform-based pan/zoom (internal)
//
// Input mapping (Figma-style):
//   • trackpad pinch  → zoom   (ctrlKey wheel; Safari gesture* events)
//   • trackpad scroll → pan    (two-finger)
//   • mouse wheel     → zoom   (notched; distinguished from trackpad scroll)
//   • middle-drag / primary-drag-on-bg → pan
//
// Transform state lives in a ref and is written straight to the DOM
// (translate3d + will-change) so wheel ticks don't go through React —
// keeps pans at 60fps on dense canvases.
// ─────────────────────────────────────────────────────────────
function DCViewport({
  children,
  minScale = 0.1,
  maxScale = 8,
  style = {}
}) {
  const vpRef = React.useRef(null);
  const worldRef = React.useRef(null);
  const tf = React.useRef({
    x: 0,
    y: 0,
    scale: 1
  });
  // Persist viewport across reloads so the user lands back where they were
  // after an agent edit or browser refresh. The sandbox origin is already
  // per-project; pathname keeps multiple canvas files in one project apart.
  const tfKey = 'dc-viewport:' + location.pathname;
  const saveT = React.useRef(0);
  const lastPostedScale = React.useRef();
  const apply = React.useCallback(() => {
    const {
      x,
      y,
      scale
    } = tf.current;
    const el = worldRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    // Exposed for zoom-invariant chrome (labels, buttons, TweaksPanel).
    el.style.setProperty('--dc-inv-zoom', String(1 / scale));
    // Keep the host toolbar's % readout in sync with the canvas scale. Pan
    // ticks leave scale unchanged — skip the cross-frame post for those.
    if (lastPostedScale.current !== scale) {
      lastPostedScale.current = scale;
      window.parent.postMessage({
        type: '__dc_zoom',
        scale
      }, '*');
    }
    clearTimeout(saveT.current);
    saveT.current = setTimeout(() => {
      try {
        localStorage.setItem(tfKey, JSON.stringify(tf.current));
      } catch {}
    }, 200);
  }, [tfKey]);
  React.useLayoutEffect(() => {
    const flush = () => {
      clearTimeout(saveT.current);
      try {
        localStorage.setItem(tfKey, JSON.stringify(tf.current));
      } catch {}
    };
    try {
      const s = JSON.parse(localStorage.getItem(tfKey) || 'null');
      if (s && Number.isFinite(s.x) && Number.isFinite(s.y) && Number.isFinite(s.scale)) {
        tf.current = {
          x: s.x,
          y: s.y,
          scale: Math.min(maxScale, Math.max(minScale, s.scale))
        };
        apply();
      }
    } catch {}
    // Flush on pagehide and unmount so a reload within the 200ms debounce
    // window doesn't drop the last pan/zoom.
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, []);
  React.useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    const zoomAt = (cx, cy, factor) => {
      const r = vp.getBoundingClientRect();
      const px = cx - r.left,
        py = cy - r.top;
      const t = tf.current;
      const next = Math.min(maxScale, Math.max(minScale, t.scale * factor));
      const k = next / t.scale;
      // --dc-inv-zoom consumers (.dc-sectionhead's CSS zoom, each section's
      // marginBottom) reflow on every scale change, vertically shifting the
      // world layout — so a world point mathematically pinned under the cursor
      // drifts as you zoom (content creeps up on zoom-in, down on zoom-out).
      // Anchor the DOM element under the cursor instead: record its screen Y,
      // apply the transform + --dc-inv-zoom, then cancel whatever vertical
      // drift the reflow introduced so it stays put on screen.
      let marker = null,
        markerY0 = 0;
      if (k !== 1) {
        const hit = document.elementFromPoint(cx, cy);
        marker = hit && hit.closest ? hit.closest('[data-dc-slot],[data-dc-section]') : null;
        if (marker) markerY0 = marker.getBoundingClientRect().top;
      }
      // keep the world point under the cursor fixed
      t.x = px - (px - t.x) * k;
      t.y = py - (py - t.y) * k;
      t.scale = next;
      apply();
      if (marker) {
        // A pure zoom around (cx, cy) maps screen Y → cy + (Y - cy) * k. Any
        // departure after the --dc-inv-zoom reflow is the layout drift.
        const drift = marker.getBoundingClientRect().top - (cy + (markerY0 - cy) * k);
        if (Math.abs(drift) > 0.1) {
          t.y -= drift;
          apply();
        }
      }
    };

    // Mouse-wheel vs trackpad-scroll heuristic. A physical wheel sends
    // line-mode deltas (Firefox) or large integer pixel deltas with no X
    // component (Chrome/Safari, typically multiples of 100/120). Trackpad
    // two-finger scroll sends small/fractional pixel deltas, often with
    // non-zero deltaX. ctrlKey is set by the browser for trackpad pinch.
    const isMouseWheel = e => e.deltaMode !== 0 || e.deltaX === 0 && Number.isInteger(e.deltaY) && Math.abs(e.deltaY) >= 40;
    const onWheel = e => {
      e.preventDefault();
      if (isGesturing) return; // Safari: gesture* owns the pinch — discard concurrent wheels
      if ((e.ctrlKey || e.metaKey) && !isMouseWheel(e)) {
        // trackpad pinch, or ctrl/cmd + smooth-scroll mouse. Notched
        // wheels fall through to the fixed-step branch below.
        zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.01));
      } else if (isMouseWheel(e)) {
        // notched mouse wheel — fixed-ratio step per click
        zoomAt(e.clientX, e.clientY, Math.exp(-Math.sign(e.deltaY) * 0.18));
      } else {
        // trackpad two-finger scroll — pan
        tf.current.x -= e.deltaX;
        tf.current.y -= e.deltaY;
        apply();
      }
    };

    // Safari sends native gesture* events for trackpad pinch with a smooth
    // e.scale; preferring these over the ctrl+wheel fallback gives a much
    // better feel there. No-ops on other browsers. Safari also fires
    // ctrlKey wheel events during the same pinch — isGesturing makes
    // onWheel drop those entirely so they neither zoom nor pan.
    let gsBase = 1;
    let isGesturing = false;
    const onGestureStart = e => {
      e.preventDefault();
      isGesturing = true;
      gsBase = tf.current.scale;
    };
    const onGestureChange = e => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, gsBase * e.scale / tf.current.scale);
    };
    const onGestureEnd = e => {
      e.preventDefault();
      isGesturing = false;
    };

    // Drag-pan: middle button anywhere, or primary button on canvas
    // background (anything that isn't an artboard or an inline editor).
    let drag = null;
    const onPointerDown = e => {
      const onBg = !e.target.closest('[data-dc-slot], .dc-editable');
      if (!(e.button === 1 || e.button === 0 && onBg)) return;
      e.preventDefault();
      vp.setPointerCapture(e.pointerId);
      drag = {
        id: e.pointerId,
        lx: e.clientX,
        ly: e.clientY
      };
      vp.style.cursor = 'grabbing';
    };
    const onPointerMove = e => {
      if (!drag || e.pointerId !== drag.id) return;
      tf.current.x += e.clientX - drag.lx;
      tf.current.y += e.clientY - drag.ly;
      drag.lx = e.clientX;
      drag.ly = e.clientY;
      apply();
    };
    const onPointerUp = e => {
      if (!drag || e.pointerId !== drag.id) return;
      vp.releasePointerCapture(e.pointerId);
      drag = null;
      vp.style.cursor = '';
    };

    // Host-driven zoom (toolbar % menu). Zooms around viewport centre so the
    // visible midpoint stays fixed — matching the host's iframe-zoom feel.
    const onHostMsg = e => {
      const d = e.data;
      if (d && d.type === '__dc_set_zoom' && typeof d.scale === 'number') {
        const r = vp.getBoundingClientRect();
        zoomAt(r.left + r.width / 2, r.top + r.height / 2, d.scale / tf.current.scale);
      } else if (d && d.type === '__dc_probe') {
        // Host's [readyGen] reset asks whether a canvas is present; it
        // fires on the iframe's native 'load', which for canvases with
        // images/fonts is after our mount-time announce, so re-announce.
        // Clear the pan-tick guard so apply() re-posts the current scale
        // even if it's unchanged — the host just reset dcScale to 1.
        window.parent.postMessage({
          type: '__dc_present'
        }, '*');
        lastPostedScale.current = undefined;
        apply();
      }
    };
    window.addEventListener('message', onHostMsg);
    // Announce canvas mode so the host toolbar proxies its % control here
    // instead of scaling the iframe element (which would just shrink the
    // viewport window of an infinite canvas). The apply() that follows emits
    // the initial __dc_zoom so the toolbar % is correct before first pinch.
    // lastPostedScale reset mirrors the __dc_probe handler: the layout
    // effect's restore-path apply() may already have posted the restored
    // scale (before __dc_present), so clear the guard to re-post it in order.
    window.parent.postMessage({
      type: '__dc_present'
    }, '*');
    lastPostedScale.current = undefined;
    apply();
    vp.addEventListener('wheel', onWheel, {
      passive: false
    });
    vp.addEventListener('gesturestart', onGestureStart, {
      passive: false
    });
    vp.addEventListener('gesturechange', onGestureChange, {
      passive: false
    });
    vp.addEventListener('gestureend', onGestureEnd, {
      passive: false
    });
    vp.addEventListener('pointerdown', onPointerDown);
    vp.addEventListener('pointermove', onPointerMove);
    vp.addEventListener('pointerup', onPointerUp);
    vp.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('message', onHostMsg);
      vp.removeEventListener('wheel', onWheel);
      vp.removeEventListener('gesturestart', onGestureStart);
      vp.removeEventListener('gesturechange', onGestureChange);
      vp.removeEventListener('gestureend', onGestureEnd);
      vp.removeEventListener('pointerdown', onPointerDown);
      vp.removeEventListener('pointermove', onPointerMove);
      vp.removeEventListener('pointerup', onPointerUp);
      vp.removeEventListener('pointercancel', onPointerUp);
    };
  }, [apply, minScale, maxScale]);
  const gridSvg = `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M120 0H0v120' fill='none' stroke='${encodeURIComponent(DC.grid)}' stroke-width='1'/%3E%3C/svg%3E")`;
  return /*#__PURE__*/React.createElement("div", {
    ref: vpRef,
    className: "design-canvas",
    style: {
      height: '100vh',
      width: '100vw',
      background: DC.bg,
      overflow: 'hidden',
      overscrollBehavior: 'none',
      touchAction: 'none',
      position: 'relative',
      fontFamily: DC.font,
      boxSizing: 'border-box',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: worldRef,
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      transformOrigin: '0 0',
      willChange: 'transform',
      width: 'max-content',
      minWidth: '100%',
      minHeight: '100%',
      padding: '60px 0 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: -6000,
      backgroundImage: gridSvg,
      backgroundSize: '120px 120px',
      pointerEvents: 'none',
      zIndex: -1
    }
  }), children));
}

// ─────────────────────────────────────────────────────────────
// DCSection — editable title + h-row of artboards in persisted order
// ─────────────────────────────────────────────────────────────
function DCSection({
  id,
  title,
  subtitle,
  children,
  gap = 48
}) {
  const ctx = React.useContext(DCCtx);
  const sid = id ?? title;
  const all = React.Children.toArray(dcFlatten(children));
  const artboards = all.filter(c => c && c.type === DCArtboard);
  const rest = all.filter(c => !(c && c.type === DCArtboard));
  const sec = ctx && sid && ctx.section(sid) || {};
  // Must match DesignCanvas's srcKey computation exactly (it filters falsy
  // IDs), or onDelete persists a srcKey that DesignCanvas never recognizes.
  const allIds = artboards.map(a => a.props.id ?? a.props.label).filter(Boolean);
  const srcKey = allIds.join('\x1f');
  const hidden = sec.srcKey === srcKey ? sec.hidden || [] : [];
  const srcOrder = allIds.filter(k => !hidden.includes(k));
  const order = React.useMemo(() => {
    const kept = (sec.order || []).filter(k => srcOrder.includes(k));
    return [...kept, ...srcOrder.filter(k => !kept.includes(k))];
  }, [sec.order, srcOrder.join('|')]);
  const byId = Object.fromEntries(artboards.map(a => [a.props.id ?? a.props.label, a]));

  // marginBottom counter-scales so the on-screen gap between sections stays
  // constant — otherwise at low zoom the (world-space) gap collapses while
  // the screen-constant sectionhead below it doesn't, and the title reads as
  // belonging to the section above. paddingBottom below is just enough for
  // the 24px artboard-header (abs-positioned above each card) plus ~8px, so
  // the title sits tight against its own row at every zoom.
  return /*#__PURE__*/React.createElement("div", {
    "data-dc-section": sid,
    style: {
      marginBottom: 'calc(80px * var(--dc-inv-zoom, 1))',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 60px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-sectionhead",
    style: {
      paddingBottom: 36
    }
  }, /*#__PURE__*/React.createElement(DCEditable, {
    tag: "div",
    value: sec.title ?? title,
    onChange: v => ctx && sid && ctx.patchSection(sid, {
      title: v
    }),
    style: {
      fontSize: 28,
      fontWeight: 600,
      color: DC.title,
      letterSpacing: -0.4,
      marginBottom: 6,
      display: 'inline-block'
    }
  }), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      color: DC.subtitle
    }
  }, subtitle))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap,
      padding: '0 60px',
      alignItems: 'flex-start',
      width: 'max-content'
    }
  }, order.map(k => /*#__PURE__*/React.createElement(DCArtboardFrame, {
    key: k,
    sectionId: sid,
    artboard: byId[k],
    order: order,
    label: (sec.labels || {})[k] ?? byId[k].props.label,
    onRename: v => ctx && ctx.patchSection(sid, x => ({
      labels: {
        ...x.labels,
        [k]: v
      }
    })),
    onReorder: next => ctx && ctx.patchSection(sid, {
      order: next
    }),
    onDelete: () => ctx && ctx.patchSection(sid, x => ({
      hidden: [...(x.srcKey === srcKey ? x.hidden || [] : []), k],
      srcKey
    })),
    onFocus: () => ctx && ctx.setFocus(`${sid}/${k}`)
  }))), rest);
}

// DCArtboard — marker; rendered by DCArtboardFrame via DCSection.
function DCArtboard() {
  return null;
}

// Per-artboard export (kind: 'png' | 'html'). Both paths share the same
// self-contained clone: computed styles baked in, @font-face / <img> /
// inline-style background-image urls inlined as data URIs. PNG wraps the
// clone in foreignObject→canvas at 3× the artboard's natural width×height
// (same pipeline the host uses for page captures); HTML wraps it in a
// minimal standalone document. Both are independent of viewport zoom.
async function dcExport(node, w, h, name, kind) {
  try {
    await document.fonts.ready;
  } catch {}
  const toDataURL = url => fetch(url).then(r => r.blob()).then(b => new Promise(res => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = () => res(url);
    fr.readAsDataURL(b);
  })).catch(() => url);

  // Collect @font-face rules. ss.cssRules throws SecurityError on
  // cross-origin sheets (e.g. fonts.googleapis.com) — in that case fetch
  // the CSS text directly (those endpoints send ACAO:*) and regex-extract
  // the blocks. @import and @media/@supports are walked so nested
  // @font-face rules aren't missed.
  const fontRules = [],
    pending = [],
    seen = new Set();
  const scrapeCss = href => {
    if (seen.has(href)) return;
    seen.add(href);
    pending.push(fetch(href).then(r => r.text()).then(css => {
      for (const m of css.match(/@font-face\s*{[^}]*}/g) || []) fontRules.push({
        css: m,
        base: href
      });
      for (const m of css.matchAll(/@import\s+(?:url\()?['"]?([^'")\s;]+)/g)) scrapeCss(new URL(m[1], href).href);
    }).catch(() => {}));
  };
  const walk = (rules, base) => {
    for (const r of rules) {
      if (r.type === CSSRule.FONT_FACE_RULE) fontRules.push({
        css: r.cssText,
        base
      });else if (r.type === CSSRule.IMPORT_RULE && r.styleSheet) {
        const ibase = r.styleSheet.href || base;
        try {
          walk(r.styleSheet.cssRules, ibase);
        } catch {
          scrapeCss(ibase);
        }
      } else if (r.cssRules) walk(r.cssRules, base);
    }
  };
  for (const ss of document.styleSheets) {
    const base = ss.href || location.href;
    try {
      walk(ss.cssRules, base);
    } catch {
      if (ss.href) scrapeCss(ss.href);
    }
  }
  while (pending.length) await pending.shift();
  const fontCss = (await Promise.all(fontRules.map(async rule => {
    let out = rule.css,
      m;
    const re = /url\((['"]?)([^'")]+)\1\)/g;
    while (m = re.exec(rule.css)) {
      if (m[2].indexOf('data:') === 0) continue;
      let abs;
      try {
        abs = new URL(m[2], rule.base).href;
      } catch {
        continue;
      }
      out = out.split(m[0]).join('url("' + (await toDataURL(abs)) + '")');
    }
    return out;
  }))).join('\n');
  const cloneStyled = src => {
    if (src.nodeType === 8 || src.nodeType === 1 && src.tagName === 'SCRIPT') return document.createTextNode('');
    const dst = src.cloneNode(false);
    if (src.nodeType === 1) {
      const cs = getComputedStyle(src);
      let txt = '';
      for (let i = 0; i < cs.length; i++) txt += cs[i] + ':' + cs.getPropertyValue(cs[i]) + ';';
      dst.setAttribute('style', txt + 'animation:none;transition:none;');
      if (src.tagName === 'CANVAS') try {
        const im = document.createElement('img');
        im.src = src.toDataURL();
        im.setAttribute('style', txt);
        return im;
      } catch {}
    }
    for (let c = src.firstChild; c; c = c.nextSibling) dst.appendChild(cloneStyled(c));
    return dst;
  };
  const clone = cloneStyled(node);
  clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  // Drop the card's own shadow/radius so the export is a flush w×h rect;
  // the artboard's own background (if any) is already in the computed style.
  clone.style.boxShadow = 'none';
  clone.style.borderRadius = '0';
  const jobs = [];
  clone.querySelectorAll('img').forEach(el => {
    const s = el.getAttribute('src');
    if (s && s.indexOf('data:') !== 0) jobs.push(toDataURL(el.src).then(d => el.setAttribute('src', d)));
  });
  [clone, ...clone.querySelectorAll('*')].forEach(el => {
    const bg = el.style.backgroundImage;
    if (!bg) return;
    let m;
    const re = /url\(["']?([^"')]+)["']?\)/g;
    while (m = re.exec(bg)) {
      const tok = m[0],
        url = m[1];
      if (url.indexOf('data:') === 0) continue;
      jobs.push(toDataURL(url).then(d => {
        el.style.backgroundImage = el.style.backgroundImage.split(tok).join('url("' + d + '")');
      }));
    }
  });
  await Promise.all(jobs);
  const xml = new XMLSerializer().serializeToString(clone);
  const save = (blob, ext) => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name + '.' + ext;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  if (kind === 'html') {
    const html = '<!doctype html><html><head><meta charset="utf-8"><title>' + name + '</title>' + (fontCss ? '<style>' + fontCss + '</style>' : '') + '</head><body style="margin:0">' + xml + '</body></html>';
    return save(new Blob([html], {
      type: 'text/html'
    }), 'html');
  }

  // PNG: the SVG's own width/height must be the output resolution — an
  // <img>-loaded SVG rasterizes at its intrinsic size, so sizing it at 1×
  // and ctx.scale()-ing up would just upscale a 1× bitmap. viewBox maps the
  // w×h foreignObject onto the px·w × px·h SVG canvas so the browser renders
  // the HTML at full resolution.
  const px = 3;
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w * px + '" height="' + h * px + '" viewBox="0 0 ' + w + ' ' + h + '"><foreignObject width="' + w + '" height="' + h + '">' + (fontCss ? '<style><![CDATA[' + fontCss + ']]></style>' : '') + xml + '</foreignObject></svg>';
  const img = new Image();
  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = () => rej(new Error('svg load failed'));
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
  const cv = document.createElement('canvas');
  cv.width = w * px;
  cv.height = h * px;
  cv.getContext('2d').drawImage(img, 0, 0);
  cv.toBlob(blob => save(blob, 'png'), 'image/png');
}
function DCArtboardFrame({
  sectionId,
  artboard,
  label,
  order,
  onRename,
  onReorder,
  onFocus,
  onDelete
}) {
  const {
    id: rawId,
    label: rawLabel,
    width = 260,
    height = 480,
    children,
    style = {}
  } = artboard.props;
  const id = rawId ?? rawLabel;
  const ref = React.useRef(null);
  const cardRef = React.useRef(null);
  const menuRef = React.useRef(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);

  // ⋯ menu: close on any outside pointerdown. Two-click delete lives inside
  // the menu — first click arms the row, second commits; closing disarms.
  React.useEffect(() => {
    if (!menuOpen) {
      setConfirming(false);
      return;
    }
    const off = e => {
      if (!menuRef.current || !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('pointerdown', off, true);
    return () => document.removeEventListener('pointerdown', off, true);
  }, [menuOpen]);
  const doExport = kind => {
    setMenuOpen(false);
    if (!cardRef.current) return;
    const name = String(label || id || 'artboard').replace(/[^\w\s.-]+/g, '_');
    dcExport(cardRef.current, width, height, name, kind).catch(e => console.error('[design-canvas] export failed:', e));
  };

  // Live drag-reorder: dragged card sticks to cursor; siblings slide into
  // their would-be slots in real time via transforms. DOM order only
  // changes on drop.
  const onGripDown = e => {
    e.preventDefault();
    e.stopPropagation();
    const me = ref.current;
    // translateX is applied in local (pre-scale) space but pointer deltas and
    // getBoundingClientRect().left are screen-space — divide by the viewport's
    // current scale so the dragged card tracks the cursor at any zoom level.
    const scale = me.getBoundingClientRect().width / me.offsetWidth || 1;
    const peers = Array.from(document.querySelectorAll(`[data-dc-section="${sectionId}"] [data-dc-slot]`));
    const homes = peers.map(el => ({
      el,
      id: el.dataset.dcSlot,
      x: el.getBoundingClientRect().left
    }));
    const slotXs = homes.map(h => h.x);
    const startIdx = order.indexOf(id);
    const startX = e.clientX;
    let liveOrder = order.slice();
    me.classList.add('dc-dragging');
    const layout = () => {
      for (const h of homes) {
        if (h.id === id) continue;
        const slot = liveOrder.indexOf(h.id);
        h.el.style.transform = `translateX(${(slotXs[slot] - h.x) / scale}px)`;
      }
    };
    const move = ev => {
      const dx = ev.clientX - startX;
      me.style.transform = `translateX(${dx / scale}px)`;
      const cur = homes[startIdx].x + dx;
      let nearest = 0,
        best = Infinity;
      for (let i = 0; i < slotXs.length; i++) {
        const d = Math.abs(slotXs[i] - cur);
        if (d < best) {
          best = d;
          nearest = i;
        }
      }
      if (liveOrder.indexOf(id) !== nearest) {
        liveOrder = order.filter(k => k !== id);
        liveOrder.splice(nearest, 0, id);
        layout();
      }
    };
    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      const finalSlot = liveOrder.indexOf(id);
      me.classList.remove('dc-dragging');
      me.style.transform = `translateX(${(slotXs[finalSlot] - homes[startIdx].x) / scale}px)`;
      // After the settle transition, kill transitions + clear transforms +
      // commit the reorder in the same frame so there's no visual snap-back.
      setTimeout(() => {
        for (const h of homes) {
          h.el.style.transition = 'none';
          h.el.style.transform = '';
        }
        if (liveOrder.join('|') !== order.join('|')) onReorder(liveOrder);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          for (const h of homes) h.el.style.transition = '';
        }));
      }, 180);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    "data-dc-slot": id,
    style: {
      position: 'relative',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-header",
    "data-omelette-chrome": "",
    style: {
      color: DC.label
    },
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-labelrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-grip",
    onPointerDown: onGripDown,
    title: "Drag to reorder"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "9",
    height: "13",
    viewBox: "0 0 9 13",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "11",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "11",
    r: "1.1"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-labeltext",
    onClick: onFocus,
    title: "Click to focus"
  }, /*#__PURE__*/React.createElement(DCEditable, {
    value: label,
    onChange: onRename,
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: DC.label,
      lineHeight: 1
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-btns"
  }, /*#__PURE__*/React.createElement("div", {
    ref: menuRef,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "dc-kebab",
    title: "More",
    onClick: () => setMenuOpen(o => !o)
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2.5",
    cy: "6",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "6",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9.5",
    cy: "6",
    r: "1.1"
  }))), menuOpen && /*#__PURE__*/React.createElement("div", {
    className: "dc-menu",
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => doExport('png')
  }, "Download PNG"), /*#__PURE__*/React.createElement("button", {
    onClick: () => doExport('html')
  }, "Download HTML"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("button", {
    className: "dc-danger",
    onClick: () => {
      if (confirming) {
        setMenuOpen(false);
        onDelete();
      } else setConfirming(true);
    }
  }, confirming ? 'Click again to delete' : 'Delete'))), /*#__PURE__*/React.createElement("button", {
    className: "dc-expand",
    onClick: onFocus,
    title: "Focus"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 1h4v4M5 11H1V7M11 1L7.5 4.5M1 11l3.5-3.5"
  }))))), /*#__PURE__*/React.createElement("div", {
    ref: cardRef,
    className: "dc-card",
    style: {
      borderRadius: 2,
      boxShadow: '0 1px 3px rgba(0,0,0,.08),0 4px 16px rgba(0,0,0,.06)',
      overflow: 'hidden',
      width,
      height,
      background: '#fff',
      ...style
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb',
      fontSize: 13,
      fontFamily: DC.font
    }
  }, id)));
}

// Inline rename — commits on blur or Enter.
function DCEditable({
  value,
  onChange,
  style,
  tag = 'span',
  onClick
}) {
  const T = tag;
  return /*#__PURE__*/React.createElement(T, {
    className: "dc-editable",
    contentEditable: true,
    suppressContentEditableWarning: true,
    onClick: onClick,
    onPointerDown: e => e.stopPropagation(),
    onBlur: e => onChange && onChange(e.currentTarget.textContent),
    onKeyDown: e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.currentTarget.blur();
      }
    },
    style: style
  }, value);
}

// ─────────────────────────────────────────────────────────────
// Focus mode — overlay one artboard; ←/→ within section, ↑/↓ across
// sections, Esc or backdrop click to exit.
// ─────────────────────────────────────────────────────────────
function DCFocusOverlay({
  entry,
  sectionMeta,
  sectionOrder
}) {
  const ctx = React.useContext(DCCtx);
  const {
    sectionId,
    artboard
  } = entry;
  const sec = ctx.section(sectionId);
  const meta = sectionMeta[sectionId];
  const peers = meta.slotIds;
  const aid = artboard.props.id ?? artboard.props.label;
  const idx = peers.indexOf(aid);
  const secIdx = sectionOrder.indexOf(sectionId);
  const go = d => {
    const n = peers[(idx + d + peers.length) % peers.length];
    if (n) ctx.setFocus(`${sectionId}/${n}`);
  };
  const goSection = d => {
    // Sections whose artboards are all deleted have slotIds:[] — step past
    // them to the next non-empty section so ↑/↓ doesn't dead-end.
    const n = sectionOrder.length;
    for (let i = 1; i < n; i++) {
      const ns = sectionOrder[((secIdx + d * i) % n + n) % n];
      const first = sectionMeta[ns] && sectionMeta[ns].slotIds[0];
      if (first) {
        ctx.setFocus(`${ns}/${first}`);
        return;
      }
    }
  };
  React.useEffect(() => {
    const k = e => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        goSection(-1);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goSection(1);
      }
    };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  });
  const {
    width = 260,
    height = 480,
    children
  } = artboard.props;
  const [vp, setVp] = React.useState({
    w: window.innerWidth,
    h: window.innerHeight
  });
  React.useEffect(() => {
    const r = () => setVp({
      w: window.innerWidth,
      h: window.innerHeight
    });
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);
  const scale = Math.max(0.1, Math.min((vp.w - 200) / width, (vp.h - 260) / height, 2));
  const [ddOpen, setDd] = React.useState(false);
  const Arrow = ({
    dir,
    onClick
  }) => /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onClick();
    },
    style: {
      position: 'absolute',
      top: '50%',
      [dir]: 28,
      transform: 'translateY(-50%)',
      border: 'none',
      background: 'rgba(255,255,255,.08)',
      color: 'rgba(255,255,255,.9)',
      width: 44,
      height: 44,
      borderRadius: 22,
      fontSize: 18,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background .15s'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.18)',
    onMouseLeave: e => e.currentTarget.style.background = 'rgba(255,255,255,.08)'
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: dir === 'left' ? 'M11 3L5 9l6 6' : 'M7 3l6 6-6 6'
  })));

  // Portal to body so position:fixed is the real viewport regardless of any
  // transform on DesignCanvas's ancestors (including the canvas zoom itself).
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    onClick: () => ctx.setFocus(null),
    onWheel: e => e.preventDefault(),
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(24,20,16,.6)',
      backdropFilter: 'blur(14px)',
      fontFamily: DC.font,
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 72,
      display: 'flex',
      alignItems: 'flex-start',
      padding: '16px 20px 0',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDd(o => !o),
    style: {
      border: 'none',
      background: 'transparent',
      color: '#fff',
      cursor: 'pointer',
      padding: '6px 8px',
      borderRadius: 6,
      textAlign: 'left',
      fontFamily: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: -0.3
    }
  }, meta.title), /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 11 11",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    style: {
      opacity: .7
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 4l3.5 3.5L9 4"
  }))), meta.subtitle && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 13,
      opacity: .6,
      fontWeight: 400,
      marginTop: 2
    }
  }, meta.subtitle)), ddOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      marginTop: 4,
      background: '#2a251f',
      borderRadius: 8,
      boxShadow: '0 8px 32px rgba(0,0,0,.4)',
      padding: 4,
      minWidth: 200,
      zIndex: 10
    }
  }, sectionOrder.filter(sid => sectionMeta[sid].slotIds.length).map(sid => /*#__PURE__*/React.createElement("button", {
    key: sid,
    onClick: () => {
      setDd(false);
      const f = sectionMeta[sid].slotIds[0];
      if (f) ctx.setFocus(`${sid}/${f}`);
    },
    style: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      border: 'none',
      cursor: 'pointer',
      background: sid === sectionId ? 'rgba(255,255,255,.1)' : 'transparent',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: 5,
      fontSize: 14,
      fontWeight: sid === sectionId ? 600 : 400,
      fontFamily: 'inherit'
    }
  }, sectionMeta[sid].title)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => ctx.setFocus(null),
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.12)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent',
    style: {
      border: 'none',
      background: 'transparent',
      color: 'rgba(255,255,255,.7)',
      width: 32,
      height: 32,
      borderRadius: 16,
      fontSize: 20,
      cursor: 'pointer',
      lineHeight: 1,
      transition: 'background .12s'
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 64,
      bottom: 56,
      left: 100,
      right: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: width * scale,
      height: height * scale,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      background: '#fff',
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: '0 20px 80px rgba(0,0,0,.4)'
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb'
    }
  }, aid))), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 14,
      fontWeight: 500,
      opacity: .85,
      textAlign: 'center'
    }
  }, (sec.labels || {})[aid] ?? artboard.props.label, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .5,
      marginLeft: 10,
      fontVariantNumeric: 'tabular-nums'
    }
  }, idx + 1, " / ", peers.length))), /*#__PURE__*/React.createElement(Arrow, {
    dir: "left",
    onClick: () => go(-1)
  }), /*#__PURE__*/React.createElement(Arrow, {
    dir: "right",
    onClick: () => go(1)
  }), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 8
    }
  }, peers.map((p, i) => /*#__PURE__*/React.createElement("button", {
    key: p,
    onClick: () => ctx.setFocus(`${sectionId}/${p}`),
    style: {
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      width: 6,
      height: 6,
      borderRadius: 3,
      background: i === idx ? '#fff' : 'rgba(255,255,255,.3)'
    }
  })))), document.body);
}

// ─────────────────────────────────────────────────────────────
// Post-it — absolute-positioned sticky note
// ─────────────────────────────────────────────────────────────
function DCPostIt({
  children,
  top,
  left,
  right,
  bottom,
  rotate = -2,
  width = 180
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top,
      left,
      right,
      bottom,
      width,
      background: DC.postitBg,
      padding: '14px 16px',
      fontFamily: '"Comic Sans MS", "Marker Felt", "Segoe Print", cursive',
      fontSize: 14,
      lineHeight: 1.4,
      color: DC.postitText,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
      transform: `rotate(${rotate}deg)`,
      zIndex: 5
    }
  }, children);
}
Object.assign(window, {
  DesignCanvas,
  DCSection,
  DCArtboard,
  DCPostIt
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "mobile-options/design-canvas.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/AnglersScreen.jsx
try { (() => {
// Castline UI Kit — Anglers list screen
const {
  useState: useStateAnglers
} = React;
function AnglersScreen({
  onOpenAngler
}) {
  const [q, setQ] = useStateAnglers("");
  const [view, setView] = useStateAnglers(typeof window !== "undefined" && window.innerWidth <= 640 ? "list" : "grid");
  const all = window.ANGLERS;
  const filtered = all.filter(a => !q || (a.first + " " + a.last + " " + a.state).toLowerCase().includes(q.toLowerCase()));
  return /*#__PURE__*/React.createElement("div", {
    className: "screen"
  }, /*#__PURE__*/React.createElement("section", {
    className: "phead"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap phead-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: "var(--flame)",
      fontSize: 14
    }
  }, "The Field \xB7 2026 Season"), /*#__PURE__*/React.createElement("h1", {
    className: "phead-title"
  }, "Anglers"), /*#__PURE__*/React.createElement("div", {
    className: "phead-sub"
  }, "62 competitors \xB7 every angler, every cast, every story"), /*#__PURE__*/React.createElement("div", {
    className: "filters"
  }, /*#__PURE__*/React.createElement("div", {
    className: "search-box",
    style: {
      marginLeft: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 17
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search anglers or states",
    value: q,
    onChange: e => setQ(e.target.value)
  }))))), /*#__PURE__*/React.createElement("section", {
    className: "band band--sand"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head",
    style: {
      marginBottom: 26
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow",
    style: {
      color: "var(--deep-blue)",
      fontSize: 13
    }
  }, filtered.length, " ", filtered.length === 1 ? "angler" : "anglers"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow",
    style: {
      color: "var(--ink)",
      fontSize: 13,
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-down-wide-narrow",
    size: 16
  }), " Season Weight"), /*#__PURE__*/React.createElement("div", {
    className: "view-toggle",
    role: "group",
    "aria-label": "View mode"
  }, /*#__PURE__*/React.createElement("button", {
    className: "view-btn" + (view === "grid" ? " is-active" : ""),
    onClick: () => setView("grid"),
    "aria-label": "Grid view",
    "aria-pressed": view === "grid"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "layout-grid",
    size: 16
  })), /*#__PURE__*/React.createElement("button", {
    className: "view-btn" + (view === "list" ? " is-active" : ""),
    onClick: () => setView("list"),
    "aria-label": "List view",
    "aria-pressed": view === "list"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "list",
    size: 16
  }))))), filtered.length ? view === "grid" ? /*#__PURE__*/React.createElement("div", {
    className: "cards-grid"
  }, filtered.map(a => /*#__PURE__*/React.createElement(AnglerCard, {
    key: a.id,
    angler: a,
    onOpen: onOpenAngler
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "alist"
  }, /*#__PURE__*/React.createElement("div", {
    className: "alist-head"
  }, /*#__PURE__*/React.createElement("span", null, "Rank"), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null, "Angler"), /*#__PURE__*/React.createElement("span", null, "Discipline"), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: "right"
    }
  }, "Season"), /*#__PURE__*/React.createElement("span", null)), filtered.map(a => /*#__PURE__*/React.createElement(AnglerRow, {
    key: a.id,
    angler: a,
    onOpen: onOpenAngler
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "60px 0",
      textAlign: "center",
      fontFamily: "var(--font-display)",
      fontWeight: 800,
      fontSize: 26,
      color: "var(--ink)"
    }
  }, "No anglers match \u2014 cast a wider line."))));
}
window.AnglersScreen = AnglersScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/AnglersScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/HomeScreen.jsx
try { (() => {
// Castline UI Kit — Home screen (recreation of the Figma homepage)
const {
  useState: useStateHome
} = React;
function HomeScreen({
  onNav,
  onOpenAngler
}) {
  const featured = window.ANGLERS.slice(0, 6);
  const t = window.TOURNAMENT;
  return /*#__PURE__*/React.createElement("div", {
    className: "screen"
  }, /*#__PURE__*/React.createElement("section", {
    className: "hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap hero-inner"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "hero-title"
  }, "Every Angler. Every Cast. Every Story."), /*#__PURE__*/React.createElement("p", {
    className: "hero-lede"
  }, "For too long, competitive fishing has only shown fans a fraction of the action. Castline changes that \u2014 connecting viewers to every angler, every moment, and every story unfolding on the water in real time.")), /*#__PURE__*/React.createElement("img", {
    className: "hero-emblem",
    src: "../../assets/emblem-blue.png",
    alt: "Castline Fishing \xB7 Cast On"
  })), /*#__PURE__*/React.createElement("div", {
    className: "wrap tbar-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tbar"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "tbar-title"
  }, "Primetime Bass", /*#__PURE__*/React.createElement("br", null), "Fishing Tournament"), /*#__PURE__*/React.createElement("span", {
    className: "tbar-meta"
  }, t.day), /*#__PURE__*/React.createElement("span", {
    className: "tbar-meta"
  }, t.boats, " Boats"), /*#__PURE__*/React.createElement("button", {
    className: "cl-btn cl-btn--ghost",
    onClick: () => onNav("live")
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: "var(--flame)",
      animation: "cl-pulse 1.4s ease-in-out infinite"
    }
  }), " Watch Tournament")))), /*#__PURE__*/React.createElement("section", {
    className: "band band--sky"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "section-title"
  }, "Featured Anglers"), /*#__PURE__*/React.createElement("span", {
    className: "section-link",
    onClick: () => onNav("anglers")
  }, "View all 62 anglers")), /*#__PURE__*/React.createElement("div", {
    className: "cards-grid only-desktop"
  }, featured.map(a => /*#__PURE__*/React.createElement(AnglerCard, {
    key: a.id,
    angler: a,
    onOpen: onOpenAngler
  }))), /*#__PURE__*/React.createElement("div", {
    className: "alist only-mobile"
  }, featured.map(a => /*#__PURE__*/React.createElement(AnglerRow, {
    key: a.id,
    angler: a,
    onOpen: onOpenAngler
  }))))), /*#__PURE__*/React.createElement("section", {
    className: "feature"
  }, /*#__PURE__*/React.createElement("div", {
    className: "feature-text"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "feature-title"
  }, "See every cast"), /*#__PURE__*/React.createElement("p", {
    className: "feature-copy"
  }, "For too long, competitive fishing has only shown fans a fraction of the action. Castline changes that, connecting viewers to every angler, every moment, and every story unfolding on the water in real time."), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    className: "cl-btn cl-btn--outline",
    onClick: () => onNav("about")
  }, "About"))), /*#__PURE__*/React.createElement("div", {
    className: "feature-img",
    style: {
      backgroundImage: "url('../../assets/stock-flyfishing.jpg')"
    }
  })));
}
window.HomeScreen = HomeScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/LiveScreen.jsx
try { (() => {
// Castline UI Kit — Live tournament screen
const {
  useState: useStateLive,
  useEffect: useEffectLive,
  useRef: useRefLive
} = React;

// today's swing vs. the previous standing — drives the +/- delta column
const LIVE_DELTAS = {
  "austin-cranford": 1.92,
  "dana-whitfield": 0.41,
  "marcus-vinroe": -0.18,
  "priya-nandakumar": 0.62,
  "wyatt-boudreaux": 0.05,
  "cole-rasmussen": -0.40,
  "harlan-pope": 0.21,
  "sofia-marchetti": -1.10
};
function fmtClock(d) {
  return d.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}
function ordSuffix(n) {
  const v = n % 100;
  if (v >= 11 && v <= 13) return "th";
  return ["th", "st", "nd", "rd"][n % 10] || "th";
}
function LiveScreen({
  onOpenAngler
}) {
  const t = window.TOURNAMENT;
  const [board, setBoard] = useStateLive(window.LIVE_BOARD);
  const [filter, setFilter] = useStateLive("top"); // top | follows | all
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
        const next = b.map(r => ({
          ...r,
          today: Math.max(0, r.today + (r.live ? Math.random() * 0.05 : 0))
        }));
        return next.sort((x, y) => y.today - x.today);
      });
    }, 2400);
    return () => clearInterval(id);
  }, []);

  // overall standing → id-keyed rank map (kept correct even when filtering)
  const rankMap = {};
  board.forEach((r, i) => {
    rankMap[r.id] = i + 1;
  });
  const active = board.find(r => r.id === activeId) || board[0];
  const liveRows = board.filter(r => r.live);
  const shown = filter === "follows" ? board.filter(r => r.follow) : board;
  const scrollBy = dx => scrollerRef.current && scrollerRef.current.scrollBy({
    left: dx,
    behavior: "smooth"
  });
  const segs = [{
    key: "top",
    label: "Top 10"
  }, {
    key: "follows",
    label: "Following"
  }, {
    key: "all",
    label: "All 62"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "screen"
  }, /*#__PURE__*/React.createElement("section", {
    className: "livebar",
    "data-screen-label": "Live \xB7 tournament bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "livebar-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "livebar-id"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cl-badge-live"
  }, "Live"), /*#__PURE__*/React.createElement("h1", {
    className: "livebar-title"
  }, t.short), /*#__PURE__*/React.createElement("span", {
    className: "livebar-day"
  }, t.day)), /*#__PURE__*/React.createElement("div", {
    className: "livebar-meta"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: 14
  }), " ", /*#__PURE__*/React.createElement("b", null, t.lake), /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "\xB7"), " ", t.boats, " boats", /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "\xB7"), " Cut ", /*#__PURE__*/React.createElement("b", null, t.cut.toFixed(2), " lb")), /*#__PURE__*/React.createElement("div", {
    className: "livebar-right"
  }, /*#__PURE__*/React.createElement("span", {
    className: "livebar-wx"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sun",
    size: 16
  }), " ", /*#__PURE__*/React.createElement("b", null, t.weather.temp, "\xB0"), " ", t.weather.cond), /*#__PURE__*/React.createElement("span", {
    className: "livebar-wx"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "wind",
    size: 15
  }), " ", t.weather.wind), /*#__PURE__*/React.createElement("span", {
    className: "livebar-clock"
  }, fmtClock(clock), /*#__PURE__*/React.createElement("small", null, t.tz))))), /*#__PURE__*/React.createElement("section", {
    className: "band band--sand livestage"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap livestage-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(VideoPlayer, {
    flat: true,
    image: active.img,
    boat: active.boat,
    live: active.live,
    views: active.viewers,
    timestamp: fmtClock(clock)
  }), /*#__PURE__*/React.createElement("div", {
    className: "tbar live-callout",
    style: {
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      gap: 15,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "board-disc",
    style: {
      width: 52,
      height: 52,
      fontSize: 17,
      flex: "none",
      background: active.disc,
      color: active.discText
    }
  }, active.initials), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: "var(--paper)",
      fontSize: 10.5,
      opacity: .9
    }
  }, "Watching \xB7 Boat ", active.boat, " \xB7 ", active.state), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 800,
      fontSize: 26,
      color: "var(--paper)",
      lineHeight: 1.05,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, active.name))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 800,
      fontSize: 32,
      color: "var(--paper)",
      lineHeight: 1
    }
  }, active.today.toFixed(2)), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: "var(--paper)",
      fontSize: 10,
      opacity: .9
    }
  }, "LB Today")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--ink)",
      borderRadius: "var(--r-md)",
      padding: "10px 16px",
      textAlign: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 800,
      fontSize: 24,
      color: "var(--paper)",
      lineHeight: 1
    }
  }, rankMap[active.id], /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      verticalAlign: "super"
    }
  }, ordSuffix(rankMap[active.id]))), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: "var(--seafoam)",
      fontSize: 9,
      marginTop: 3
    }
  }, "Position"))), /*#__PURE__*/React.createElement("div", {
    className: "mcam"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mcam-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mcam-label"
  }, /*#__PURE__*/React.createElement("span", {
    className: "board-live-dot",
    style: {
      marginLeft: 0
    }
  }), "Multi-cam \xB7 ", /*#__PURE__*/React.createElement("span", {
    className: "ct"
  }, liveRows.length, " live boats")), /*#__PURE__*/React.createElement("div", {
    className: "mcam-nav"
  }, /*#__PURE__*/React.createElement("button", {
    className: "mcam-arrow",
    "aria-label": "Scroll left",
    onClick: () => scrollBy(-460)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-left",
    size: 18
  })), /*#__PURE__*/React.createElement("button", {
    className: "mcam-arrow",
    "aria-label": "Scroll right",
    onClick: () => scrollBy(460)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 18
  })))), /*#__PURE__*/React.createElement("div", {
    className: "vcam-row",
    ref: scrollerRef
  }, liveRows.map(r => /*#__PURE__*/React.createElement(VCam, {
    key: r.id,
    row: r,
    rank: rankMap[r.id],
    active: r.id === activeId,
    onClick: () => setActiveId(r.id)
  }))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "board-panel-title"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "section-title",
    style: {
      fontSize: 30
    }
  }, "Live board"), /*#__PURE__*/React.createElement("span", {
    className: "board-panel-eyebrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "board-live-dot",
    style: {
      marginLeft: 0
    }
  }), " Updating")), /*#__PURE__*/React.createElement("div", {
    className: "seg",
    role: "tablist"
  }, segs.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.key,
    className: "seg-btn" + (filter === s.key ? " is-active" : ""),
    onClick: () => setFilter(s.key)
  }, s.label))), /*#__PURE__*/React.createElement(Leaderboard, {
    rows: shown,
    onOpen: onOpenAngler,
    activeId: activeId,
    deltas: LIVE_DELTAS,
    rankMap: rankMap
  }), /*#__PURE__*/React.createElement("a", {
    className: "cl-btn cl-btn--ghost board-all",
    onClick: () => onOpenAngler && onOpenAngler(board[0].id)
  }, "View all ", t.boats, " boats", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 17
  }))))));
}
window.LiveScreen = LiveScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/LiveScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/ProfileScreen.jsx
try { (() => {
// Castline UI Kit — Angler profile screen
function ProfileScreen({
  anglerId,
  onOpenAngler,
  onNav
}) {
  const a = window.ANGLERS.find(x => x.id === anglerId) || window.ANGLERS[0];
  const moments = [{
    cap: "Day 2 · Morning flurry",
    img: "../../assets/stock-boats.jpg"
  }, {
    cap: "5.2 lb kicker",
    img: "../../assets/stock-openwater.png"
  }, {
    cap: "Locking down the bank",
    img: "../../assets/stock-flyfishing.jpg"
  }];
  const discColor = a.discText;
  return /*#__PURE__*/React.createElement("div", {
    className: "screen"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pcover",
    style: {
      backgroundImage: `url('${a.photo}')`
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "phead-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pavatar",
    style: {
      background: a.accent
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pavatar-disc",
    style: {
      background: a.disc,
      color: discColor
    }
  }, a.initials)), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 10,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h1", {
    className: "pname"
  }, a.first, " ", a.last), /*#__PURE__*/React.createElement("div", {
    className: "ploc"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: 16
  }), " ", a.state)), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 14,
      display: "flex",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "cl-btn"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), " Follow"), /*#__PURE__*/React.createElement("button", {
    className: "cl-btn cl-btn--ghost"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "share-2",
    size: 16
  }), " Share"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "acard-tag",
    style: {
      fontSize: 26
    }
  }, a.tag)), /*#__PURE__*/React.createElement("div", {
    className: "stat-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-box"
  }, /*#__PURE__*/React.createElement("b", null, a.seasonLb.toFixed(2)), /*#__PURE__*/React.createElement("span", null, "LB \xB7 Season Total")), /*#__PURE__*/React.createElement("div", {
    className: "stat-box"
  }, /*#__PURE__*/React.createElement("b", null, "#", a.rank), /*#__PURE__*/React.createElement("span", null, "Season Rank")), /*#__PURE__*/React.createElement("div", {
    className: "stat-box"
  }, /*#__PURE__*/React.createElement("b", null, a.events), /*#__PURE__*/React.createElement("span", null, "Events Fished")), /*#__PURE__*/React.createElement("div", {
    className: "stat-box"
  }, /*#__PURE__*/React.createElement("b", null, a.bigBag.toFixed(2)), /*#__PURE__*/React.createElement("span", null, "LB \xB7 Biggest Bag")))), /*#__PURE__*/React.createElement("section", {
    className: "band band--sand",
    style: {
      paddingTop: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head",
    style: {
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "section-title",
    style: {
      fontSize: 40
    }
  }, "Recent casts"), /*#__PURE__*/React.createElement("span", {
    className: "section-link"
  }, "All clips")), /*#__PURE__*/React.createElement("div", {
    className: "moment-grid"
  }, moments.map((m, i) => /*#__PURE__*/React.createElement(VideoPlayer, {
    key: i,
    image: m.img,
    caption: m.cap,
    live: false
  }))))), /*#__PURE__*/React.createElement("section", {
    className: "band band--sky",
    style: {
      paddingTop: 56,
      paddingBottom: 56
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1.3fr",
      gap: 48,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "section-title"
  }, "About", /*#__PURE__*/React.createElement("br", null), a.first), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 19,
      lineHeight: 1.6,
      color: "var(--ink)",
      margin: "6px 0 0",
      maxWidth: 600
    }
  }, a.bio), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      marginTop: 26,
      flexWrap: "wrap"
    }
  }, a.disciplines.map(d => /*#__PURE__*/React.createElement("span", {
    key: d,
    className: "eyebrow",
    style: {
      fontSize: 12,
      padding: "9px 16px",
      borderRadius: 999,
      border: "2px solid var(--ink)",
      color: "var(--ink)"
    }
  }, d)))))));
}
window.ProfileScreen = ProfileScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/ProfileScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/app.jsx
try { (() => {
// Castline UI Kit — app shell & router
const {
  useState: useStateApp,
  useEffect: useEffectApp
} = React;
function App() {
  const [screen, setScreen] = useStateApp("home");
  const [anglerId, setAnglerId] = useStateApp(window.ANGLERS[0].id);

  // re-render Lucide icons after every commit
  useEffectApp(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  const nav = key => {
    if (key === "tournaments") key = "live";
    if (["expos", "about", "signin"].includes(key)) key = "home";
    setScreen(key);
    window.scrollTo({
      top: 0,
      behavior: "instant" in window ? "instant" : "auto"
    });
  };
  const openAngler = id => {
    setAnglerId(id);
    setScreen("profile");
    window.scrollTo({
      top: 0
    });
  };

  // active nav highlight
  const active = screen === "profile" ? "anglers" : screen === "live" ? "tournaments" : screen;
  return /*#__PURE__*/React.createElement("div", {
    className: "app"
  }, /*#__PURE__*/React.createElement(Header, {
    active: active,
    onNav: nav
  }), screen === "home" && /*#__PURE__*/React.createElement(HomeScreen, {
    onNav: nav,
    onOpenAngler: openAngler
  }), screen === "anglers" && /*#__PURE__*/React.createElement(AnglersScreen, {
    onOpenAngler: openAngler
  }), screen === "profile" && /*#__PURE__*/React.createElement(ProfileScreen, {
    anglerId: anglerId,
    onOpenAngler: openAngler,
    onNav: nav
  }), screen === "live" && /*#__PURE__*/React.createElement(LiveScreen, {
    onOpenAngler: openAngler
  }), /*#__PURE__*/React.createElement(Footer, {
    onNav: nav
  }));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/components.jsx
try { (() => {
// Castline UI Kit — shared components
// Loaded as Babel script. Exports to window for use by screens.

const {
  useState,
  useEffect,
  useRef
} = React;

// ---- Icon (Lucide via CDN) ----
function Icon({
  name,
  size = 20,
  className = "",
  style = {}
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "ic " + className,
    style: {
      fontSize: size,
      ...style
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": name
  }));
}

// ---- Racing-stripe rule ----
function Stripe() {
  return /*#__PURE__*/React.createElement("div", {
    className: "stripe"
  });
}

// ---- Header ----
function Header({
  active,
  onNav
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  // lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);
  const go = key => {
    setMenuOpen(false);
    onNav(key);
  };
  const link = (key, label) => /*#__PURE__*/React.createElement("button", {
    className: "hdr-link" + (active === key ? " is-active" : ""),
    onClick: () => onNav(key)
  }, label);
  // drawer link — same Epilogue all-caps label vocabulary as the web nav, sized up for touch
  const dlink = (key, label, icon, badge) => /*#__PURE__*/React.createElement("button", {
    className: "hdr-drawer-link" + (active === key ? " is-active" : ""),
    onClick: () => go(key)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 20
  }), label, badge && /*#__PURE__*/React.createElement("span", {
    className: "cl-badge-live hdr-drawer-badge"
  }, badge));
  return /*#__PURE__*/React.createElement("header", {
    className: "hdr"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap hdr-inner"
  }, /*#__PURE__*/React.createElement("img", {
    className: "hdr-logo",
    src: "../../assets/logo-blue.png",
    alt: "Castline",
    onClick: () => onNav("home")
  }), /*#__PURE__*/React.createElement("nav", {
    className: "hdr-nav"
  }, link("tournaments", "Tournaments"), link("anglers", "Anglers"), link("expos", "Expos"), link("about", "About"), /*#__PURE__*/React.createElement("span", {
    className: "hdr-divider"
  }), /*#__PURE__*/React.createElement("button", {
    className: "hdr-link",
    onClick: () => onNav("signin")
  }, "Sign In"), /*#__PURE__*/React.createElement("span", {
    className: "cl-badge-live hdr-live",
    onClick: () => onNav("live"),
    style: {
      cursor: "pointer"
    }
  }, "LIVE \xB7 DAY 2"), /*#__PURE__*/React.createElement("button", {
    className: "hdr-icon",
    "aria-label": "Search"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 19
  }))), /*#__PURE__*/React.createElement("div", {
    className: "hdr-mobile"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cl-badge-live hdr-live",
    onClick: () => onNav("live"),
    style: {
      cursor: "pointer"
    }
  }, "LIVE \xB7 DAY 2"), /*#__PURE__*/React.createElement("button", {
    className: "hdr-burger",
    "aria-label": "Open menu",
    onClick: () => setMenuOpen(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "menu",
    size: 22
  })))), /*#__PURE__*/React.createElement(Stripe, null), menuOpen && /*#__PURE__*/React.createElement("div", {
    className: "hdr-drawer",
    role: "dialog",
    "aria-modal": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hdr-drawer-bar"
  }, /*#__PURE__*/React.createElement("img", {
    className: "hdr-drawer-logo",
    src: "../../assets/logo-blue.png",
    alt: "Castline",
    onClick: () => go("home")
  }), /*#__PURE__*/React.createElement("button", {
    className: "hdr-drawer-close",
    "aria-label": "Close menu",
    onClick: () => setMenuOpen(false)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "menu",
    size: 22
  }))), /*#__PURE__*/React.createElement("nav", {
    className: "hdr-drawer-links"
  }, dlink("tournaments", "Tournaments", "trophy"), dlink("anglers", "Anglers", "users"), dlink("expos", "Expos", "store"), dlink("live", "Live", "radio", "On Air"), dlink("about", "About", "info"), dlink("signin", "Sign In", "log-in")), /*#__PURE__*/React.createElement("div", {
    className: "hdr-drawer-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "hdr-drawer-search",
    onClick: () => go("anglers")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 18
  }), " Search anglers, events\u2026"))));
}

// ---- Footer ----
function Footer({
  onNav
}) {
  return /*#__PURE__*/React.createElement("footer", {
    className: "ftr"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap ftr-inner"
  }, /*#__PURE__*/React.createElement("img", {
    className: "ftr-logo",
    src: "../../assets/logo-blue.png",
    alt: "Castline"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ftr-copy"
  }, "2026 Castline Media"), /*#__PURE__*/React.createElement("span", {
    className: "ftr-link"
  }, "Terms"), /*#__PURE__*/React.createElement("span", {
    className: "ftr-link"
  }, "Privacy"), /*#__PURE__*/React.createElement("div", {
    className: "ftr-links"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ftr-link",
    onClick: () => onNav("tournaments")
  }, "Tournaments"), /*#__PURE__*/React.createElement("span", {
    className: "ftr-link",
    onClick: () => onNav("anglers")
  }, "Anglers"), /*#__PURE__*/React.createElement("span", {
    className: "ftr-link",
    onClick: () => onNav("expos")
  }, "Expos"), /*#__PURE__*/React.createElement("span", {
    className: "ftr-link",
    onClick: () => onNav("about")
  }, "About"))), /*#__PURE__*/React.createElement(Stripe, null));
}

// ---- Angler avatar (disc on accent square) ----
function AnglerAvatar({
  angler,
  square = 96,
  disc = 66,
  fontSize = 24
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "acard-avatar",
    style: {
      width: square,
      height: square,
      background: angler.accent
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "acard-disc",
    style: {
      width: disc,
      height: disc,
      background: angler.disc,
      fontSize,
      color: angler.discText
    }
  }, angler.initials));
}

// ---- Angler card ----
function AnglerCard({
  angler,
  onOpen
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "acard",
    onClick: () => onOpen(angler.id)
  }, /*#__PURE__*/React.createElement("div", {
    className: "acard-top"
  }, /*#__PURE__*/React.createElement(AnglerAvatar, {
    angler: angler
  }), /*#__PURE__*/React.createElement("div", {
    className: "acard-stat"
  }, /*#__PURE__*/React.createElement("b", null, angler.seasonLb.toFixed(2)), /*#__PURE__*/React.createElement("span", null, "LB \xB7 SEASON"))), /*#__PURE__*/React.createElement("h3", {
    className: "acard-name"
  }, angler.first, " ", angler.last), /*#__PURE__*/React.createElement("div", {
    className: "acard-loc"
  }, angler.state), /*#__PURE__*/React.createElement("div", {
    className: "acard-foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "acard-tag"
  }, angler.tag), /*#__PURE__*/React.createElement("button", {
    className: "acard-profile",
    onClick: e => {
      e.stopPropagation();
      onOpen(angler.id);
    }
  }, "PROFILE")));
}

// ---- Angler list row (list-view variant of the card) ----
function AnglerRow({
  angler,
  onOpen
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "arow",
    onClick: () => onOpen(angler.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "arow-rank"
  }, angler.rank), /*#__PURE__*/React.createElement(AnglerAvatar, {
    angler: angler,
    square: 56,
    disc: 38,
    fontSize: 15
  }), /*#__PURE__*/React.createElement("div", {
    className: "arow-id"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "arow-name"
  }, angler.first, " ", angler.last), /*#__PURE__*/React.createElement("div", {
    className: "arow-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "arow-loc"
  }, angler.state), /*#__PURE__*/React.createElement("span", {
    className: "arow-tag arow-tag-m"
  }, angler.tag))), /*#__PURE__*/React.createElement("span", {
    className: "arow-tag"
  }, angler.tag), /*#__PURE__*/React.createElement("div", {
    className: "arow-stat"
  }, /*#__PURE__*/React.createElement("b", null, angler.seasonLb.toFixed(2)), /*#__PURE__*/React.createElement("span", null, "LB \xB7 Season")), /*#__PURE__*/React.createElement("button", {
    className: "acard-profile arow-profile",
    onClick: e => {
      e.stopPropagation();
      onOpen(angler.id);
    }
  }, "PROFILE"));
}

// ---- viewer-count formatter (12483 -> "12.5k") ----
function fmtViews(n) {
  return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "k" : String(n);
}

// ---- Video player (flush — NO hard offset shadow, per brand rule) ----
// flat=true  -> squared corners (standard rectangular video)
// timestamp  -> live timecode shown in the control bar
// boat       -> boat-number chip beside the LIVE badge
function VideoPlayer({
  image,
  caption = "PRIMETIME BASS · LIVE FEED",
  live = true,
  views,
  flat = false,
  timestamp,
  boat
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "player" + (flat ? " player--flat" : "")
  }, /*#__PURE__*/React.createElement("img", {
    className: "player-img",
    src: image,
    alt: ""
  }), /*#__PURE__*/React.createElement("div", {
    className: "player-scrim"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 16,
      left: 16,
      display: "flex",
      gap: 10,
      alignItems: "center"
    }
  }, live && /*#__PURE__*/React.createElement("span", {
    className: "cl-badge-live"
  }, "LIVE"), boat && /*#__PURE__*/React.createElement("span", {
    className: "player-boat"
  }, "Boat ", boat)), views != null && /*#__PURE__*/React.createElement("div", {
    className: "player-views"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "eye",
    size: 15
  }), " ", views.toLocaleString(), " watching"), /*#__PURE__*/React.createElement("button", {
    className: "player-play",
    "aria-label": "Play"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "play",
    size: 32
  })), /*#__PURE__*/React.createElement("div", {
    className: "player-bar"
  }, /*#__PURE__*/React.createElement("button", {
    className: "player-iconbtn",
    "aria-label": "Mute"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "volume-2",
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    className: "player-track"
  }, /*#__PURE__*/React.createElement("i", null)), timestamp ? /*#__PURE__*/React.createElement("span", {
    className: "player-time"
  }, timestamp, /*#__PURE__*/React.createElement("span", {
    className: "lv"
  }, "LIVE")) : /*#__PURE__*/React.createElement("span", {
    className: "player-caption"
  }, caption), /*#__PURE__*/React.createElement("button", {
    className: "player-iconbtn",
    "aria-label": "Fullscreen"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "maximize",
    size: 18
  }))));
}

// ---- Multi-cam tile (live boat thumbnail in the scroller) ----
function VCam({
  row,
  rank,
  active,
  onClick
}) {
  const shortName = row.name.split(" ").slice(-1)[0];
  return /*#__PURE__*/React.createElement("div", {
    className: "vcam" + (active ? " is-active" : ""),
    onClick: onClick
  }, /*#__PURE__*/React.createElement("div", {
    className: "vcam-thumb"
  }, /*#__PURE__*/React.createElement("img", {
    src: row.img,
    alt: ""
  }), /*#__PURE__*/React.createElement("div", {
    className: "vcam-scrim"
  }), row.live && /*#__PURE__*/React.createElement("span", {
    className: "cl-badge-live vcam-live"
  }, "LIVE"), /*#__PURE__*/React.createElement("span", {
    className: "vcam-views"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "eye",
    size: 13
  }), " ", fmtViews(row.viewers))), /*#__PURE__*/React.createElement("div", {
    className: "vcam-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "vcam-rank"
  }, rank), /*#__PURE__*/React.createElement("span", {
    className: "vcam-name"
  }, shortName), /*#__PURE__*/React.createElement("span", {
    className: "vcam-wt"
  }, row.today.toFixed(2))));
}

// ---- Live leaderboard ----
function Leaderboard({
  rows,
  onOpen,
  activeId,
  deltas,
  rankMap
}) {
  const showDelta = !!deltas;
  return /*#__PURE__*/React.createElement("div", {
    className: "board"
  }, /*#__PURE__*/React.createElement("div", {
    className: "board-head" + (showDelta ? " has-delta" : "")
  }, /*#__PURE__*/React.createElement("span", null, "Rank"), /*#__PURE__*/React.createElement("span", null, "Angler"), !showDelta && /*#__PURE__*/React.createElement("span", null, "Fish"), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: "right"
    }
  }, "Today")), rows.map((r, i) => {
    const rank = rankMap ? rankMap[r.id] : i + 1;
    return /*#__PURE__*/React.createElement("div", {
      className: "board-row" + (showDelta ? " has-delta" : "") + (r.id === activeId ? " is-watching" : ""),
      key: r.id,
      onClick: () => onOpen && onOpen(r.id)
    }, /*#__PURE__*/React.createElement("span", {
      className: "board-rank" + (rank === 1 ? " top" : "")
    }, rank), /*#__PURE__*/React.createElement("div", {
      className: "board-angler"
    }, /*#__PURE__*/React.createElement("div", {
      className: "board-disc",
      style: {
        background: r.disc,
        color: r.discText
      }
    }, r.initials), /*#__PURE__*/React.createElement("div", {
      className: "board-name"
    }, r.name, /*#__PURE__*/React.createElement("small", null, r.fish != null && /*#__PURE__*/React.createElement("span", {
      className: "board-fish-m"
    }, r.fish, "/5 \xB7 "), r.boat ? "Boat " + r.boat + " · " : "", r.state, r.live && /*#__PURE__*/React.createElement("span", {
      className: "board-live-dot"
    })))), !showDelta && /*#__PURE__*/React.createElement("span", {
      className: "board-fish"
    }, r.fish, "/5"), showDelta ? /*#__PURE__*/React.createElement("div", {
      className: "board-wt-wrap"
    }, /*#__PURE__*/React.createElement("span", {
      className: "board-wt"
    }, r.today.toFixed(2)), deltas[r.id] != null && /*#__PURE__*/React.createElement("div", {
      className: "board-delta " + (deltas[r.id] >= 0 ? "up" : "down")
    }, deltas[r.id] >= 0 ? "+" : "", deltas[r.id].toFixed(2))) : /*#__PURE__*/React.createElement("span", {
      className: "board-wt"
    }, r.today.toFixed(2)));
  }));
}
Object.assign(window, {
  Icon,
  Stripe,
  Header,
  Footer,
  AnglerAvatar,
  AnglerCard,
  AnglerRow,
  VideoPlayer,
  VCam,
  Leaderboard,
  fmtViews
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/components.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/data.jsx
try { (() => {
// Castline UI Kit — shared demo data
// Anglers, tournaments, and live-leaderboard fixtures used across screens.
//
// Avatar color rule: each angler has a unique trio drawn from the brand palette —
//   accent  = outer rounded square
//   disc    = inner circle background  (always a LIGHT palette hue, never buff/cream)
//   discText= initials color           (a saturated palette hue, never buff or black)

const ACCENTS = ["#E46B3B", "#577147", "#296E97", "#83BAD4", "#EDC73B", "#213845"];
const ANGLERS = [{
  id: "austin-cranford",
  first: "Austin",
  last: "Cranford",
  initials: "AC",
  state: "Oklahoma",
  disciplines: ["Jerkbait", "Flippin"],
  tag: "Jerkbait & Flippin",
  seasonLb: 52.10,
  rank: 1,
  events: 7,
  bigBag: 24.86,
  accent: "#E46B3B",
  disc: "#EDC73B",
  discText: "#577147",
  photo: "../../assets/stock-flyfishing.jpg",
  bio: "Tulsa-raised power fisherman known for grinding shallow grass lines and a jerkbait bite most write off as finished. Three-time regional qualifier chasing a first national title."
}, {
  id: "marcus-vinroe",
  first: "Marcus",
  last: "Vinroe",
  initials: "MV",
  state: "Alabama",
  disciplines: ["Deep Crank", "Ledge"],
  tag: "Deep Crank & Ledge",
  seasonLb: 49.74,
  rank: 2,
  events: 7,
  bigBag: 23.10,
  accent: "#296E97",
  disc: "#83BAD4",
  discText: "#213845",
  photo: "../../assets/stock-boats.jpg",
  bio: "Offshore specialist who lives on his electronics and built a reputation winning when the fish pull out to the ledges in summer."
}, {
  id: "dana-whitfield",
  first: "Dana",
  last: "Whitfield",
  initials: "DW",
  state: "Texas",
  disciplines: ["Frog", "Punch"],
  tag: "Frog & Punch",
  seasonLb: 47.92,
  rank: 3,
  events: 7,
  bigBag: 22.40,
  accent: "#577147",
  disc: "#AFE0BA",
  discText: "#296E97",
  photo: "../../assets/stock-openwater.png",
  bio: "Heavy-cover hunter from East Texas. If there's matted hydrilla, Dana is punching through it while everyone else idles past."
}, {
  id: "cole-rasmussen",
  first: "Cole",
  last: "Rasmussen",
  initials: "CR",
  state: "Minnesota",
  disciplines: ["Smallmouth", "Drop Shot"],
  tag: "Smallmouth & Drop Shot",
  seasonLb: 46.18,
  rank: 4,
  events: 7,
  bigBag: 19.95,
  accent: "#83BAD4",
  disc: "#B9D6CD",
  discText: "#E46B3B",
  photo: "../../assets/stock-openwater.png",
  bio: "Northern smallmouth ace translating finesse-river instincts into a national run on unfamiliar southern lakes."
}, {
  id: "priya-nandakumar",
  first: "Priya",
  last: "Nandakumar",
  initials: "PN",
  state: "Florida",
  disciplines: ["Sight Fish", "Spinnerbait"],
  tag: "Sight Fish & Spinnerbait",
  seasonLb: 45.03,
  rank: 5,
  events: 7,
  bigBag: 21.72,
  accent: "#213845",
  disc: "#EDC73B",
  discText: "#296E97",
  photo: "../../assets/stock-flyfishing.jpg",
  bio: "Sight-fishing phenom out of the Florida grass flats with the sharpest eyes on tour and a spinnerbait she never puts down."
}, {
  id: "wyatt-boudreaux",
  first: "Wyatt",
  last: "Boudreaux",
  initials: "WB",
  state: "Louisiana",
  disciplines: ["Swim Jig", "Flippin"],
  tag: "Swim Jig & Flippin",
  seasonLb: 43.66,
  rank: 6,
  events: 7,
  bigBag: 20.18,
  accent: "#213845",
  disc: "#83BAD4",
  discText: "#577147",
  photo: "../../assets/stock-boats.jpg",
  bio: "Bayou-bred junk fisherman who can win on a swim jig in a foot of muddy water nobody else will fish."
}, {
  id: "harlan-pope",
  first: "Harlan",
  last: "Pope",
  initials: "HP",
  state: "Tennessee",
  disciplines: ["Topwater", "Crank"],
  tag: "Topwater & Crank",
  seasonLb: 42.20,
  rank: 7,
  events: 6,
  bigBag: 18.40,
  accent: "#E46B3B",
  disc: "#AFE0BA",
  discText: "#296E97",
  photo: "../../assets/stock-openwater.png",
  bio: "River-system topwater specialist who built a following throwing a walking bait when conventional wisdom says go deep."
}, {
  id: "sofia-marchetti",
  first: "Sofia",
  last: "Marchetti",
  initials: "SM",
  state: "California",
  disciplines: ["Finesse", "Spook"],
  tag: "Finesse & Spook",
  seasonLb: 40.95,
  rank: 8,
  events: 6,
  bigBag: 17.85,
  accent: "#577147",
  disc: "#B9D6CD",
  discText: "#577147",
  photo: "../../assets/stock-flyfishing.jpg",
  bio: "West-coast finesse technician carrying clear-water Delta tactics east, one drop-shot limit at a time."
}, {
  id: "trey-ellington",
  first: "Trey",
  last: "Ellington",
  initials: "TE",
  state: "Georgia",
  disciplines: ["Shaky Head", "Dock"],
  tag: "Shaky Head & Dock",
  seasonLb: 39.40,
  rank: 9,
  events: 6,
  bigBag: 16.90,
  accent: "#296E97",
  disc: "#EDC73B",
  discText: "#213845",
  photo: "../../assets/stock-boats.jpg",
  bio: "Dock-skipping dock-hopper from Lake Lanier who turned a backyard fishery into a national platform."
}];
const TOURNAMENT = {
  name: "Primetime Bass Fishing Tournament",
  short: "Primetime Bass",
  day: "DAY 2",
  boats: 62,
  lake: "Lake Guntersville, AL",
  liveViewers: 12480,
  cut: 22.40,
  weather: {
    temp: 74,
    cond: "Clear",
    wind: "SE 8 mph"
  },
  tz: "ET"
};

// live leaderboard = anglers ordered by today's running weight.
// `viewers` + `img` drive the multi-cam strip; `follow` drives the "Following" filter.
const LIVE_BOARD = [{
  id: "austin-cranford",
  name: "Austin Cranford",
  initials: "AC",
  boat: "B-14",
  state: "OK",
  today: 18.42,
  fish: 5,
  viewers: 12483,
  follow: true,
  img: "../../assets/stock-boats.jpg",
  accent: "#E46B3B",
  disc: "#EDC73B",
  discText: "#577147",
  live: true
}, {
  id: "dana-whitfield",
  name: "Dana Whitfield",
  initials: "DW",
  boat: "B-22",
  state: "TX",
  today: 17.96,
  fish: 5,
  viewers: 8120,
  follow: false,
  img: "../../assets/stock-openwater.png",
  accent: "#577147",
  disc: "#AFE0BA",
  discText: "#296E97",
  live: true
}, {
  id: "marcus-vinroe",
  name: "Marcus Vinroe",
  initials: "MV",
  boat: "B-07",
  state: "AL",
  today: 16.30,
  fish: 5,
  viewers: 5630,
  follow: true,
  img: "../../assets/stock-flyfishing.jpg",
  accent: "#296E97",
  disc: "#83BAD4",
  discText: "#213845",
  live: true
}, {
  id: "priya-nandakumar",
  name: "Priya Nandakumar",
  initials: "PN",
  boat: "B-31",
  state: "FL",
  today: 15.11,
  fish: 4,
  viewers: 4310,
  follow: false,
  img: "../../assets/stock-openwater.png",
  accent: "#213845",
  disc: "#EDC73B",
  discText: "#296E97",
  live: false
}, {
  id: "wyatt-boudreaux",
  name: "Wyatt Boudreaux",
  initials: "WB",
  boat: "B-09",
  state: "LA",
  today: 14.88,
  fish: 5,
  viewers: 3920,
  follow: true,
  img: "../../assets/stock-boats.jpg",
  accent: "#213845",
  disc: "#83BAD4",
  discText: "#577147",
  live: true
}, {
  id: "cole-rasmussen",
  name: "Cole Rasmussen",
  initials: "CR",
  boat: "B-18",
  state: "MN",
  today: 13.54,
  fish: 4,
  viewers: 2740,
  follow: false,
  img: "../../assets/stock-flyfishing.jpg",
  accent: "#83BAD4",
  disc: "#B9D6CD",
  discText: "#E46B3B",
  live: false
}, {
  id: "harlan-pope",
  name: "Harlan Pope",
  initials: "HP",
  boat: "B-03",
  state: "TN",
  today: 12.07,
  fish: 4,
  viewers: 2110,
  follow: true,
  img: "../../assets/stock-openwater.png",
  accent: "#E46B3B",
  disc: "#AFE0BA",
  discText: "#296E97",
  live: true
}, {
  id: "sofia-marchetti",
  name: "Sofia Marchetti",
  initials: "SM",
  boat: "B-28",
  state: "CA",
  today: 10.62,
  fish: 3,
  viewers: 1480,
  follow: false,
  img: "../../assets/stock-flyfishing.jpg",
  accent: "#577147",
  disc: "#B9D6CD",
  discText: "#577147",
  live: false
}];
const DISCIPLINES = ["All", "Jerkbait", "Flippin", "Deep Crank", "Frog", "Smallmouth", "Topwater", "Finesse", "Swim Jig"];
Object.assign(window, {
  ANGLERS,
  TOURNAMENT,
  LIVE_BOARD,
  DISCIPLINES,
  ACCENTS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/data.jsx", error: String((e && e.message) || e) }); }

})();
