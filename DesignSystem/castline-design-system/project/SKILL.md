---
name: castline-design
description: Use this skill to generate well-branded interfaces and assets for Castline, the fan-accessible competitive-fishing platform — either for production or throwaway prototypes/mocks/decks. Contains essential design guidelines, colors, type, fonts, assets, and a web UI kit for prototyping.
user-invocable: true
---

# Castline Design

Castline is a fan-accessible competitive-fishing platform. Brand line:
**Every Angler. Every Cast. Every Story.** Rallying cry: **Cast On.**

Read `README.md` for the full brand context, content fundamentals, visual
foundations, and iconography. Explore the other files:

- `colors_and_type.css` — all design tokens (fonts, color vars, semantic roles, type
  styles) plus primitive components (`.cl-btn`, `.cl-badge-live`, `.cl-card`). Link or
  copy this into any artifact.
- `fonts/` — Rethink Sans (display), Epilogue (labels/body), BBH Hegarty (brushy accent).
- `assets/` — wordmark + fish emblem (blue & ink), racing-stripe rule, halftone dot
  fields, stock imagery, color palette, homepage reference.
- `preview/` — design-system specimen cards.
- `ui_kits/web/` — interactive React UI kit: Home, Anglers list, Angler profile, Live
  tournament. Reusable components in `components.jsx`.

## Non-negotiable brand rules
- **Hard offset shadow** (solid deep-teal `#143B45`, blur-free, ~8px) on cards/buttons —
  never a soft blurred shadow. Press = element travels down-right into its shadow.
- **Video players sit flush** — do NOT put the button/card hard shadow on embedded video.
- **Casing:** display headlines = sentence case with periods; labels/nav/buttons/metadata
  = ALL CAPS, Epilogue ExtraBold, +0.13em tracking.
- **Color in bands:** one dark (ink), one bright (sky), one feature (moss/flame) per page.
  Compose only from the eight brand swatches — don't invent hues.
- **No emoji.** Icons = Lucide (CDN), even ~2px stroke, in ink/cream; flame for live.

## How to work
If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and
produce static/standalone HTML for the user to view. If working on production code, copy
assets and apply the rules here. If invoked with no guidance, ask the user what they want
to build, ask a few focused questions, then act as an expert Castline designer and output
HTML artifacts or production code as needed.
