from apps.profile_app.views.link import LinkViewSet
from apps.profile_app.views.page import PageViewSet
from apps.profile_app.views.template import TemplateViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register("page", PageViewSet, basename="page")
router.register("link", LinkViewSet, basename="link")
router.register("template", TemplateViewSet, basename="template")

urlpatterns = [
    *router.urls,
]
