import { MapPin } from "lucide-react"

import type { Angler } from "@/api/client"
import { locationOf } from "@/lib/angler"
import { Wrap } from "@/components/layout/container"
import { Icon } from "@/components/ui/icon"
import { AnglerAvatar } from "./angler-avatar"
import cover from "@/assets/brand/profile-cover.jpg"

// Cover banner + the head card that overlaps up into it: the angler badge
// (photo or initials disc), the name in cream over the darkened cover, and the
// home town/state. Mirrors the design system's profile screen.
function ProfileHeader({ angler }: { angler: Angler }) {
  const loc = locationOf(angler)
  return (
    <header data-slot="profile-header">
      {/* Full-bleed cover with the design's top→bottom ink gradient. */}
      <div
        className="relative h-[360px] border-b-[2.5px] border-cl-ink bg-cl-ink bg-cover bg-center max-[640px]:h-[220px]"
        style={{ backgroundImage: `url(${cover})` }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(33,56,69,0.1),rgba(33,56,69,0.78))]" />
      </div>

      <Wrap>
        <div className="relative z-[3] flex items-end gap-7 pb-2 -mt-[120px] max-[640px]:gap-4 max-[640px]:-mt-[80px]">
          <AnglerAvatar
            angler={angler}
            square={168}
            disc={116}
            fontSize={44}
            className="rounded-[18px] border-[3px] border-cl-ink"
          />
          <div className="pb-2.5">
            <h1 className="m-0 font-display text-[clamp(40px,5vw,72px)] leading-[0.95] font-extrabold tracking-[-0.01em] text-cl-paper max-[640px]:text-[30px]">
              {angler.display_name}
            </h1>
            {loc && (
              <div
                data-slot="profile-location"
                className="mt-2 flex items-center gap-2 font-label text-[15px] font-extrabold tracking-[0.12em] text-cl-sky uppercase max-[640px]:text-[13px]"
              >
                <Icon icon={MapPin} size={16} />
                {loc}
              </div>
            )}
          </div>
        </div>
      </Wrap>
    </header>
  )
}

export { ProfileHeader }
