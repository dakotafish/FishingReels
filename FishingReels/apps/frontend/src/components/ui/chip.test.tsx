import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"

import { Chip } from "./chip"

describe("Chip", () => {
  it("defaults to the filled sky variant", () => {
    render(<Chip>62 Boats</Chip>)
    const chip = screen.getByText("62 Boats")
    expect(chip).toHaveClass("bg-cl-sky", "text-cl-ink", "rounded-pill")
  })

  it("renders the seafoam outline variant", () => {
    render(<Chip variant="outline">Jerkbait</Chip>)
    const chip = screen.getByText("Jerkbait")
    expect(chip).toHaveClass("border-cl-seafoam", "text-cl-seafoam")
    expect(chip).not.toHaveClass("bg-cl-sky")
  })
})
