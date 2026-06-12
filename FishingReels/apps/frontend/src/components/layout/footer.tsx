import { cn } from "@/lib/utils"
import { EdgeGutter } from "@/components/layout/container"
import { Stripe } from "@/components/layout/stripe"
import logoBlue from "@/assets/brand/logo-blue.png"

const FOOTER_NAV = [
  { key: "anglers", label: "Anglers" },
  { key: "about", label: "About" },
]

type FooterProps = {
  onNav?: (key: string) => void
}

const linkClass =
  "cursor-pointer font-label text-[10px] font-extrabold tracking-[0.12em] text-cl-deep-blue uppercase transition-colors hover:text-cl-flame"

function Footer({ onNav = () => {} }: FooterProps) {
  return (
    <footer data-slot="footer" className="overflow-x-clip bg-cl-paper">
      <EdgeGutter className="flex h-28 flex-wrap items-center gap-x-6 gap-y-3 max-[640px]:h-auto max-[640px]:py-6">
        <img
          src={logoBlue}
          alt="Castline"
          onClick={() => onNav("home")}
          className="h-[68px] cursor-pointer max-[640px]:h-11"
        />
        <span className="font-label text-[10px] font-extrabold tracking-[0.13em] text-cl-deep-blue uppercase">
          2026 Castline Media
        </span>
        <button type="button" className={linkClass}>
          Terms
        </button>
        <button type="button" className={linkClass}>
          Privacy
        </button>
        <nav className="ml-auto flex flex-wrap gap-7 max-[640px]:ml-0 max-[640px]:basis-full">
          {FOOTER_NAV.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => onNav(item.key)}
              className={cn(linkClass)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </EdgeGutter>
      <Stripe />
    </footer>
  )
}

export { Footer }
export type { FooterProps }
