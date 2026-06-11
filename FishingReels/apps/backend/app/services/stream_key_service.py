"""Stream-key service — mints and lists publish keys for anglers."""

import secrets
import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.enums import StreamKeyStatus
from app.models.stream_key import AnglerStreamKey, StreamKey
from app.repositories.stream_key import StreamKeyRepository


class StreamKeyService:
    def __init__(self, repo: StreamKeyRepository, db: AsyncSession) -> None:
        self.repo = repo
        self.db = db

    async def create_for_angler(self, angler_id: uuid.UUID) -> StreamKey:
        # token_urlsafe(24) -> 32 chars of [A-Za-z0-9_-]: always a valid
        # MediaMTX path segment, comfortably inside the 64-char column.
        # id is set explicitly so the link row can reference it pre-flush
        # (column defaults only fire at flush time).
        stream_key = StreamKey(id=uuid.uuid4(), key=secrets.token_urlsafe(24))
        self.repo.add(stream_key)
        self.repo.add_angler_link(
            AnglerStreamKey(angler_id=angler_id, stream_key_id=stream_key.id)
        )
        await self.db.commit()
        await self.db.refresh(stream_key)
        return stream_key

    async def list_for_angler(self, angler_id: uuid.UUID) -> list[StreamKey]:
        return await self.repo.list_for_angler(angler_id)

    async def revoke(self, angler_id: uuid.UUID, key_id: uuid.UUID) -> bool:
        """Revoke a key (status flip, never row deletion — a revoked key must
        still resolve so the not-ready hook can close out its live stream).

        Idempotent; False only when the key doesn't exist or belongs to a
        different angler.
        """
        stream_key = await self.repo.get_for_angler(angler_id, key_id)
        if stream_key is None:
            return False
        stream_key.status = StreamKeyStatus.revoked
        await self.db.commit()
        return True
