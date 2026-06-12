#!/bin/sh
# runOnNotReady hook: make sure the recording playlist is finalized, then tell
# the backend the stream ended. ffmpeg (SIGINT'd by MediaMTX in parallel with
# this script) normally writes #EXT-X-ENDLIST itself — the append here is the
# backstop for an ffmpeg that died ungracefully.
set -eu

SESSION_FILE="/recordings/.sessions/$MTX_PATH"
if [ -f "$SESSION_FILE" ]; then
  STREAM_ID=$(cat "$SESSION_FILE")
  PLAYLIST="/recordings/$STREAM_ID/index.m3u8"

  i=0
  while [ "$i" -lt 5 ]; do
    grep -q '#EXT-X-ENDLIST' "$PLAYLIST" 2>/dev/null && break
    i=$((i + 1))
    sleep 1
  done
  if [ -f "$PLAYLIST" ] && ! grep -q '#EXT-X-ENDLIST' "$PLAYLIST"; then
    printf '#EXT-X-ENDLIST\n' >> "$PLAYLIST"
  fi

  rm -f "$SESSION_FILE"
fi

i=0
while [ "$i" -lt 10 ]; do
  if curl -fsS -X POST "$BACKEND_BASE_URL/api/internal/mediamtx/not-ready" \
    -H "Content-Type: application/json" \
    -H "X-Webhook-Secret: $WEBHOOK_SECRET" \
    -d "{\"path\":\"$MTX_PATH\"}" > /dev/null; then
    exit 0
  fi
  i=$((i + 1))
  sleep 2
done

# Not fatal for the data model: the next publish for this angler sweeps any
# stream left stuck "live".
echo "on-not-ready: backend unreachable; stream row stays live until swept" >&2
exit 1
