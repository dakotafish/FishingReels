"""Behavioral tests for StreamService (wired directly onto the rollback session)."""

import pytest
from sqlalchemy import select

from app.models.enums import StreamKeyStatus, StreamStatus
from app.models.stream import AnglerStream
from app.repositories.angler import AnglerRepository
from app.repositories.stream import StreamRepository
from app.repositories.stream_key import StreamKeyRepository
from app.schemas.angler import AnglerCreate
from app.services.angler_service import AnglerService
from app.services.stream_key_service import StreamKeyService
from app.services.stream_service import StreamService


@pytest.fixture
def stream_service(db_session):
    return StreamService(
        stream_repo=StreamRepository(db_session),
        key_repo=StreamKeyRepository(db_session),
        db=db_session,
    )


@pytest.fixture
def key_service(db_session):
    return StreamKeyService(repo=StreamKeyRepository(db_session), db=db_session)


@pytest.fixture
def angler_service(db_session):
    return AnglerService(repo=AnglerRepository(db_session), db=db_session)


async def _angler_with_key(angler_service, key_service, name="Service Angler"):
    angler = await angler_service.create(AnglerCreate(display_name=name))
    stream_key = await key_service.create_for_angler(angler.id)
    return angler, stream_key


async def test_start_stream_creates_stream_and_angler_link(
    db_session, stream_service, key_service, angler_service
):
    angler, stream_key = await _angler_with_key(angler_service, key_service)

    stream = await stream_service.start_stream(stream_key.key)

    assert stream is not None
    assert stream.status == StreamStatus.live
    assert stream.started_at is not None
    assert stream.ended_at is None
    assert stream.playlist_path == f"{stream.id}/index.m3u8"
    assert stream.playlist_url == f"/streams/{stream.id}/index.m3u8"
    assert stream.angler is not None and stream.angler.id == angler.id

    link = await db_session.scalar(
        select(AnglerStream).where(AnglerStream.stream_id == stream.id)
    )
    assert link is not None and link.angler_id == angler.id


async def test_start_stream_unknown_key_returns_none(stream_service):
    assert await stream_service.start_stream("not-a-key") is None


async def test_start_stream_revoked_key_returns_none(
    db_session, stream_service, key_service, angler_service
):
    _, stream_key = await _angler_with_key(angler_service, key_service)
    stream_key.status = StreamKeyStatus.revoked
    await db_session.flush()

    assert await stream_service.start_stream(stream_key.key) is None


async def test_end_stream_sets_ended_at(
    stream_service, key_service, angler_service
):
    _, stream_key = await _angler_with_key(angler_service, key_service)
    stream = await stream_service.start_stream(stream_key.key)

    ended = await stream_service.end_stream(stream_key.key)

    assert ended is True
    refreshed = await stream_service.get(stream.id)
    assert refreshed.status == StreamStatus.ended
    assert refreshed.ended_at is not None


async def test_end_stream_works_after_key_revoked(
    db_session, stream_service, key_service, angler_service
):
    # A key revoked mid-session must still be able to close out its stream.
    _, stream_key = await _angler_with_key(angler_service, key_service)
    stream = await stream_service.start_stream(stream_key.key)
    stream_key.status = StreamKeyStatus.revoked
    await db_session.flush()

    assert await stream_service.end_stream(stream_key.key) is True
    refreshed = await stream_service.get(stream.id)
    assert refreshed.status == StreamStatus.ended


async def test_authorize_publish_matrix(
    db_session, stream_service, key_service, angler_service
):
    _, stream_key = await _angler_with_key(angler_service, key_service)

    assert await stream_service.authorize_publish(stream_key.key) is True
    assert await stream_service.authorize_publish("not-a-key") is False

    stream_key.status = StreamKeyStatus.revoked
    await db_session.flush()
    assert await stream_service.authorize_publish(stream_key.key) is False
