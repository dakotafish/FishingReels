import * as React from "react"

import { cn } from "@/lib/utils"
import { Wrap } from "@/components/layout/container"
import dotsBlue from "@/assets/brand/dots-blue.png"
import emblemBlue from "@/assets/brand/emblem-blue.png"

type HeroProps = {
  title: React.ReactNode
  lede?: React.ReactNode
  /** Right-side fish emblem (hidden ≤980px). */
  showEmblem?: boolean
  /** Rendered in the wrap below the title grid — e.g. a TournamentBar. */
  children?: React.ReactNode
  className?: string
}

// Ink band with a screen-blended blue dot texture. Sky display title + seafoam
// all-caps lede, with the fish emblem aligned to the right edge.
function Hero({ title, lede, showEmblem = true, children, className }: HeroProps) {
  return (
    <section
      data-slot="hero"
      className={cn("relative overflow-hidden bg-cl-ink text-cl-paper", className)}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[length:520px] opacity-25 mix-blend-screen"
        style={{ backgroundImage: `url(${dotsBlue})` }}
      />
      <Wrap className="relative">
        <div className="grid grid-cols-[1.5fr_0.8fr] items-center gap-10 py-[78px] max-[980px]:grid-cols-1 max-[640px]:py-7">
          <div>
            <h1 className="m-0 mb-7 font-display text-[clamp(48px,6.6vw,104px)] leading-[0.94] font-extrabold tracking-[0.01em] text-cl-sky max-[640px]:mb-3 max-[640px]:text-[28px]">
              {title}
            </h1>
            {lede && (
              <p className="m-0 max-w-[640px] font-medium text-[13px] leading-[1.5] tracking-[0.08em] text-cl-seafoam uppercase max-[640px]:text-[11.5px]">
                {lede}
              </p>
            )}
          </div>
          {showEmblem && (
            <img
              src={emblemBlue}
              alt=""
              aria-hidden="true"
              className="w-full max-w-[320px] justify-self-end max-[980px]:hidden"
            />
          )}
        </div>
        {children}
      </Wrap>
    </section>
  )
}

export { Hero }
export type { HeroProps }
