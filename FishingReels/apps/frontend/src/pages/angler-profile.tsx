import { useParams } from "react-router"

import { Wrap } from "@/components/layout/container"

// Placeholder. Profile stats and "recent casts" are deferred until tournament /
// leaderboard tables exist (Q8a).
function AnglerProfilePage() {
  const { slug } = useParams()
  return (
    <section className="bg-cl-paper py-[76px] max-[640px]:py-11">
      <Wrap>
        <h1 className="m-0 font-display text-[clamp(34px,4vw,56px)] leading-none font-extrabold text-cl-ink">
          Angler profile
        </h1>
        <p className="mt-4 font-label text-[13px] tracking-[0.1em] text-cl-deep-blue uppercase">
          Profile for “{slug}” — coming soon.
        </p>
      </Wrap>
    </section>
  )
}

export { AnglerProfilePage }
