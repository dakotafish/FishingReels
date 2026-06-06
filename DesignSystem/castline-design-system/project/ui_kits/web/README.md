# Castline — Web UI Kit

Interactive, click-through recreation of the Castline web platform, built from the
provided Figma homepage and extended into the three requested product surfaces.

## Run it
Open `index.html`. It's a single React + Babel app (no build step). Navigate via the
header, the angler cards, or the LIVE badge.

## Screens
1. **Home** (`HomeScreen.jsx`) — faithful recreation of the Figma homepage: dark hero
   with the "Every Angler. Every Cast. Every Story." headline + emblem, the flame
   tournament bar, the sky-blue Featured Anglers grid, and the green "See every cast"
   photo-split feature.
2. **Anglers** (`AnglersScreen.jsx`) — the full field. Ink page-header with discipline
   filter chips + search, then a sand band of clickable angler cards (filter/sort live).
3. **Angler Profile** (`ProfileScreen.jsx`) — photo cover, avatar + name + discipline
   tags, a 4-up stat row, **Recent casts** video thumbnails, and an About section.
4. **Live Tournament** (`LiveScreen.jsx`) — a live feature player, a leader callout bar,
   and a self-updating live leaderboard with pulsing live dots and ticking weights.

## Components (`components.jsx`)
`Header`, `Footer`, `Stripe` (racing-rule), `AnglerAvatar`, `AnglerCard`,
`VideoPlayer`, `Leaderboard`, `Icon` (Lucide). Buttons/badges/cards come from the
primitives in `../../colors_and_type.css`.

## Conventions & brand rules honored
- **Hard offset shadow** (solid teal, blur-free) on buttons and cards; lift on hover,
  stamp-press down on `:active`.
- **Video players are flush** — `.player` deliberately has **no** hard offset shadow,
  per the brand rule that the button/card drop shadow is not used on integrated video.
- Display type = Rethink Sans (sentence case); labels/nav/metadata = Epilogue ExtraBold
  ALL CAPS at +0.13em; discipline tags use the BBH Hegarty brushy accent.
- Color bands: ink hero, sky feature band, moss feature split, sand list ground.
- Icons are **Lucide via CDN** (substitution — no brand icon set was provided).

## Files
| File | Role |
|---|---|
| `index.html` | Entry — loads React, Babel, Lucide, then the scripts below. |
| `kit.css` | Layout + component styles (on top of root tokens). |
| `data.jsx` | Anglers, tournament, and live-board fixtures. |
| `components.jsx` | Shared components → exported to `window`. |
| `HomeScreen.jsx` `AnglersScreen.jsx` `ProfileScreen.jsx` `LiveScreen.jsx` | Screens. |
| `app.jsx` | Shell + simple screen router. |
