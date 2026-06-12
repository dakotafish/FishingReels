"""Log hygiene helpers."""

import logging
import re

# Matches the webhook secret when passed as a query param. The MediaMTX auth
# callback (MTX_AUTHHTTPADDRESS) can't send custom headers, so it carries the
# secret in the URL — without this filter it would land in every access-log
# line for that endpoint.
_SECRET_QUERY_RE = re.compile(r"(secret=)[^&\s\"']+")


class RedactSecretQueryFilter(logging.Filter):
    """Scrubs ``?secret=...`` values from access-log lines."""

    def filter(self, record: logging.LogRecord) -> bool:
        if record.args:
            record.args = tuple(
                _SECRET_QUERY_RE.sub(r"\1[redacted]", arg)
                if isinstance(arg, str)
                else arg
                for arg in record.args
            )
        return True


def install_log_redaction() -> None:
    logging.getLogger("uvicorn.access").addFilter(RedactSecretQueryFilter())
