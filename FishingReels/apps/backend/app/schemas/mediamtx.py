"""Wire formats for the MediaMTX -> backend hooks.

MediaMTX's payloads vary across versions (newer releases add fields such as
``userAgent``), so every inbound schema tolerates extras. These endpoints are
internal-only and excluded from the OpenAPI schema.
"""

import uuid

from pydantic import BaseModel, ConfigDict


class MediaMTXAuthPayload(BaseModel):
    """POSTed by MediaMTX (authMethod: http) for every access attempt."""

    model_config = ConfigDict(extra="ignore")

    action: str
    path: str = ""
    user: str | None = None
    password: str | None = None
    ip: str | None = None
    protocol: str | None = None
    id: str | None = None
    query: str | None = None


class StreamReadyPayload(BaseModel):
    """Sent by the runOnReady hook script when a publish starts."""

    model_config = ConfigDict(extra="ignore")

    path: str
    query: str | None = None
    source_type: str | None = None
    source_id: str | None = None


class StreamReadyResponse(BaseModel):
    stream_id: uuid.UUID


class StreamNotReadyPayload(BaseModel):
    """Sent by the runOnNotReady hook script when a publish stops."""

    model_config = ConfigDict(extra="ignore")

    path: str
