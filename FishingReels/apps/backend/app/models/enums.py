import enum


class AnglerStatus(str, enum.Enum):
    """Lifecycle / visibility state of an Angler profile.

    Stored as a native Postgres enum type ``angler_status``.
    """

    active = "active"      # live and visible on the platform
    hidden = "hidden"      # temporarily not shown
    archived = "archived"  # retired / soft-deleted


class StreamKeyType(str, enum.Enum):
    """What kind of owner a publish key belongs to.

    Tells consumers which per-type link table to look in (AnglerStreamKey
    today; a tourney link table later). Stored as a native Postgres enum
    type ``stream_key_type``.
    """

    angler = "angler"
    tourney = "tourney"


class StreamKeyStatus(str, enum.Enum):
    """Whether a publish key is accepted at the ingest door.

    Stored as a native Postgres enum type ``stream_key_status``.
    """

    active = "active"
    revoked = "revoked"


class StreamStatus(str, enum.Enum):
    """Lifecycle of a single live-stream session.

    Stored as a native Postgres enum type ``stream_status``.
    """

    live = "live"
    ended = "ended"
