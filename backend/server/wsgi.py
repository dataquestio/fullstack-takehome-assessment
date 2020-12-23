import os

from django.core.wsgi import get_wsgi_application
import socketio

from code_running.handlers import sio

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_example.settings")

django_app = get_wsgi_application()
application = socketio.WSGIApp(sio, django_app)
