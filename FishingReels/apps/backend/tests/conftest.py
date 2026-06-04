import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.pool import NullPool

from app.core.config import settings
from app.main import app


@pytest.fixture
async def client():
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
    teardown, so rows created during a test are discarded. Use ``flush()``,
    not ``commit()``.
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
