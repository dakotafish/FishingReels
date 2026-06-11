"""API tests for /api/anglers/{slug}/stream-keys (via api_client)."""

import re
import uuid


async def _create_angler(api_client, name: str) -> str:
    resp = await api_client.post("/api/anglers", json={"display_name": name})
    assert resp.status_code == 201
    return resp.json()["slug"]


async def test_create_key_returns_201_and_urlsafe_key(api_client):
    slug = await _create_angler(api_client, "Key Holder")

    resp = await api_client.post(f"/api/anglers/{slug}/stream-keys")

    assert resp.status_code == 201
    body = resp.json()
    # token_urlsafe(24) -> 32 URL-safe chars; always a valid MediaMTX path.
    assert re.fullmatch(r"[A-Za-z0-9_-]{20,64}", body["key"])
    assert body["key_type"] == "angler"
    assert body["status"] == "active"
    assert "id" in body and "created_at" in body


async def test_create_key_missing_angler_404(api_client):
    resp = await api_client.post("/api/anglers/no-such-angler/stream-keys")
    assert resp.status_code == 404


async def test_list_keys_scoped_to_angler(api_client):
    slug_a = await _create_angler(api_client, "Angler A")
    slug_b = await _create_angler(api_client, "Angler B")
    key_1 = (await api_client.post(f"/api/anglers/{slug_a}/stream-keys")).json()["key"]
    key_2 = (await api_client.post(f"/api/anglers/{slug_a}/stream-keys")).json()["key"]
    (await api_client.post(f"/api/anglers/{slug_b}/stream-keys")).json()

    resp = await api_client.get(f"/api/anglers/{slug_a}/stream-keys")

    assert resp.status_code == 200
    assert {k["key_hint"] for k in resp.json()} == {key_1[-4:], key_2[-4:]}


async def test_list_keys_never_exposes_secret(api_client):
    # The full key is shown exactly once, at mint time; listings carry only
    # metadata + a 4-char hint.
    slug = await _create_angler(api_client, "Secret Keeper")
    key = (await api_client.post(f"/api/anglers/{slug}/stream-keys")).json()["key"]

    resp = await api_client.get(f"/api/anglers/{slug}/stream-keys")

    item = resp.json()[0]
    assert "key" not in item
    assert item["key_hint"] == key[-4:]
    assert item["status"] == "active"


async def test_list_keys_missing_angler_404(api_client):
    resp = await api_client.get("/api/anglers/no-such-angler/stream-keys")
    assert resp.status_code == 404


async def test_revoke_key(api_client):
    slug = await _create_angler(api_client, "Revoker")
    key_id = (await api_client.post(f"/api/anglers/{slug}/stream-keys")).json()["id"]

    resp = await api_client.delete(f"/api/anglers/{slug}/stream-keys/{key_id}")
    assert resp.status_code == 204

    items = (await api_client.get(f"/api/anglers/{slug}/stream-keys")).json()
    assert items[0]["status"] == "revoked"


async def test_revoke_key_idempotent(api_client):
    slug = await _create_angler(api_client, "Double Revoker")
    key_id = (await api_client.post(f"/api/anglers/{slug}/stream-keys")).json()["id"]
    await api_client.delete(f"/api/anglers/{slug}/stream-keys/{key_id}")

    resp = await api_client.delete(f"/api/anglers/{slug}/stream-keys/{key_id}")
    assert resp.status_code == 204


async def test_revoke_key_of_other_angler_404(api_client):
    slug_a = await _create_angler(api_client, "Owner Angler")
    slug_b = await _create_angler(api_client, "Other Angler")
    key_id = (await api_client.post(f"/api/anglers/{slug_a}/stream-keys")).json()["id"]

    resp = await api_client.delete(f"/api/anglers/{slug_b}/stream-keys/{key_id}")
    assert resp.status_code == 404

    items = (await api_client.get(f"/api/anglers/{slug_a}/stream-keys")).json()
    assert items[0]["status"] == "active"  # untouched


async def test_revoke_unknown_key_404(api_client):
    slug = await _create_angler(api_client, "No Key Angler")
    resp = await api_client.delete(
        f"/api/anglers/{slug}/stream-keys/{uuid.uuid4()}"
    )
    assert resp.status_code == 404
