from fastapi import FastAPI

from app.api.routes import anglers, health, mediamtx_hooks, stream_keys, streams

app = FastAPI(title="FishingReels API")


@app.get("/")
async def root() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(health.router, prefix="/api")
app.include_router(anglers.router, prefix="/api")
app.include_router(stream_keys.router, prefix="/api")
app.include_router(streams.router, prefix="/api")
app.include_router(mediamtx_hooks.router, prefix="/api")
