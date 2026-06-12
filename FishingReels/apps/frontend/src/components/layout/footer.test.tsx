import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

import { Footer } from "./footer"

describe("Footer", () => {
  it("renders the wordmark, copy line, and nav links", () => {
    render(<Footer />)
    expect(screen.getByAltText("Castline")).toBeInTheDocument()
    expect(screen.getByText("2026 Castline Media")).toBeInTheDocument()
    for (const label of ["Anglers", "About", "Terms", "Privacy"]) {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument()
    }
  })

  it("calls onNav with the link key", () => {
    const onNav = vi.fn()
    render(<Footer onNav={onNav} />)
    fireEvent.click(screen.getByRole("button", { name: "Anglers" }))
    expect(onNav).toHaveBeenCalledWith("anglers")
  })
})
