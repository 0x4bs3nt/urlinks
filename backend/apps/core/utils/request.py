def get_client_ip(request):
    if request is None:
        return ""

    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[-1].strip()

    return request.META.get("REMOTE_ADDR", "")


def get_user_agent(request):
    if request is None:
        return ""

    return request.META.get("HTTP_USER_AGENT", "")
