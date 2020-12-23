from django.conf.urls import url
from .views import BaseUserView

app_name = "accounts"
urlpatterns = [
    url(r'^$', BaseUserView.as_view(), name='home'),
]
