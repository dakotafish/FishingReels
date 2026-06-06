import type { Angler } from "@/api/client"
import { locationOf } from "@/lib/angler"
import { Button } from "@/components/ui/button"
import { AnglerAvatar } from "./angler-avatar"

type AnglerRowProps = {
  angler: Angler
  onOpen?: (angler: Angler) => void
}

// List-view variant. Like the card, rank / season weight / discipline are omitted
// until those fields exist server-side (Q8b).
function AnglerRow({ angler, onOpen }: AnglerRowProps) {
  const loc = locationOf(angler)
  return (
    <div
      data-slot="angler-row"
      onClick={() => onOpen?.(angler)}
      className="flex cursor-pointer items-center gap-4 border-t-2 border-cl-ink/10 px-6 py-4 transition-colors first:border-t-0 hover:bg-cl-sand max-[640px]:px-4 max-[640px]:py-3"
    >
      <AnglerAvatar angler={angler} square={56} disc={38} fontSize={15} />
      <div className="min-w-0 flex-1">
        <h3 className="m-0 font-display text-[22px] leading-none font-extrabold text-cl-ink max-[640px]:text-[16px]">
          {angler.display_name}
        </h3>
        {loc && (
          <div className="mt-1 text-[14px] text-cl-flame max-[640px]:text-[12px]">
            {loc}
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="max-[640px]:hidden"
        onClick={(e) => {
          e.stopPropagation()
          onOpen?.(angler)
        }}
      >
        Profile
      </Button>
    </div>
  )
}

export { AnglerRow }
export type { AnglerRowProps }
