import { useEffect, useState } from "react"

import { fetchApi, type Angler } from "@/api/client"

type AnglersState = {
  anglers: Angler[]
  loading: boolean
  error: string | null
}

// Fetches the public roster from GET /api/anglers (a plain array — the endpoint
// is not paginated). Cancels its state update if the consumer unmounts first.
export function useAnglers(): AnglersState {
  const [state, setState] = useState<AnglersState>({
    anglers: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    fetchApi<Angler[]>("/anglers")
      .then((anglers) => {
        if (!cancelled) setState({ anglers, loading: false, error: null })
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setState({ anglers: [], loading: false, error: String(e) })
      })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
