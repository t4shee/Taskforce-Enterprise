import base64
import uuid


def generate_quantum_certificate(risk_report: dict):
    """
    Generate a digital PQC readiness certificate badge
    with dynamic risk color and verification metadata.
    """

    risk_score = risk_report.get("risk_score", 0)
    quantum_safe = risk_report.get("quantum_safe", False)

    # -----------------------------------
    # Badge color based on risk
    # -----------------------------------
    if risk_score < 30:
        color = "#2ecc71"  # green
        status = "Quantum Safe Certified"
    elif risk_score < 60:
        color = "#f1c40f"  # yellow
        status = "Quantum Migration Recommended"
    else:
        color = "#e74c3c"  # red
        status = "Not Quantum-Resilient"

    # -----------------------------------
    # Generate verification id
    # -----------------------------------
    verification_id = f"QS-{uuid.uuid4().hex[:10].upper()}"

    # -----------------------------------
    # SVG certificate badge
    # -----------------------------------
    svg = f"""
    <svg xmlns="http://www.w3.org/2000/svg" width="360" height="120">
        <rect width="360" height="120" fill="#0b3d91"/>
        <rect x="10" y="10" width="340" height="100" fill="{color}" rx="10"/>
        
        <text x="180" y="45" font-size="18" fill="black" text-anchor="middle">
            Quantum Security Certification
        </text>

        <text x="180" y="75" font-size="20" fill="black" text-anchor="middle">
            {status}
        </text>

        <text x="180" y="100" font-size="12" fill="black" text-anchor="middle">
            ID: {verification_id}
        </text>
    </svg>
    """

    encoded_svg = base64.b64encode(svg.encode()).decode()

    return {
        "certificate_label": status,
        "certificate_svg_base64": encoded_svg,
        "certificate_verification": {
            "verification_id": verification_id,
            "issued_by": "Quantum Security Scanner",
            "standard_reference": "NIST FIPS 203 / 204 / 205"
        }
    }