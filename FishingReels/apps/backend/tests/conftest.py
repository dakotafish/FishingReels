import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.pool import NullPool

from app.api.deps import get_db
from app.core.config import settings
from app.main import app


@pytest.fixture
async def client():
    """Bare ASGI client (no DB isolation) — for non-DB routes like /health."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
async def db_session():
    """A transactional AsyncSession that rolls back after the test.

    Uses a dedicated NullPool engine so connections are never pooled or reused
    across pytest-asyncio's per-test event loops (reuse corrupts the shared app
    engine with asyncpg "another operation is in progress" errors). The session
    runs inside a savepoint on an outer transaction that is rolled back on
    teardown — so even the service's real ``commit()`` calls (which become
    SAVEPOINT releases) are discarded. No dev-DB pollution.
    """
    engine = create_async_engine(settings.database_url, poolclass=NullPool)
    connection = await engine.connect()
    transaction = await connection.begin()
    session = AsyncSession(
        bind=connection,
        expire_on_commit=False,
        join_transaction_mode="create_savepoint",
    )
    try:
        yield session
    finally:
        await session.close()
        if transaction.is_active:
            await transaction.rollback()
        await connection.close()
        await engine.dispose()


@pytest.fixture
async def api_client(db_session: AsyncSession):
    """ASGI client whose DB calls use the test's isolated rollback session.

    Overrides the app's ``get_db`` dependency to yield ``db_session``, so the
    service's commit()/refresh() run on the savepoint session and everything
    rolls back on teardown. Use this for API-level Angler tests.
    """

    async def _override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = _override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.pop(get_db, None)
