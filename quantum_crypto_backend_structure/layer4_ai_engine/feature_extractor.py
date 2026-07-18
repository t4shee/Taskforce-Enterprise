def extract_features(crypto_profile):
    """
    Convert CBOM crypto_profile into normalized ML features
    for the AI risk prediction model.
    """

    asset = crypto_profile.get("asset", {})
    tls = crypto_profile.get("tls", {})
    cipher = crypto_profile.get("cipher_inventory", {})
    cert = crypto_profile.get("certificate", {})

    # -------------------------------------------------
    # Normalize asset type
    # -------------------------------------------------
    asset_type_raw = asset.get("asset_type", "WEB")

    asset_mapping = {
        "public_web": "WEB",
        "web": "WEB",
        "api": "API",
        "public_api": "API",
        "vpn": "VPN"
    }

    asset_type = asset_mapping.get(asset_type_raw.lower(), "WEB")

    # -------------------------------------------------
    # Normalize key exchange algorithm
    # -------------------------------------------------
    key_exchange_methods = cipher.get("key_exchange_methods", [])

# handle empty key exchange list
    if not key_exchange_methods:
        algorithm_raw = "UNKNOWN"
    else:
        algorithm_raw = str(key_exchange_methods[0]).upper()

# normalize algorithm name
    if "ECDHE" in algorithm_raw:
        algorithm = "ECDHE"
    elif "RSA" in algorithm_raw:
        algorithm = "RSA"
    elif "ECDSA" in algorithm_raw:
        algorithm = "ECDSA"
    elif "DH" in algorithm_raw:
        algorithm = "DH"
    else:
        algorithm = "RSA"

    # -------------------------------------------------
    # Normalize TLS version
    # -------------------------------------------------
    tls_version_raw = tls.get("version", "TLS1.2")

    tls_mapping = {
        "TLSV1.0": "TLS1.0",
        "TLSV1.1": "TLS1.1",
        "TLSV1.2": "TLS1.2",
        "TLSV1.3": "TLS1.3"
    }

    tls_version = tls_mapping.get(tls_version_raw.upper(), "TLS1.2")

    # -------------------------------------------------
    # Build ML feature vector
    # -------------------------------------------------
    features = {
        "asset_type": asset_type,
        "algorithm": algorithm,
        "tls_version": tls_version,

        # Synthetic contextual features for demo model
        "data_longevity": 15,
        "traffic_volume": 50000,

        # Use weak cipher count as dependency proxy
        "dependencies": cipher.get("weak_cipher_count", 1)
    }

    return features