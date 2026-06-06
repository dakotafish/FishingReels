// Deterministic avatar identity for anglers without a photo (Q8b: the prototype's
// accent/disc/discText trio is *derived* from the angler, never stored).
//
// Brand rule (a fixed prototype bug): the inner disc is always a LIGHT hue and the
// initials are always a SATURATED hue — never cream/buff or black — so initials
// stay legible. We therefore draw the disc and the initials from disjoint pools.

// Outer square — saturated brand hues.
export const AVATAR_ACCENTS = [
  "var(--cl-sky)",
  "var(--cl-flame)",
  "var(--cl-moss)",
  "var(--cl-deep-blue)",
  "var(--cl-ink)",
] as const

// Inner disc — light hues.
export const AVATAR_DISCS = [
  "var(--cl-seafoam)",
  "var(--cl-sand)",
  "var(--cl-paper-warm)",
  "var(--cl-mint-text)",
] as const

// Initials — saturated hues (no cream/buff, no black).
export const AVATAR_DISC_TEXTS = [
  "var(--cl-flame)",
  "var(--cl-moss)",
  "var(--cl-deep-blue)",
  "var(--cl-ink)",
] as const

export type AvatarColors = {
  accent: string
  disc: string
  discText: string
}

// FNV-1a — small, stable, dependency-free string hash.
function hashString(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// Same seed → same trio, every render and every session.
export function deriveAvatarColors(seed: string): AvatarColors {
  const h = hashString(seed)
  return {
    accent: AVATAR_ACCENTS[h % AVATAR_ACCENTS.length],
    disc: AVATAR_DISCS[Math.floor(h / 7) % AVATAR_DISCS.length],
    discText: AVATAR_DISC_TEXTS[Math.floor(h / 53) % AVATAR_DISC_TEXTS.length],
  }
}

// "Jordan Wheeler" → "JW"; "Cher" → "CH"; "" → "?".
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
