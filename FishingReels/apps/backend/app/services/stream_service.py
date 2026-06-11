"""Stream service — owns the unit of work for the stream lifecycle.

Driven by the MediaMTX hooks: auth (publish gate), ready (stream starts),
not-ready (stream ends). The MediaMTX path is the publish key.
"""

import uuid
from datetime import UTC, datetime

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.enums import StreamStatus
from app.models.stream import AnglerStream, Stream
from app.repositories.stream import StreamRepository
from app.repositories.stream_key import StreamKeyRepository


class StreamService:
    def __init__(
        self,
        stream_repo: StreamRepository,
        key_repo: StreamKeyRepository,
        db: AsyncSession,
    ) -> None:
        self.stream_repo = stream_repo
        self.key_repo = key_repo
        self.db = db

    async def authorize_publish(self, path: str) -> bool:
        """Publish gate: only an active key linked to an angler may publish."""
        return await self.key_repo.get_active_angler_link(path) is not None

    async def start_stream(self, path: str) -> Stream | None:
        """Register a new live stream for the angler owning ``path``.

        Returns None if the path matches no active angler key (the caller
        404s and the hook script then refuses to spawn the packager).
        """
        link = await self.key_repo.get_active_angler_link(path)
        if link is None:
            return None

        now = datetime.now(UTC)
        # Defensive sweep: a crashed MediaMTX container can leave a stream
        # stuck "live" (its not-ready hook never fired). End those now so a
        # reconnect always gets a fresh Stream row and recording dir.
        for stale in await self.stream_repo.list_live_for_angler(link.angler_id):
            stale.status = StreamStatus.ended
            stale.ended_at = now

        # id is set explicitly: playlist_path embeds it and the link row
        # references it, both before flush (column defaults fire at flush).
        stream_id = uuid.uuid4()
        stream = Stream(
            id=stream_id,
            started_at=now,
            playlist_path=f"{stream_id}/index.m3u8",
        )
        self.stream_repo.add(stream)
        self.stream_repo.add_angler_link(
            AnglerStream(angler_id=link.angler_id, stream_id=stream_id)
        )
        await self.db.commit()
        # Re-fetch with the angler chain eager-loaded for serialization.
        return await self.stream_repo.get_with_angler(stream_id)

    async def end_stream(self, path: str) -> bool | None:
        """Mark the live stream(s) for ``path``'s angler as ended.

        Looks the key up regardless of status (it may have been revoked
        mid-session). Idempotent: zero live streams is still success.
        Returns None only when the key is unknown entirely.
        """
        link = await self.key_repo.get_angler_link(path)
        if link is None:
            return None

        now = datetime.now(UTC)
        for stream in await self.stream_repo.list_live_for_angler(link.angler_id):
            stream.status = StreamStatus.ended
            stream.ended_at = now
        await self.db.commit()
        return True

    async def list_(self, status: StreamStatus | None = None) -> list[Stream]:
        return await self.stream_repo.list_filtered(status)

    async def get(self, stream_id: uuid.UUID) -> Stream | None:
        return await self.stream_repo.get_with_angler(stream_id)
