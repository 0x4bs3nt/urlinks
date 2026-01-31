from django.apps import apps
from django.contrib import admin

models = apps.get_app_config("profile_app").get_models()

for model in models:
    try:
        admin.site.register(model)
    except admin.sites.AlreadyRegistered:
        pass
