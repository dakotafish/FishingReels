import uuid
from typing import Generic, TypeVar

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import Base

ModelT = TypeVar("ModelT", bound=Base)


class BaseRepository(Generic[ModelT]):
    """Query-only base repository.

    Repositories never commit, flush, or refresh — the service layer owns the
    unit of work. Reads are SELECT-only; writes (``add``, ``delete``) only stage
    changes on the session for the service to commit.
    """

    model: type[ModelT]

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get(self, entity_id: uuid.UUID) -> ModelT | None:
        return await self.db.get(self.model, entity_id)

    async def list(self) -> list[ModelT]:
        result = await self.db.scalars(select(self.model))
        return list(result.all())

    def add(self, entity: ModelT) -> None:
        """Stage an entity for insertion (sync — registers on the session)."""
        self.db.add(entity)

    async def delete(self, entity: ModelT) -> None:
        """Stage an entity for deletion (async — may emit SQL for cascades)."""
        await self.db.delete(entity)
