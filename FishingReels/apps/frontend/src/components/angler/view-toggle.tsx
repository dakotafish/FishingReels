import { LayoutGrid, List } from "lucide-react"

import { cn } from "@/lib/utils"
import { Icon } from "@/components/ui/icon"

export type RosterView = "grid" | "list"

type ViewToggleProps = {
  value: RosterView
  onChange: (view: RosterView) => void
  className?: string
}

const OPTIONS: { view: RosterView; icon: typeof LayoutGrid; label: string }[] = [
  { view: "grid", icon: LayoutGrid, label: "Grid view" },
  { view: "list", icon: List, label: "List view" },
]

// Pill segmented control (ink-fill active) switching the roster between grid/list.
function ViewToggle({ value, onChange, className }: ViewToggleProps) {
  return (
    <div
      data-slot="view-toggle"
      role="group"
      className={cn(
        "inline-flex overflow-hidden rounded-pill border-2 border-cl-ink bg-cl-paper",
        className,
      )}
    >
      {OPTIONS.map(({ view, icon, label }) => {
        const active = value === view
        return (
          <button
            key={view}
            type="button"
            aria-label={label}
            aria-pressed={active}
            onClick={() => onChange(view)}
            className={cn(
              "flex h-[34px] w-[42px] cursor-pointer items-center justify-center border-l-2 border-cl-ink transition-colors first:border-l-0",
              active ? "bg-cl-ink text-cl-paper" : "text-cl-ink hover:text-cl-flame",
            )}
          >
            <Icon icon={icon} size={18} />
          </button>
        )
      })}
    </div>
  )
}

export { ViewToggle }
export type { ViewToggleProps }
