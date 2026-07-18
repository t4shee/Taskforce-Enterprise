def classify_asset(port, response_type=None):

    if port in [1194, 4443, 10000]:
        return "vpn_gateway"

    if port in [8080, 8000, 3000, 5000]:
        return "api_service"

    if port in [443, 8443]:
        return "web_service"

    return "unknown"
