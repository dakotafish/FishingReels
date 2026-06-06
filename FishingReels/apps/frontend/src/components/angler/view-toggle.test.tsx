import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

import { ViewToggle } from "./view-toggle"

describe("ViewToggle", () => {
  it("reflects the active view via aria-pressed", () => {
    render(<ViewToggle value="grid" onChange={() => {}} />)
    expect(screen.getByRole("button", { name: "Grid view" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
    expect(screen.getByRole("button", { name: "List view" })).toHaveAttribute(
      "aria-pressed",
      "false",
    )
  })

  it("calls onChange with the chosen view", () => {
    const onChange = vi.fn()
    render(<ViewToggle value="grid" onChange={onChange} />)
    fireEvent.click(screen.getByRole("button", { name: "List view" }))
    expect(onChange).toHaveBeenCalledWith("list")
  })
})
