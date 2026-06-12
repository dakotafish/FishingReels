import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"

import { useLiveNow } from "./use-live-now"
import { makeStream } from "@/test/fixtures"

beforeEach(() => {
  vi.restoreAllMocks()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe("useLiveNow", () => {
  it("reports live when any stream is live", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [makeStream({ status: "ended" }), makeStream()],
      }),
    )

    const { result } = renderHook(() => useLiveNow())
    expect(result.current).toBe(false)
    await waitFor(() => expect(result.current).toBe(true))
    expect(fetch).toHaveBeenCalledWith("/api/streams")
  })

  it("stays false when no stream is live or the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [makeStream({ status: "ended" })],
      }),
    )
    const { result } = renderHook(() => useLiveNow())
    await waitFor(() => expect(fetch).toHaveBeenCalled())
    expect(result.current).toBe(false)

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }))
    const { result: failed } = renderHook(() => useLiveNow())
    await waitFor(() => expect(fetch).toHaveBeenCalled())
    expect(failed.current).toBe(false)
  })

  it("re-checks on an interval", async () => {
    vi.useFakeTimers()
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] })
    vi.stubGlobal("fetch", fetchMock)

    renderHook(() => useLiveNow())
    expect(fetchMock).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(15_000)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
