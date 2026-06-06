import type { Angler } from "@/api/client"
import { locationOf } from "@/lib/angler"
import { Button } from "@/components/ui/button"
import { AnglerAvatar } from "./angler-avatar"

type AnglerCardProps = {
  angler: Angler
  onOpen?: (angler: Angler) => void
}

// Grid-view roster card. Season-weight stat and discipline tag are intentionally
// omitted — those fields have no backend home yet (Q8b); we don't fabricate them.
function AnglerCard({ angler, onOpen }: AnglerCardProps) {
  const loc = locationOf(angler)
  return (
    <article
      data-slot="angler-card"
      onClick={() => onOpen?.(angler)}
      className="flex cursor-pointer flex-col rounded-lg border-[2.5px] border-cl-ink bg-cl-paper p-5 shadow-card transition-[transform,box-shadow] duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[11px_11px_0_0_var(--cl-shadow-teal)]"
    >
      <AnglerAvatar angler={angler} />
      <h3 className="mt-4 mb-0.5 font-display text-[28px] leading-none font-extrabold text-cl-ink max-[640px]:text-[22px]">
        {angler.display_name}
      </h3>
      {loc && <div className="text-[16px] text-cl-flame">{loc}</div>}
      <div className="mt-auto flex items-center justify-end pt-[18px]">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onOpen?.(angler)
          }}
        >
          Profile
        </Button>
      </div>
    </article>
  )
}

export { AnglerCard }
export type { AnglerCardProps }
