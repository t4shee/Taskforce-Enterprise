import joblib
from layer4_ai_engine.feature_extractor import extract_features

# Load trained model
model_data = joblib.load("layer4_ai_engine/model.pkl")

model = model_data["model"]
enc = model_data["encoders"]


def banking_compliance_context(risk_score: float):
    """
    Add banking-sector regulatory risk context.
    """

    if risk_score >= 70:
        regulatory_weight = "CRITICAL"
    elif risk_score >= 40:
        regulatory_weight = "HIGH"
    else:
        regulatory_weight = "MEDIUM"

    return {
        "sector": "Banking & Financial Services",
        "regulatory_risk_weight": regulatory_weight,
        "compliance_frameworks": [
            "RBI Cyber Security Framework",
            "NIST Post-Quantum Cryptography Migration",
            "PCI DSS 4.0",
            "ISO/IEC 27001"
        ],
        "compliance_impact":
            "Quantum-vulnerable cryptography may create future regulatory non-compliance risks for banking systems handling long-lived financial data."
    }


def predict_ai_risk(crypto_profile):
    """
    Predict future quantum risk using trained ML model.
    """

    f = extract_features(crypto_profile)

    # Feature vector
    x = [[
        enc["asset"].transform([f["asset_type"]])[0],
        enc["algo"].transform([f["algorithm"]])[0],
        enc["tls"].transform([f["tls_version"]])[0],
        f["data_longevity"],
        f["traffic_volume"],
        f["dependencies"]
    ]]

    # ML prediction
    risk_score = float(model.predict(x)[0])

    

    # Migration priority
    if risk_score >= 70:
        priority = "HIGH"
    elif risk_score >= 40:
        priority = "MEDIUM"
    else:
        priority = "LOW"

    # Quantum break window estimation
    if risk_score >= 70:
        break_window = "2030-2040"
    else:
        break_window = "2035-2045"

    # Banking regulatory context
    compliance_context = banking_compliance_context(risk_score)

    return {


        "migration_priority": priority,

        "predicted_break_window": break_window,

        
        "banking_compliance_context": compliance_context
    }