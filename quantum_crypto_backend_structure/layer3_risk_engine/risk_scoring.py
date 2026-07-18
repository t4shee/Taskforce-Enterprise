def calculate_risk_score(crypto_profile: dict, classification: dict = None):
    """
    Calibrated quantum risk scoring (linear, stable, realistic distribution)
    """

    score = 0
    details = []

    tls = crypto_profile.get("tls", {})
    cipher = crypto_profile.get("cipher_inventory", {})
    cert = crypto_profile.get("certificate", {})
    props = crypto_profile.get("crypto_properties", {})

    tls_version = tls.get("version")
    key_exchange = cipher.get("key_exchange_methods", []) or []
    weak_ciphers = cipher.get("weak_cipher_count", 0)
    key_size = cert.get("key_size", 0)
    validity_days = cert.get("validity_days", 0)
    encryption_algos = cipher.get("encryption_algorithms", []) or []
    total_ciphers = cipher.get("total_ciphers", 0)
    assumed_secure = cipher.get("assumed_secure", False)

    # ✅ Forward secrecy override (TLS 1.3 guarantees FS)
    forward_secrecy = props.get("forward_secrecy_supported", False)
    if tls_version == "TLSv1.3":
        forward_secrecy = True

    # ✅ TLS 1.3 fallback for key exchange visibility
    if not key_exchange and tls_version == "TLSv1.3":
        key_exchange = ["ECDHE"]

    # -----------------------------
    # 1. TLS VERSION (Balanced)
    # -----------------------------
    tls_scores = {
        "TLSv1.0": 20,
        "TLSv1.1": 18,
        "TLSv1.2": 12,   # reduced from aggressive penalty
        "TLSv1.3": 0
    }

    tls_score = tls_scores.get(tls_version, 12)
    score += tls_score

    details.append({
        "parameter": "TLS Version",
        "value": tls_version,
        "classification": "Strong" if tls_version == "TLSv1.3" else "Weak",
        "weight": 0.20,
        "impact": tls_score,
        "technical_basis": "TLS version determines protocol security and forward secrecy support"
    })

    # -----------------------------
    # 2. KEY EXCHANGE (Slightly softened)
    # -----------------------------
    key_exchange_str = str(key_exchange)

    if "RSA" in key_exchange_str:
        ke_score = 22   # reduced from 25
        ke_class = "Quantum Vulnerable"
        ke_reason = "RSA is vulnerable to Shor's algorithm"

    elif "ECDHE" in key_exchange_str:
        ke_score = 15
        ke_class = "Moderate"
        ke_reason = "ECDHE provides forward secrecy but remains quantum vulnerable"

    else:
        ke_score = 10
        ke_class = "Unknown"
        ke_reason = "Unidentified key exchange mechanism"

    score += ke_score

    details.append({
        "parameter": "Key Exchange",
        "value": key_exchange,
        "classification": ke_class,
        "weight": 0.30,
        "impact": ke_score,
        "technical_basis": ke_reason
    })

    # -----------------------------
    # 3. KEY SIZE (Adjusted)
    # -----------------------------
    if key_size <= 2048:
        cert_score = 13   # reduced from 15
        cert_class = "Moderate"
        cert_reason = "2048-bit keys are insufficient against future quantum threats"

    elif key_size <= 3072:
        cert_score = 8
        cert_class = "Strong"
        cert_reason = "3072-bit provides higher classical resistance"

    else:
        cert_score = 4
        cert_class = "Strong"
        cert_reason = "High key size provides strong classical security"

    score += cert_score

    details.append({
        "parameter": "Key Size",
        "value": key_size,
        "classification": cert_class,
        "weight": 0.15,
        "impact": cert_score,
        "technical_basis": cert_reason
    })

    # -----------------------------
    # 4. ENCRYPTION ALGORITHM
    # -----------------------------
    cipher_score = 0
    cipher_class = "Unknown"
    cipher_reason = "No encryption data"

    if any("CBC" in algo for algo in encryption_algos):
        cipher_score = 10
        cipher_class = "Weak"
        cipher_reason = "CBC mode vulnerable to padding oracle attacks"

    elif any("GCM" in algo for algo in encryption_algos):
        cipher_score = 3
        cipher_class = "Strong"
        cipher_reason = "GCM provides authenticated encryption"

    elif any("CHACHA20" in algo for algo in encryption_algos):
        cipher_score = 3
        cipher_class = "Strong"
        cipher_reason = "ChaCha20 provides strong modern encryption"

    score += cipher_score

    details.append({
        "parameter": "Encryption Algorithm",
        "value": encryption_algos,
        "classification": cipher_class,
        "weight": 0.20,
        "impact": cipher_score,
        "technical_basis": cipher_reason
    })

    # -----------------------------
    # 5. WEAK CIPHERS (Controlled scaling)
    # -----------------------------
    weak_cipher_score = min(10, weak_ciphers * 2)
    score += weak_cipher_score

    details.append({
        "parameter": "Weak Cipher Count",
        "value": weak_ciphers,
        "classification": "High Risk" if weak_ciphers > 3 else "Moderate",
        "weight": 0.10,
        "impact": weak_cipher_score,
        "technical_basis": "Higher number of weak ciphers increases attack surface"
    })

    # -----------------------------
    # 6. FORWARD SECRECY (Balanced)
    # -----------------------------
    fs_score = -2 if forward_secrecy else 6   # softened
    score += fs_score

    details.append({
        "parameter": "Forward Secrecy",
        "value": forward_secrecy,
        "classification": "Enabled" if forward_secrecy else "Disabled",
        "weight": 0.10,
        "impact": fs_score,
        "technical_basis": "Forward secrecy prevents retrospective decryption"
    })

    # -----------------------------
    # 7. CERTIFICATE VALIDITY
    # -----------------------------
    if validity_days > 365:
        validity_score = 6   # reduced slightly
        validity_class = "Long"

    elif validity_days > 180:
        validity_score = 3
        validity_class = "Moderate"

    else:
        validity_score = 0
        validity_class = "Optimal"

    score += validity_score

    details.append({
        "parameter": "Certificate Validity",
        "value": validity_days,
        "classification": validity_class,
        "weight": 0.10,
        "impact": validity_score,
        "technical_basis": "Shorter certificate lifetimes reduce exposure window"
    })

    # -----------------------------
    # 8. VISIBILITY
    # -----------------------------
    if total_ciphers == 0:
        if assumed_secure:
            vis_score = 2
            vis_class = "Partial Visibility"
            vis_reason = "TLS1.3 enforces secure cipher suites"
        else:
            vis_score = 6
            vis_class = "Unknown"
            vis_reason = "Cipher data missing, confidence reduced"
    else:
        vis_score = 0
        vis_class = "Full Visibility"
        vis_reason = "Complete cipher inventory available"

    score += vis_score

    details.append({
        "parameter": "Cipher Visibility",
        "value": total_ciphers,
        "classification": vis_class,
        "weight": 0.05,
        "impact": vis_score,
        "technical_basis": vis_reason
    })

    # -----------------------------
    # FINAL NORMALIZATION
    # -----------------------------
    score = max(0, min(score, 100))

    if score <= 25:
        level = "LOW"
    elif score <= 50:
        level = "MODERATE"
    elif score <= 75:
        level = "HIGH"
    else:
        level = "CRITICAL"

    return {
        "risk_score": round(score, 2),
        "risk_level": level,
        "quantum_safe": score <= 25,
        "risk_score_details": details
    }