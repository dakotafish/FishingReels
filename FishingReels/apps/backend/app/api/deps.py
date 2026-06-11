from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.repositories.angler import AnglerRepository
from app.repositories.stream import StreamRepository
from app.repositories.stream_key import StreamKeyRepository
from app.services.angler_service import AnglerService
from app.services.stream_key_service import StreamKeyService
from app.services.stream_service import StreamService

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


def get_stream_key_repository(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> StreamKeyRepository:
    return StreamKeyRepository(db)


def get_stream_repository(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> StreamRepository:
    return StreamRepository(db)


def get_stream_key_service(
    repo: Annotated[StreamKeyRepository, Depends(get_stream_key_repository)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> StreamKeyService:
    return StreamKeyService(repo=repo, db=db)


def get_stream_service(
    stream_repo: Annotated[StreamRepository, Depends(get_stream_repository)],
    key_repo: Annotated[StreamKeyRepository, Depends(get_stream_key_repository)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> StreamService:
    return StreamService(stream_repo=stream_repo, key_repo=key_repo, db=db)
