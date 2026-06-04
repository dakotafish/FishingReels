import enum


class AnglerStatus(str, enum.Enum):
    """Lifecycle / visibility state of an Angler profile.

    Stored as a native Postgres enum type ``angler_status``.
    """

    active = "active"      # live and visible on the platform
    hidden = "hidden"      # temporarily not shown
    archived = "archived"  # retired / soft-deleted
