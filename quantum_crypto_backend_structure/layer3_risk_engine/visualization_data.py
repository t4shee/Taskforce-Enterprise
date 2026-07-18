def generate_visualization_data(crypto_profile: dict, ai_insights: dict):
    """
    Generate structured data for frontend visualizations.

    Includes:
    - Quantum attack timeline
    - Quantum risk forecast curve
    - PQC migration roadmap
    """

    cipher_inventory = crypto_profile.get("cipher_inventory", {})
    certificate = crypto_profile.get("certificate", {})

    encryption_algorithms = cipher_inventory.get("encryption_algorithms", [])
    key_exchange_methods = cipher_inventory.get("key_exchange_methods", [])

    public_key_algo = certificate.get("public_key_algorithm", "")
    key_size = certificate.get("key_size", "")

    algorithms = []

    if public_key_algo:
        algorithms.append(f"{public_key_algo}-{key_size}")

    algorithms.extend(key_exchange_methods)
    algorithms.extend(encryption_algorithms)

    timeline = []

    for algo in algorithms:

        algo_upper = str(algo).upper()

        if "RSA" in algo_upper:
            timeline.append({
                "algorithm": algo,
                "risk_start_year": 2030,
                "risk_end_year": 2040,
                "risk_type": "Shor_algorithm"
            })

        elif "ECDHE" in algo_upper or "ECDSA" in algo_upper or "ECC" in algo_upper:
            timeline.append({
                "algorithm": algo,
                "risk_start_year": 2030,
                "risk_end_year": 2040,
                "risk_type": "Shor_algorithm"
            })

        elif "AES_128" in algo_upper:
            timeline.append({
                "algorithm": algo,
                "risk_start_year": 2040,
                "risk_end_year": 2050,
                "risk_type": "Grover_speedup"
            })

        elif "AES_256" in algo_upper:
            timeline.append({
                "algorithm": algo,
                "risk_start_year": 2050,
                "risk_end_year": 2060,
                "risk_type": "Grover_speedup"
            })

        elif "CHACHA20" in algo_upper:
            timeline.append({
                "algorithm": algo,
                "risk_start_year": 2045,
                "risk_end_year": 2060,
                "risk_type": "Grover_speedup"
            })

    # AI-based break forecast curve
    base_risk = ai_insights.get("hndl_probability", 0.5)

    forecast = [
        {"year": 2025, "risk": round(base_risk * 20, 2)},
        {"year": 2030, "risk": round(base_risk * 40, 2)},
        {"year": 2035, "risk": round(base_risk * 70, 2)},
        {"year": 2040, "risk": round(base_risk * 90, 2)},
        {"year": 2045, "risk": round(base_risk * 100, 2)}
    ]

    # PQC migration roadmap
    migration_roadmap = [
        {
            "phase": "Hybrid TLS Deployment",
            "start_year": 2025,
            "end_year": 2030
        },
        {
            "phase": "RSA/ECC Phaseout",
            "start_year": 2030,
            "end_year": 2035
        },
        {
            "phase": "Full PQC Deployment",
            "start_year": 2035,
            "end_year": 2040
        }
    ]

    return {
        "quantum_attack_timeline": timeline,
        "quantum_risk_forecast": forecast,
        "pqc_migration_timeline": migration_roadmap
    }