import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Static metadata pills ("62 BOATS", "JERKBAIT"). Two specimens from the system:
// `sky` is a filled blue pill (reads on ink); `outline` is a seafoam stroke (on ink).
const chipVariants = cva(
  "inline-flex items-center gap-1 rounded-pill px-3 py-1 font-label text-[0.75rem] font-extrabold tracking-[0.1em] uppercase",
  {
    variants: {
      variant: {
        sky: "bg-cl-sky text-cl-ink",
        outline: "border-[1.5px] border-cl-seafoam text-cl-seafoam",
      },
    },
    defaultVariants: {
      variant: "sky",
    },
  },
)

function Chip({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof chipVariants>) {
  return (
    <span
      data-slot="chip"
      className={cn(chipVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Chip, chipVariants }
