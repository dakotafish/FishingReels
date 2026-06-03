# Import Base so Base.metadata is available for Alembic autogenerate.
# As domain models are added, import each here so its Table is registered on
# Base.metadata before alembic/env.py reads it, e.g.:
#   from app.models.angler import Angler  # noqa: F401

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

__all__ = ["Base", "UUIDPrimaryKeyMixin", "TimestampMixin"]
