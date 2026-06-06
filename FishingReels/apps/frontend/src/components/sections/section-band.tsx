import * as React from "react"

import { cn } from "@/lib/utils"
import { Wrap } from "@/components/layout/container"

type Tone = "sky" | "moss" | "sand" | "paper"

const toneClass: Record<Tone, string> = {
  sky: "bg-cl-sky",
  moss: "bg-cl-moss",
  sand: "bg-cl-sand",
  paper: "bg-cl-paper",
}

type SectionBandProps = {
  /** One flat brand color per major section. */
  tone?: Tone
  title?: React.ReactNode
  /** Right-aligned header slot — typically a SectionLink. */
  action?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

// Full-bleed flat color band; content lives in the centered Wrap.
function SectionBand({
  tone = "paper",
  title,
  action,
  children,
  className,
}: SectionBandProps) {
  return (
    <section
      data-slot="section-band"
      className={cn("py-[76px] max-[640px]:py-11", toneClass[tone], className)}
    >
      <Wrap>
        {(title || action) && (
          <div className="mb-[38px] flex items-end justify-between max-[640px]:mb-[22px]">
            {title && (
              <h2 className="m-0 font-display text-[clamp(34px,4vw,56px)] leading-none font-extrabold tracking-[-0.01em] text-cl-ink max-[640px]:text-[24px]">
                {title}
              </h2>
            )}
            {action}
          </div>
        )}
        {children}
      </Wrap>
    </section>
  )
}

// Underlined "view all" link — ink, turning flame on hover.
function SectionLink({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="section-link"
      className={cn(
        "cursor-pointer border-b-2 border-cl-ink pb-[3px] font-label text-[14px] font-extrabold tracking-[0.12em] text-cl-ink uppercase transition-colors hover:border-cl-flame hover:text-cl-flame max-[640px]:text-[12px]",
        className,
      )}
      {...props}
    />
  )
}

export { SectionBand, SectionLink }
export type { SectionBandProps }
