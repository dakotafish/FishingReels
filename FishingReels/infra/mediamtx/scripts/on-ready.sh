#!/bin/sh
# runOnReady hook: register the publish with the backend, then exec the HLS
# packager. MediaMTX sends SIGINT to this process when the publish stops; the
# exec is what lets that signal land on ffmpeg so it finalizes the playlist
# (#EXT-X-ENDLIST) and the recording becomes the VOD.
#
# Env from MediaMTX: MTX_PATH (the stream key), MTX_QUERY, MTX_SOURCE_TYPE,
# MTX_SOURCE_ID. Env from compose: BACKEND_BASE_URL, WEBHOOK_SECRET.
set -eu

BODY=$(printf '{"path":"%s","query":"%s","source_type":"%s","source_id":"%s"}' \
  "$MTX_PATH" "${MTX_QUERY:-}" "${MTX_SOURCE_TYPE:-}" "${MTX_SOURCE_ID:-}")
TMP="/tmp/on-ready.$$.json"

# Retry while the backend is unreachable or 5xx; a 4xx is final (the key was
# revoked between auth and ready) — never package an unregistered stream.
RESP=""
i=0
while [ "$i" -lt 10 ]; do
  CODE=$(curl -sS -o "$TMP" -w '%{http_code}' \
    -X POST "$BACKEND_BASE_URL/api/internal/mediamtx/ready" \
    -H "Content-Type: application/json" \
    -H "X-Webhook-Secret: $WEBHOOK_SECRET" \
    -d "$BODY") || CODE=000
  case "$CODE" in
    200)
      RESP=$(cat "$TMP")
      break
      ;;
    4*)
      echo "on-ready: backend refused registration ($CODE) for path $MTX_PATH" >&2
      rm -f "$TMP"
      exit 1
      ;;
  esac
  i=$((i + 1))
  sleep 2
done
rm -f "$TMP"

if [ -z "$RESP" ]; then
  echo "on-ready: backend unreachable; not packaging path $MTX_PATH" >&2
  exit 1
fi

STREAM_ID=$(printf '%s' "$RESP" | jq -r '.stream_id')
if [ -z "$STREAM_ID" ] || [ "$STREAM_ID" = "null" ]; then
  echo "on-ready: no stream_id in backend response: $RESP" >&2
  exit 1
fi

# Session state for on-not-ready.sh. MTX_PATH is a token_urlsafe key (no
# slashes — anything else was rejected at the auth door), so it's a safe
# filename. .sessions is never served: both nginx configs only match media
# extensions.
mkdir -p /recordings/.sessions "/recordings/$STREAM_ID"
printf '%s' "$STREAM_ID" > "/recordings/.sessions/$MTX_PATH"

# Event-style HLS: append-only segments, playlist never truncates -> viewers
# can scrub to the very start of a live stream. -c copy = pure remux (no
# transcode); publishers must send H.264 + AAC (Moblin: NOT HEVC).
exec ffmpeg -nostdin -hide_banner -loglevel warning \
  -rtsp_transport tcp \
  -i "rtsp://127.0.0.1:8554/$MTX_PATH" \
  -c copy \
  -f hls \
  -hls_time 4 \
  -hls_list_size 0 \
  -hls_playlist_type event \
  -hls_segment_type fmp4 \
  -hls_fmp4_init_filename init.mp4 \
  -hls_flags program_date_time \
  -hls_segment_filename "/recordings/$STREAM_ID/seg%06d.m4s" \
  "/recordings/$STREAM_ID/index.m3u8"
