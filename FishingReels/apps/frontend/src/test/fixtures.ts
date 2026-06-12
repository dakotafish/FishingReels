import type { Angler, Stream } from "@/api/client"

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

// Builds a valid Stream (live by default) with a unique id; override per test.
export function makeStream(overrides: Partial<Stream> = {}): Stream {
  seq += 1
  return {
    id: `stream-${seq}`,
    status: "live",
    started_at: "2026-06-01T15:00:00Z",
    ended_at: null,
    playlist_url: `/streams/stream-${seq}/index.m3u8`,
    angler: {
      id: `id-${seq}`,
      display_name: `Angler ${seq}`,
      slug: `angler-${seq}`,
      avatar_url: null,
    },
    created_at: "2026-06-01T15:00:00Z",
    updated_at: "2026-06-01T15:00:00Z",
    ...overrides,
  }
}
