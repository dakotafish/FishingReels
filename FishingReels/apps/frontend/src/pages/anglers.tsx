import { useState } from "react"
import { useNavigate } from "react-router"

import type { Angler } from "@/api/client"
import { useAnglers } from "@/hooks/use-anglers"
import { Wrap } from "@/components/layout/container"
import { AnglerCard } from "@/components/angler/angler-card"
import { AnglerRow } from "@/components/angler/angler-row"
import { ViewToggle, type RosterView } from "@/components/angler/view-toggle"
import dotsBlue from "@/assets/brand/dots-blue.png"

function AnglersPage() {
  const navigate = useNavigate()
  const { anglers, loading, error } = useAnglers()
  const [view, setView] = useState<RosterView>("grid")
  const open = (a: Angler) => navigate(`/anglers/${a.slug}`)

  return (
    <>
      {/* Page header band */}
      <section className="relative overflow-hidden bg-cl-ink text-cl-paper">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[length:480px] opacity-[0.22] mix-blend-screen"
          style={{ backgroundImage: `url(${dotsBlue})` }}
        />
        <Wrap className="relative py-9 max-[640px]:py-6">
          <h1 className="m-0 font-display text-[clamp(38px,4.4vw,64px)] leading-[0.95] font-extrabold tracking-[-0.015em] text-cl-sky">
            Anglers
          </h1>
          <p className="mt-2.5 font-medium text-[16px] tracking-[0.09em] text-cl-seafoam uppercase max-[640px]:text-[12.5px]">
            The athletes behind every cast.
          </p>
        </Wrap>
      </section>

      <section className="bg-cl-sand py-[76px] max-[640px]:py-11">
        <Wrap>
          <div className="mb-[38px] flex items-center justify-between max-[640px]:mb-[22px]">
            <span className="font-label text-[13px] font-extrabold tracking-[0.13em] text-cl-deep-blue uppercase">
              {loading
                ? "Loading…"
                : `${anglers.length} ${anglers.length === 1 ? "angler" : "anglers"}`}
            </span>
            <ViewToggle value={view} onChange={setView} />
          </div>

          {error ? (
            <p className="text-cl-danger">Couldn’t load anglers: {error}</p>
          ) : loading ? (
            <p className="font-label text-[13px] tracking-[0.1em] text-cl-ink/60 uppercase">
              Loading anglers…
            </p>
          ) : anglers.length === 0 ? (
            <p className="font-label text-[13px] tracking-[0.1em] text-cl-ink/60 uppercase">
              No anglers yet.
            </p>
          ) : view === "grid" ? (
            <div className="grid grid-cols-3 gap-[26px] max-[980px]:grid-cols-1">
              {anglers.map((a) => (
                <AnglerCard key={a.id} angler={a} onOpen={open} />
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border-[2.5px] border-cl-ink bg-cl-paper">
              {anglers.map((a) => (
                <AnglerRow key={a.id} angler={a} onOpen={open} />
              ))}
            </div>
          )}
        </Wrap>
      </section>
    </>
  )
}

export { AnglersPage }
