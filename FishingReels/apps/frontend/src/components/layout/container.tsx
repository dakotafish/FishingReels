import * as React from "react"

import { cn } from "@/lib/utils"

// Q10: two intentional horizontal systems.
//
// Wrap — the centered 1240px content column (72px gutter) used by page sections.
// EdgeGutter — the wider 57px viewport inset used by the chrome (header, footer,
// live bar) so the chrome reads wider than the content beneath it.
//
// Both apply the responsive classes defined in index.css.
function Wrap({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="wrap" className={cn("wrap", className)} {...props} />
}

function EdgeGutter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="edge" className={cn("edge", className)} {...props} />
}

export { Wrap, EdgeGutter }
