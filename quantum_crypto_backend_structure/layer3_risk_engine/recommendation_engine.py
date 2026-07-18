def generate_recommendations(crypto_profile: dict, classification: dict):
    """
    Generate actionable recommendations based on
    crypto profile and algorithm classification.
    """

    recommendations = []

    tls_info = crypto_profile.get("tls", {})
    cipher_analysis = crypto_profile.get("cipher_analysis", {})
    certificate = crypto_profile.get("certificate", {})

    vulnerable_algorithms = classification.get("quantum_vulnerable_algorithms", [])

    # TLS Version Recommendations
    tls_version = tls_info.get("version")
    if tls_version in ["TLSv1.0", "TLSv1.1", "TLSv1.2"]:
        recommendations.append(
            "Upgrade TLS to TLSv1.3 for stronger security and forward secrecy."
        )

    # Weak Cipher Recommendations
    weak_cipher_count = cipher_analysis.get("weak_cipher_count", 0)
    if weak_cipher_count > 0:
        recommendations.append(
            "Disable CBC-mode cipher suites and weak hashes such as SHA1."
        )

    # Quantum Vulnerable Algorithms
    for algo in vulnerable_algorithms:
        if "RSA" in algo or "ECDSA" in algo or "ECDHE" in algo:
            recommendations.append(
                "Prepare migration to Post-Quantum Cryptography (PQC) algorithms."
            )
            break

    # Certificate Key Size Recommendation
    key_size = certificate.get("key_size")
    if key_size and key_size < 2048:
        recommendations.append(
            "Use certificates with stronger key sizes (≥2048 bits for RSA or PQC alternatives)."
        )

    # PQC Adoption Suggestion
    recommendations.append(
        "Consider hybrid TLS using Post-Quantum algorithms such as ML-KEM."
    )

    return recommendations# Placeholder file for recommendation_engine.py
