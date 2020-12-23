import json

from django.core.exceptions import ValidationError
from . import config


def validate_message(message):
    exc = ValidationError(f"Invalid message: {message}")

    if not isinstance(message, dict):
        raise exc
    else:
        try:
            type_ = message["type"]
            key = message.get("key", None)
            payload = message.get("payload", {})
        except KeyError:
            raise exc
        else:
            if type_ not in config.message_types():
                raise NotImplementedError

            if (key is not None) and (not isinstance(key, str)):
                raise exc

            try:
                json.dumps(payload)
            except (ValueError, TypeError):
                raise exc

            return {"type": type_, "key": key, "payload": payload}


def validate_namespace(expected, type_):
    if isinstance(expected, str):
        expected = expected.rstrip("/") + "/".rstrip("/") + "/"

        if not type_.startswith(expected):
            raise ValidationError(
                "`{}` does not start with expected namespace `{}`".format(
                    type_, expected
                )
            )
    else:
        if not any(type_.startswith(expected_type) for expected_type in expected):
            raise ValidationError(
                "`{}` does not start with expected namespace `{}`".format(
                    type_, expected
                )
            )
