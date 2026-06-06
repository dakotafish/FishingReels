import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"

import { AnglerAvatar } from "./angler-avatar"
import { makeAngler } from "@/test/fixtures"

describe("AnglerAvatar", () => {
  it("renders the photo when avatar_url is set", () => {
    const angler = makeAngler({
      display_name: "Jordan Wheeler",
      avatar_url: "https://cdn.example/p.jpg",
    })
    render(<AnglerAvatar angler={angler} />)
    const img = screen.getByRole("img", { name: "Jordan Wheeler" })
    expect(img).toHaveAttribute("src", "https://cdn.example/p.jpg")
  })

  it("falls back to derived initials on a colored disc when there's no photo", () => {
    const angler = makeAngler({ display_name: "Jordan Wheeler", avatar_url: null })
    render(<AnglerAvatar angler={angler} />)
    const disc = screen.getByRole("img", { name: "Jordan Wheeler" })
    expect(disc).toHaveTextContent("JW")
    expect(disc.style.background).toContain("var(--cl-")
  })
})
