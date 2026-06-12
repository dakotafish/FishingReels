import { Link, useParams } from "react-router"

import { useStream } from "@/hooks/use-stream"
import { Wrap } from "@/components/layout/container"
import { StreamPlayer } from "@/components/stream/stream-player"
import { BadgeLive } from "@/components/ui/badge-live"
import { Chip } from "@/components/ui/chip"

function StreamWatchPage() {
  const { id } = useParams()
  const { stream, loading, error } = useStream(id)

  return (
    <section className="bg-cl-paper py-[44px] max-[640px]:py-6">
      <Wrap>
        {loading ? (
          <p className="font-label text-[13px] tracking-[0.1em] text-cl-ink/60 uppercase">
            Loading stream…
          </p>
        ) : error || !stream ? (
          <p className="text-cl-danger">Couldn’t load stream: {error}</p>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h1 className="m-0 min-w-0 truncate font-display text-[clamp(26px,3vw,40px)] leading-none font-extrabold text-cl-ink">
                {stream.angler ? (
                  <Link
                    to={`/anglers/${stream.angler.slug}`}
                    className="text-inherit no-underline hover:underline"
                  >
                    {stream.angler.display_name}
                  </Link>
                ) : (
                  "Stream"
                )}
              </h1>
              {stream.status === "live" ? (
                <BadgeLive />
              ) : (
                <Chip variant="sky">Ended</Chip>
              )}
            </div>

            <StreamPlayer
              src={stream.playlist_url}
              live={stream.status === "live"}
            />

            <p className="mt-3 font-label text-[12px] tracking-[0.1em] text-cl-ink/55 uppercase">
              Started {new Date(stream.started_at).toLocaleString()}
              {stream.ended_at
                ? ` · Ended ${new Date(stream.ended_at).toLocaleString()}`
                : " · You can rewind to the start while live"}
            </p>
          </>
        )}
      </Wrap>
    </section>
  )
}

export { StreamWatchPage }
