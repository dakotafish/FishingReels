import * as React from "react"

import { cn } from "@/lib/utils"
import retroLines from "@/assets/brand/retro-lines.png"

// The racing-stripe rule (orange-over-blue) — a full-bleed divider under the
// header and above the footer. Decorative only.
function Stripe({ className, style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      data-slot="stripe"
      className={cn("h-[29px] w-full bg-[length:100%_100%] bg-no-repeat", className)}
      style={{ backgroundImage: `url(${retroLines})`, ...style }}
      {...props}
    />
  )
}

export { Stripe }
