from django.views.generic import TemplateView


class BaseUserView(TemplateView):
    template_name = 'index.html'
