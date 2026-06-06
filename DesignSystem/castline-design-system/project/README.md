# Castline — Design System

> **Every Angler. Every Cast. Every Story.**
> Brand rallying cry: **Cast On.**

Castline is a fan-accessible competitive-fishing platform. Where the sport has
historically spotlighted a handful of big names and big moments, Castline gives
**every** angler visibility, audience, and identity — and gives fans a closer,
more connected seat to the action. It is positioned not as "another fishing
league" but as a **platform** spanning tournaments, media, technology, apparel,
events, and community.

This repository is the canonical source for Castline's brand foundations,
visual language, reusable UI, and asset library. Use it to build on-brand
interfaces and marketing artifacts.

---

## Brand Foundation

- **Purpose** — To connect and advance the fishing community through greater visibility, access, and engagement.
- **Vision** — To become the platform that brings anglers, fans, and the future of fishing together.
- **Mission** — To make competitive fishing more accessible, connected, and engaging, giving every angler the opportunity to be seen and every fan the opportunity to be closer to the sport.
- **Belief** — Fishing is at its best when everyone has the opportunity to participate, be seen, and belong.
- **Rallying cry** — *Cast On.*

### Name rationale
**Cast** = action, opportunity, the moment an angler takes a chance.
**Line** = connection (angler↔fish, competitor↔fan, story↔audience, tradition↔future).
Together: *the connection created through every cast.*

### Taglines
- **Platform tagline:** Every Angler. Every Cast. Every Story.
- **Expression tagline / rallying cry:** Cast On.

---

## Source materials (provided)

- **Figma** — `Castline_Homepage.fig` (mounted read-only). Page-1 → `Castline_Web_AJ`
  frame is the full homepage at 2560px wide. The `index.jsx` reconstruction is the
  layout/type/color source of truth.
- **Brand palette** — `assets/color-palette.png` (eight swatches).
- **Logos** — `assets/logo-blue.png`, `assets/logo-ink.png` (the *Castline.* script wordmark).
- **Emblems** — `assets/emblem-blue.png`, `assets/emblem-ink.png` ("Castline Fishing · Cast On" fish roundel). `assets/emblem-full.svg` is the inner fish-pair mark extracted from Figma.
- **Textures** — `assets/retro-lines.png` (orange + blue stacked rules), `assets/dots-blue.png`, `assets/dots-tan.png` (fine halftone dot fields).
- **Stock imagery** — `assets/stock-boats.jpg` (tournament launch dock), `assets/stock-openwater.png` (lone boat, open water), `assets/stock-flyfishing.jpg` (warm low-angle anglers).
- **Reference render** — `assets/homepage-reference.png`.

> The homepage is the only finished screen provided. The **Anglers list**,
> **Angler profile**, and **Live tournament** pages in `ui_kits/` are designed in
> this project, extending the homepage's established language.

---

## CONTENT FUNDAMENTALS

**Voice — inclusive, confident, plainspoken.** Castline speaks for the whole field,
not the leaderboard. The through-line is *everyone matters*: "every angler, every
moment, every story." Copy is optimistic and forward-looking without being hype-y.

- **Person:** Brand-as-"we" in manifesto copy ("We believe…", "Castline exists to…").
  Reader addressed indirectly; product UI is direct and functional ("Watch Tournament", "View all 62 anglers").
- **Casing — the signature move.** Two registers run side by side:
  - **Display headlines = sentence case**, period-punctuated, often a triad:
    *"Every Angler. Every Cast. Every Story."*, *"See every cast"*, *"Primetime Bass Fishing Tournament"*.
  - **Labels, eyebrows, nav, buttons, metadata = ALL CAPS** with wide tracking (~0.13em):
    `LIVE·DAY 2`, `TOURNAMENTS`, `ANGLERS`, `EXPOS`, `ABOUT`, `SIGN IN`, `WATCH TOURNAMENT`,
    `62 BOATS`, `VIEW ALL 62 ANGLERS`, `2026 CASTLINE MEDIA`.
- **Triads & cadence.** Three-beat phrasing is core ("Angler / Cast / Story";
  "accessible / connected / engaging"). Short declarative sentences. End the big
  statements with periods — even fragments — for a stamped, certain feel.
- **Fishing vernacular, used plainly.** Discipline tags read like an angler would
  say them: *"Jerkbait & Flippin"*. Stats are concrete: *"52.10 LB · SEASON"*, *"DAY 2"*, *"62 BOATS"*.
- **Numbers earn their place.** Counts and weights are shown because they carry
  meaning (boats, pounds, day-of-event), never as decorative stats.
- **No emoji.** None appear in the brand. Iconography does the lightweight signalling instead.
- **Tone examples:**
  - Manifesto: *"For too long, competitive fishing has only shown fans a fraction of the action. Castline changes that — connecting viewers to every angler, every moment, and every story unfolding on the water in real time."*
  - Rallying: *"Cast On."* — two words, optimistic, doubles as apparel/event line.

---

## VISUAL FOUNDATIONS

**Overall vibe:** retro-Americana sporting brand meets modern broadcast. Warm cream
paper, deep teal ink, a sun-faded lake-day palette, bold condensed-feeling display
type, halftone dot fields and stacked racing-stripe rules. Confident, tactile,
print-poster energy — never glossy or techy.

### Color
- **Anchors:** Sky blue `#83BAD4` (the hero/brand color — big display type, the
  emblem, the lighter feature band) and Deep teal `#213845` (dark hero band,
  primary text, borders). Warm cream `#FFF9EF` / tan `#EBE1CE` is the default
  light ground.
- **Accents:** Burnt orange `#E46B3B` for CTAs, the LIVE badge, and the racing-stripe
  rule. Field green `#577147` for alternate feature sections (mint `#AFE0BA`/`#B9D6CD`
  body text rides on it). Gold `#EDC73B` very sparingly (e.g. avatar disc).
- **Rule of thumb:** one dark band (teal), one bright band (sky), one feature band
  (green or orange) per long page. Don't introduce new hues — compose from the eight.

### Typography
- **Display:** *Rethink Sans* (700–800), tight leading (~0.96–1.0), slight negative
  tracking. Sentence case. This carries every headline.
- **Labels/UI:** *Epilogue* ExtraBold, ALL CAPS, +0.13em tracking for eyebrows, nav,
  buttons, badges, metadata.
- **Body:** *Epilogue* Regular/Medium. On-dark intro copy is set ALL CAPS Medium with
  ~0.09em tracking and airy 1.5 leading.
- **Accent:** *BBH Hegarty* (brushy retro) for occasional personality lines (angler
  discipline tags / signatures). Use rarely.

### Backgrounds & texture
- Solid color **bands**, full-bleed, stacked vertically — not gradients. Each major
  section owns a flat color.
- **Halftone dot fields** (`dots-blue`, `dots-tan`) layer subtle texture onto flat bands.
- **Racing-stripe rule** (`retro-lines`): an orange bar over a blue bar, used as a
  full-width divider between the header and the hero.
- Full-bleed **photography** appears as half-and-half splits with a color band (see the
  green "See every cast" section). Imagery is warm, sun-flared, golden-hour — natural
  and editorial, never cool/clinical. Open-water shots skew bright sky-blue.

### Shape, borders, corners
- **Corner radii:** buttons/inputs ~10px, cards ~16px, large feature cards ~28px,
  pills fully round (badges, the LIVE chip).
- **Borders:** crisp **2.5px deep-teal** outlines on cards and buttons — a defining trait.
- **Signature shadow:** a **solid, blur-free offset shadow** in darker teal
  (`#143B45`), ~8px down-right. It reads like a sticker/letterpress lift. There are
  **no soft blurred drop shadows** anywhere.
  - ⚠️ **Important usage rule:** this hard button/card shadow must **NOT** be applied
    to embedded **video players**. Videos sit flush (border or none), without the
    offset shadow.

### Motion & states
- Animation is **restrained** — short fades/slide-ins on entrance, no bounces, no
  decorative loops. Standard easing (~160ms, ease-out).
- **Hover:** buttons/cards lift up-left ~1px and the hard shadow grows slightly.
  Links underline or shift to deep-blue.
- **Press:** the element travels down-right into its shadow (shadow shrinks to ~3px) —
  a physical "stamp" press. No color inversion.
- **Transparency/blur:** used minimally. Photo bands may carry a subtle teal/cream
  color wash for text legibility rather than a blur.

### Layout
- Wide, poster-like compositions on a generous left margin. Full-bleed color bands;
  content set on an internal max-width. Grids of equal cards (the featured-angler
  3-up). Sticky top header over the hero. Fixed header height with the racing-stripe
  rule pinned beneath it.

---

## ICONOGRAPHY

See `ICONOGRAPHY` notes inline below and in component usage:

- **No bespoke icon font ships in the brand assets.** The provided marks are the
  **Castline wordmark** (`logo-*`) and the **fish roundel emblem** (`emblem-*`),
  both as PNG, plus the extracted inner fish mark as SVG (`emblem-full.svg`).
- For functional UI glyphs (search, chevrons, play, location pin, share, etc.) this
  system uses **[Lucide](https://lucide.dev)** via CDN — a clean, even-stroke
  open-source set whose **~2px geometric stroke** matches the emblem's line weight and
  the brand's crisp 2.5px borders. This is a **substitution** (no brand icon set was
  provided) — flagged for review.
- Icons render in **deep teal** on light grounds and **cream** on dark grounds; the
  **flame orange** is reserved for active/live affordances. Stroke style only — avoid
  filled glyphs except the live dot.
- **No emoji. No unicode-as-icon.** The fish emblem is the only mascot.

---

## CAVEATS & SUBSTITUTIONS

- **Fonts** are the genuine provided files (Rethink Sans, Epilogue, BBH Hegarty) as
  variable/TTF — no substitution needed.
- **Icons:** Lucide via CDN substitutes for an unshipped brand icon set (see above).
- Only the **homepage** was a finished design; the three requested product pages are
  original extensions of its language, pending brand review.

---

## INDEX — what's in this system

| Path | What it is |
|---|---|
| `README.md` | This file — brand context, content & visual foundations, iconography, index. |
| `colors_and_type.css` | All design tokens: fonts, color vars, semantic roles, type styles, primitive components (button, badge, card). |
| `SKILL.md` | Agent Skill manifest for using this system in Claude Code. |
| `fonts/` | Rethink Sans, Epilogue, BBH Hegarty (TTF). |
| `assets/` | Logos, emblems, color palette, textures (retro-lines, dots), stock imagery, homepage reference. |
| `preview/` | Design-system cards (colors, type, components) shown in the Design System tab. |
| `ui_kits/web/` | Web UI kit — reusable JSX components + interactive screens (homepage, anglers list, angler profile, live tournament). |

### UI kits
- **`ui_kits/web/`** — the Castline web platform. `index.html` is an interactive,
  click-through demo across four screens. Components live as small JSX files
  (header, footer, buttons, angler card, hero, tournament bar, video player, etc.).
