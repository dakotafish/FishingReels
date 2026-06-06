import * as React from "react"

import { cn } from "@/lib/utils"

// The brand's signature live signal: a flame pill with a pulsing white dot and
// an ALL-CAPS label. The pulse honors prefers-reduced-motion via motion-reduce.
function BadgeLive({
  className,
  children = "LIVE",
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="badge-live"
      className={cn(
        "inline-flex items-center gap-2 rounded-pill bg-cl-flame px-4 py-[7px] font-label text-[0.8rem] font-extrabold tracking-[0.13em] text-cl-paper uppercase",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        data-slot="badge-live-dot"
        className="size-2 animate-cl-pulse rounded-full bg-cl-paper motion-reduce:animate-none"
      />
      {children}
    </span>
  )
}

export { BadgeLive }
