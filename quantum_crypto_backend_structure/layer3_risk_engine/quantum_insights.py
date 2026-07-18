def calculate_hndl_exposure(classification: dict):
    """
    Detect Harvest Now, Decrypt Later (HNDL) exposure.
    """

    vulnerable_algorithms = classification.get("quantum_vulnerable_algorithms", [])

    classical_crypto = ["RSA", "ECDHE", "ECDSA", "DH", "EC"]

    exposed_algorithms = []

    for algo in vulnerable_algorithms:
        if any(c in algo for c in classical_crypto):
            exposed_algorithms.append(algo)

    if exposed_algorithms:
        return {
            "exposed": True,
            "level": "HIGH",
            "reason": "Classical public-key cryptography vulnerable to quantum attacks",
            "algorithms": exposed_algorithms
        }

    return {
        "exposed": False,
        "level": "LOW",
        "reason": "No classical public-key cryptography detected"
    }


def calculate_quantum_readiness(risk_report: dict):
    """
    Convert risk score into a quantum readiness score.
    """

    risk_score = risk_report.get("risk_score", 0)

    readiness_score = max(0, 100 - risk_score)

    if readiness_score >= 80:
        readiness_level = "QUANTUM READY"
    elif readiness_score >= 50:
        readiness_level = "MIGRATION NEEDED"
    else:
        readiness_level = "HIGH RISK"

    return {
        "quantum_readiness_score": readiness_score,
        "readiness_level": readiness_level
    }


def generate_migration_plan(crypto_profile: dict):
    """
    Generate a roadmap for migrating to post-quantum cryptography.
    """

    certificate = crypto_profile.get("certificate", {})
    cipher_analysis = crypto_profile.get("cipher_analysis", {})
    signature_algo = certificate.get("signature_algorithm", "")   # ← ADD THIS
    public_key_algo = certificate.get("public_key_algorithm", "")
    key_size = certificate.get("key_size", "")

    algorithm = f"{public_key_algo.upper()}-{key_size}"
    key_exchange = cipher_analysis.get("key_exchange_methods", [])

    plan = {}

    # Key exchange migration
    if any("ECDHE" in k or "RSA" in k for k in key_exchange):
        plan["key_exchange"] = {
            "current": key_exchange,
            "recommended": "Hybrid TLS using ML-KEM"
        }

    # Signature migration
    if "ecdsa" in signature_algo.lower() or "rsa" in signature_algo.lower():
        plan["signature"] = {
            "current": signature_algo,
            "recommended": "ML-DSA or SLH-DSA (Post-Quantum Signature)"
        }

    if not plan:
        plan["status"] = "System appears compatible with post-quantum cryptography."

    return plan

def generate_quantum_threat_model(classification: dict, crypto_profile: dict):
    """
    Generate a quantum threat analysis based on detected vulnerable algorithms.
    """

    vulnerable_algorithms = classification.get("quantum_vulnerable_algorithms", [])

    threat_analysis = []

    for algo in vulnerable_algorithms:

        if "RSA" in algo or "ECDH" in algo or "DH" in algo:
            threat_analysis.append({
                "algorithm": algo,
                "quantum_vulnerability_reason":
                    "Vulnerable to Shor's Algorithm (quantum factoring / discrete logarithm attack)",
                "standard_reference":
                    "NIST Post-Quantum Cryptography Migration Guidance"
            })

        elif "SHA" in algo:
            threat_analysis.append({
                "algorithm": algo,
                "quantum_vulnerability_reason":
                    "Security reduced by Grover's Algorithm (quadratic speedup for brute force)",
                "standard_reference":
                    "NIST Hash Security Guidance for Post-Quantum Era"
            })

        else:
            threat_analysis.append({
                "algorithm": algo,
                "quantum_vulnerability_reason":
                    "Potential quantum vulnerability depending on implementation",
                "standard_reference":
                    "General Quantum Cryptanalysis Considerations"
            })

    return {
        "quantum_threat_analysis": threat_analysis
    }

