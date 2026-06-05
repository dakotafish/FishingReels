"""Angler service — owns the unit of work for Angler mutations."""

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.angler import Angler
from app.repositories.angler import AnglerRepository
from app.schemas.angler import AnglerCreate, AnglerUpdate
from app.services.slug import generate_unique_slug


class AnglerService:
    def __init__(self, repo: AnglerRepository, db: AsyncSession) -> None:
        self.repo = repo
        self.db = db

    async def create(self, payload: AnglerCreate) -> Angler:
        slug = await generate_unique_slug(payload.display_name, self.repo.slug_exists)
        angler = Angler(
            display_name=payload.display_name,
            slug=slug,
            bio=payload.bio,
            avatar_url=payload.avatar_url,
            home_state=payload.home_state,
            home_town=payload.home_town,
        )
        self.repo.add(angler)
        await self.db.commit()
        await self.db.refresh(angler)
        return angler

    async def list_(self) -> list[Angler]:
        return await self.repo.list()

    async def get_by_slug(self, slug: str) -> Angler | None:
        return await self.repo.get_by_slug(slug)

    async def update(self, slug: str, payload: AnglerUpdate) -> Angler | None:
        angler = await self.repo.get_by_slug(slug)
        if angler is None:
            return None
        # Only the fields the client actually sent; slug is never in the schema.
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(angler, field, value)
        await self.db.commit()
        await self.db.refresh(angler)
        return angler
