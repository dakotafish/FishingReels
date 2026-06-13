import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act, waitFor } from "@testing-library/react"

import { useAnglerStreams } from "./use-angler-streams"
import { makeStream } from "@/test/fixtures"

const wade = { id: "a1", display_name: "Wade Fisher", slug: "wade", avatar_url: null }
const mara = { id: "a2", display_name: "Mara Lopez", slug: "mara", avatar_url: null }

beforeEach(() => {
  vi.restoreAllMocks()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe("useAnglerStreams", () => {
  it("splits this angler's streams into a live one and recent casts, ignoring others", async () => {
    const liveStream = makeStream({ angler: wade, status: "live" })
    const castA = makeStream({ angler: wade, status: "ended" })
    const castB = makeStream({ angler: wade, status: "ended" })
    const otherAngler = makeStream({ angler: mara, status: "live" })
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [liveStream, castA, castB, otherAngler],
      }),
    )

    const { result } = renderHook(() => useAnglerStreams("wade"))
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.live).toEqual(liveStream)
    // Order preserved from the API response (newest first).
    expect(result.current.casts).toEqual([castA, castB])
    expect(fetch).toHaveBeenCalledWith("/api/streams")
  })

  it("reports no live stream when the angler only has past casts", async () => {
    const cast = makeStream({ angler: wade, status: "ended" })
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => [cast] }),
    )

    const { result } = renderHook(() => useAnglerStreams("wade"))
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.live).toBeNull()
    expect(result.current.casts).toEqual([cast])
  })

  it("picks up a stream that goes live while viewing, on the next poll", async () => {
    vi.useFakeTimers()
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValue({
        ok: true,
        json: async () => [makeStream({ angler: wade, status: "live" })],
      })
    vi.stubGlobal("fetch", fetchMock)

    const { result } = renderHook(() => useAnglerStreams("wade"))
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0)
    })
    expect(result.current.live).toBeNull()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(15_000)
    })
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(result.current.live).not.toBeNull()
  })

  it("captures an error when the initial request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    const { result } = renderHook(() => useAnglerStreams("wade"))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toContain("500")
    expect(result.current.live).toBeNull()
    expect(result.current.casts).toEqual([])
  })
})
