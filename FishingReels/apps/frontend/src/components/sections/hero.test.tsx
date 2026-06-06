import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"

import { Hero } from "./hero"

describe("Hero", () => {
  it("renders the title and lede on an ink band", () => {
    const { container } = render(
      <Hero title="Every angler. Every cast." lede="Cast on." />,
    )
    expect(
      screen.getByRole("heading", { name: "Every angler. Every cast." }),
    ).toBeInTheDocument()
    expect(screen.getByText("Cast on.")).toBeInTheDocument()
    expect(container.querySelector('[data-slot="hero"]')).toHaveClass("bg-cl-ink")
  })

  it("shows the emblem by default and hides it when disabled", () => {
    const { rerender, container } = render(<Hero title="Title" />)
    expect(container.querySelector("img")).toBeInTheDocument()
    rerender(<Hero title="Title" showEmblem={false} />)
    expect(container.querySelector("img")).not.toBeInTheDocument()
  })

  it("renders children below the title grid", () => {
    render(
      <Hero title="Title">
        <div>tournament bar slot</div>
      </Hero>,
    )
    expect(screen.getByText("tournament bar slot")).toBeInTheDocument()
  })
})
