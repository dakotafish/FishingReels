"""API tests for the internal MediaMTX hook endpoints (auth/ready/not-ready)."""

from sqlalchemy import select

from app.core.config import settings
from app.models.enums import StreamKeyStatus
from app.models.stream_key import StreamKey

SECRET = {"X-Webhook-Secret": settings.mediamtx_webhook_secret}
AUTH = "/api/internal/mediamtx/auth"
READY = "/api/internal/mediamtx/ready"
NOT_READY = "/api/internal/mediamtx/not-ready"


async def _mint_key(api_client, name: str = "Hook Angler") -> tuple[str, str]:
    """Create an angler + stream key via the public API; return (slug, key)."""
    resp = await api_client.post("/api/anglers", json={"display_name": name})
    slug = resp.json()["slug"]
    resp = await api_client.post(f"/api/anglers/{slug}/stream-keys")
    return slug, resp.json()["key"]


def _publish(path: str, action: str = "publish") -> dict:
    """A MediaMTX-shaped auth payload (extra fields are tolerated)."""
    return {
        "action": action,
        "path": path,
        "protocol": "srt",
        "ip": "172.18.0.5",
        "query": "",
        "user": "",
        "password": "",
    }


# --- secret gate ---


async def test_auth_rejects_missing_secret(api_client):
    resp = await api_client.post(AUTH, json=_publish("whatever"))
    assert resp.status_code == 401


async def test_auth_rejects_wrong_secret(api_client):
    resp = await api_client.post(
        AUTH, json=_publish("whatever"), headers={"X-Webhook-Secret": "nope"}
    )
    assert resp.status_code == 401


async def test_auth_accepts_secret_as_query_param(api_client):
    # The authHTTPAddress URL can't set headers, so ?secret= must work too.
    resp = await api_client.post(
        f"{AUTH}?secret={settings.mediamtx_webhook_secret}",
        json=_publish("whatever", action="read"),
    )
    assert resp.status_code == 204


# --- /auth ---


async def test_auth_accepts_non_publish_action(api_client):
    resp = await api_client.post(
        AUTH, json=_publish("garbage-path", action="read"), headers=SECRET
    )
    assert resp.status_code == 204


async def test_auth_accepts_publish_with_active_key(api_client):
    _, key = await _mint_key(api_client)
    resp = await api_client.post(AUTH, json=_publish(key), headers=SECRET)
    assert resp.status_code == 204


async def test_auth_rejects_publish_unknown_path(api_client):
    resp = await api_client.post(AUTH, json=_publish("not-a-key"), headers=SECRET)
    assert resp.status_code == 401


async def test_auth_rejects_publish_revoked_key(api_client, db_session):
    _, key = await _mint_key(api_client)
    stream_key = await db_session.scalar(select(StreamKey).where(StreamKey.key == key))
    stream_key.status = StreamKeyStatus.revoked
    await db_session.flush()

    resp = await api_client.post(AUTH, json=_publish(key), headers=SECRET)
    assert resp.status_code == 401


# --- /ready ---


async def test_ready_creates_live_stream_and_link(api_client):
    slug, key = await _mint_key(api_client)

    resp = await api_client.post(READY, json={"path": key}, headers=SECRET)
    assert resp.status_code == 200
    stream_id = resp.json()["stream_id"]

    resp = await api_client.get(f"/api/streams/{stream_id}")
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "live"
    assert body["started_at"] is not None
    assert body["ended_at"] is None
    assert body["playlist_url"] == f"/streams/{stream_id}/index.m3u8"
    assert body["angler"]["slug"] == slug


async def test_ready_unknown_key_404(api_client):
    resp = await api_client.post(READY, json={"path": "not-a-key"}, headers=SECRET)
    assert resp.status_code == 404


async def test_ready_sweeps_stale_live_stream(api_client):
    # A missed not-ready hook leaves a stream stuck "live"; the next publish
    # for the same angler must end it rather than coexist with it.
    _, key = await _mint_key(api_client)
    first = (await api_client.post(READY, json={"path": key}, headers=SECRET)).json()
    second = (await api_client.post(READY, json={"path": key}, headers=SECRET)).json()

    first_body = (await api_client.get(f"/api/streams/{first['stream_id']}")).json()
    second_body = (await api_client.get(f"/api/streams/{second['stream_id']}")).json()
    assert first_body["status"] == "ended"
    assert first_body["ended_at"] is not None
    assert second_body["status"] == "live"


# --- /not-ready ---


async def test_not_ready_marks_ended(api_client):
    _, key = await _mint_key(api_client)
    stream_id = (await api_client.post(READY, json={"path": key}, headers=SECRET)).json()[
        "stream_id"
    ]

    resp = await api_client.post(NOT_READY, json={"path": key}, headers=SECRET)
    assert resp.status_code == 200

    body = (await api_client.get(f"/api/streams/{stream_id}")).json()
    assert body["status"] == "ended"
    assert body["ended_at"] is not None


async def test_not_ready_idempotent(api_client):
    _, key = await _mint_key(api_client)
    await api_client.post(READY, json={"path": key}, headers=SECRET)
    await api_client.post(NOT_READY, json={"path": key}, headers=SECRET)

    resp = await api_client.post(NOT_READY, json={"path": key}, headers=SECRET)
    assert resp.status_code == 200


async def test_not_ready_unknown_key_404(api_client):
    resp = await api_client.post(NOT_READY, json={"path": "not-a-key"}, headers=SECRET)
    assert resp.status_code == 404


# --- OpenAPI hygiene ---


async def test_hooks_hidden_from_openapi(client):
    resp = await client.get("/openapi.json")
    assert resp.status_code == 200
    assert not [p for p in resp.json()["paths"] if p.startswith("/api/internal/")]
