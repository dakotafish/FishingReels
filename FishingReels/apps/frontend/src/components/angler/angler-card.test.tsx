import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

import { AnglerCard } from "./angler-card"
import { makeAngler } from "@/test/fixtures"

describe("AnglerCard", () => {
  it("shows the name and location", () => {
    const angler = makeAngler({
      display_name: "Jordan Wheeler",
      home_town: "Tampa",
      home_state: "FL",
    })
    render(<AnglerCard angler={angler} />)
    expect(
      screen.getByRole("heading", { name: "Jordan Wheeler" }),
    ).toBeInTheDocument()
    expect(screen.getByText("Tampa, FL")).toBeInTheDocument()
  })

  it("opens once from the Profile button (no double-fire from the card)", () => {
    const onOpen = vi.fn()
    const angler = makeAngler()
    render(<AnglerCard angler={angler} onOpen={onOpen} />)
    fireEvent.click(screen.getByRole("button", { name: "Profile" }))
    expect(onOpen).toHaveBeenCalledTimes(1)
    expect(onOpen).toHaveBeenCalledWith(angler)
  })
})
