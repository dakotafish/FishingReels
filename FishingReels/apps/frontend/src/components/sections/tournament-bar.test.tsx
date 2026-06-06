import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"

import { TournamentBar } from "./tournament-bar"

describe("TournamentBar", () => {
  it("renders title, meta, and a CTA slot on a flame card with the small hard shadow", () => {
    const { container } = render(
      <TournamentBar title="Pro Series Championship" meta="LIVE · DAY 2">
        <button>Watch</button>
      </TournamentBar>,
    )
    expect(
      screen.getByRole("heading", { name: "Pro Series Championship" }),
    ).toBeInTheDocument()
    expect(screen.getByText("LIVE · DAY 2")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Watch" })).toBeInTheDocument()

    const bar = container.querySelector('[data-slot="tournament-bar"]')
    expect(bar).toHaveClass("bg-cl-flame", "shadow-card-sm", "border-[2.5px]")
  })
})
