import { Link } from "react-router"
import { Play } from "lucide-react"

import type { Stream } from "@/api/client"
import { Icon } from "@/components/ui/icon"
import { BadgeLive } from "@/components/ui/badge-live"
import { Chip } from "@/components/ui/chip"

// Same compact date the streams list uses ("Jun 1 · 3:00 PM").
function castDateLabel(stream: Stream): string {
  return new Date(stream.started_at).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

// One past (or live) stream as a carousel tile. We have no stored poster frame
// or title, so the tile is a carbon video-well with the real metadata we do have
// — status + started date — and links to the existing watch page.
function RecentCastCard({ stream }: { stream: Stream }) {
  const live = stream.status === "live"
  return (
    <Link
      to={`/streams/${stream.id}`}
      data-slot="recent-cast-card"
      className="group block no-underline"
    >
      {/* Video well sits flush — ink border, no hard offset shadow (brand rule). */}
      <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg border-[2.5px] border-cl-ink bg-cl-carbon">
        <span className="absolute top-3 left-3">
          {live ? <BadgeLive /> : <Chip variant="sky">Ended</Chip>}
        </span>
        <Icon
          icon={Play}
          size={34}
          className="text-cl-paper/85 transition-colors group-hover:text-cl-gold"
        />
      </div>
      <p className="mt-3 font-label text-[12px] font-extrabold tracking-[0.12em] text-cl-deep-blue uppercase">
        {castDateLabel(stream)}
      </p>
    </Link>
  )
}

export { RecentCastCard }
