import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router"

import { AnglerProfilePage } from "./angler-profile"
import { makeAngler, makeStream } from "@/test/fixtures"

// jsdom has no MediaSource; force the player down a no-op path.
vi.mock("hls.js", () => ({
  default: class {
    static isSupported() {
      return false
    }
    loadSource() {}
    attachMedia() {}
    destroy() {}
  },
}))

const mockUseAngler = vi.fn()
vi.mock("@/hooks/use-angler", () => ({
  useAngler: (slug: string | undefined) => mockUseAngler(slug),
}))

const mockUseAnglerStreams = vi.fn()
vi.mock("@/hooks/use-angler-streams", () => ({
  useAnglerStreams: (slug: string | undefined) => mockUseAnglerStreams(slug),
}))

beforeEach(() => {
  mockUseAngler.mockReset()
  mockUseAnglerStreams.mockReset()
  // Sensible default: an angler with no streams.
  mockUseAnglerStreams.mockReturnValue({
    live: null,
    casts: [],
    loading: false,
    error: null,
  })
})

function renderPage(slug = "wade-fisher") {
  return render(
    <MemoryRouter initialEntries={[`/anglers/${slug}`]}>
      <Routes>
        <Route path="/anglers/:slug" element={<AnglerProfilePage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe("AnglerProfilePage", () => {
  it("renders the header, recent casts, and bio — no player when not live", () => {
    mockUseAngler.mockReturnValue({
      angler: makeAngler({
        display_name: "Wade Fisher",
        bio: "Bass pro out of Tampa.",
      }),
      loading: false,
      error: null,
    })
    mockUseAnglerStreams.mockReturnValue({
      live: null,
      casts: [
        makeStream({ status: "ended" }),
        makeStream({ status: "ended" }),
      ],
      loading: false,
      error: null,
    })

    const { container } = renderPage()

    expect(screen.getByText("Wade Fisher")).toBeInTheDocument()
    expect(screen.getByText("Bass pro out of Tampa.")).toBeInTheDocument()
    expect(screen.getByText("Recent casts")).toBeInTheDocument()
    expect(
      container.querySelectorAll('[data-slot="recent-cast-card"]'),
    ).toHaveLength(2)
    // No live player when the angler isn't live.
    expect(container.querySelector("video")).toBeNull()
  })

  it("shows the live player when the angler is live", () => {
    mockUseAngler.mockReturnValue({
      angler: makeAngler({ display_name: "Wade Fisher" }),
      loading: false,
      error: null,
    })
    mockUseAnglerStreams.mockReturnValue({
      live: makeStream({ status: "live" }),
      casts: [],
      loading: false,
      error: null,
    })

    const { container } = renderPage()

    expect(container.querySelector("video")).not.toBeNull()
    expect(screen.getByText("Live now")).toBeInTheDocument()
  })

  it("shows an empty state when the angler has no recorded casts", () => {
    mockUseAngler.mockReturnValue({
      angler: makeAngler(),
      loading: false,
      error: null,
    })

    renderPage()

    expect(screen.getByText(/no recorded casts yet/i)).toBeInTheDocument()
  })

  it("falls back to a placeholder when the angler has no bio", () => {
    mockUseAngler.mockReturnValue({
      angler: makeAngler({ display_name: "Wade Fisher", bio: null }),
      loading: false,
      error: null,
    })

    renderPage()

    expect(screen.getByText(/no bio yet/i)).toBeInTheDocument()
  })

  it("shows a loading state while the profile loads", () => {
    mockUseAngler.mockReturnValue({ angler: null, loading: true, error: null })

    renderPage()

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it("shows an error state when the profile can't be loaded", () => {
    mockUseAngler.mockReturnValue({
      angler: null,
      loading: false,
      error: "API /anglers/ghost failed: 404",
    })

    renderPage("ghost")

    expect(screen.getByText(/couldn’t load/i)).toBeInTheDocument()
  })
})
