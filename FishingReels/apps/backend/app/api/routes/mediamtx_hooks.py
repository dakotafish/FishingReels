"""Internal endpoints called by the MediaMTX container, never by browsers.

Three hooks drive the stream lifecycle:

- ``/auth``       — MediaMTX ``authMethod: http`` callback; gates publishes.
- ``/ready``      — runOnReady script; registers the Stream, returns its id.
- ``/not-ready``  — runOnNotReady script; marks the Stream ended.

All three require the shared webhook secret, as an ``X-Webhook-Secret`` header
(curl from the hook scripts) or a ``?secret=`` query param (the auth callback
URL is configured as a single string, so it can't set headers). The router is
excluded from the OpenAPI schema so generated frontend types stay clean.
"""

import hmac
from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException, Query, status

from app.api.deps import get_stream_service
from app.core.config import settings
from app.schemas.mediamtx import (
    MediaMTXAuthPayload,
    StreamNotReadyPayload,
    StreamReadyPayload,
    StreamReadyResponse,
)
from app.services.stream_service import StreamService


def require_webhook_secret(
    x_webhook_secret: Annotated[str | None, Header()] = None,
    secret: Annotated[str | None, Query()] = None,
) -> None:
    provided = x_webhook_secret or secret or ""
    if not hmac.compare_digest(provided, settings.mediamtx_webhook_secret):
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED, detail="Invalid webhook secret"
        )


router = APIRouter(
    prefix="/internal/mediamtx",
    include_in_schema=False,
    dependencies=[Depends(require_webhook_secret)],
)


@router.post("/auth", status_code=status.HTTP_204_NO_CONTENT)
async def authorize(
    payload: MediaMTXAuthPayload,
    service: Annotated[StreamService, Depends(get_stream_service)],
) -> None:
    """Any 20x accepts the action; anything else rejects it (MediaMTX rule)."""
    if payload.action != "publish":
        # Reads/API/etc. are open; only publishing is key-gated.
        return
    if not await service.authorize_publish(payload.path):
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED, detail="Unknown or inactive stream key"
        )


@router.post("/ready", response_model=StreamReadyResponse)
async def stream_ready(
    payload: StreamReadyPayload,
    service: Annotated[StreamService, Depends(get_stream_service)],
):
    stream = await service.start_stream(payload.path)
    if stream is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, detail="Unknown or inactive stream key"
        )
    return StreamReadyResponse(stream_id=stream.id)


@router.post("/not-ready")
async def stream_not_ready(
    payload: StreamNotReadyPayload,
    service: Annotated[StreamService, Depends(get_stream_service)],
):
    ended = await service.end_stream(payload.path)
    if ended is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Unknown stream key")
    return {"status": "ok"}
