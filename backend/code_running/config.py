from django.conf import settings
from django.utils.module_loading import import_string


def connections():
    return settings.CONNECTIONS


def lazy_load_message_handlers():
    """Use closure to load handlers settings only once"""
    type_handlers = {}

    def load_once():
        nonlocal type_handlers
        if not type_handlers:
            for message_type, handler_path in connections()["messages"][
                "types"
            ].items():
                handler = import_string(handler_path) if handler_path else None
                if handler is not None and not callable(handler):
                    raise TypeError(
                        f"Connection handler should be a callable or None, not `{message_type}: {handler}`"
                    )

                type_handlers[message_type] = handler

        return type_handlers

    return load_once


message_handlers = lazy_load_message_handlers()


def message_types():
    return set(connections()["messages"]["types"].keys())


def message_ttl():
    return connections()["messages"]["ttl"]
