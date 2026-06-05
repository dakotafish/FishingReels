"""Service-level tests for AnglerService (wired directly, no HTTP).

The service calls real commit()/refresh(); under the db_session savepoint mode
those become SAVEPOINT releases that the outer rollback discards.
"""

import pytest

from app.repositories.angler import AnglerRepository
from app.schemas.angler import AnglerCreate, AnglerUpdate
from app.services.angler_service import AnglerService


@pytest.fixture
def service(db_session):
    return AnglerService(repo=AnglerRepository(db_session), db=db_session)


async def test_create_generates_slug_and_defaults(service):
    angler = await service.create(AnglerCreate(display_name="Jordan Lake"))

    assert angler.slug == "jordan-lake"
    assert angler.id is not None
    assert angler.created_at is not None
    assert angler.status.value == "active"


async def test_create_dedupes_slug(service):
    first = await service.create(AnglerCreate(display_name="Jordan Lake"))
    second = await service.create(AnglerCreate(display_name="Jordan Lake"))

    assert first.slug == "jordan-lake"
    assert second.slug == "jordan-lake-2"


async def test_create_stores_validated_optional_fields(service):
    angler = await service.create(
        AnglerCreate(
            display_name="Trout King",
            bio="Loves fly fishing",
            home_state="mt",  # normalized to MT by the schema validator
            home_town="Missoula",
        )
    )
    assert angler.bio == "Loves fly fishing"
    assert angler.home_state == "MT"
    assert angler.home_town == "Missoula"


async def test_get_by_slug(service):
    await service.create(AnglerCreate(display_name="Slug Target"))
    assert await service.get_by_slug("slug-target") is not None
    assert await service.get_by_slug("missing") is None


async def test_update_partial_leaves_other_fields(service):
    await service.create(AnglerCreate(display_name="Original Name", home_state="FL"))

    updated = await service.update("original-name", AnglerUpdate(bio="New bio"))
    assert updated is not None
    assert updated.bio == "New bio"
    assert updated.display_name == "Original Name"  # untouched
    assert updated.home_state == "FL"               # untouched


async def test_update_does_not_change_slug(service):
    await service.create(AnglerCreate(display_name="Keep My Slug"))

    updated = await service.update(
        "keep-my-slug", AnglerUpdate(display_name="Brand New Name")
    )
    assert updated is not None
    assert updated.slug == "keep-my-slug"          # immutable
    assert updated.display_name == "Brand New Name"


async def test_update_missing_returns_none(service):
    assert await service.update("ghost", AnglerUpdate(bio="x")) is None
