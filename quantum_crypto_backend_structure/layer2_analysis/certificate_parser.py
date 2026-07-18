from datetime import datetime


def parse_certificate(certificate_data: dict):
    """
    Extract important cryptographic properties
    from certificate section of the scan JSON.
    """

    subject = certificate_data.get("subject_name")
    issuer = certificate_data.get("issuer_name")

    signature_algo = (
        certificate_data.get("signature_algorithm", {})
        .get("name")
    )

    public_key = certificate_data.get("public_key", {})

    key_algorithm = public_key.get("algorithm")
    key_size = public_key.get("key_size")
    security_bits = public_key.get("classical_security_bits")

    valid_from = certificate_data.get("not_valid_before")
    valid_to = certificate_data.get("not_valid_after")

    # Calculate validity days if possible
    validity_days = None
    try:
        start = datetime.fromisoformat(valid_from.replace("Z", ""))
        end = datetime.fromisoformat(valid_to.replace("Z", ""))
        validity_days = (end - start).days
    except Exception:
        pass

    certificate_info = {
        "subject": subject,
        "issuer": issuer,
        "signature_algorithm": signature_algo,
        "public_key_algorithm": key_algorithm,
        "key_size": key_size,
        "security_bits": security_bits,
        "valid_from": valid_from,
        "valid_to": valid_to,
        "validity_days": validity_days
    }

    return certificate_info