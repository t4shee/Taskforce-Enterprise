def parse_tls(protocol_data: dict):
    """
    Extract TLS information from protocol section
    of the scan JSON.
    """

    tls_version = protocol_data.get("version")

    negotiated_cipher = protocol_data.get("negotiated_cipher_suite")

    supported_ciphers = protocol_data.get("supported_cipher_suites", [])

    cipher_count = len(supported_ciphers)

    tls_info = {
        "tls_version": tls_version,
        "negotiated_cipher": negotiated_cipher,
        "cipher_count": cipher_count
    }

    return tls_info# Placeholder file for tls_parser.py
