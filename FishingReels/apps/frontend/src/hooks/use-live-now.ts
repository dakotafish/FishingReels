import { useEffect, useState } from "react"

import { fetchApi, type Stream } from "@/api/client"

const POLL_MS = 15_000

// Polls GET /api/streams so the header LIVE badge tracks whether anyone is
// actually live. Keeps the last known value if a poll fails, so a flaky
// request doesn't flicker the badge.
export function useLiveNow(): boolean {
  const [live, setLive] = useState(false)

  useEffect(() => {
    let cancelled = false

    const check = () => {
      fetchApi<Stream[]>("/streams")
        .then((streams) => {
          if (!cancelled) setLive(streams.some((s) => s.status === "live"))
        })
        .catch(() => {})
    }

    check()
    const id = setInterval(check, POLL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return live
}
