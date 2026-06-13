import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"

import { AppRoutes } from "./app-routes"
import { makeAngler } from "@/test/fixtures"

beforeEach(() => {
  // both home and anglers pages fetch the roster on mount
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => [] }),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("AppRoutes", () => {
  it("renders the home page at /", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>,
    )
    expect(screen.getByRole("heading", { name: /^Every angler/i })).toBeInTheDocument()
  })

  it("renders the anglers page at /anglers", () => {
    render(
      <MemoryRouter initialEntries={["/anglers"]}>
        <AppRoutes />
      </MemoryRouter>,
    )
    expect(screen.getByRole("heading", { name: "Anglers" })).toBeInTheDocument()
  })

  it("renders the angler profile at /anglers/:slug", async () => {
    // URL-aware: the profile fetch returns an angler; /streams stays empty.
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) =>
        Promise.resolve({
          ok: true,
          json: async () =>
            String(url).includes("/anglers/")
              ? makeAngler({
                  display_name: "Jordan Wheeler",
                  slug: "jordan-wheeler",
                })
              : [],
        }),
      ),
    )
    render(
      <MemoryRouter initialEntries={["/anglers/jordan-wheeler"]}>
        <AppRoutes />
      </MemoryRouter>,
    )
    expect(
      await screen.findByRole("heading", { name: "Jordan Wheeler" }),
    ).toBeInTheDocument()
  })
})
