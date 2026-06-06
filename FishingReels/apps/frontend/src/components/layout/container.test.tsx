import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"

import { Wrap, EdgeGutter } from "./container"

describe("container helpers", () => {
  it("Wrap applies the centered content-column class", () => {
    render(<Wrap>content</Wrap>)
    expect(screen.getByText("content")).toHaveClass("wrap")
  })

  it("EdgeGutter applies the edge-gutter class", () => {
    render(<EdgeGutter>chrome</EdgeGutter>)
    expect(screen.getByText("chrome")).toHaveClass("edge")
  })

  it("merges extra className", () => {
    render(<Wrap className="flex">content</Wrap>)
    expect(screen.getByText("content")).toHaveClass("wrap", "flex")
  })
})
