import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"

import { useStreams } from "./use-streams"
import { makeStream } from "@/test/fixtures"

beforeEach(() => {
  vi.restoreAllMocks()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("useStreams", () => {
  it("starts loading, then resolves with the streams", async () => {
    const sample = [makeStream(), makeStream({ status: "ended" })]
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => sample,
      }),
    )

    const { result } = renderHook(() => useStreams())
    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.streams).toEqual(sample)
    expect(result.current.error).toBeNull()
    expect(fetch).toHaveBeenCalledWith("/api/streams")
  })

  it("captures an error when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500 }),
    )

    const { result } = renderHook(() => useStreams())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.streams).toEqual([])
    expect(result.current.error).toContain("500")
  })
})
