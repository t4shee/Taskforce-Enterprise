from datetime import datetime

def calculate_classical_bits(algorithm, key_size):

    if algorithm is None or key_size is None:
        return None

    algorithm = algorithm.lower()

    # RSA Mapping
    if "rsa" in algorithm:
        if key_size >= 4096:
            return 152
        elif key_size >= 3072:
            return 128
        elif key_size >= 2048:
            return 112
        elif key_size >= 1024:
            return 80
        else:
            return 40

    # EC Mapping
    if "ec" in algorithm:
        if key_size >= 521:
            return 256
        elif key_size >= 384:
            return 192
        elif key_size >= 256:
            return 128
        else:
            return 64

    return None


def determine_key_state(not_valid_after):

    if not_valid_after is None:
        return "unknown"

    expiry_date = datetime.strptime(not_valid_after, "%Y-%m-%dT%H:%M:%SZ")
    current_date = datetime.utcnow()

    if expiry_date < current_date:
        return "expired"
    else:
        return "active"


def analyze_key_strength(certificate_object):

    cert = certificate_object["certificate"]

    algorithm = cert["public_key"]["algorithm"]
    key_size = cert["public_key"]["key_size"]

    classical_bits = calculate_classical_bits(algorithm, key_size)

    key_state = determine_key_state(cert["not_valid_after"])

    return {
        "public_key": {
            "algorithm": algorithm,
            "key_size": key_size,
            "oid": cert["public_key"]["oid"],
            "classical_security_bits": classical_bits
        },
        "key_state": key_state
    }
