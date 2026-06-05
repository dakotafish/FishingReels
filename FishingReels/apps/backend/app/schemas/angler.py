import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.enums import AnglerStatus

# 50 states + DC. home_state is validated/normalized here at the API boundary.
_US_STATES = frozenset(
    {
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA",
        "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA",
        "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY",
        "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX",
        "UT", "VT", "VA", "WA", "WV", "WI", "WY",
    }
)


def _normalize_home_state(value: str | None) -> str | None:
    if value is None:
        return None
    code = value.strip().upper()
    if code not in _US_STATES:
        raise ValueError(f"{value!r} is not a valid US state code")
    return code


class _AnglerWritable(BaseModel):
    """Fields a client may set on create or update (shared validation)."""

    bio: str | None = None
    avatar_url: str | None = Field(default=None, max_length=2048)
    home_state: str | None = None
    home_town: str | None = Field(default=None, max_length=100)

    @field_validator("home_state")
    @classmethod
    def _validate_home_state(cls, value: str | None) -> str | None:
        return _normalize_home_state(value)


class AnglerCreate(_AnglerWritable):
    # slug is auto-generated in the service; status defaults to active.
    display_name: str = Field(min_length=1, max_length=120)


class AnglerUpdate(_AnglerWritable):
    # All optional — a PATCH only touches the fields provided. slug is immutable.
    display_name: str | None = Field(default=None, min_length=1, max_length=120)
    status: AnglerStatus | None = None


class AnglerRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    display_name: str
    slug: str
    bio: str | None
    avatar_url: str | None
    status: AnglerStatus
    home_state: str | None
    home_town: str | None
    created_at: datetime
    updated_at: datetime
