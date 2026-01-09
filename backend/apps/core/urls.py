from apps.core.views.health import HealthCheckView
from apps.core.views.user import CustomRefreshView, CustomTokenPairView, RegisterView
from django.urls import path

urlpatterns = [
    # General
    path("health/", HealthCheckView.as_view(), name="health-check"),
    # Auth
    path("token/refresh/", CustomRefreshView.as_view(), name="token-refresh"),
    path("token/", CustomTokenPairView.as_view(), name="token-obtain"),
    path("register/", RegisterView.as_view(), name="user-register"),
]
