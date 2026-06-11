"""Stream-key management for an angler.

SECURITY: the platform has no auth model yet (deferred decision — see
Docs/Project-structure-design.md), so like every route these are unauthenticated.
When auth lands, all three handlers must gate on "caller owns this angler".
Until then the exposure is limited by design: the secret is returned only once
(at mint), listings carry a 4-char hint, and revocation replaces leaked keys.
"""

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_angler_service, get_stream_key_service
from app.schemas.stream import StreamKeyListItem, StreamKeyRead
from app.services.angler_service import AnglerService
from app.services.stream_key_service import StreamKeyService

router = APIRouter(prefix="/anglers/{slug}/stream-keys", tags=["stream-keys"])


@router.post("", response_model=StreamKeyRead, status_code=status.HTTP_201_CREATED)
async def create_stream_key(
    slug: str,
    angler_service: Annotated[AnglerService, Depends(get_angler_service)],
    key_service: Annotated[StreamKeyService, Depends(get_stream_key_service)],
):
    """Mint a key. The only response that ever contains the full secret."""
    angler = await angler_service.get_by_slug(slug)
    if angler is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Angler not found")
    return await key_service.create_for_angler(angler.id)


@router.get("", response_model=list[StreamKeyListItem])
async def list_stream_keys(
    slug: str,
    angler_service: Annotated[AnglerService, Depends(get_angler_service)],
    key_service: Annotated[StreamKeyService, Depends(get_stream_key_service)],
):
    angler = await angler_service.get_by_slug(slug)
    if angler is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Angler not found")
    return await key_service.list_for_angler(angler.id)


@router.delete("/{key_id}", status_code=status.HTTP_204_NO_CONTENT)
async def revoke_stream_key(
    slug: str,
    key_id: uuid.UUID,
    angler_service: Annotated[AnglerService, Depends(get_angler_service)],
    key_service: Annotated[StreamKeyService, Depends(get_stream_key_service)],
) -> None:
    angler = await angler_service.get_by_slug(slug)
    if angler is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Angler not found")
    if not await key_service.revoke(angler.id, key_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Stream key not found")
