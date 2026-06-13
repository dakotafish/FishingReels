import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"

import { ProfileHeader } from "./profile-header"
import { makeAngler } from "@/test/fixtures"

describe("ProfileHeader", () => {
  it("renders the name, location, and the initials badge when there is no photo", () => {
    render(
      <ProfileHeader
        angler={makeAngler({
          display_name: "Wade Fisher",
          home_town: "Tampa",
          home_state: "FL",
          avatar_url: null,
        })}
      />,
    )

    expect(screen.getByText("Wade Fisher")).toBeInTheDocument()
    expect(screen.getByText("Tampa, FL")).toBeInTheDocument()
    // Initials-disc fallback exposes the name via the avatar's accessible label.
    expect(screen.getByRole("img", { name: "Wade Fisher" })).toBeInTheDocument()
  })

  it("uses the photo when avatar_url is set", () => {
    render(
      <ProfileHeader
        angler={makeAngler({
          display_name: "Mara Lopez",
          avatar_url: "https://example.com/mara.jpg",
        })}
      />,
    )

    const img = screen.getByRole("img", { name: "Mara Lopez" })
    expect(img).toHaveAttribute("src", "https://example.com/mara.jpg")
  })

  it("omits the location row when the angler has no home town or state", () => {
    const { container } = render(
      <ProfileHeader
        angler={makeAngler({ home_town: null, home_state: null })}
      />,
    )

    expect(
      container.querySelector('[data-slot="profile-location"]'),
    ).toBeNull()
  })
})
