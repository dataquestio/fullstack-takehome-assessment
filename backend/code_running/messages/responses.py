import uuid
from django.core.exceptions import ValidationError
from code_running import validators


def make_reply(
    type: str,
    payload: dict,
    has_error: bool = False,
) -> dict:
    # TODO we should remove these as response values
    reply_id = str(uuid.uuid1())

    message_dict = {
        "id": reply_id,
        "type": type,
        "payload": payload if payload else {},
        "has_error": has_error,
    }

    return message_dict


def reply(type, payload=None, has_error=False):
    """
    Send a message to the user of this context as a reply and store it in the DB.
    """

    reply_payload = payload if payload else {}

    try:
        message = make_reply(
            type, reply_payload, has_error=has_error
        )
    except Exception:
        pass
    else:
        return message


def error_reply(type, payload=None):
    try:
        validators.validate_namespace("error/", type)
    except ValidationError:
        raise ValueError
    else:
        return reply(type, payload, has_error=True)
