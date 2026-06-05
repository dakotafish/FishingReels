"""Slug generation utilities.

Hand-rolled to avoid an external dependency: normalize to ASCII, hyphenate, and
append a numeric suffix when needed to stay unique per a caller-supplied check.
"""

import re
import unicodedata
from collections.abc import Awaitable, Callable


def slugify(text: str, max_length: int = 80) -> str:
    """Convert arbitrary text to a URL-safe slug.

    NFKD-normalize, drop non-ASCII (é → e), lowercase, collapse runs of
    non-alphanumeric characters into a single hyphen, strip stray hyphens, and
    truncate to ``max_length``.
    """
    normalized = unicodedata.normalize("NFKD", text)
    ascii_str = normalized.encode("ascii", errors="ignore").decode("ascii").lower()
    slug = re.sub(r"[^a-z0-9]+", "-", ascii_str).strip("-")
    if len(slug) > max_length:
        slug = slug[:max_length].rstrip("-")
    return slug or "angler"  # fallback if input had no ASCII-able characters


async def generate_unique_slug(
    display_name: str,
    exists: Callable[[str], Awaitable[bool]],
    *,
    max_attempts: int = 100,
    max_length: int = 80,
) -> str:
    """Return a slug unique per the async ``exists`` predicate.

    Tries the bare slug, then ``-2``, ``-3`` ... up to ``max_attempts``. A
    concurrent create can still race past ``exists`` and hit the
    ``uq_angler_slug`` constraint; that surfaces as an IntegrityError which the
    route maps to 409.
    """
    base = slugify(display_name, max_length=max_length)
    if not await exists(base):
        return base

    for suffix in range(2, max_attempts + 2):
        tail = f"-{suffix}"
        candidate = f"{base[: max_length - len(tail)].rstrip('-')}{tail}"
        if not await exists(candidate):
            return candidate

    raise RuntimeError(f"Could not generate a unique slug for {display_name!r}")
