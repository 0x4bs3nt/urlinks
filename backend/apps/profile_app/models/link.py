from apps.profile_app.models.page import Page
from django.db import models


def link_icon_path(instance, filename):
    return f"folder_{instance.page.user_id}/link_icons/{filename}"


class LinkCategory(models.TextChoices):
    WEBSITE = "website", "Website"
    FACEBOOK = "facebook", "Facebook"
    INSTAGRAM = "instagram", "Instagram"
    TWITTER = "twitter", "Twitter"
    TIKTOK = "tiktok", "TikTok"
    YOUTUBE = "youtube", "YouTube"
    LINKEDIN = "linkedin", "LinkedIn"
    GITHUB = "github", "GitHub"
    DISCORD = "discord", "Discord"
    TWITCH = "twitch", "Twitch"
    SPOTIFY = "spotify", "Spotify"
    SOUNDCLOUD = "soundcloud", "SoundCloud"


class Link(models.Model):
    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name="links")
    title = models.CharField(max_length=50)
    url = models.URLField()
    description = models.CharField(max_length=100, blank=True, null=True)
    icon = models.ImageField(upload_to=link_icon_path, blank=True, null=True)
    category = models.CharField(
        max_length=20, choices=LinkCategory.choices, default=LinkCategory.WEBSITE
    )
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]
        indexes = [models.Index(fields=["page"])]

    def __str__(self):
        return f"{self.title} ({self.page.display_name})"
