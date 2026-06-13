import { useEffect, useState } from "react"

import { fetchApi, type Stream } from "@/api/client"

const POLL_MS = 15_000

type AnglerStreamsState = {
  /** The angler's currently-live stream, if any. */
  live: Stream | null
  /** The angler's past (non-live) streams, newest first (API order). */
  casts: Stream[]
  loading: boolean
  error: string | null
}

type Fetched = {
  streams: Stream[]
  loading: boolean
  error: string | null
}

// Polls GET /api/streams and derives this angler's live stream + recent casts.
// Polling (not a one-shot fetch) means the live player appears on a profile the
// moment its angler goes live, and clears when the stream ends. A failed poll
// keeps the last known streams, so a flaky request doesn't blank the page.
export function useAnglerStreams(slug: string | undefined): AnglerStreamsState {
  const [state, setState] = useState<Fetched>({
    streams: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!slug) return
    let cancelled = false

    const check = () => {
      fetchApi<Stream[]>("/streams")
        .then((streams) => {
          if (!cancelled) setState({ streams, loading: false, error: null })
        })
        .catch((e: unknown) => {
          if (!cancelled)
            setState((prev) =>
              prev.loading
                ? { streams: [], loading: false, error: String(e) }
                : prev,
            )
        })
    }

    check()
    const id = setInterval(check, POLL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [slug])

  if (!slug) return { live: null, casts: [], loading: false, error: null }

  const mine = state.streams.filter((s) => s.angler?.slug === slug)
  return {
    live: mine.find((s) => s.status === "live") ?? null,
    casts: mine.filter((s) => s.status !== "live"),
    loading: state.loading,
    error: state.error,
  }
}
