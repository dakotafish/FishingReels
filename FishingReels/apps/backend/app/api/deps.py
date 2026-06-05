from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.repositories.angler import AnglerRepository
from app.services.angler_service import AnglerService

get_db = get_session


def get_angler_repository(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> AnglerRepository:
    return AnglerRepository(db)


def get_angler_service(
    repo: Annotated[AnglerRepository, Depends(get_angler_repository)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> AnglerService:
    # FastAPI caches get_db within a request, so repo.db and service.db are the
    # same session — one unit of work per request.
    return AnglerService(repo=repo, db=db)
