import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"

import { useAnglers } from "./use-anglers"
import type { Angler } from "@/api/client"

const sample: Angler[] = [
  {
    id: "1",
    display_name: "Jordan Wheeler",
    slug: "jordan-wheeler",
    bio: null,
    avatar_url: null,
    status: "active",
    home_state: "FL",
    home_town: "Tampa",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
]

beforeEach(() => {
  vi.restoreAllMocks()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("useAnglers", () => {
  it("starts loading, then resolves with the roster", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => sample,
      }),
    )

    const { result } = renderHook(() => useAnglers())
    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.anglers).toEqual(sample)
    expect(result.current.error).toBeNull()
    expect(fetch).toHaveBeenCalledWith("/api/anglers")
  })

  it("captures an error when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500 }),
    )

    const { result } = renderHook(() => useAnglers())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.anglers).toEqual([])
    expect(result.current.error).toContain("500")
  })
})
