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
    for (const label of ["Anglers", "About"]) {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument()
    }
  })

  it("shows the LIVE badge only when a stream is live", () => {
    const onNav = vi.fn()
    const { rerender } = render(<Header onNav={onNav} />)
    expect(screen.queryByText("LIVE")).not.toBeInTheDocument()

    rerender(<Header live onNav={onNav} />)
    // one badge in the desktop nav, one pinned next to the hamburger
    const badges = screen.getAllByText("LIVE")
    expect(badges).toHaveLength(2)
    fireEvent.click(badges[0])
    expect(onNav).toHaveBeenCalledWith("live")
  })

  it("marks the active link in brand blue", () => {
    render(<Header active="anglers" />)
    expect(screen.getByRole("button", { name: "Anglers" })).toHaveClass("text-cl-sky")
    expect(screen.getByRole("button", { name: "About" })).toHaveClass(
      "text-cl-near-black",
    )
  })

  it("calls onNav when a nav link is clicked", () => {
    const onNav = vi.fn()
    render(<Header onNav={onNav} />)
    fireEvent.click(screen.getByRole("button", { name: "About" }))
    expect(onNav).toHaveBeenCalledWith("about")
  })

  it("opens the drawer, locks body scroll, and closes it", () => {
    render(<Header live />)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(document.body.style.overflow).toBe("")

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }))
    const dialog = screen.getByRole("dialog")
    expect(dialog).toBeInTheDocument()
    expect(document.body.style.overflow).toBe("hidden")
    // drawer-only entries are present; live shows the "On Air" badge
    expect(within(dialog).getByRole("button", { name: /Live/ })).toBeInTheDocument()
    expect(within(dialog).getByText("On Air")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Close menu" }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(document.body.style.overflow).toBe("")
  })

  it("navigates and closes the drawer when a drawer link is tapped", () => {
    const onNav = vi.fn()
    render(<Header onNav={onNav} />)
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }))
    const dialog = screen.getByRole("dialog")
    fireEvent.click(within(dialog).getByRole("button", { name: /About/ }))
    expect(onNav).toHaveBeenCalledWith("about")
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })
})
