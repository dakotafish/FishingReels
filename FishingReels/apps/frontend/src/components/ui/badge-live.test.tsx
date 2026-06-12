import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"

import { BadgeLive } from "./badge-live"

describe("BadgeLive", () => {
  it("defaults to a LIVE label on a flame pill", () => {
    render(<BadgeLive />)
    const badge = screen.getByText("LIVE")
    expect(badge).toHaveClass("bg-cl-flame", "rounded-pill", "text-cl-paper")
  })

  it("accepts a custom label", () => {
    render(<BadgeLive>On Air</BadgeLive>)
    expect(screen.getByText("On Air")).toBeInTheDocument()
  })

  it("pulses the dot but disables animation under reduced motion", () => {
    render(<BadgeLive />)
    const dot = document.querySelector('[data-slot="badge-live-dot"]')
    expect(dot).toHaveClass("animate-cl-pulse", "motion-reduce:animate-none")
  })
})
