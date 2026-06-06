import type { LucideIcon, LucideProps } from "lucide-react"

import { cn } from "@/lib/utils"

// Thin wrapper over a Lucide glyph that bakes in the Castline icon conventions:
// ~2px stroke to match the 2.5px borders, default 20px, color inherited from the
// surrounding text (ink on light / cream on dark) with `live` switching to flame.
//
// Q6: the glyph source is passed in as `icon`, so swapping Lucide for a bespoke
// brand set later means changing call sites' import — this wrapper stays put.
type IconProps = Omit<LucideProps, "ref"> & {
  icon: LucideIcon
  /** Flame tint for live/active affordances. */
  live?: boolean
}

function Icon({
  icon: Glyph,
  size = 20,
  strokeWidth = 2,
  live = false,
  className,
  ...props
}: IconProps) {
  return (
    <Glyph
      data-slot="icon"
      size={size}
      strokeWidth={strokeWidth}
      className={cn(live && "text-cl-flame", className)}
      {...props}
    />
  )
}

export { Icon }
export type { IconProps }
