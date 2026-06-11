import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.enums import StreamKeyStatus, StreamKeyType, StreamStatus


class StreamKeyRead(BaseModel):
    """Full key included — returned ONLY by the mint endpoint, once."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    key: str
    key_type: StreamKeyType
    status: StreamKeyStatus
    created_at: datetime
    updated_at: datetime


class StreamKeyListItem(BaseModel):
    """Key metadata for listings — never carries the secret. A lost key is
    replaced by minting a new one and revoking the old."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    key_hint: str
    key_type: StreamKeyType
    status: StreamKeyStatus
    created_at: datetime
    updated_at: datetime


class AnglerSummary(BaseModel):
    """Just enough Angler for stream listings and the watch page."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    display_name: str
    slug: str
    avatar_url: str | None


class StreamRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    status: StreamStatus
    started_at: datetime
    ended_at: datetime | None
    # Model property: "/streams/<playlist_path>" — same contract in dev & prod.
    playlist_url: str
    # Model property over angler_links; None for (future) non-angler streams.
    angler: AnglerSummary | None
    created_at: datetime
    updated_at: datetime
