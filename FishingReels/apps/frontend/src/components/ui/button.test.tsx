import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

import { Button } from "./button"

describe("Button", () => {
  it("renders its label", () => {
    render(<Button>Watch live</Button>)
    expect(
      screen.getByRole("button", { name: "Watch live" }),
    ).toBeInTheDocument()
  })

  it("defaults to the calm ink variant with the brand border + hard shadow", () => {
    render(<Button>Default</Button>)
    const btn = screen.getByRole("button")
    expect(btn).toHaveClass("bg-primary", "border-cl-ink", "shadow-card-sm")
  })

  it("renders the flame CTA variant", () => {
    render(<Button variant="cta">Cast on</Button>)
    expect(screen.getByRole("button")).toHaveClass("bg-cl-flame", "text-cl-paper")
  })

  it("renders the on-dark outline variant with no hard shadow", () => {
    render(<Button variant="outline">About</Button>)
    const btn = screen.getByRole("button")
    expect(btn).toHaveClass("border-cl-paper", "bg-transparent")
    expect(btn).not.toHaveClass("shadow-card-sm")
  })

  it("renders as a child element via asChild", () => {
    render(
      <Button asChild>
        <a href="/anglers">Anglers</a>
      </Button>,
    )
    const link = screen.getByRole("link", { name: "Anglers" })
    expect(link).toHaveAttribute("href", "/anglers")
    expect(link).toHaveClass("bg-primary")
  })

  it("fires onClick when enabled", () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Go</Button>)
    fireEvent.click(screen.getByRole("button"))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("does not fire onClick when disabled", () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Go
      </Button>,
    )
    fireEvent.click(screen.getByRole("button"))
    expect(onClick).not.toHaveBeenCalled()
  })
})
