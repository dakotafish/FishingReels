import { useEffect, useState } from "react"

import { fetchApi, type Stream } from "@/api/client"

type StreamState = {
  stream: Stream | null
  loading: boolean
  error: string | null
}

// Fetches one stream from GET /api/streams/:id. Cancels its state update if
// the consumer unmounts first.
export function useStream(id: string | undefined): StreamState {
  const [state, setState] = useState<StreamState>({
    stream: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!id) return
    let cancelled = false

    fetchApi<Stream>(`/streams/${id}`)
      .then((stream) => {
        if (!cancelled) setState({ stream, loading: false, error: null })
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setState({ stream: null, loading: false, error: String(e) })
      })

    return () => {
      cancelled = true
    }
  }, [id])

  // Derived, not set in the effect: an absent id can't load anything.
  if (!id) return { stream: null, loading: false, error: "No stream id" }
  return state
}
