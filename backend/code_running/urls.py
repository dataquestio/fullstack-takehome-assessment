from django.urls import path

from code_running.views import (
    SingleEndpointCodeRunView
)

app_name = "code_running"

urlpatterns = [
    path("v1/code/runner/process-message/", SingleEndpointCodeRunView.as_view()),
]
