"""End-to-end API tests for /api/anglers (via api_client → rollback session)."""


async def test_create_returns_201(api_client):
    resp = await api_client.post("/api/anglers", json={"display_name": "Wade Fisher"})

    assert resp.status_code == 201
    body = resp.json()
    assert body["slug"] == "wade-fisher"
    assert body["display_name"] == "Wade Fisher"
    assert body["status"] == "active"
    assert "id" in body and "created_at" in body


async def test_create_dedupes_slug(api_client):
    r1 = await api_client.post("/api/anglers", json={"display_name": "Wade Fisher"})
    r2 = await api_client.post("/api/anglers", json={"display_name": "Wade Fisher"})

    assert r1.json()["slug"] == "wade-fisher"
    assert r2.json()["slug"] == "wade-fisher-2"


async def test_create_invalid_home_state_returns_422(api_client):
    resp = await api_client.post(
        "/api/anglers", json={"display_name": "Bad State", "home_state": "XX"}
    )
    assert resp.status_code == 422


async def test_create_duplicate_slug_returns_409(api_client, monkeypatch):
    # Force both creates onto the same slug so the second hits uq_angler_slug.
    async def _fixed_slug(display_name, exists, **kwargs):
        return "fixed-slug"

    monkeypatch.setattr(
        "app.services.angler_service.generate_unique_slug", _fixed_slug
    )

    r1 = await api_client.post("/api/anglers", json={"display_name": "First"})
    assert r1.status_code == 201
    r2 = await api_client.post("/api/anglers", json={"display_name": "Second"})
    assert r2.status_code == 409


async def test_get_by_slug(api_client):
    await api_client.post("/api/anglers", json={"display_name": "Cam Rivers"})

    resp = await api_client.get("/api/anglers/cam-rivers")
    assert resp.status_code == 200
    assert resp.json()["slug"] == "cam-rivers"


async def test_get_not_found(api_client):
    resp = await api_client.get("/api/anglers/ghost-angler-99")
    assert resp.status_code == 404


async def test_list(api_client):
    await api_client.post("/api/anglers", json={"display_name": "List One"})
    await api_client.post("/api/anglers", json={"display_name": "List Two"})

    resp = await api_client.get("/api/anglers")
    assert resp.status_code == 200
    slugs = {a["slug"] for a in resp.json()}
    assert {"list-one", "list-two"}.issubset(slugs)


async def test_patch_partial(api_client):
    await api_client.post(
        "/api/anglers", json={"display_name": "Patch Target", "home_state": "FL"}
    )

    resp = await api_client.patch(
        "/api/anglers/patch-target", json={"bio": "Loves bass fishing"}
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["bio"] == "Loves bass fishing"
    assert body["home_state"] == "FL"        # untouched
    assert body["slug"] == "patch-target"    # immutable


async def test_patch_not_found(api_client):
    resp = await api_client.patch("/api/anglers/no-such-angler", json={"bio": "x"})
    assert resp.status_code == 404
