"""End-to-end API tests for /api/streams (seeded via the MediaMTX hooks)."""

import uuid

from app.core.config import settings

SECRET = {"X-Webhook-Secret": settings.mediamtx_webhook_secret}
READY = "/api/internal/mediamtx/ready"
NOT_READY = "/api/internal/mediamtx/not-ready"


async def _mint_key(api_client, name: str) -> tuple[str, str]:
    resp = await api_client.post("/api/anglers", json={"display_name": name})
    slug = resp.json()["slug"]
    resp = await api_client.post(f"/api/anglers/{slug}/stream-keys")
    return slug, resp.json()["key"]


async def test_list_streams_empty(api_client):
    resp = await api_client.get("/api/streams")
    assert resp.status_code == 200
    assert resp.json() == []


async def test_list_streams_filters_by_status(api_client):
    _, ended_key = await _mint_key(api_client, "Ended Angler")
    await api_client.post(READY, json={"path": ended_key}, headers=SECRET)
    await api_client.post(NOT_READY, json={"path": ended_key}, headers=SECRET)

    _, live_key = await _mint_key(api_client, "Live Angler")
    live_id = (
        await api_client.post(READY, json={"path": live_key}, headers=SECRET)
    ).json()["stream_id"]

    resp = await api_client.get("/api/streams", params={"status": "live"})
    assert resp.status_code == 200
    body = resp.json()
    assert [s["id"] for s in body] == [live_id]

    resp = await api_client.get("/api/streams", params={"status": "ended"})
    assert all(s["status"] == "ended" for s in resp.json())
    assert len(resp.json()) == 1


async def test_list_streams_includes_angler_summary(api_client):
    slug, key = await _mint_key(api_client, "Summary Angler")
    await api_client.post(READY, json={"path": key}, headers=SECRET)

    resp = await api_client.get("/api/streams")
    angler = resp.json()[0]["angler"]
    assert angler["slug"] == slug
    assert angler["display_name"] == "Summary Angler"
    assert "id" in angler and "avatar_url" in angler


async def test_get_stream_playlist_url_shape(api_client):
    _, key = await _mint_key(api_client, "URL Angler")
    stream_id = (
        await api_client.post(READY, json={"path": key}, headers=SECRET)
    ).json()["stream_id"]

    resp = await api_client.get(f"/api/streams/{stream_id}")
    assert resp.status_code == 200
    assert resp.json()["playlist_url"] == f"/streams/{stream_id}/index.m3u8"


async def test_get_stream_404(api_client):
    resp = await api_client.get(f"/api/streams/{uuid.uuid4()}")
    assert resp.status_code == 404
