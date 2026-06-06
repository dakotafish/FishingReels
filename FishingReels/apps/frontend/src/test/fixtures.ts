import type { Angler } from "@/api/client"

let seq = 0

// Builds a valid Angler with unique id/slug; override any field per test.
export function makeAngler(overrides: Partial<Angler> = {}): Angler {
  seq += 1
  return {
    id: `id-${seq}`,
    display_name: `Angler ${seq}`,
    slug: `angler-${seq}`,
    bio: null,
    avatar_url: null,
    status: "active",
    home_state: "FL",
    home_town: "Tampa",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  }
}
