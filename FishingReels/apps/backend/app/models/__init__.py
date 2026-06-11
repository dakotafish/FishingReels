# Import Base so Base.metadata is available for Alembic autogenerate, and import
# each domain model so its Table is registered on Base.metadata before
# alembic/env.py reads it.

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin
from app.models.enums import AnglerStatus, StreamKeyStatus, StreamKeyType, StreamStatus
from app.models.angler import Angler
from app.models.stream import AnglerStream, Stream
from app.models.stream_key import AnglerStreamKey, StreamKey

__all__ = [
    "Base",
    "UUIDPrimaryKeyMixin",
    "TimestampMixin",
    "AnglerStatus",
    "Angler",
    "StreamKeyType",
    "StreamKeyStatus",
    "StreamStatus",
    "StreamKey",
    "AnglerStreamKey",
    "Stream",
    "AnglerStream",
]
