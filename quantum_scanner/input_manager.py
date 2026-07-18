import socket
from urllib.parse import urlparse

def normalize_hostname(input_string):
    """
    Removes protocol and path from URL if provided.
    """

    if input_string.startswith("http"):
        parsed = urlparse(input_string)
        return parsed.hostname

    return input_string


def get_normalized_target(input_string):

    try:
        clean_host = normalize_hostname(input_string)

        resolved_ip = socket.gethostbyname(clean_host)

        target_object = {
            "original_input": clean_host,
            "resolved_ip": resolved_ip,
            "asset_type": "public_web",
            "scan_ports": [443, 8443, 500, 4500],
            "protocol_hint": "https"
        }

        return target_object

    except Exception as e:
        return {
            "error": True,
            "error_type": "dns_resolution_failed",
            "message": str(e)
        }
