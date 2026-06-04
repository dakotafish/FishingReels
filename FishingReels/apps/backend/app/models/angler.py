from sqlalchemy import Enum, String, Text, text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin
from app.models.enums import AnglerStatus


class Angler(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """A discoverable public athlete profile — the core identity on the platform.

    An Angler exists independently of a login: organizers can create profiles,
    and a User optionally claims one via AnglerUser. All identity/profile fields
    therefore live here; streams, highlights, sponsors, leagues, and tournament
    entries live in related tables.
    """

    __tablename__ = "angler"

    display_name: Mapped[str] = mapped_column(String(120))
    # URL handle for the public profile (/anglers/<slug>); auto-slugified from
    # display_name and lowercased on write by the service layer.
    slug: Mapped[str] = mapped_column(String(80), unique=True)
    bio: Mapped[str | None] = mapped_column(Text)
    avatar_url: Mapped[str | None] = mapped_column(String(2048))
    status: Mapped[AnglerStatus] = mapped_column(
        Enum(
            AnglerStatus,
            name="angler_status",
            values_callable=lambda enum_cls: [member.value for member in enum_cls],
        ),
        default=AnglerStatus.active,
        server_default=text("'active'"),
    )
    # US state code, e.g. "FL" (stored uppercase; validated app-side).
    home_state: Mapped[str | None] = mapped_column(String(2))
    home_town: Mapped[str | None] = mapped_column(String(100))
