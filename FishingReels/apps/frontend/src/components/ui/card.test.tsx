import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"

import { Card, CardHeader, CardTitle, CardContent } from "./card"

describe("Card", () => {
  it("carries the brand trio: ink border, hard shadow, lg radius", () => {
    render(<Card>Body</Card>)
    const card = screen.getByText("Body")
    expect(card).toHaveClass(
      "border-[2.5px]",
      "border-foreground",
      "shadow-card",
      "rounded-lg",
    )
  })

  it("no longer uses the stock shadcn ring", () => {
    render(<Card>Body</Card>)
    expect(screen.getByText("Body")).not.toHaveClass("ring-1")
  })

  it("composes header/title/content", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Northern Pike</CardTitle>
        </CardHeader>
        <CardContent>52.10 LB</CardContent>
      </Card>,
    )
    expect(screen.getByText("Northern Pike")).toBeInTheDocument()
    expect(screen.getByText("52.10 LB")).toBeInTheDocument()
  })
})
