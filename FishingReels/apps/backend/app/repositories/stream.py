import uuid

from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.enums import StreamStatus
from app.models.stream import AnglerStream, Stream
from app.repositories.base import BaseRepository


def _with_angler():
    """Eager-load option for the angler chain.

    ``Stream.angler`` (a plain property) traverses ``angler_links``, and the
    relationships are ``lazy="raise"`` — so every read that will be serialized
    must apply this.
    """
    return selectinload(Stream.angler_links).selectinload(AnglerStream.angler)


class StreamRepository(BaseRepository[Stream]):
    """Bespoke queries for stream sessions."""

    model = Stream

    def add_angler_link(self, link: AnglerStream) -> None:
        """Stage an angler<->stream link for insertion."""
        self.db.add(link)

    async def list_filtered(self, status: StreamStatus | None = None) -> list[Stream]:
        stmt = (
            select(Stream).options(_with_angler()).order_by(Stream.started_at.desc())
        )
        if status is not None:
            stmt = stmt.where(Stream.status == status)
        result = await self.db.scalars(stmt)
        return list(result.all())

    async def get_with_angler(self, stream_id: uuid.UUID) -> Stream | None:
        return await self.db.scalar(
            select(Stream).options(_with_angler()).where(Stream.id == stream_id)
        )

    async def list_live_for_angler(self, angler_id: uuid.UUID) -> list[Stream]:
        result = await self.db.scalars(
            select(Stream)
            .join(AnglerStream, AnglerStream.stream_id == Stream.id)
            .where(
                AnglerStream.angler_id == angler_id,
                Stream.status == StreamStatus.live,
            )
        )
        return list(result.all())
