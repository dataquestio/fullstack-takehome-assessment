import socketio
from ptyprocess import PtyProcessUnicode
import select

from django.core.cache import cache
from django.conf import settings

from .messages.message_types import REPLY_INVALID_TYPE
from .messages.responses import reply, error_reply

manager = socketio.RedisManager(settings.REDIS_CACHE_URL)
sio = socketio.Server(client_manager=manager, logger=True, engineio_logger=True, async_handlers=False)
thread = None
global_tty = None


# Terminal handlers
def read_and_forward_xterm_output():
    max_read_bytes = 1024 * 20
    while True:
        sio.sleep(0.01)
        tty = get_tty()
        timeout = 0
        (data_ready, _, _) = select.select([tty], [], [], timeout)
        if data_ready:
            output = tty.read(max_read_bytes)
            sio.emit("xterm_data", output, ignore_queue=True)


def get_tty():
    global global_tty
    if global_tty is None:
        global_tty = PtyProcessUnicode.spawn(['bash'])
    return global_tty


@sio.on("xterm_input")
def xterm_input(sid, data):
    """write to the tty std. The pty sees this as if you are typing in a real
    terminal.
    """
    cache.set("sid", sid)
    tty = get_tty()
    if data:
        tty.write(data)


@sio.on("connect")
def connect(sid, data):
    """new client connected"""
    cache.set("sid", sid)
    global thread
    if thread is None:
        thread = sio.start_background_task(target=read_and_forward_xterm_output)
    get_tty()
    sio.emit("xterm_data", "Welcome to xterm\n", room=sid)


# Success handlers
def get_connect_data(*args, **kwargs):
    return reply(
        "push/connect/data",
        {"runner": {"status": "ready"}}
    )


def reset(*args, **kwargs):
    global_tty = None


def echo_handler(data):
    return reply("echo", data)


def connection_success_handler(*args, **kwargs):
    return reply("connection_success")


def console_run_handler():
    return


# Error handlers


def invalid_type_handler(*args, **kwargs):
    return error_reply(REPLY_INVALID_TYPE)


def invalid_message_handler(*args, **kwargs):
    return error_reply("error/invalid_message")


def connection_failure_handler(context):
    pass  # We can't send anything back to the user :/

