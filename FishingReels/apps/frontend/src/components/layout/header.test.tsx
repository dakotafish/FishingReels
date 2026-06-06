import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, fireEvent, within } from "@testing-library/react"

import { Header } from "./header"

afterEach(() => {
  // guard against a leaked scroll lock between cases
  document.body.style.overflow = ""
})

describe("Header", () => {
  it("renders the desktop nav vocabulary", () => {
    render(<Header />)
    for (const label of ["Tournaments", "Anglers", "Expos", "About", "Sign In"]) {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument()
    }
  })

  it("marks the active link in brand blue", () => {
    render(<Header active="anglers" />)
    expect(screen.getByRole("button", { name: "Anglers" })).toHaveClass("text-cl-sky")
    expect(screen.getByRole("button", { name: "Tournaments" })).toHaveClass(
      "text-cl-near-black",
    )
  })

  it("calls onNav when a nav link is clicked", () => {
    const onNav = vi.fn()
    render(<Header onNav={onNav} />)
    fireEvent.click(screen.getByRole("button", { name: "Expos" }))
    expect(onNav).toHaveBeenCalledWith("expos")
  })

  it("opens the drawer, locks body scroll, and closes it", () => {
    render(<Header />)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(document.body.style.overflow).toBe("")

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }))
    const dialog = screen.getByRole("dialog")
    expect(dialog).toBeInTheDocument()
    expect(document.body.style.overflow).toBe("hidden")
    // drawer-only entries are present (name includes the "On Air" badge text)
    expect(within(dialog).getByRole("button", { name: /Live/ })).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Close menu" }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(document.body.style.overflow).toBe("")
  })

  it("navigates and closes the drawer when a drawer link is tapped", () => {
    const onNav = vi.fn()
    render(<Header onNav={onNav} />)
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }))
    const dialog = screen.getByRole("dialog")
    fireEvent.click(within(dialog).getByRole("button", { name: /Expos/ }))
    expect(onNav).toHaveBeenCalledWith("expos")
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })
})
