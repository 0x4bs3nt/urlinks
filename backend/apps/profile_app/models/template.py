from apps.core.models import CustomUser
from django.db import models


class Template(models.Model):
    # Null user means it's a premade/system template
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="templates",
        blank=True,
        null=True,
    )
    name = models.CharField(max_length=50)

    # Colors (stored as hex strings like "#ffffff")
    background_color = models.CharField(max_length=7, default="#ffffff")
    text_color = models.CharField(max_length=7, default="#000000")
    button_color = models.CharField(max_length=7, default="#3b82f6")
    button_text_color = models.CharField(max_length=7, default="#ffffff")

    # Typography
    font_family = models.CharField(max_length=50, default="Inter")

    # Styling
    border_radius = models.PositiveIntegerField(default=8)  # in pixels

    class Meta:
        indexes = [models.Index(fields=["user"])]

    def __str__(self):
        if self.user:
            return f"{self.name} (by {self.user.email})"

        return f"{self.name} (system)"

    @property
    def is_system_template(self):
        return self.user is None
