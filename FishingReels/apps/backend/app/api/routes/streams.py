import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from fastapi import status as http_status

from app.api.deps import get_stream_service
from app.models.enums import StreamStatus
from app.schemas.stream import StreamRead
from app.services.stream_service import StreamService

router = APIRouter(prefix="/streams", tags=["streams"])


@router.get("", response_model=list[StreamRead])
async def list_streams(
    service: Annotated[StreamService, Depends(get_stream_service)],
    status: StreamStatus | None = None,
):
    return await service.list_(status)


@router.get("/{stream_id}", response_model=StreamRead)
async def get_stream(
    stream_id: uuid.UUID,
    service: Annotated[StreamService, Depends(get_stream_service)],
):
    stream = await service.get(stream_id)
    if stream is None:
        raise HTTPException(http_status.HTTP_404_NOT_FOUND, detail="Stream not found")
    return stream
