import { useNavigate } from "react-router"

import type { Angler } from "@/api/client"
import { useAnglers } from "@/hooks/use-anglers"
import { Button } from "@/components/ui/button"
import { Hero } from "@/components/sections/hero"
import { SectionBand, SectionLink } from "@/components/sections/section-band"
import { FeatureSplit } from "@/components/sections/feature-split"
import { AnglerCard } from "@/components/angler/angler-card"
import featurePhoto from "@/assets/brand/feature-openwater.png"

function HomePage() {
  const navigate = useNavigate()
  const { anglers } = useAnglers()
  const open = (a: Angler) => navigate(`/anglers/${a.slug}`)
  const featured = anglers.slice(0, 3)

  return (
    <>
      <Hero
        title="Every Angler. Every Cast. Every Story."
        lede="For too long, competitive fishing has only shown fans a fraction of the action. Castline changes that — connecting viewers to every angler, every moment, and every story unfolding on the water in real time."
      />

      <SectionBand
        tone="sky"
        title="Featured anglers"
        action={
          <SectionLink onClick={() => navigate("/anglers")}>
            View all anglers
          </SectionLink>
        }
      >
        {featured.length > 0 ? (
          <div className="grid grid-cols-3 gap-[26px] max-[980px]:grid-cols-1">
            {featured.map((a) => (
              <AnglerCard key={a.id} angler={a} onOpen={open} />
            ))}
          </div>
        ) : (
          <p className="font-label text-[13px] tracking-[0.1em] text-cl-ink/70 uppercase">
            No anglers yet.
          </p>
        )}
      </SectionBand>

      <FeatureSplit
        title="See every cast"
        copy="From the weigh-in to the water, follow the anglers who define the sport."
        image={featurePhoto}
      >
        <Button variant="cta" onClick={() => navigate("/anglers")}>
          Meet the anglers
        </Button>
      </FeatureSplit>
    </>
  )
}

export { HomePage }
