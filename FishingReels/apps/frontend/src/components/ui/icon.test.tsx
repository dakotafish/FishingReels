import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { Fish } from "lucide-react"

import { Icon } from "./icon"

describe("Icon", () => {
  it("renders the provided Lucide glyph as an svg", () => {
    const { container } = render(<Icon icon={Fish} />)
    const svg = container.querySelector("svg")
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass("lucide-fish")
  })

  it("applies default size (20) and ~2px stroke", () => {
    const { container } = render(<Icon icon={Fish} />)
    const svg = container.querySelector("svg")!
    expect(svg).toHaveAttribute("width", "20")
    expect(svg).toHaveAttribute("stroke-width", "2")
  })

  it("respects size and strokeWidth overrides", () => {
    const { container } = render(<Icon icon={Fish} size={32} strokeWidth={1.5} />)
    const svg = container.querySelector("svg")!
    expect(svg).toHaveAttribute("width", "32")
    expect(svg).toHaveAttribute("stroke-width", "1.5")
  })

  it("tints flame when live", () => {
    const { container } = render(<Icon icon={Fish} live />)
    expect(container.querySelector("svg")).toHaveClass("text-cl-flame")
  })
})
