from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError

from app.api.deps import get_angler_service
from app.schemas.angler import AnglerCreate, AnglerRead, AnglerUpdate
from app.services.angler_service import AnglerService

router = APIRouter(prefix="/anglers", tags=["anglers"])


@router.post("", response_model=AnglerRead, status_code=status.HTTP_201_CREATED)
async def create_angler(
    payload: AnglerCreate,
    service: Annotated[AnglerService, Depends(get_angler_service)],
):
    try:
        return await service.create(payload)
    except IntegrityError:
        # Slug race: two creates picked the same slug; the DB unique constraint
        # (uq_angler_slug) is the authoritative guard.
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            detail="An angler with this slug already exists.",
        )


@router.get("", response_model=list[AnglerRead])
async def list_anglers(
    service: Annotated[AnglerService, Depends(get_angler_service)],
):
    return await service.list_()


@router.get("/{slug}", response_model=AnglerRead)
async def get_angler(
    slug: str,
    service: Annotated[AnglerService, Depends(get_angler_service)],
):
    angler = await service.get_by_slug(slug)
    if angler is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Angler not found")
    return angler


@router.patch("/{slug}", response_model=AnglerRead)
async def update_angler(
    slug: str,
    payload: AnglerUpdate,
    service: Annotated[AnglerService, Depends(get_angler_service)],
):
    angler = await service.update(slug, payload)
    if angler is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Angler not found")
    return angler
