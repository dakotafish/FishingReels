import { useEffect, useState } from "react"

import { fetchApi, type Stream } from "@/api/client"

type StreamsState = {
  streams: Stream[]
  loading: boolean
  error: string | null
}

// Fetches all streams from GET /api/streams (newest first). Live/ended are
// split client-side from the one fetch. Cancels its state update if the
// consumer unmounts first.
export function useStreams(): StreamsState {
  const [state, setState] = useState<StreamsState>({
    streams: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    fetchApi<Stream[]>("/streams")
      .then((streams) => {
        if (!cancelled) setState({ streams, loading: false, error: null })
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setState({ streams: [], loading: false, error: String(e) })
      })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
