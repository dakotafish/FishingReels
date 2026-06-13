import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"

import { RecentCastCard } from "./recent-cast-card"
import { makeStream } from "@/test/fixtures"

function renderCard(stream = makeStream()) {
  return render(
    <MemoryRouter>
      <RecentCastCard stream={stream} />
    </MemoryRouter>,
  )
}

describe("RecentCastCard", () => {
  it("links to the watch page and shows the Ended status for a past cast", () => {
    const stream = makeStream({
      id: "s-42",
      status: "ended",
      started_at: "2026-06-01T15:00:00Z",
    })
    renderCard(stream)

    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "/streams/s-42")
    expect(screen.getByText("Ended")).toBeInTheDocument()
    expect(screen.queryByText("LIVE")).not.toBeInTheDocument()

    // The started date is shown, formatted the same way the streams list does.
    const expected = new Date(stream.started_at).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
    expect(screen.getByText(expected)).toBeInTheDocument()
  })

  it("shows the LIVE badge for a live cast", () => {
    renderCard(makeStream({ status: "live" }))

    expect(screen.getByText("LIVE")).toBeInTheDocument()
    expect(screen.queryByText("Ended")).not.toBeInTheDocument()
  })
})
