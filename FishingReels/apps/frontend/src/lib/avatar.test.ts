import { describe, it, expect } from "vitest"

import {
  AVATAR_DISCS,
  AVATAR_DISC_TEXTS,
  deriveAvatarColors,
  getInitials,
} from "./avatar"

describe("deriveAvatarColors", () => {
  it("is deterministic for a given seed", () => {
    expect(deriveAvatarColors("angler-123")).toEqual(deriveAvatarColors("angler-123"))
  })

  it("varies across seeds", () => {
    const seeds = ["a", "b", "c", "d", "e", "f", "g", "h"]
    const accents = new Set(seeds.map((s) => deriveAvatarColors(s).accent))
    expect(accents.size).toBeGreaterThan(1)
  })

  it("always picks a light disc and a saturated (non-cream/black) initials color", () => {
    for (const seed of ["x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9"]) {
      const { disc, discText } = deriveAvatarColors(seed)
      expect(AVATAR_DISCS).toContain(disc)
      expect(AVATAR_DISC_TEXTS).toContain(discText)
      // never carbon/near-black or paper/cream for the initials
      expect(discText).not.toBe("var(--cl-carbon)")
      expect(discText).not.toBe("var(--cl-paper)")
    }
  })
})

describe("getInitials", () => {
  it("uses first + last initial", () => {
    expect(getInitials("Jordan Wheeler")).toBe("JW")
  })

  it("uses two letters for a single name", () => {
    expect(getInitials("Cher")).toBe("CH")
  })

  it("collapses extra whitespace and ignores middle names", () => {
    expect(getInitials("  Mary  Anne  Cobb ")).toBe("MC")
  })

  it("falls back for empty input", () => {
    expect(getInitials("")).toBe("?")
  })
})
