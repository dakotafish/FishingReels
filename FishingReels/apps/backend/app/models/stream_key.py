import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Enum, ForeignKey, String, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin
from app.models.enums import StreamKeyStatus, StreamKeyType

if TYPE_CHECKING:
    from app.models.angler import Angler


class StreamKey(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """A publish credential for the ingest server.

    The key string doubles as the MediaMTX path: publishers send SRT streamid
    ``publish:<key>``, and the backend validates the path against this table
    before MediaMTX accepts the publish. Ownership lives in per-type link
    tables (AnglerStreamKey today); ``key_type`` says which one to consult.
    """

    __tablename__ = "stream_key"

    # Generated server-side via secrets.token_urlsafe — URL-safe chars only,
    # so the key is always a valid MediaMTX path segment.
    key: Mapped[str] = mapped_column(String(64), unique=True)
    key_type: Mapped[StreamKeyType] = mapped_column(
        Enum(
            StreamKeyType,
            name="stream_key_type",
            values_callable=lambda enum_cls: [member.value for member in enum_cls],
        ),
        default=StreamKeyType.angler,
        server_default=text("'angler'"),
    )
    status: Mapped[StreamKeyStatus] = mapped_column(
        Enum(
            StreamKeyStatus,
            name="stream_key_status",
            values_callable=lambda enum_cls: [member.value for member in enum_cls],
        ),
        default=StreamKeyStatus.active,
        server_default=text("'active'"),
    )

    @property
    def key_hint(self) -> str:
        """Last 4 chars, for recognizing a key in listings without exposing it."""
        return self.key[-4:]


class AnglerStreamKey(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """Link table tying a StreamKey to the one Angler who owns it.

    ``stream_key_id`` is unique so a key can never belong to two anglers; an
    angler may hold several keys.
    """

    __tablename__ = "angler_stream_key"

    angler_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("angler.id", ondelete="CASCADE")
    )
    stream_key_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("stream_key.id", ondelete="CASCADE"), unique=True
    )

    # lazy="raise" so async code can never trip implicit IO — repositories must
    # eager-load (selectinload) anything they intend to traverse.
    angler: Mapped["Angler"] = relationship(lazy="raise")
    stream_key: Mapped["StreamKey"] = relationship(lazy="raise")
