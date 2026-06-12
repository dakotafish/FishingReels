"""The webhook secret must never survive into access-log output."""

import logging

from app.core.logging import RedactSecretQueryFilter


def _access_record(path: str) -> logging.LogRecord:
    # Shape of uvicorn.access records: message template + tuple args, where
    # the request line (with query string) is one of the string args.
    return logging.LogRecord(
        name="uvicorn.access",
        level=logging.INFO,
        pathname=__file__,
        lineno=0,
        msg='%s - "%s %s HTTP/%s" %d',
        args=("172.18.0.5:1234", "POST", path, "1.1", 204),
        exc_info=None,
    )


def test_secret_query_param_is_redacted():
    record = _access_record("/api/internal/mediamtx/auth?secret=super-secret-value")

    assert RedactSecretQueryFilter().filter(record) is True
    assert "super-secret-value" not in record.getMessage()
    assert "secret=[redacted]" in record.getMessage()


def test_other_paths_untouched():
    record = _access_record("/api/streams?status=live")

    RedactSecretQueryFilter().filter(record)
    assert "/api/streams?status=live" in record.getMessage()
