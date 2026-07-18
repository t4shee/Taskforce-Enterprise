import subprocess
import json
import re

def parse_cipher_components(cipher_name):
    """
    Extracts key_exchange, encryption_algorithm, hash_algorithm, and mode
    from cipher name.
    """

    key_exchange = None
    encryption_algorithm = None
    hash_algorithm = None
    mode = None

    # TLS 1.3 format (example: TLS_AES_256_GCM_SHA384)
    if cipher_name.startswith("TLS_AES") or cipher_name.startswith("TLS_CHACHA20"):
        parts = cipher_name.split("_")
        if len(parts) >= 4:
            encryption_algorithm = parts[1] + "_" + parts[2] if parts[1] == "AES" else parts[1]
            mode = parts[3] if "GCM" in parts[3] or "POLY1305" in parts[3] else None
            hash_algorithm = parts[-1]
        return key_exchange, encryption_algorithm, hash_algorithm, mode

    # TLS 1.2 format (example: TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384)
    if "_WITH_" in cipher_name:
        left, right = cipher_name.split("_WITH_")
        key_exchange = left.replace("TLS_", "")

        right_parts = right.split("_")

        if len(right_parts) >= 3:
            encryption_algorithm = right_parts[0] + "_" + right_parts[1]
            if "GCM" in right_parts or "CBC" in right_parts:
                mode = right_parts[-2]
            hash_algorithm = right_parts[-1]

    return key_exchange, encryption_algorithm, hash_algorithm, mode


def extract_supported_ciphers(hostname):

    try:
        cmd = [
            "sslyze",
            "--json_out=-",
            hostname
        ]

        result = subprocess.check_output(
            cmd,
            text=True,
            timeout=30,
            stderr=subprocess.DEVNULL
        )

        data = json.loads(result)

        supported_ciphers = []
        server_results = data.get("server_scan_results", [])

        for server in server_results:

            scan_result = server.get("scan_result", {})

            # TLS 1.2
            tls12 = scan_result.get("tls_1_2_cipher_suites", {})
            tls12_result = tls12.get("result", {})

            for cipher in tls12_result.get("accepted_cipher_suites", []):
                cipher_name = cipher.get("cipher_suite", {}).get("name")
                if cipher_name:
                    kx, enc, hash_alg, mode = parse_cipher_components(cipher_name)

                    supported_ciphers.append({
                        "name": cipher_name,
                        "key_exchange": kx,
                        "encryption_algorithm": enc,
                        "hash_algorithm": hash_alg,
                        "mode": mode
                    })

            # TLS 1.3
            tls13 = scan_result.get("tls_1_3_cipher_suites", {})
            tls13_result = tls13.get("result", {})

            for cipher in tls13_result.get("accepted_cipher_suites", []):
                cipher_name = cipher.get("cipher_suite", {}).get("name")
                if cipher_name:
                    kx, enc, hash_alg, mode = parse_cipher_components(cipher_name)

                    supported_ciphers.append({
                        "name": cipher_name,
                        "key_exchange": kx,
                        "encryption_algorithm": enc,
                        "hash_algorithm": hash_alg,
                        "mode": mode
                    })

        # Deduplicate by cipher name
        unique_ciphers = {c["name"]: c for c in supported_ciphers}

        return list(unique_ciphers.values())

    except Exception:
        return []
