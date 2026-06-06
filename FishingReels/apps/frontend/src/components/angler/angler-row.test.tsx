import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

import { AnglerRow } from "./angler-row"
import { makeAngler } from "@/test/fixtures"

describe("AnglerRow", () => {
  it("shows the name and location", () => {
    const angler = makeAngler({
      display_name: "Mara Lopez",
      home_town: "Austin",
      home_state: "TX",
    })
    render(<AnglerRow angler={angler} />)
    expect(screen.getByRole("heading", { name: "Mara Lopez" })).toBeInTheDocument()
    expect(screen.getByText("Austin, TX")).toBeInTheDocument()
  })

  it("opens when the row is clicked", () => {
    const onOpen = vi.fn()
    const angler = makeAngler()
    render(<AnglerRow angler={angler} onOpen={onOpen} />)
    fireEvent.click(screen.getByRole("heading", { name: angler.display_name }))
    expect(onOpen).toHaveBeenCalledWith(angler)
  })
})
