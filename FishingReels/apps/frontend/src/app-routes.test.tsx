import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"

import { AppRoutes } from "./app-routes"

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
    expect(screen.getByRole("heading", { name: /^Every angler/ })).toBeInTheDocument()
  })

  it("renders the anglers page at /anglers", () => {
    render(
      <MemoryRouter initialEntries={["/anglers"]}>
        <AppRoutes />
      </MemoryRouter>,
    )
    expect(screen.getByRole("heading", { name: "Anglers" })).toBeInTheDocument()
  })

  it("renders the profile placeholder at /anglers/:slug", () => {
    render(
      <MemoryRouter initialEntries={["/anglers/jordan-wheeler"]}>
        <AppRoutes />
      </MemoryRouter>,
    )
    expect(
      screen.getByRole("heading", { name: "Angler profile" }),
    ).toBeInTheDocument()
    expect(screen.getByText(/jordan-wheeler/)).toBeInTheDocument()
  })
})
