import uuid

import pytest
from sqlalchemy.exc import IntegrityError

from app.models import Angler, AnglerStatus


async def test_create_angler_populates_defaults(db_session):
    """Mixins + model produce a working row: UUID PK, server timestamps, and the
    status enum defaulting to active."""
    angler = Angler(display_name="Jane Rivera", slug="jane-rivera")
    db_session.add(angler)
    await db_session.flush()
    await db_session.refresh(angler)

    assert isinstance(angler.id, uuid.UUID)
    assert angler.created_at is not None and angler.created_at.tzinfo is not None
    assert angler.updated_at is not None and angler.updated_at.tzinfo is not None
    assert angler.status == AnglerStatus.active


async def test_slug_is_unique(db_session):
    db_session.add(Angler(display_name="Jane Rivera", slug="jane-rivera"))
    await db_session.flush()

    db_session.add(Angler(display_name="Jane Rivera II", slug="jane-rivera"))
    with pytest.raises(IntegrityError):
        await db_session.flush()
