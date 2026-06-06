import type { Angler } from "@/api/client"
import { cn } from "@/lib/utils"
import { deriveAvatarColors, getInitials } from "@/lib/avatar"

type AnglerAvatarProps = {
  angler: Pick<Angler, "id" | "display_name" | "avatar_url">
  /** Outer square size in px. */
  square?: number
  /** Inner disc size in px (initials fallback only). */
  disc?: number
  fontSize?: number
  className?: string
}

// Uses the real photo when present; otherwise the derived initials disc on an
// accent square (see lib/avatar).
function AnglerAvatar({
  angler,
  square = 96,
  disc = 66,
  fontSize = 24,
  className,
}: AnglerAvatarProps) {
  if (angler.avatar_url) {
    return (
      <img
        src={angler.avatar_url}
        alt={angler.display_name}
        className={cn("rounded-[12px] border-2 border-cl-ink object-cover", className)}
        style={{ width: square, height: square }}
      />
    )
  }

  const { accent, disc: discColor, discText } = deriveAvatarColors(angler.id)
  return (
    <div
      data-slot="angler-avatar"
      role="img"
      aria-label={angler.display_name}
      className={cn("flex shrink-0 items-center justify-center rounded-[12px]", className)}
      style={{ width: square, height: square, background: accent }}
    >
      <span
        aria-hidden="true"
        className="flex items-center justify-center rounded-full font-display font-extrabold"
        style={{ width: disc, height: disc, background: discColor, color: discText, fontSize }}
      >
        {getInitials(angler.display_name)}
      </span>
    </div>
  )
}

export { AnglerAvatar }
export type { AnglerAvatarProps }
