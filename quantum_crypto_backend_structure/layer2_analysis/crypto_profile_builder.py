def build_crypto_profile(
    tls_info: dict,
    cipher_info: dict,
    certificate_info: dict,
    asset_info: dict = None,
    discovery_info: dict = None
):
    """
    Combine TLS, cipher, certificate, asset, and discovery information
    into a Cryptographic Bill of Materials (CBOM).

    Layer-2 responsibility:
    Inventory cryptographic components only.
    No risk or quantum scoring here.
    """

    # -------------------------------
    # BASIC EXTRACTION
    # -------------------------------
    key_exchange_methods = cipher_info.get("key_exchange_methods", []) or []
    encryption_algorithms = cipher_info.get("encryption_algorithms", []) or []
    hash_algorithms = cipher_info.get("hash_algorithms", []) or []

    tls_version = tls_info.get("tls_version")
    total_ciphers = cipher_info.get("total_ciphers", 0)

    # -------------------------------
    # HANDLE PARTIAL VISIBILITY (FIX)
    # -------------------------------
    assumed_secure = False
    visibility = "full"

    if tls_version == "TLSv1.3" and total_ciphers == 0:
        # TLS 1.3 usually enforces modern secure ciphers
        assumed_secure = True
        visibility = "partial"

    # -------------------------------
    # DISCOVERY DATA
    # -------------------------------
    discovered_apis = discovery_info.get("discovered_apis", []) if discovery_info else []
    discovered_vpn = discovery_info.get("discovered_vpn_endpoints", []) if discovery_info else []
    discovered_services = discovery_info.get("discovered_services", []) if discovery_info else []

    # -------------------------------
    # DERIVED PROPERTIES
    # -------------------------------
    forward_secrecy_supported = any(
        "ECDHE" in str(k) or "DHE" in str(k) for k in key_exchange_methods
    )
    if tls_version == "TLSv1.3":
        forward_secrecy_supported = True

    legacy_hash_detected = any(
        str(h).upper() in ["SHA", "MD5"] for h in hash_algorithms
    )

    classical_public_key = any(
        k for k in key_exchange_methods
        if "RSA" in str(k) or "ECDH" in str(k) or "DH" in str(k)
    )

    # -------------------------------
    # FINAL PROFILE
    # -------------------------------
    crypto_profile = {

        # ------------------------------------------------
        # ASSET METADATA
        # ------------------------------------------------
        "asset": {
            "hostname": asset_info.get("hostname") if asset_info else None,
            "ip_address": asset_info.get("ip_address") if asset_info else None,
            "port": asset_info.get("port") if asset_info else None,
            "service": asset_info.get("service") if asset_info else None,
            "asset_type": asset_info.get("asset_type") if asset_info else None
        },

        # ------------------------------------------------
        # DISCOVERED ASSETS
        # ------------------------------------------------
        "discovered_assets": {
            "apis": discovered_apis,
            "vpn_endpoints": discovered_vpn,
            "services": discovered_services
        },

        # ------------------------------------------------
        # TLS INFORMATION
        # ------------------------------------------------
        "tls": {
            "protocol": "TLS",
            "version": tls_version,
            "negotiated_cipher": tls_info.get("negotiated_cipher"),
            "supported_cipher_count": tls_info.get("cipher_count")
        },

        # ------------------------------------------------
        # CIPHER INVENTORY
        # ------------------------------------------------
        "cipher_inventory": {
            "total_ciphers": total_ciphers,
            "encryption_algorithms": encryption_algorithms,
            "hash_algorithms": hash_algorithms,
            "cipher_modes": cipher_info.get("modes"),
            "key_exchange_methods": key_exchange_methods,
            "weak_cipher_count": cipher_info.get("weak_cipher_count"),
            "weak_ciphers": cipher_info.get("weak_ciphers"),

            # ✅ NEW FIXED FIELDS
            "visibility": visibility,
            "assumed_secure": assumed_secure
        },

        # ------------------------------------------------
        # CERTIFICATE
        # ------------------------------------------------
        "certificate": {
            "subject": certificate_info.get("subject"),
            "issuer": certificate_info.get("issuer"),
            "signature_algorithm": certificate_info.get("signature_algorithm"),
            "public_key_algorithm": certificate_info.get("public_key_algorithm"),
            "key_size": certificate_info.get("key_size"),
            "security_bits": certificate_info.get("security_bits"),
            "valid_from": certificate_info.get("valid_from"),
            "valid_to": certificate_info.get("valid_to"),
            "validity_days": certificate_info.get("validity_days")
        },

        # ------------------------------------------------
        # CRYPTO PROPERTIES
        # ------------------------------------------------
        "crypto_properties": {
            "forward_secrecy_supported": forward_secrecy_supported,
            "legacy_hash_detected": legacy_hash_detected,
            "weak_cipher_support": cipher_info.get("weak_cipher_count", 0) > 0,
            "classical_public_key_crypto": bool(classical_public_key)
        }
    }

    return crypto_profile