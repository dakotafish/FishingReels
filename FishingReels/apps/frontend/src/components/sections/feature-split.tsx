import * as React from "react"

import { cn } from "@/lib/utils"

type FeatureSplitProps = {
  title: React.ReactNode
  copy?: React.ReactNode
  /** Full-bleed photo URL for the image half. */
  image?: string
  /** Trailing content under the copy — typically a CTA. */
  children?: React.ReactNode
  className?: string
}

// 50/50 moss-text ÷ full-bleed photo. Mint caps copy on green. One column ≤980px.
function FeatureSplit({
  title,
  copy,
  image,
  children,
  className,
}: FeatureSplitProps) {
  return (
    <section
      data-slot="feature-split"
      className={cn("grid min-h-[460px] grid-cols-2 max-[980px]:grid-cols-1", className)}
    >
      <div className="flex flex-col justify-center bg-cl-moss px-16 py-[76px] text-cl-paper max-[640px]:px-[22px] max-[640px]:py-10">
        <h2 className="m-0 mb-[26px] font-display text-[clamp(48px,6vw,92px)] leading-[0.95] font-extrabold text-cl-paper max-[640px]:text-[28px]">
          {title}
        </h2>
        {copy && (
          <p className="m-0 mb-[34px] max-w-[520px] font-medium text-[13px] leading-[1.55] tracking-[0.07em] text-cl-mint-text uppercase max-[640px]:text-[12px]">
            {copy}
          </p>
        )}
        {children}
      </div>
      <div
        aria-hidden={!image}
        className="bg-cover bg-center max-[980px]:min-h-[280px]"
        style={image ? { backgroundImage: `url(${image})` } : undefined}
      />
    </section>
  )
}

export { FeatureSplit }
export type { FeatureSplitProps }
