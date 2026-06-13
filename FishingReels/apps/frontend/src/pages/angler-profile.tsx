import { useParams } from "react-router"

import { useAngler } from "@/hooks/use-angler"
import { useAnglerStreams } from "@/hooks/use-angler-streams"
import { Wrap } from "@/components/layout/container"
import { SectionBand } from "@/components/sections/section-band"
import { ProfileHeader } from "@/components/angler/profile-header"
import { RecentCastCard } from "@/components/stream/recent-cast-card"
import { StreamPlayer } from "@/components/stream/stream-player"
import { BadgeLive } from "@/components/ui/badge-live"

function firstName(displayName: string): string {
  return displayName.trim().split(/\s+/)[0] || displayName
}

function AnglerProfilePage() {
  const { slug } = useParams()
  const { angler, loading, error } = useAngler(slug)
  const { live, casts } = useAnglerStreams(slug)

  if (loading) {
    return (
      <section className="bg-cl-paper py-[76px] max-[640px]:py-11">
        <Wrap>
          <p className="font-label text-[13px] tracking-[0.1em] text-cl-ink/60 uppercase">
            Loading profile…
          </p>
        </Wrap>
      </section>
    )
  }

  if (error || !angler) {
    return (
      <section className="bg-cl-paper py-[76px] max-[640px]:py-11">
        <Wrap>
          <p className="text-cl-danger">Couldn’t load this profile.</p>
        </Wrap>
      </section>
    )
  }

  return (
    <>
      <ProfileHeader angler={angler} />

      {/* Live player — only while this angler is streaming. The polling hook
          makes it appear the moment they go live and clears when it ends. */}
      {live && (
        <section className="bg-cl-paper pt-8 pb-2 max-[640px]:pt-6">
          <Wrap>
            <div className="mb-4 flex items-center gap-3">
              <h2 className="m-0 font-label text-[13px] font-extrabold tracking-[0.13em] text-cl-deep-blue uppercase">
                Live now
              </h2>
              <BadgeLive />
            </div>
            <StreamPlayer src={live.playlist_url} live />
            <p className="mt-3 font-label text-[12px] tracking-[0.1em] text-cl-ink/55 uppercase">
              You can rewind to the start while live.
            </p>
          </Wrap>
        </section>
      )}

      {/* Recent casts — a horizontal carousel of past streams. */}
      <SectionBand tone="sand" title="Recent casts">
        {casts.length === 0 ? (
          <p className="font-label text-[13px] tracking-[0.1em] text-cl-ink/60 uppercase">
            No recorded casts yet.
          </p>
        ) : (
          <div className="flex snap-x snap-mandatory gap-[22px] overflow-x-auto pb-2">
            {casts.map((s) => (
              <div
                key={s.id}
                className="w-[320px] shrink-0 snap-start max-[640px]:w-[80vw]"
              >
                <RecentCastCard stream={s} />
              </div>
            ))}
          </div>
        )}
      </SectionBand>

      {/* About — bio over the brand sky band. */}
      <SectionBand tone="sky">
        <div className="grid grid-cols-[1fr_1.3fr] items-start gap-12 max-[860px]:grid-cols-1 max-[860px]:gap-5">
          <h2 className="m-0 font-display text-[clamp(34px,4vw,56px)] leading-[0.95] font-extrabold tracking-[-0.01em] text-cl-ink max-[640px]:text-[24px]">
            About {firstName(angler.display_name)}
          </h2>
          {angler.bio ? (
            <p className="m-0 max-w-[600px] text-[19px] leading-[1.6] text-cl-ink max-[640px]:text-[16px]">
              {angler.bio}
            </p>
          ) : (
            <p className="m-0 font-label text-[13px] tracking-[0.1em] text-cl-ink/60 uppercase">
              No bio yet.
            </p>
          )}
        </div>
      </SectionBand>
    </>
  )
}

export { AnglerProfilePage }
