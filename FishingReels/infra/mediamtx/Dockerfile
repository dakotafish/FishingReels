# Custom MediaMTX image: the -ffmpeg variant (Alpine-based) so the runOnReady
# hook can spawn the HLS packager, plus curl/jq for the backend hook calls.
# Pinned: hook/auth config keys drift between MediaMTX minor versions.
FROM bluenviron/mediamtx:1.19.1-ffmpeg

RUN apk add --no-cache curl jq

COPY scripts/on-ready.sh scripts/on-not-ready.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/on-ready.sh /usr/local/bin/on-not-ready.sh
