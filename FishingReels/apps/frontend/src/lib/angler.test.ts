import { describe, it, expect } from "vitest"

import { locationOf } from "./angler"

describe("locationOf", () => {
  it("joins hometown and state", () => {
    expect(locationOf({ home_town: "Tampa", home_state: "FL" })).toBe("Tampa, FL")
  })

  it("falls back to whichever part exists", () => {
    expect(locationOf({ home_town: null, home_state: "TX" })).toBe("TX")
    expect(locationOf({ home_town: "Austin", home_state: null })).toBe("Austin")
  })

  it("returns an empty string when both are missing", () => {
    expect(locationOf({ home_town: null, home_state: null })).toBe("")
  })
})
