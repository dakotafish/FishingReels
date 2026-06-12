import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router"

import { StreamWatchPage } from "./stream-watch"
import { makeStream } from "@/test/fixtures"

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

const mockUseStream = vi.fn()
vi.mock("@/hooks/use-stream", () => ({
  useStream: (id: string | undefined) => mockUseStream(id),
}))

function renderPage(id = "stream-1") {
  return render(
    <MemoryRouter initialEntries={[`/streams/${id}`]}>
      <Routes>
        <Route path="/streams/:id" element={<StreamWatchPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe("StreamWatchPage", () => {
  it("renders the player and LIVE badge for a live stream", () => {
    const stream = makeStream({
      angler: {
        id: "a1",
        display_name: "Wade Fisher",
        slug: "wade-fisher",
        avatar_url: null,
      },
    })
    mockUseStream.mockReturnValue({ stream, loading: false, error: null })

    const { container } = renderPage(stream.id)

    expect(screen.getByText("Wade Fisher")).toBeInTheDocument()
    expect(screen.getByText("LIVE")).toBeInTheDocument()
    const video = container.querySelector("video")
    expect(video).not.toBeNull()
    expect(screen.getByText(/rewind to the start/i)).toBeInTheDocument()
    // Angler name links to the profile.
    expect(screen.getByRole("link", { name: "Wade Fisher" })).toHaveAttribute(
      "href",
      "/anglers/wade-fisher",
    )
  })

  it("renders the Ended chip for a finished stream", () => {
    const stream = makeStream({
      status: "ended",
      ended_at: "2026-06-01T18:00:00Z",
    })
    mockUseStream.mockReturnValue({ stream, loading: false, error: null })

    renderPage(stream.id)

    expect(screen.getByText("Ended")).toBeInTheDocument()
    expect(screen.queryByText("LIVE")).not.toBeInTheDocument()
  })

  it("shows the error state", () => {
    mockUseStream.mockReturnValue({
      stream: null,
      loading: false,
      error: "API /streams/x failed: 404",
    })

    renderPage("x")

    expect(screen.getByText(/couldn’t load stream/i)).toBeInTheDocument()
  })
})
