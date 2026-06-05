"""Repository-level tests for AnglerRepository (via the rollback db_session)."""

import pytest

from app.models.angler import Angler
from app.repositories.angler import AnglerRepository


@pytest.fixture
def repo(db_session):
    return AnglerRepository(db_session)


async def test_get_by_slug_found(repo, db_session):
    repo.add(Angler(display_name="River Fox", slug="river-fox"))
    await db_session.flush()

    found = await repo.get_by_slug("river-fox")
    assert found is not None
    assert found.slug == "river-fox"


async def test_get_by_slug_missing(repo):
    assert await repo.get_by_slug("does-not-exist") is None


async def test_slug_exists(repo, db_session):
    repo.add(Angler(display_name="Lake Bass", slug="lake-bass"))
    await db_session.flush()

    assert await repo.slug_exists("lake-bass") is True
    assert await repo.slug_exists("nope") is False


async def test_get_by_pk(repo, db_session):
    angler = Angler(display_name="Pike Hunter", slug="pike-hunter")
    repo.add(angler)
    await db_session.flush()
    await db_session.refresh(angler)

    fetched = await repo.get(angler.id)
    assert fetched is not None
    assert fetched.id == angler.id


async def test_list_returns_staged_rows(repo, db_session):
    repo.add(Angler(display_name="Alpha", slug="alpha"))
    repo.add(Angler(display_name="Beta", slug="beta"))
    await db_session.flush()

    slugs = {a.slug for a in await repo.list()}
    assert {"alpha", "beta"}.issubset(slugs)
