import { useEffect, useState } from "react"

import { fetchApi, type Angler } from "@/api/client"

type AnglerState = {
  angler: Angler | null
  loading: boolean
  error: string | null
}

// Fetches one public profile from GET /api/anglers/:slug. Cancels its state
// update if the consumer unmounts first.
export function useAngler(slug: string | undefined): AnglerState {
  const [state, setState] = useState<AnglerState>({
    angler: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!slug) return
    let cancelled = false

    fetchApi<Angler>(`/anglers/${slug}`)
      .then((angler) => {
        if (!cancelled) setState({ angler, loading: false, error: null })
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setState({ angler: null, loading: false, error: String(e) })
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  // Derived, not set in the effect: an absent slug can't load anything.
  if (!slug) return { angler: null, loading: false, error: "No angler slug" }
  return state
}
