import uuid
from datetime import datetime

from sqlalchemy import DateTime, MetaData, Uuid, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

# Alembic-recommended naming convention. Ensures every constraint gets a
# stable, deterministic name in migrations, which keeps autogenerate diffs clean.
NAMING_CONVENTION: dict[str, str] = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}


class Base(DeclarativeBase):
    metadata = MetaData(naming_convention=NAMING_CONVENTION)


class UUIDPrimaryKeyMixin:
    """Adds a UUID primary key column.

    The default is generated client-side (``uuid.uuid4``) so the PK is known in
    Python before the row is flushed — handy for building relationships and
    response objects without a DB round-trip. asyncpg maps Postgres ``uuid``
    to ``uuid.UUID`` natively.
    """

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        sort_order=-2,
    )


class TimestampMixin:
    """Adds tz-aware ``created_at`` / ``updated_at`` columns.

    Both carry a server default so Postgres fills them even on inserts outside
    the ORM; ``updated_at`` also carries ``onupdate`` so SQLAlchemy refreshes it
    on every ORM UPDATE. (DB-side enforcement of ``updated_at`` would be a
    separate trigger.)
    """

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        sort_order=-1,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
        sort_order=0,
    )
