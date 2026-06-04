# Import Base so Base.metadata is available for Alembic autogenerate, and import
# each domain model so its Table is registered on Base.metadata before
# alembic/env.py reads it.

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin
from app.models.enums import AnglerStatus
from app.models.angler import Angler

__all__ = [
    "Base",
    "UUIDPrimaryKeyMixin",
    "TimestampMixin",
    "AnglerStatus",
    "Angler",
]
