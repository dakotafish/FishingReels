import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router"

import { AnglersPage } from "./anglers"
import { makeAngler } from "@/test/fixtures"
import type { Angler } from "@/api/client"

afterEach(() => {
  vi.unstubAllGlobals()
})

function mockFetch(data: Angler[]) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => data }),
  )
}

function renderPage() {
  return render(
    <MemoryRouter>
      <AnglersPage />
    </MemoryRouter>,
  )
}

describe("AnglersPage", () => {
  it("renders the roster as cards and switches to list view", async () => {
    mockFetch([
      makeAngler({ display_name: "Jordan Wheeler" }),
      makeAngler({ display_name: "Mara Lopez" }),
    ])
    renderPage()

    await waitFor(() =>
      expect(screen.getByText("Jordan Wheeler")).toBeInTheDocument(),
    )
    expect(document.querySelectorAll('[data-slot="angler-card"]')).toHaveLength(2)
    expect(screen.getByText("2 anglers")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "List view" }))
    expect(document.querySelectorAll('[data-slot="angler-row"]')).toHaveLength(2)
    expect(document.querySelectorAll('[data-slot="angler-card"]')).toHaveLength(0)
  })

  it("shows an empty state when there are no anglers", async () => {
    mockFetch([])
    renderPage()
    await waitFor(() =>
      expect(screen.getByText("No anglers yet.")).toBeInTheDocument(),
    )
  })

  it("surfaces a load error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 503 }),
    )
    renderPage()
    await waitFor(() =>
      expect(screen.getByText(/Couldn’t load anglers/)).toBeInTheDocument(),
    )
  })
})
