def calculate_crypto_agility(crypto_profile: dict):
    """
    Crypto agility score (0–100)
    """

    score = 100
    details = []

    cipher = crypto_profile.get("cipher_inventory", {})
    cert = crypto_profile.get("certificate", {})

    key_exchange = cipher.get("key_exchange_methods", [])
    encryption_algos = cipher.get("encryption_algorithms", [])
    weak_ciphers = cipher.get("weak_cipher_count", 0)

    signature_algo = str(cert.get("signature_algorithm", "")).upper()
    key_size = cert.get("key_size", 0)

    # RSA dependency
    if "RSA" in signature_algo:
        score -= 25
        details.append({
            "parameter": "Signature Algorithm",
            "value": signature_algo,
            "classification": "Rigid",
            "weight": 0.30,
            "impact": -25,
            "technical_basis": "RSA reduces PQC adaptability"
        })

    # Low diversity
    if len(key_exchange) <= 1:
        score -= 15
        details.append({
            "parameter": "Key Exchange Diversity",
            "value": key_exchange,
            "classification": "Low",
            "weight": 0.20,
            "impact": -15,
            "technical_basis": "Limited algorithm diversity"
        })

    # Weak ciphers
    if weak_ciphers > 0:
        impact = min(20, weak_ciphers * 3)
        score -= impact
        details.append({
            "parameter": "Weak Cipher Count",
            "value": weak_ciphers,
            "classification": "Outdated",
            "weight": 0.20,
            "impact": -impact,
            "technical_basis": "Legacy ciphers reduce flexibility"
        })

    # Modern encryption boost
    if any("GCM" in algo or "CHACHA20" in algo for algo in encryption_algos):
        score += 10
        details.append({
            "parameter": "Encryption Mode",
            "value": encryption_algos,
            "classification": "Modern",
            "weight": 0.10,
            "impact": +10,
            "technical_basis": "Modern encryption improves agility"
        })

    # Key size
    if key_size >= 3072:
        score += 5

    score = max(0, min(score, 100))

    return {
        "crypto_agility_score": round(score, 1),
        "agility_details": details
    }

def calculate_quantum_readiness(
    crypto_profile: dict,
    risk_report: dict,
    ai_insights: dict,
    agility_result: dict
):
    """
    Stable + explainable quantum readiness model (NO over-normalization)
    """

    details = []

    risk_score = risk_report.get("risk_score", 0)
    hndl = ai_insights.get("hndl_probability", 0.5)
    agility = agility_result.get("crypto_agility_score", 50)

    cipher = crypto_profile.get("cipher_inventory", {})
    props = crypto_profile.get("crypto_properties", {})
    cert = crypto_profile.get("certificate", {})

    signature_algo = str(cert.get("signature_algorithm", "")).upper()
    forward_secrecy = props.get("forward_secrecy_supported", False)
    weak_ciphers = cipher.get("weak_cipher_count", 0)

    # -----------------------------
    # BASE COMPONENTS (LINEAR CORE)
    # -----------------------------
    risk_component = (100 - risk_score) * 0.5
    hndl_component = (1 - hndl) * 100 * 0.3
    agility_component = agility * 0.2

    readiness = risk_component + hndl_component + agility_component

    # -----------------------------
    # SPREAD ADJUSTMENT (IMPORTANT)
    # -----------------------------
    spread_adjustment = (agility - 50) * 0.3
    readiness += spread_adjustment

    # -----------------------------
    # SOFT PENALTIES (NO HARD CAPS)
    # -----------------------------
    penalty = 0

    if "RSA" in signature_algo:
        penalty += 5

    if not forward_secrecy:
        penalty += 5

    if weak_ciphers > 3:
        penalty += 5

    readiness -= penalty

    # -----------------------------
    # NORMALIZE FINAL VALUE
    # -----------------------------
    readiness = max(0, min(readiness, 100))

    # -----------------------------
    # LEVEL CLASSIFICATION
    # -----------------------------
    if readiness >= 80:
        level = "QUANTUM READY"
    elif readiness >= 60:
        level = "TRANSITION READY"
    elif readiness >= 40:
        level = "MIGRATION REQUIRED"
    else:
        level = "NOT READY"

    # -----------------------------
    # EXPLANATION DETAILS
    # -----------------------------
    details.append({
        "parameter": "Risk Score Influence",
        "value": risk_score,
        "classification": "Inverse",
        "weight": 0.5,
        "impact": round(risk_component, 2),
        "technical_basis": "Lower classical risk increases readiness"
    })

    details.append({
        "parameter": "HNDL Exposure",
        "value": hndl,
        "classification": "Quantum Risk",
        "weight": 0.3,
        "impact": round(hndl_component, 2),
        "technical_basis": "Lower future decryption probability increases readiness"
    })

    details.append({
        "parameter": "Crypto Agility",
        "value": agility,
        "classification": "Adaptability",
        "weight": 0.2,
        "impact": round(agility_component, 2),
        "technical_basis": "Higher agility improves migration capability"
    })

    details.append({
        "parameter": "Spread Adjustment",
        "value": agility,
        "classification": "Variance Control",
        "weight": 0.1,
        "impact": round(spread_adjustment, 2),
        "technical_basis": "Improves score differentiation across systems"
    })

    if penalty > 0:
        details.append({
            "parameter": "Security Penalties",
            "value": {
                "rsa": "RSA" in signature_algo,
                "forward_secrecy": forward_secrecy,
                "weak_ciphers": weak_ciphers
            },
            "classification": "Penalty Applied",
            "weight": 0.1,
            "impact": -penalty,
            "technical_basis": "Weak cryptographic properties reduce readiness"
        })

    return {
        "quantum_readiness_score": {
            "quantum_readiness_score": round(readiness, 2),
            "readiness_level": level
        },
        "readiness_details": details
    }