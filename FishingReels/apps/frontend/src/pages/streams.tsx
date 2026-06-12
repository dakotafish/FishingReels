import { useNavigate } from "react-router"

import type { Stream } from "@/api/client"
import { useStreams } from "@/hooks/use-streams"
import { Wrap } from "@/components/layout/container"
import { AnglerAvatar } from "@/components/angler/angler-avatar"
import { BadgeLive } from "@/components/ui/badge-live"
import { Chip } from "@/components/ui/chip"

function startedLabel(stream: Stream): string {
  return new Date(stream.started_at).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function StreamRow({
  stream,
  onOpen,
}: {
  stream: Stream
  onOpen: (s: Stream) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(stream)}
      className="flex w-full cursor-pointer items-center gap-4 border-b-[2.5px] border-cl-ink/15 bg-cl-paper px-5 py-4 text-left last:border-b-0 hover:bg-cl-sky/15"
    >
      {stream.angler ? (
        <AnglerAvatar angler={stream.angler} square={52} disc={38} fontSize={15} />
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="m-0 truncate font-display text-[19px] font-extrabold text-cl-ink">
          {stream.angler?.display_name ?? "Unknown angler"}
        </p>
        <p className="m-0 mt-0.5 font-label text-[12px] tracking-[0.1em] text-cl-ink/55 uppercase">
          Started {startedLabel(stream)}
        </p>
      </div>
      {stream.status === "live" ? (
        <BadgeLive />
      ) : (
        <Chip variant="sky">Ended</Chip>
      )}
    </button>
  )
}

function StreamsPage() {
  const navigate = useNavigate()
  const { streams, loading, error } = useStreams()
  const open = (s: Stream) => navigate(`/streams/${s.id}`)

  const live = streams.filter((s) => s.status === "live")
  const past = streams.filter((s) => s.status !== "live")

  return (
    <>
      {/* Page header band */}
      <section className="bg-cl-ink text-cl-paper">
        <Wrap className="py-9 max-[640px]:py-6">
          <h1 className="m-0 font-display text-[clamp(38px,4.4vw,64px)] leading-[0.95] font-extrabold tracking-[-0.015em] text-cl-sky">
            Live
          </h1>
          <p className="mt-2.5 font-medium text-[16px] tracking-[0.09em] text-cl-seafoam uppercase max-[640px]:text-[12.5px]">
            Every cast, as it happens — rewind any time.
          </p>
        </Wrap>
      </section>

      <section className="bg-cl-paper py-[76px] max-[640px]:py-11">
        <Wrap>
          {error ? (
            <p className="text-cl-danger">Couldn’t load streams: {error}</p>
          ) : loading ? (
            <p className="font-label text-[13px] tracking-[0.1em] text-cl-ink/60 uppercase">
              Loading streams…
            </p>
          ) : (
            <>
              <h2 className="m-0 mb-4 font-label text-[13px] font-extrabold tracking-[0.13em] text-cl-deep-blue uppercase">
                Live now
              </h2>
              {live.length === 0 ? (
                <p className="mb-10 font-label text-[13px] tracking-[0.1em] text-cl-ink/60 uppercase">
                  No one is live right now.
                </p>
              ) : (
                <div className="mb-10 overflow-hidden rounded-lg border-[2.5px] border-cl-ink bg-cl-paper">
                  {live.map((s) => (
                    <StreamRow key={s.id} stream={s} onOpen={open} />
                  ))}
                </div>
              )}

              <h2 className="m-0 mb-4 font-label text-[13px] font-extrabold tracking-[0.13em] text-cl-deep-blue uppercase">
                Past streams
              </h2>
              {past.length === 0 ? (
                <p className="font-label text-[13px] tracking-[0.1em] text-cl-ink/60 uppercase">
                  No past streams yet.
                </p>
              ) : (
                <div className="overflow-hidden rounded-lg border-[2.5px] border-cl-ink bg-cl-paper">
                  {past.map((s) => (
                    <StreamRow key={s.id} stream={s} onOpen={open} />
                  ))}
                </div>
              )}
            </>
          )}
        </Wrap>
      </section>
    </>
  )
}

export { StreamsPage }
