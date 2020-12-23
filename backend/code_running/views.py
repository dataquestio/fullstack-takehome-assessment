import os

from django.core.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from code_running import validators
from code_running import config
from .messages.message_types import REPLY_INVALID_TYPE
from .messages.responses import make_reply

basedir = os.path.dirname(os.path.realpath(__file__))


class SingleEndpointCodeRunView(APIView):
    def post(self, request):
        if not request.data:
            return Response([])

        handler = _get_message_handler(request.data)

        if not request.data:
            # Shortcut the rest of this method if we receive an empty message
            return Response([make_reply(REPLY_INVALID_TYPE, {})], status=503)

        reply = handler(request.data)
        status = 200
        if reply and reply.get("has_error"):
            status = 503
        return Response([reply], status=status)


def _get_message_handler(message_payload):
    def noop():
        pass

    try:
        valid_message = validators.validate_message(message_payload)
    except NotImplementedError:
        handler = config.message_handlers()[REPLY_INVALID_TYPE]
        valid_message = None
    except ValidationError:
        handler = config.message_handlers()["error/invalid_message"]
        valid_message = None
    else:
        # Handle valid message
        handler = config.message_handlers()[valid_message["type"]]

    return handler
