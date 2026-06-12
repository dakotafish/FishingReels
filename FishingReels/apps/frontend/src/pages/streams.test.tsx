import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"

import { StreamsPage } from "./streams"
import { makeStream } from "@/test/fixtures"

const mockUseStreams = vi.fn()
vi.mock("@/hooks/use-streams", () => ({
  useStreams: () => mockUseStreams(),
}))

function renderPage() {
  return render(
    <MemoryRouter>
      <StreamsPage />
    </MemoryRouter>,
  )
}

describe("StreamsPage", () => {
  it("splits live and past streams into sections", () => {
    const live = makeStream({
      angler: {
        id: "a1",
        display_name: "Wade Fisher",
        slug: "wade-fisher",
        avatar_url: null,
      },
    })
    const past = makeStream({
      status: "ended",
      ended_at: "2026-06-01T18:00:00Z",
      angler: {
        id: "a2",
        display_name: "Cam Rivers",
        slug: "cam-rivers",
        avatar_url: null,
      },
    })
    mockUseStreams.mockReturnValue({
      streams: [live, past],
      loading: false,
      error: null,
    })

    renderPage()

    expect(screen.getByText("Wade Fisher")).toBeInTheDocument()
    expect(screen.getByText("LIVE")).toBeInTheDocument()
    expect(screen.getByText("Cam Rivers")).toBeInTheDocument()
    expect(screen.getByText("Ended")).toBeInTheDocument()
  })

  it("shows empty states when nothing has streamed", () => {
    mockUseStreams.mockReturnValue({ streams: [], loading: false, error: null })

    renderPage()

    expect(screen.getByText(/no one is live right now/i)).toBeInTheDocument()
    expect(screen.getByText(/no past streams yet/i)).toBeInTheDocument()
  })

  it("shows the error state", () => {
    mockUseStreams.mockReturnValue({
      streams: [],
      loading: false,
      error: "boom",
    })

    renderPage()

    expect(screen.getByText(/couldn’t load streams/i)).toBeInTheDocument()
  })
})
