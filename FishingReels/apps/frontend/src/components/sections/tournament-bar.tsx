import * as React from "react"

import { cn } from "@/lib/utils"

type TournamentBarProps = {
  title: React.ReactNode
  meta?: React.ReactNode
  /** Trailing action — typically a CTA Button. */
  children?: React.ReactNode
  className?: string
}

// Flame card that sits on the ink hero — title + meta + CTA. It's a card (not
// video), so it carries the small hard shadow. Stacks vertically ≤640px.
function TournamentBar({ title, meta, children, className }: TournamentBarProps) {
  return (
    <div
      data-slot="tournament-bar"
      className={cn(
        "relative z-[5] flex items-center gap-9 rounded-lg border-[2.5px] border-cl-ink bg-cl-flame px-7 py-[22px] shadow-card-sm max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-3.5",
        className,
      )}
    >
      <h2 className="m-0 flex-1 font-display text-[28px] leading-[1.05] font-extrabold text-cl-paper max-[640px]:text-[19px]">
        {title}
      </h2>
      {meta && (
        <span className="font-label text-[16px] font-extrabold tracking-[0.12em] text-cl-paper uppercase max-[640px]:text-[12px]">
          {meta}
        </span>
      )}
      {children}
    </div>
  )
}

export { TournamentBar }
export type { TournamentBarProps }
