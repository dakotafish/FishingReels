import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"

import { useAngler } from "./use-angler"
import { makeAngler } from "@/test/fixtures"

beforeEach(() => {
  vi.restoreAllMocks()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("useAngler", () => {
  it("starts loading, then resolves with the angler for the slug", async () => {
    const angler = makeAngler({ slug: "wade-fisher", display_name: "Wade Fisher" })
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => angler }),
    )

    const { result } = renderHook(() => useAngler("wade-fisher"))
    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.angler).toEqual(angler)
    expect(result.current.error).toBeNull()
    expect(fetch).toHaveBeenCalledWith("/api/anglers/wade-fisher")
  })

  it("captures an error when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 404 }))

    const { result } = renderHook(() => useAngler("ghost"))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.angler).toBeNull()
    expect(result.current.error).toContain("404")
  })

  it("does not fetch when the slug is missing", () => {
    const fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)

    const { result } = renderHook(() => useAngler(undefined))
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe("No angler slug")
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
