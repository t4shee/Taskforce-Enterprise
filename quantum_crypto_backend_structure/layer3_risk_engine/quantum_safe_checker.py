def determine_quantum_safety(classification: dict, risk_report: dict):
    """
    Determine the final quantum safety label
    based on algorithm classification and risk score.
    """

    vulnerable_algorithms = classification.get("quantum_vulnerable_algorithms", [])
    risk_score = risk_report.get("risk_score", 0)

    # If PQC algorithms were detected (future support)
    pqc_algorithms = ["KYBER", "DILITHIUM", "SPHINCS"]

    quantum_resistant = classification.get("quantum_resistant_algorithms", [])

    for algo in quantum_resistant:
        for pqc in pqc_algorithms:
            if pqc.lower() in algo.lower():
                return "Fully Quantum Safe"

    # PQC ready condition
    if len(vulnerable_algorithms) == 0 and risk_score < 40:
        return "PQC Ready"

    # Default condition
    return "Not Quantum Safe"# Placeholder file for quantum_safe_checker.py
