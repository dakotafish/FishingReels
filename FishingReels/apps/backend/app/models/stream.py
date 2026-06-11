import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum, ForeignKey, String, UniqueConstraint, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin
from app.models.enums import StreamStatus

if TYPE_CHECKING:
    from app.models.angler import Angler


class Stream(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """One live-stream session from ingest to (eventual) VOD.

    Created by the MediaMTX runOnReady hook when a publish starts and marked
    ``ended`` by runOnNotReady. The packager writes event-style HLS under
    ``<HLS root>/<stream id>/``, so the same playlist serves live rewind and,
    after #EXT-X-ENDLIST, the VOD. Ownership lives in per-type link tables
    (AnglerStream today, TourneyStream later) — a Stream is intentionally
    shareable.
    """

    __tablename__ = "stream"

    status: Mapped[StreamStatus] = mapped_column(
        Enum(
            StreamStatus,
            name="stream_status",
            values_callable=lambda enum_cls: [member.value for member in enum_cls],
        ),
        default=StreamStatus.live,
        server_default=text("'live'"),
    )
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    ended_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    # Relative to the HLS root (./data/hls on the host): "<stream id>/index.m3u8".
    playlist_path: Mapped[str] = mapped_column(String(255))

    angler_links: Mapped[list["AnglerStream"]] = relationship(
        back_populates="stream", lazy="raise"
    )

    @property
    def playlist_url(self) -> str:
        """Public URL for the playlist — same contract in dev and prod."""
        return f"/streams/{self.playlist_path}"

    @property
    def angler(self) -> "Angler | None":
        """The owning angler, if any. Requires angler_links eager-loaded."""
        return self.angler_links[0].angler if self.angler_links else None


class AnglerStream(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """Link table tying a Stream to the Angler it belongs to."""

    __tablename__ = "angler_stream"
    __table_args__ = (UniqueConstraint("angler_id", "stream_id"),)

    angler_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("angler.id", ondelete="CASCADE")
    )
    stream_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("stream.id", ondelete="CASCADE")
    )

    angler: Mapped["Angler"] = relationship(lazy="raise")
    stream: Mapped["Stream"] = relationship(back_populates="angler_links", lazy="raise")
