import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

import { SectionBand, SectionLink } from "./section-band"

describe("SectionBand", () => {
  it("applies the tone background and renders title + content", () => {
    const { container } = render(
      <SectionBand tone="sky" title="Anglers">
        <p>roster</p>
      </SectionBand>,
    )
    expect(container.querySelector('[data-slot="section-band"]')).toHaveClass(
      "bg-cl-sky",
    )
    expect(screen.getByRole("heading", { name: "Anglers" })).toBeInTheDocument()
    expect(screen.getByText("roster")).toBeInTheDocument()
  })

  it("renders the action slot", () => {
    render(
      <SectionBand
        title="Anglers"
        action={<SectionLink>View all 62</SectionLink>}
      >
        body
      </SectionBand>,
    )
    expect(screen.getByRole("button", { name: "View all 62" })).toBeInTheDocument()
  })
})

describe("SectionLink", () => {
  it("fires onClick", () => {
    const onClick = vi.fn()
    render(<SectionLink onClick={onClick}>View all</SectionLink>)
    fireEvent.click(screen.getByRole("button", { name: "View all" }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
