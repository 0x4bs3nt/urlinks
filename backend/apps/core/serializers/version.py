from rest_framework import serializers


class VersionSerializer(serializers.Serializer):
    version = serializers.CharField()
    name = serializers.CharField()
