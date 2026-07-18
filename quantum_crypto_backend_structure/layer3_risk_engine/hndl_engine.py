def calculate_hndl_probability(crypto_profile: dict, risk_score: float):
    """
    Calibrated HNDL model with explainability
    """

    score = 0.0
    details = []

    cipher = crypto_profile.get("cipher_inventory", {})
    cert = crypto_profile.get("certificate", {})
    props = crypto_profile.get("crypto_properties", {})

    key_exchange = cipher.get("key_exchange_methods", [])
    weak_cipher_count = cipher.get("weak_cipher_count", 0)
    forward_secrecy = props.get("forward_secrecy_supported", False)

    signature_algo = str(cert.get("signature_algorithm", "")).upper()
    key_size = cert.get("key_size", 0)
    validity_days = cert.get("validity_days", 0)

    # -----------------------------
    # 1. PUBLIC KEY RISK (MAIN)
    # -----------------------------
    if "RSA" in signature_algo:
        score += 0.45
        details.append({
            "parameter": "Public Key Algorithm",
            "value": signature_algo,
            "classification": "Quantum Vulnerable",
            "weight": 0.45,
            "impact": 0.45,
            "technical_basis": "RSA is vulnerable to Shor's algorithm"
        })

    # -----------------------------
    # 2. FORWARD SECRECY
    # -----------------------------
    if not forward_secrecy:
        score += 0.20
        details.append({
            "parameter": "Forward Secrecy",
            "value": False,
            "classification": "Disabled",
            "weight": 0.20,
            "impact": 0.20,
            "technical_basis": "Allows retrospective decryption of sessions"
        })
    else:
        score -= 0.10
        details.append({
            "parameter": "Forward Secrecy",
            "value": True,
            "classification": "Enabled",
            "weight": 0.20,
            "impact": -0.10,
            "technical_basis": "Protects past sessions even if keys are compromised"
        })

    # -----------------------------
    # 3. WEAK CIPHERS
    # -----------------------------
    if weak_cipher_count > 0:
        impact = min(0.15, weak_cipher_count * 0.03)
        score += impact

        details.append({
            "parameter": "Weak Cipher Count",
            "value": weak_cipher_count,
            "classification": "Exposed",
            "weight": 0.15,
            "impact": round(impact, 2),
            "technical_basis": "Weak ciphers increase attack surface"
        })

    # -----------------------------
    # 4. CERTIFICATE VALIDITY
    # -----------------------------
    if validity_days > 180:
        score += 0.10

        details.append({
            "parameter": "Certificate Validity",
            "value": validity_days,
            "classification": "Long",
            "weight": 0.10,
            "impact": 0.10,
            "technical_basis": "Long-lived keys increase exposure window"
        })

    # -----------------------------
    # 5. KEY SIZE
    # -----------------------------
    if key_size <= 2048:
        score += 0.05

        details.append({
            "parameter": "Key Size",
            "value": key_size,
            "classification": "Moderate",
            "weight": 0.05,
            "impact": 0.05,
            "technical_basis": "Insufficient against future quantum threats"
        })

    # -----------------------------
    # 6. RISK ALIGNMENT
    # -----------------------------
    if risk_score < 25:
        score = min(score, 0.7)

    # -----------------------------
    # NORMALIZATION
    # -----------------------------
    score = 0.2 + (score * 0.6)
    score = max(0.1, min(score, 0.9))

    return {
        "hndl_probability": round(score, 2),
        "hndl_details": details
    }