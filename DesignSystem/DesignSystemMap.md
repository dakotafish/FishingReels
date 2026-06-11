# Castline Design System — Build Map

> Personal reference for implementing the Castline frontend in the FishingReels codebase.
> Source of truth: `DesignSystem/castline-design-system/project/` — primarily `colors_and_type.css`
> (tokens + primitives) and `ui_kits/web/kit.css` (layout + composed components).
> Brand line: **Every Angler. Every Cast. Every Story.** · Rallying cry: **Cast On.**

**Vibe in one sentence:** retro-Americana sporting brand meets modern broadcast — warm cream paper,
deep teal ink, sun-faded lake palette, bold display type, halftone dots, racing-stripe rules, and a
signature **hard (blur-free) offset shadow** that makes cards/buttons read like letterpress stickers.

**Five non-negotiable brand rules** (repeated everywhere in the source — treat as invariants):
1. **Hard offset shadow** — solid deep-teal `#143B45`, **never** a soft/blurred shadow.
2. **Video players sit flush** — the card/button hard shadow must **NOT** be applied to embedded video.
3. **Casing:** display headlines = sentence case with periods; labels/nav/buttons/metadata = ALL CAPS, Epilogue ExtraBold, +0.13em tracking.
4. **Color in bands:** one dark (ink), one bright (sky), one feature (moss/flame) per long page. Compose only from the 8 brand swatches — don't invent hues.
5. **No emoji.** Functional icons = Lucide (CDN substitution), even ~2px stroke; flame reserved for live/active.

---

## 1. Token Inventory

All tokens are CSS custom properties defined in `colors_and_type.css` (`:root`), except `--edge-gutter`
(defined in `kit.css`). Values are literal; semantic tokens alias the core/support palette.

### 1a. Core palette — the 8 brand swatches

| Token | Value | Intended use |
|---|---|---|
| `--sky` | `#83BAD4` | Primary **brand** blue — hero/display type, the emblem, the bright feature band, links/active nav. |
| `--ink` | `#213845` | Deep teal — dark hero/section bands, primary text on light, all 2.5px borders. |
| `--paper` | `#FFF9EF` | Warm cream — default light page ground, text on dark grounds. |
| `--flame` | `#E46B3B` | Burnt orange — **primary CTA**, LIVE badge, racing-stripe rule, active/live affordances. |
| `--moss` | `#577147` | Field green — alternate "feature" section background; also the discipline-tag color on light. |
| `--seafoam` | `#B9D6CD` | Pale mint — secondary text on dark grounds, soft surfaces, outline-chip stroke on ink. |
| `--gold` | `#EDC73B` | Sunlit yellow — avatar discs, weather icon, highlights. Use **sparingly**. |
| `--carbon` | `#1C1A17` | Near-black — video well background, max-contrast fine print. |

### 1b. Extended / support palette

| Token | Value | Intended use |
|---|---|---|
| `--sand` | `#EBE1CE` | Tan paper — large alt fills, the list/roster band ground, `Dots_Tan` field, row-hover bg. |
| `--paper-warm` | `#FFF7EA` | Slightly warmer paper tint (subtle surface variation). |
| `--shadow-teal` | `#143B45` | The hard offset-shadow color under cards & buttons. **Only** used inside shadow tokens. |
| `--deep-blue` | `#296E97` | Darker blue — stat figures, footer/caption links, search-icon, muted text on cream. |
| `--mint-text` | `#AFE0BA` | Mint body copy that rides on moss-green feature sections. |
| `--near-black` | `#2B272A` | Label/nav text color on light (header links). |

### 1c. Semantic role tokens (aliases — prefer these in app code)

| Token | Resolves to | Intended use |
|---|---|---|
| `--bg` | `--paper` | Default page background. |
| `--bg-alt` | `--sand` | Alternate/secondary surface band. |
| `--bg-dark` | `--ink` | Dark band background. |
| `--bg-section` | `--sky` | Bright feature band background. |
| `--bg-feature` | `--moss` | Green feature-split background. |
| `--fg` | `--ink` | Primary text on light. |
| `--fg-muted` | `--deep-blue` | Secondary text on light. |
| `--fg-on-dark` | `--paper` | Primary text on ink/moss. |
| `--fg-on-dark-muted` | `--seafoam` | Secondary text on dark. |
| `--fg-brand` | `--sky` | Brand-blue display text. |
| `--accent` | `--flame` | Primary CTA / live accent. |
| `--accent-fg` | `--paper` | Text/icon color on flame. |
| `--link` | `--deep-blue` | Inline link color. |
| `--surface` | `--paper` | Card/control surface. |
| `--surface-border` | `--ink` | Card/control border color. |

### 1d. Typography

**Font families** (real provided TTFs in `fonts/` — no substitution needed):

| Token | Value | Intended use |
|---|---|---|
| `--font-display` | `"Rethink Sans", system-ui, sans-serif` | Big bold headlines, stats, names. Weights 400–800 (variable). |
| `--font-label` | `"Epilogue", system-ui, sans-serif` | ALL-CAPS eyebrows, nav, buttons, badges, metadata. Use ExtraBold (800). |
| `--font-body` | `"Epilogue", system-ui, sans-serif` | Paragraphs and UI body. Weights 100–900 (variable). |
| `--font-accent` | `"BBH Hegarty", "Rethink Sans", cursive` | Brushy personality lines (discipline tags, signatures). Use **rarely**. Weight 400. |

> Note: BBH Hegarty is used **upright** — the design system explicitly set `font-style: normal` (user removed the italic slant). Display = Rethink Sans, Labels + Body both = Epilogue.

**Semantic type styles** (utility classes in `colors_and_type.css` — these encode the real scale):

| Class | Family / weight | Size | Leading / tracking | Intended use |
|---|---|---|---|---|
| `.cl-hero` | display / 800 | `clamp(3rem, 8vw, 9.5rem)` | 0.96 / −0.01em | Page-dominating hero headline (brand-blue). |
| `.cl-h1` | display / 800 | `clamp(2.4rem, 5vw, 4.5rem)` | 1.0 / −0.01em | Top section/page titles. |
| `.cl-h2` | display / 700 | `clamp(1.8rem, 3.2vw, 2.85rem)` | 1.04 / −0.005em | Sub-section titles. |
| `.cl-h3` | display / 700 | `1.6rem` | 1.1 | Card/block headings. |
| `.cl-eyebrow` | label / 800 | `0.85rem` | +0.13em, UPPERCASE | Eyebrows, nav, metadata labels. |
| `.cl-stat` | display / 800 | `2rem` | 1.0 / +0.01em | Numeric data figures (weights, counts). |
| `.cl-body` | body / 400 | `1.05rem` | 1.6 | Paragraph copy on light. |
| `.cl-lede` | body / 500 | `1.1rem` | 1.5 / +0.09em, UPPERCASE | On-dark intro/lede copy (airy caps). |
| `.cl-small` | body / 500 | `0.8rem` | 1.4 / +0.04em | Small print / captions. |
| `.cl-accent` | accent / 400 | `1.4rem` | — | Brushy discipline tags / signatures. |

### 1e. Radii

| Token | Value | Intended use |
|---|---|---|
| `--r-sm` | `6px` | Chips, small buttons, tiny labels. |
| `--r-md` | `10px` | Buttons, inputs, stat boxes. |
| `--r-lg` | `16px` | Cards, panels, leaderboards, video players. |
| `--r-xl` | `28px` | Large feature cards. |
| `--r-pill` | `999px` | Badges, filter chips, segmented toggles, the LIVE chip. |

### 1f. Shadows (signature — hard / blur-free only)

| Token | Value | Intended use |
|---|---|---|
| `--shadow-card` | `8px 8px 0 0 var(--shadow-teal)` | Default resting card shadow. |
| `--shadow-card-sm` | `5px 5px 0 0 var(--shadow-teal)` | Smaller controls (primary button, tournament bar, stat box). |
| `--shadow-press` | `3px 3px 0 0 var(--shadow-teal)` | `:active` state — element travels down-right into a shrunken shadow. |

> Hover convention (not a token, but consistent): the shadow *grows* (`6px 6px` for buttons, `11px 11px` for cards) and the element lifts up-left 1–2px. **Never** apply any of these to `.player` (video). There are **no soft/blurred drop shadows** anywhere in the system.

### 1g. Spacing scale (8pt base)

| Token | Value | | Token | Value |
|---|---|---|---|---|
| `--s-1` | `4px` | | `--s-6` | `32px` |
| `--s-2` | `8px` | | `--s-7` | `48px` |
| `--s-3` | `12px` | | `--s-8` | `64px` |
| `--s-4` | `16px` | | `--s-9` | `96px` |
| `--s-5` | `24px` | | `--s-10` | `128px` |

Intended use: vertical/horizontal rhythm. Section band padding lives around `--s-9` (`76px` desktop, dialed to `44px` at phone). Card inner padding ≈ `--s-5` (`20–24px`). Element gaps ≈ `--s-2`/`--s-3`.

### 1h. Motion & layout tokens

| Token | Value | Intended use |
|---|---|---|
| `--ease` | `160ms cubic-bezier(0.4, 0, 0.2, 1)` | Standard transition for transform/shadow/color. Restrained — no bounces. |
| `--edge-gutter` | `57px` (→ `18px` ≤640px) | **(kit.css)** Shared page edge inset locking the header and live tournament bar to the same vertical guides. |
| `.wrap` | `max-width: 1240px; padding: 0 72px` (→ `0 28px` ≤980px, `0 18px` ≤640px) | **(kit.css)** Centered content column for most sections. |

**Pulse keyframes:** `cl-pulse` (live badge dot, 1.4s) and `pulse` (board live-dot, 1.6s) — both opacity/scale flashes, disabled under `prefers-reduced-motion`.

---

## 2. Component Inventory

Two tiers: **primitives** (`colors_and_type.css`, framework-agnostic classes) and **kit components**
(`ui_kits/web/{components.jsx,kit.css}`, React + CSS). In the FishingReels build these become
React/shadcn components; the props below come from the prototype's JSX.

### 2a. Primitives (`.cl-*`)

| Component | Class(es) | What it is / when to use | Variants & rules |
|---|---|---|---|
| **Primary button** | `.cl-btn` | The default CTA — flame fill, cream caps label, 2.5px ink border, small hard shadow. Use for the main action ("Watch Tournament"). | Hover: lift −1px, shadow→6px. Active: translate +3px, shadow→`--shadow-press` (stamp). Label is Epilogue 800 UPPERCASE +0.12em. |
| **Ghost button** | `.cl-btn.cl-btn--ghost` | Secondary action — cream fill, flame text, ink border. | Same shape/shadow as primary; lower emphasis. |
| **Outline button** | `.cl-btn.cl-btn--outline` | On-dark tertiary — transparent, cream border+text, **no shadow**. Hover inverts to cream fill / ink text. | Use on ink/moss bands. Can be re-tinted to ink (see `buttons.html` "About"). |
| **Live badge** | `.cl-badge-live` | Flame pill with a pulsing white dot + ALL-CAPS label ("LIVE", "LIVE · DAY 2"). The brand's signature live signal. | Dot + text are **white** (`--paper`) on flame. Pulses via `cl-pulse`. Runs smaller in header (`.hdr-live`) and on video tiles (`.vcam-live`). |
| **Card** | `.cl-card` | Base surface — cream, 2.5px ink border, `--r-lg`, full `--shadow-card`. Compose richer cards on top. | Cards essentially always carry the hard shadow + ink border (the defining trait). |
| **Chips** (specimen) | `.chip--sky`, `.chip--outline` | Static metadata pills ("62 BOATS", "JERKBAIT"). `--sky` = filled on ink; `--outline` = seafoam stroke on ink. | From `badges-chips.html`. Pill radius, Epilogue 800 caps +0.1em. |

### 2b. Kit components (React, exported to `window`)

| Component | File | Props | What it is / usage rules |
|---|---|---|---|
| **Icon** | components.jsx | `name, size=20, className, style` | Lucide glyph wrapper (`<i data-lucide>`). ~2px stroke. Ink on light, cream on dark, flame for live/active. No emoji, no filled glyphs (except the live dot). |
| **Stripe** | components.jsx | — | The racing-stripe rule (`retro-lines.png`, orange-over-blue). Full-bleed divider under the header and above the footer. Bleed is clipped via `overflow-x: clip` on its containers. |
| **Header** | components.jsx | `active, onNav` | Sticky top header (cream, 123px). Big sky-blue wordmark left; Epilogue-caps nav right (Tournaments / Anglers / Expos / About / Sign In) + LIVE badge + search. Collapses to a **hamburger drawer** ≤820px. Active link = `--sky`, hover = `--flame`. |
| **Mobile drawer** | components.jsx (in Header) | (internal `menuOpen`) | Full-screen ink panel with dot texture. Links use the **web nav vocabulary** (Epilogue caps, sized up) + Lucide icons + docked search on a flame rule. Burger has **no box outline**; turns **cream** in the open state and stays visible. Locks body scroll. |
| **Footer** | components.jsx | `onNav` | Cream bar, single row: sky wordmark + "2026 Castline Media · Terms · Privacy" beside it, nav links right, Stripe beneath. Shares the header's 57px gutter. |
| **AnglerAvatar** | components.jsx | `angler, square=96, disc=66, fontSize=24` | Initials disc on an accent square. **Color rule:** `disc` = a *light* palette hue, `discText` (initials) = a *saturated* palette hue — **never** cream/buff or black (a real contrast bug that was fixed). `accent` = outer square. |
| **AnglerCard** | components.jsx | `angler, onOpen` | Grid-view roster card — avatar + season-weight stat, name, state (flame), discipline tag (brushy), PROFILE button. Cream card, ink border, full hard shadow; hover lifts −2px / shadow→11px. |
| **AnglerRow** | components.jsx | `angler, onOpen` | List-view variant of the card (mirrors the leaderboard row). Rank · avatar · name+state · discipline · season weight · PROFILE. Toggled against `AnglerCard`; on phones the whole row is tappable (PROFILE button & standalone discipline column drop, discipline moves inline). |
| **VideoPlayer** | components.jsx | `image, caption, live=true, views, flat=false, timestamp, boat` | Embedded player — **flush, NO hard shadow** (brand rule). `--r-lg` by default; `flat` = squared corners (standard rectangular feed). Shows LIVE badge, optional boat chip, watching count, center play, scrubber, and either a caption or a live timecode. |
| **VCam** | components.jsx | `row, rank, active, onClick` | Multi-cam thumbnail tile in the live scroller — thumb (no border/outline), LIVE badge, viewer count, rank/short-name/weight. Click swaps it into the main `VideoPlayer`. Flush, no shadow/stroke. |
| **Leaderboard** | components.jsx | `rows, onOpen, activeId, deltas, rankMap` | Live standings table — Rank / Angler (disc + name + boat·state subline) / Fish / Today weight. `#1` rank renders flame. `deltas` adds a +/− column (up=moss, down=flame); `activeId` highlights the watched row (sand bg + flame inset bar); `rankMap` preserves overall rank under filtered views. Reflows to compact rows ≤640px. |

### 2c. Composed layout blocks (CSS-only, in `kit.css`)

These are page-section patterns rather than discrete components — recreate them as layout components.

| Block | Key classes | What it is / rules |
|---|---|---|
| **Hero (home)** | `.hero`, `.hero-inner`, `.hero-title`, `.hero-lede`, `.hero-emblem` | Ink band with blue dot texture (screen blend, ~25%). Sky display title + seafoam all-caps lede + fish emblem. Title left-edge & emblem right-edge align to the tournament bar's guides. Emblem hidden ≤980px. |
| **Tournament bar** | `.tbar`, `.tbar-title`, `.tbar-meta` | Flame card on the ink hero — title + meta + CTA. Carries `--shadow-card-sm` (it's a card, not video). Stacks vertically ≤640px. |
| **Section band** | `.band`, `.band--sky/--moss/--sand`, `.section-head`, `.section-title`, `.section-link` | Full-bleed flat color band; content on `.wrap`. One flat color per major section. `.section-link` is an ink underline that turns flame on hover. |
| **Feature split** | `.feature`, `.feature-text`, `.feature-title`, `.feature-copy`, `.feature-img` | 50/50 moss-text ÷ full-bleed photo. Mint (`--mint-text`) caps copy on green. Collapses to 1 column ≤980px. |
| **Page header band** | `.phead`, `.phead-title`, `.phead-sub` | Ink page-intro band with dot texture; sky title + seafoam sub. Used atop Anglers/Profile. |
| **Filters / chips / search** | `.filters`, `.chip-btn`, `.search-box` | Filter chip row (seafoam outline → flame when active) + a cream pill search box (min 360px desktop, full-width mobile). **Note:** the Anglers page intentionally *removed* discipline filter chips — discipline lives only as the accent tag on cards/profiles. These styles still exist for other uses. |
| **View toggle** | `.view-toggle`, `.view-btn` | Pill segmented grid/list switch (ink-fill active) for the Anglers roster. |
| **Profile** | `.pcover`, `.phead-card`, `.pavatar`, `.pname`, `.ploc`, `.stat-row`, `.stat-box`, `.moment-grid` | Photo cover (gradient scrim) + overlapping avatar/name, a 4-up stat row (`--shadow-card-sm` boxes), and a 3-up "recent casts" grid. |
| **Live bar** | `.livebar`, `.livebar-title`, `.livebar-day`, `.livebar-meta`, `.livebar-wx`, `.livebar-clock` | Compact ink strip with a flame bottom border — title (sky) + day chip + boats/cut/location + weather (gold icon) + ticking ET clock. Aligned to `--edge-gutter`. |
| **Live stage** | `.livestage`, `.livestage-grid` | 1.7fr video ÷ 1fr board two-column live layout (`min-width:0` to prevent grid blowout). 1 column ≤980px. |
| **Multi-cam scroller** | `.mcam`, `.vcam-row`, `.mcam-arrow` | Horizontal scroll strip of `VCam` tiles with prev/next arrows + themed scrollbar. |
| **Board panel + segmented** | `.board-panel-title`, `.seg`, `.seg-btn`, `.board-all` | Live board with a `Top 10 / Following / All 62` segmented control (ink-fill active) and a "view all" CTA. |
| **Leader callout** | `.live-callout` | Card below the player showing the watched boat — carries `--shadow-card-sm`. |

---

## 3. Tailwind Integration Notes

> ⚠️ **Important — the task says "map to `tailwind.config.ts`," but this project has no `tailwind.config.ts`.**
> Per `CLAUDE.md`, FishingReels runs **Tailwind v4 with CSS-first config** in
> `apps/frontend/src/index.css` (`@import "tailwindcss"; @theme inline { … }`) plus **shadcn/ui**.
> So integration happens in `index.css` `@theme` + `:root`, **not** a JS config. The notes below target
> that reality and flag conflicts with shadcn's CSS-variable conventions. (Confirmed: no `tailwind.config.*`
> exists; `components.json` drives shadcn.)

> **✅ Implemented** in `FishingReels/apps/frontend/src/index.css` per the §5 decisions: `--cl-*` brand
> tokens (oklch + hex comments), shadcn semantic vars remapped onto them, `shadow-card*` hard-shadow
> utilities, literal radii, the three Fontsource fonts, the `cl-pulse` animation, and the `.wrap` / `.edge`
> layout helpers. The `.dark` block and `dark` variant were removed. The notes below remain as the rationale
> record; see the **Implementation status** section at the end for the file map.

**Current state of `index.css`:** stock shadcn neutral theme — `--background`/`--foreground`/`--primary`/
`--card`/`--accent`/`--destructive`/`--border`/`--ring`/`--radius` etc. in **oklch grayscale**, font is
**Geist Variable**, with a `.dark` block and a `--radius: 0.625rem` calc-based radius scale. None of it is
Castline yet — this is what we override.

### What to ADD
- **`@font-face` for the three brand fonts** (copy `fonts/*.ttf` into `apps/frontend/public/fonts/` or `src/assets`): Rethink Sans (400–800), Epilogue (100–900), BBH Hegarty (400).
- **Brand palette + support + shadow vars** in `:root` (the hex values from §1a–1c). Either keep hex or convert to oklch to match shadcn's format (decision in Open Questions).
- **Castline type tokens** in `@theme`: `--font-display`, `--font-label`, `--font-accent` (shadcn only ships `--font-sans`/`--font-heading`). Repoint `--font-sans` → Epilogue.
- **Hard-shadow tokens** `--shadow-card`, `--shadow-card-sm`, `--shadow-press` → exposed as `--shadow-*` so `shadow-card` utilities exist. Tailwind's default `shadow-*` scale is all soft/blurred — these must be custom.
- **Brand radii** `--r-sm/md/lg/xl/pill` (or remap onto Tailwind's `--radius-*`).
- **`--edge-gutter`** and a `wrap`/container helper for the 1240px / 72px content column.

### What to EXTEND / map onto shadcn semantic vars
shadcn components read `--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`,
`--card`, `--popover`, `--border`, `--input`, `--ring`, `--destructive`. Proposed mapping:

| shadcn var | Castline value | Note |
|---|---|---|
| `--background` / `--foreground` | `--paper` / `--ink` | Clean fit. |
| `--card` / `--card-foreground` | `--paper` / `--ink` | Add ink border + hard shadow via component class, not the var. |
| `--primary` / `--primary-foreground` | **decision** (`--flame` or `--ink`) / `--paper` | shadcn `--primary` drives the default Button. Castline's CTA is flame, but flame is also "accent/live." See Open Questions. |
| `--secondary` | `--sand` or `--seafoam` | Ghost/secondary surfaces. |
| `--accent` | `--sky` | Brand blue; but note Castline's own `--accent` token = flame — **naming collision** (see below). |
| `--muted` / `--muted-foreground` | `--sand` / `--deep-blue` | |
| `--border` / `--input` | `--ink` | Castline uses a heavy **2.5px** ink border; shadcn defaults to 1px — override border-width too. |
| `--ring` | `--sky` or `--flame` | Focus ring. |
| `--destructive` | **none exists** — decision needed | Brand has no danger token (see Open Questions). |

### Conflicts to FLAG against shadcn defaults
1. **`--accent` means opposite things.** shadcn `--accent` = a subtle hover/muted surface; Castline `--accent` = flame (the loud CTA color). Don't let the names collide — namespace Castline tokens (`--cl-accent`/`--cl-flame`) so app code stays unambiguous.
2. **Radius model mismatch.** shadcn derives everything from one `--radius` (0.625rem ≈ 10px) via `calc()` (sm=0.6×, md=0.8×, lg=1×, xl=1.4× …). Castline uses **discrete** radii (6/10/16/28/999px) where lg=16px (cards) and xl=28px (feature) don't fall on the calc curve. Either set `--radius: 16px` and accept drift, or override `--radius-sm/md/lg/xl` to the literal Castline values. **Recommend the latter.**
3. **Shadow model mismatch.** shadcn/Tailwind shadows are soft and blurred; Castline's are hard, 0-blur, single-color offsets. The default `shadow`, `shadow-md`, `shadow-lg` utilities are off-brand — introduce `shadow-card`/`shadow-card-sm`/`shadow-press` and avoid the stock ones. **And never apply any shadow to video.**
4. **Border weight.** Castline's defining 2.5px ink outline ≠ shadcn's 1px. Need a brand border-width (e.g. `border-[2.5px] border-ink`) baked into the card/button components.
5. **Dark mode.** shadcn ships a `.dark` theme (and a `dark` variant is wired in `index.css`). Castline has **no light/dark duality** — it's a band system (ink/sky/moss/sand grounds on one cream page). Decide whether to keep `.dark` at all (see Open Questions).
6. **Color format.** shadcn theme is oklch; Castline source is hex. Mixing is fine functionally but inconsistent — pick one (recommend converting Castline hex → oklch to match the existing file).
7. **Font swap.** Geist (current) → Epilogue/Rethink/BBH Hegarty. `--font-sans` and `--font-heading` both need repointing; add display/label/accent tokens.

---

## 4. Patterns & Conventions

**Color composition (per page):** exactly one **dark** band (ink), one **bright** band (sky), one
**feature** band (moss or flame). Flat full-bleed color bands stacked vertically — **never gradients**
for the band itself (gradients appear only as photo-legibility scrims). Don't introduce hues outside the 8.

**Casing is the signature move (two registers side by side):**
- **Display = sentence case, period-punctuated,** often a triad ("Every Angler. Every Cast. Every Story.").
- **Labels / eyebrows / nav / buttons / metadata = ALL CAPS,** Epilogue ExtraBold, **+0.13em** tracking
  (`LIVE · DAY 2`, `62 BOATS`, `VIEW ALL 62 ANGLERS`, `52.10 LB · SEASON`).

**Cards:** cream surface + **2.5px ink border** + **hard teal offset shadow** + `--r-lg`. This trio is the
brand's tactile "sticker" look and is near-universal for interactive cards. Stat boxes / tournament bar use
the smaller `--shadow-card-sm`.

**Video is the exception:** flush, no hard shadow, no stroke — `--r-lg` or squared (`flat`). This applies to
the main player *and* the multi-cam tiles.

**Interaction physics (consistent everywhere):**
- **Hover:** lift up-left ~1–2px, hard shadow *grows*; links underline or shift to flame/deep-blue.
- **Press (`:active`):** element travels **down-right into its shadow** (`--shadow-press`, ~3px) — a physical stamp. **No color inversion.**
- **Motion:** restrained, ~160ms ease-out (`--ease`). Short fades/slides only — no bounces or decorative loops. Honor `prefers-reduced-motion` (pulses already do).

**Spacing rhythm:** 8pt scale. Section bands ≈ 76px vertical padding (→44px phone). Content lives in the
1240px `.wrap` (72px gutter) — **except** the header, footer, and live bar, which align to the shared
**`--edge-gutter` (57px)** instead. Card padding ≈ 20–24px.

**Typography pairing:** Rethink Sans (display: headlines, names, stats) + Epilogue (everything else:
nav/labels caps & body) + BBH Hegarty **upright**, used sparingly for discipline tags / personality.

**Iconography:** Lucide via the **`lucide-react`** package (behind the `Icon` wrapper; the glyph source is
swappable if a bespoke set ever ships). Even ~2px stroke to match the 2.5px borders. Ink on light, cream on
dark, **flame only for live/active**. Stroke style only (no fills except the live dot). **No emoji, no
unicode-as-icon.** The fish emblem is the only mascot.

**Avatar color rule:** every angler gets a unique trio from the palette — `accent` (outer square),
`disc` (inner circle, always a *light* hue), `discText` (initials, always a *saturated* hue). Never
cream/buff or black initials (prevents the invisible-on-dark bug that was fixed in the prototype). In the
build these are **derived deterministically** from the angler id (`src/lib/avatar.ts`) — disc and initials
are drawn from disjoint light/saturated pools, so the rule holds for every angler without storing colors.

**Responsive intent (from the mobile pass):** desktop-first, then layered breakpoints — **≤980px** (grids →
1 col, emblem hidden), **≤820px** (nav → hamburger drawer), **≤640px** (gutters→18px, tables → Option B
**compact rows**, type scaled down with tighter hierarchy, home roster defaults to list view), **≤380px**
(further type/scale trims). Tables become compact rows (chosen over stacked cards), folding low-priority
columns into a subline rather than dropping data. Keep the LIVE badge pinned at every width.

---

## 5. Resolved Decisions

These were the build-time open questions; each is now a settled decision (walked through 2026-06-06). They drive the token foundation and component port.

1. **`--primary` semantic → ink.** shadcn/Button `--primary` maps to **ink** (calm default), and **flame is opt-in via an explicit CTA variant** — this protects the "use flame sparingly" rule and keeps flame for true CTAs/live. A bare `<Button>` is ink; the brand flame CTA is `variant="cta"`.
2. **Destructive / danger token → dedicated danger red.** Destructive actions use a **single danger red defined as a functional/system token *outside* the 8 brand bands** (the same way error/validation colors are conventionally exempt). This keeps "delete" visually distinct from the flame CTA. Maps to shadcn `--destructive`.
3. **Dark mode → none.** Castline isn't a light/dark system. **Drop shadcn's `.dark` block and the `dark` custom-variant entirely**; "darkness" is expressed only via the ink/carbon bands on the one cream page. A real dark variant is deferred (YAGNI) and not carried speculatively.
4. **Token format & namespace → oklch + hex comment, `--cl-*` namespace.** Brand swatches are written in **oklch with the source hex in a trailing comment** (consistent with the existing file, still verifiable). Brand tokens are **namespaced `--cl-*`** (e.g. `--cl-flame`, `--cl-accent`) to avoid the `--accent` meaning-collision; shadcn semantic vars *reference* the `--cl-*` tokens.
5. **Radius strategy → literal override.** Override shadcn's calc-based `--radius-sm/md/lg/xl` to Castline's **literal values** (6 / 10 / 16 / 28px) plus a pill/full 999px. The calc curve is dropped so cards (16) / feature cards (28) render at the exact brand radius.
6. **Icon set → lucide-react now, swappable later.** Standardize on **`lucide-react`** (already a dependency) behind a thin `Icon` wrapper that bakes in the ink/cream/flame conventions. The wrapper is built so the glyph source can be **swapped to a bespoke brand set later** if one is commissioned.
7. **Fonts in production → Fontsource for all three.** All three brand fonts are on Fontsource (incl. BBH Hegarty — OFL, Studio Drama, single 400 weight): `@fontsource-variable/rethink-sans`, `@fontsource-variable/epilogue`, `@fontsource/bbh-hegarty`. **Drop `@fontsource-variable/geist`.** Apply `font-style: normal` to keep BBH upright. No licensing blocker; no self-hosted TTFs.
8. **Scope of screens & data model → Homepage + Anglers list; wire what exists.** Only **Homepage + the Anglers list** are in scope now (the `Angler` model genuinely supports a real roster). **Angler Profile-stats and the Live tournament screen are deferred** until Tournament/Participant/Leaderboard tables exist. For prototype fields with no backend home: use `avatar_url` with a **deterministically-derived** initials/color trio fallback (don't store colors — `accent`/`disc`/`discText` are derived from id/display_name); **omit/placeholder** `seasonLb`/`rank`/`bigBag` (no tables yet); and treat `disciplines`/`tag` as a **separate future backend decision** rather than faking it. Real `Angler` fields: `display_name`, `slug`, `bio`, `avatar_url`, `status`, `home_state`, `home_town`.
9. **Static `.cl-*` primitives → React/shadcn components.** Port `.cl-btn`, `.cl-card`, `.cl-badge-live` (etc.) as **React/shadcn components in `src/components/ui/`** (cva variants + `cn()`), matching the existing `card.tsx`. **No parallel `.cl-*` CSS layer** — one coherent component layer. The 2.5px ink border + hard shadow live in the component classes, not the shadcn vars.
10. **`--edge-gutter` vs `.wrap` → keep both as named helpers.** Both horizontal systems are intentional and kept: an **edge-gutter wrapper (57px)** for header/footer/live bar, and a **`.wrap` container (1240px / 72px)** for content sections — codified as explicit, named layout helpers so the chrome-wider-than-content alignment stays deliberate.

---

## 6. Implementation status

Built in `FishingReels/apps/frontend/` (all with colocated Vitest tests). Scope = **Homepage + Anglers list** (Q8a); Angler **Profile** stats and the **Live tournament** screen are deferred until tournament/leaderboard tables exist.

**Tokens & theme:** `src/index.css` (see §3 banner).

**Primitives** (`src/components/ui/`): `button.tsx` (variants `default`=ink / `cta`=flame / `ghost` / `outline` / `destructive`), `card.tsx` (ink border + hard shadow), `badge-live.tsx`, `icon.tsx`, `chip.tsx`.

**Layout chrome** (`src/components/layout/`): `container.tsx` (`Wrap` + `EdgeGutter`), `stripe.tsx`, `header.tsx` (+ mobile drawer), `footer.tsx`, `site-layout.tsx`.

**Home sections** (`src/components/sections/`): `hero.tsx`, `tournament-bar.tsx`, `section-band.tsx` (+ `SectionLink`), `feature-split.tsx`.

**Anglers** (`src/components/angler/`): `angler-avatar.tsx` (photo or derived fallback), `angler-card.tsx`, `angler-row.tsx`, `view-toggle.tsx`. Data via `src/hooks/use-anglers.ts` → `GET /api/anglers`; helpers in `src/lib/avatar.ts` + `src/lib/angler.ts`.

**Routing & pages:** `src/app-routes.tsx`, `src/pages/{home,anglers,angler-profile}.tsx`; `App.tsx` mounts `<BrowserRouter>`.

**Deferred / not built:** season-weight stat, rank, and discipline tag on cards/rows (no backend field — Q8b); the Angler Profile body; the Live tournament screen, multi-cam scroller, leaderboard, and video player (§2 documents these from the prototype for when their data lands).

### Source files referenced
- `castline-design-system/project/README.md` — brand context, content/visual foundations, iconography, index.
- `castline-design-system/project/colors_and_type.css` — all tokens + `.cl-*` primitives.
- `castline-design-system/project/ui_kits/web/kit.css` — layout + composed component styles (+ mobile pass).
- `castline-design-system/project/ui_kits/web/components.jsx` — React component props/structure.
- `castline-design-system/project/ui_kits/web/data.jsx` — angler/tournament fixtures (data shape).
- `castline-design-system/project/_ds_manifest.json` — machine-readable token + card manifest.
- `castline-design-system/project/preview/*.html` — specimen cards (buttons, badges-chips, type, colors, radii, shadow, spacing).
- `castline-design-system/chats/*.md` — design-iteration intent (mobile decisions, brand rules, fixes).
- `FishingReels/apps/frontend/src/index.css` + `components.json` — current Tailwind v4 / shadcn setup to integrate into.
```
