import * as React from "react"
import { Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Signature Castline interaction physics: rests on a small hard shadow, lifts
// up-left and grows the shadow on hover, then travels down-right into a shrunken
// shadow on press (a letterpress "stamp"). Shared by the shadowed variants only
// — `outline` (on-dark) deliberately carries no shadow per the brand rules.
const stamp =
  "shadow-card-sm hover:-translate-x-px hover:-translate-y-px hover:shadow-[6px_6px_0_0_var(--cl-shadow-teal)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-press"

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border-[2.5px] font-label text-[0.95rem] font-extrabold tracking-[0.12em] uppercase whitespace-nowrap transition-[transform,color,box-shadow] duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Q1: the default shadcn Button is calm ink; flame is opt-in via `cta`.
        default: `border-cl-ink bg-primary text-primary-foreground ${stamp}`,
        cta: `border-cl-ink bg-cl-flame text-cl-paper ${stamp}`,
        ghost: `border-cl-ink bg-cl-paper text-cl-flame ${stamp}`,
        outline:
          "border-cl-paper bg-transparent text-cl-paper hover:bg-cl-paper hover:text-cl-ink",
        destructive: `border-cl-ink bg-destructive text-cl-paper ${stamp}`,
      },
      size: {
        default: "px-[26px] py-[14px]",
        sm: "px-4 py-2 text-[0.8rem]",
        icon: "size-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button"
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
export type { ButtonProps }
