from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str
    # Shared secret MediaMTX hook calls must present (X-Webhook-Secret header
    # or ?secret= query param). Required — the ingest pipeline is unusable
    # without it, so fail at startup like database_url.
    mediamtx_webhook_secret: str


settings = Settings()
