import uuid

from sqlalchemy import select

from app.models.enums import StreamKeyStatus, StreamKeyType
from app.models.stream_key import AnglerStreamKey, StreamKey
from app.repositories.base import BaseRepository


class StreamKeyRepository(BaseRepository[StreamKey]):
    """Bespoke queries for publish keys and their angler links."""

    model = StreamKey

    def add_angler_link(self, link: AnglerStreamKey) -> None:
        """Stage an angler<->key link for insertion."""
        self.db.add(link)

    async def get_active_angler_link(self, key: str) -> AnglerStreamKey | None:
        """The angler link for an *active* angler-type key — the auth check."""
        return await self.db.scalar(
            select(AnglerStreamKey)
            .join(StreamKey, AnglerStreamKey.stream_key_id == StreamKey.id)
            .where(
                StreamKey.key == key,
                StreamKey.status == StreamKeyStatus.active,
                StreamKey.key_type == StreamKeyType.angler,
            )
        )

    async def get_angler_link(self, key: str) -> AnglerStreamKey | None:
        """The angler link regardless of key status — for ending a stream
        whose key was revoked mid-session."""
        return await self.db.scalar(
            select(AnglerStreamKey)
            .join(StreamKey, AnglerStreamKey.stream_key_id == StreamKey.id)
            .where(
                StreamKey.key == key,
                StreamKey.key_type == StreamKeyType.angler,
            )
        )

    async def get_for_angler(
        self, angler_id: uuid.UUID, key_id: uuid.UUID
    ) -> StreamKey | None:
        """A key by id, only if it belongs to the given angler."""
        return await self.db.scalar(
            select(StreamKey)
            .join(AnglerStreamKey, AnglerStreamKey.stream_key_id == StreamKey.id)
            .where(
                StreamKey.id == key_id,
                AnglerStreamKey.angler_id == angler_id,
            )
        )

    async def list_for_angler(self, angler_id: uuid.UUID) -> list[StreamKey]:
        result = await self.db.scalars(
            select(StreamKey)
            .join(AnglerStreamKey, AnglerStreamKey.stream_key_id == StreamKey.id)
            .where(AnglerStreamKey.angler_id == angler_id)
            .order_by(StreamKey.created_at.desc())
        )
        return list(result.all())
