import type { Angler } from "@/api/client"

// "Tampa, FL" · "FL" · "" — joins hometown and state, tolerating missing pieces.
export function locationOf(
  angler: Pick<Angler, "home_town" | "home_state">,
): string {
  return [angler.home_town, angler.home_state].filter(Boolean).join(", ")
}
