import * as React from "react"
import {
  Info,
  LogIn,
  Menu,
  Radio,
  Search,
  Store,
  Trophy,
  Users,
  X,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { BadgeLive } from "@/components/ui/badge-live"
import { Icon } from "@/components/ui/icon"
import { EdgeGutter } from "@/components/layout/container"
import { Stripe } from "@/components/layout/stripe"
import logoBlue from "@/assets/brand/logo-blue.png"
import dotsBlue from "@/assets/brand/dots-blue.png"

type NavItem = { key: string; label: string }
type DrawerItem = NavItem & { icon: LucideIcon; badge?: string }

// Top-level nav uses one vocabulary across web and the drawer.
const NAV: NavItem[] = [
  { key: "tournaments", label: "Tournaments" },
  { key: "anglers", label: "Anglers" },
  { key: "expos", label: "Expos" },
  { key: "about", label: "About" },
]

const DRAWER: DrawerItem[] = [
  { key: "tournaments", label: "Tournaments", icon: Trophy },
  { key: "anglers", label: "Anglers", icon: Users },
  { key: "expos", label: "Expos", icon: Store },
  { key: "live", label: "Live", icon: Radio, badge: "On Air" },
  { key: "about", label: "About", icon: Info },
  { key: "signin", label: "Sign In", icon: LogIn },
]

type HeaderProps = {
  active?: string
  onNav?: (key: string) => void
}

function NavLink({
  item,
  active,
  onNav,
}: {
  item: NavItem
  active?: string
  onNav: (key: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onNav(item.key)}
      className={cn(
        "cursor-pointer font-label text-[12px] font-extrabold tracking-[0.13em] uppercase transition-colors",
        active === item.key ? "text-cl-sky" : "text-cl-near-black hover:text-cl-flame",
      )}
    >
      {item.label}
    </button>
  )
}

function DrawerLink({
  item,
  active,
  onNav,
}: {
  item: DrawerItem
  active?: string
  onNav: (key: string) => void
}) {
  const isActive = active === item.key
  return (
    <button
      type="button"
      onClick={() => onNav(item.key)}
      className={cn(
        "group flex cursor-pointer items-center gap-[15px] border-t border-cl-seafoam/15 px-2 py-5 text-left font-label text-[17px] font-extrabold tracking-[0.12em] uppercase transition-colors first:border-t-0",
        isActive ? "text-cl-sky" : "text-cl-paper hover:text-cl-sky",
      )}
    >
      <Icon
        icon={item.icon}
        className={cn(
          "transition-colors group-hover:text-cl-sky",
          isActive ? "text-cl-sky" : "text-cl-seafoam",
        )}
      />
      <span>{item.label}</span>
      {item.badge && (
        <BadgeLive className="ml-auto px-2.5 py-1 text-[10px]">{item.badge}</BadgeLive>
      )}
    </button>
  )
}

function Header({ active, onNav = () => {} }: HeaderProps) {
  const [menuOpen, setMenuOpen] = React.useState(false)

  // Lock body scroll while the drawer is open.
  React.useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  const go = (key: string) => {
    setMenuOpen(false)
    onNav(key)
  }

  return (
    <header
      data-slot="header"
      className="sticky top-0 z-50 overflow-x-clip bg-cl-paper"
    >
      <EdgeGutter className="flex items-center gap-7 pt-[26px] pb-[14px]">
        <img
          src={logoBlue}
          alt="Castline"
          onClick={() => onNav("home")}
          className="h-[97px] cursor-pointer max-[820px]:h-[58px]"
        />

        {/* Desktop nav */}
        <nav className="ml-auto flex items-center gap-[26px] max-[820px]:hidden">
          {NAV.map((item) => (
            <NavLink key={item.key} item={item} active={active} onNav={onNav} />
          ))}
          <span className="h-4 w-px bg-cl-ink/30" />
          <NavLink
            item={{ key: "signin", label: "Sign In" }}
            active={active}
            onNav={onNav}
          />
          <BadgeLive
            onClick={() => onNav("live")}
            className="cursor-pointer px-3 py-1.5 text-[11px]"
          >
            LIVE · DAY 2
          </BadgeLive>
          <button
            type="button"
            aria-label="Search"
            onClick={() => onNav("search")}
            className="flex cursor-pointer text-cl-near-black transition-colors hover:text-cl-flame"
          >
            <Icon icon={Search} size={19} />
          </button>
        </nav>

        {/* Mobile cluster: pinned LIVE badge + hamburger */}
        <div className="ml-auto hidden items-center gap-3 max-[820px]:flex">
          <BadgeLive
            onClick={() => onNav("live")}
            className="cursor-pointer px-3 py-1.5 text-[11px]"
          >
            LIVE · DAY 2
          </BadgeLive>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="flex size-11 cursor-pointer items-center justify-center text-cl-ink transition-colors hover:text-cl-flame"
          >
            <Icon icon={Menu} size={22} />
          </button>
        </div>
      </EdgeGutter>

      <Stripe />

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[200] flex flex-col bg-cl-ink text-cl-paper"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[length:380px] opacity-[0.18] mix-blend-screen"
            style={{ backgroundImage: `url(${dotsBlue})` }}
          />
          <div className="relative flex items-center px-[22px] pt-[22px] pb-[14px]">
            <img
              src={logoBlue}
              alt="Castline"
              onClick={() => go("home")}
              className="h-[42px] cursor-pointer"
            />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="ml-auto flex size-11 cursor-pointer items-center justify-center text-cl-paper transition-colors hover:text-cl-seafoam"
            >
              <Icon icon={X} size={22} />
            </button>
          </div>

          <nav className="relative flex flex-col px-4 py-1.5">
            {DRAWER.map((item) => (
              <DrawerLink key={item.key} item={item} active={active} onNav={go} />
            ))}
          </nav>

          <div className="relative mt-auto border-t-[2.5px] border-cl-flame px-5 pt-[18px] pb-[26px]">
            <button
              type="button"
              onClick={() => go("search")}
              className="flex w-full cursor-pointer items-center gap-[11px] rounded-pill bg-cl-paper px-[18px] py-[14px] font-sans text-[14px] font-medium text-cl-deep-blue"
            >
              <Icon icon={Search} size={18} /> Search anglers, events…
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export { Header }
export type { HeaderProps }
