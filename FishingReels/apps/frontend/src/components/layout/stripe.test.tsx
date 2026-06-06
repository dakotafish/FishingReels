import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"

import { Stripe } from "./stripe"

describe("Stripe", () => {
  it("renders a decorative full-bleed rule with the retro-lines image", () => {
    const { container } = render(<Stripe />)
    const stripe = container.querySelector('[data-slot="stripe"]')!
    expect(stripe).toHaveAttribute("aria-hidden", "true")
    expect(stripe).toHaveClass("h-[29px]", "w-full")
    expect((stripe as HTMLElement).style.backgroundImage).toContain("retro-lines")
  })
})
