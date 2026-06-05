from sqlalchemy import select

from app.models.angler import Angler
from app.repositories.base import BaseRepository


class AnglerRepository(BaseRepository[Angler]):
    """Bespoke queries for the Angler model."""

    model = Angler

    async def list(self) -> list[Angler]:
        # Deterministic ordering; pagination is a future addition.
        result = await self.db.scalars(
            select(Angler).order_by(Angler.created_at.desc())
        )
        return list(result.all())

    async def get_by_slug(self, slug: str) -> Angler | None:
        return await self.db.scalar(select(Angler).where(Angler.slug == slug))

    async def slug_exists(self, slug: str) -> bool:
        found = await self.db.scalar(
            select(Angler.id).where(Angler.slug == slug).limit(1)
        )
        return found is not None
