import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"

import { FeatureSplit } from "./feature-split"

describe("FeatureSplit", () => {
  it("renders title and copy on the moss text panel", () => {
    render(<FeatureSplit title="Field reports" copy="Every cast, every story." />)
    expect(
      screen.getByRole("heading", { name: "Field reports" }),
    ).toBeInTheDocument()
    expect(screen.getByText("Every cast, every story.")).toBeInTheDocument()
  })

  it("sets the photo half as a background image when provided", () => {
    const { container } = render(
      <FeatureSplit title="T" image="/photo.jpg" />,
    )
    const imageHalf = container.querySelector('[data-slot="feature-split"] > div:last-child') as HTMLElement
    expect(imageHalf.style.backgroundImage).toContain("/photo.jpg")
  })

  it("marks the photo half decorative when no image is given", () => {
    const { container } = render(<FeatureSplit title="T" />)
    const imageHalf = container.querySelector('[data-slot="feature-split"] > div:last-child')
    expect(imageHalf).toHaveAttribute("aria-hidden", "true")
  })
})
