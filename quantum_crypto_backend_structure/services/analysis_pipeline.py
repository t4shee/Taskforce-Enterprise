from layer2_analysis.tls_parser import parse_tls
from layer2_analysis.cipher_analyzer import analyze_ciphers
from layer2_analysis.certificate_parser import parse_certificate
from layer2_analysis.crypto_profile_builder import build_crypto_profile

from layer3_risk_engine.quantum_certificate import generate_quantum_certificate
from layer3_risk_engine.algorithm_classifier import classify_algorithms
from layer3_risk_engine.risk_scoring import calculate_risk_score
from layer3_risk_engine.quantum_safe_checker import determine_quantum_safety
from layer3_risk_engine.recommendation_engine import generate_recommendations
from layer3_risk_engine.quantum_insights import (
    generate_migration_plan,
    generate_quantum_threat_model
)
from layer3_risk_engine.visualization_data import generate_visualization_data

# ✅ NEW IMPORTS
from layer3_risk_engine.hndl_engine import calculate_hndl_probability
from layer3_risk_engine.readiness_engine import (
    calculate_crypto_agility,
    calculate_quantum_readiness
)

from layer4_ai_engine.ai_predictor import predict_ai_risk


def run_crypto_analysis(scan_data: dict):
    protocol_data = scan_data.get("protocol", {})
    certificate_data = scan_data.get("certificate", {})
    asset_data = scan_data.get("asset", {})

    tls_info = parse_tls(protocol_data)
    cipher_info = analyze_ciphers(protocol_data)
    certificate_info = parse_certificate(certificate_data)

    discovery_info = {
        "discovered_apis": scan_data.get("discovered_apis", []),
        "discovered_vpn_endpoints": scan_data.get("discovered_vpn_endpoints", []),
        "discovered_services": scan_data.get("discovered_services", [])
    }

    return build_crypto_profile(
        tls_info,
        cipher_info,
        certificate_info,
        asset_data,
        discovery_info
    )


def run_full_analysis(scan_data: dict):

    # -----------------------------
    # Layer 2 → CBOM
    # -----------------------------
    crypto_profile = run_crypto_analysis(scan_data)

    # -----------------------------
    # Layer 3 → Risk Engine
    # -----------------------------
    classification = classify_algorithms(crypto_profile)

    risk_report = calculate_risk_score(
        crypto_profile,
        classification
    )

    # -----------------------------
    # HNDL (Quantum Layer)
    # -----------------------------
    hndl_result = calculate_hndl_probability(
        crypto_profile,
        risk_report.get("risk_score", 0)
    )

    # -----------------------------
    # AI Layer
    # -----------------------------
    ai_insights = predict_ai_risk(crypto_profile)

    # -----------------------------
    # Crypto Agility
    # -----------------------------
    agility_result = calculate_crypto_agility(crypto_profile)

    # -----------------------------
    # Quantum Readiness (NEW MODEL)
    # -----------------------------
    readiness_result = calculate_quantum_readiness(
        crypto_profile,
        risk_report,
        {
            "hndl_probability": hndl_result["hndl_probability"]
        },
        agility_result
    )

    # -----------------------------
    # Other Quantum Components
    # -----------------------------
    certificate = generate_quantum_certificate(risk_report)

    safety_label = determine_quantum_safety(
        classification,
        risk_report
    )

    recommendations = generate_recommendations(
        crypto_profile,
        classification
    )

    migration_plan = generate_migration_plan(crypto_profile)

    quantum_threat_model = generate_quantum_threat_model(
        classification,
        crypto_profile
    )

    visualization_data = generate_visualization_data(
        crypto_profile,
        ai_insights
    )

    # -----------------------------
    # FINAL RESPONSE
    # -----------------------------
    return {

        # -----------------------------
        # EXECUTIVE SUMMARY
        # -----------------------------
        "executive_summary": {
            "overall_risk_level": risk_report.get("risk_level"),
            "quantum_readiness": readiness_result["quantum_readiness_score"]["readiness_level"],
        },

        # -----------------------------
        # SCAN INFO
        # -----------------------------
        "scan_summary": {
            "scan_id": scan_data.get("scan_metadata", {}).get("scan_id"),
            "target": scan_data.get("scan_metadata", {}).get("target"),
            "scan_timestamp": scan_data.get("scan_metadata", {}).get("scan_timestamp"),
            "scanner_version": scan_data.get("scan_metadata", {}).get("scanner_version"),
            "scan_mode": scan_data.get("scan_metadata", {}).get("scan_mode")
        },

        # -----------------------------
        # ASSET PROFILE
        # -----------------------------
        "asset_profile": {
            "hostname": scan_data.get("asset", {}).get("hostname"),
            "ip_address": scan_data.get("scan_metadata", {}).get("ip_address"),
            "port": scan_data.get("asset", {}).get("port"),
            "service": scan_data.get("asset", {}).get("service"),
            "asset_type": scan_data.get("asset", {}).get("asset_type")
        },

        # -----------------------------
        # CBOM
        # -----------------------------
        "cryptographic_bill_of_materials": crypto_profile,

        # -----------------------------
        # SECURITY ASSESSMENT
        # -----------------------------
        "security_assessment": {
            "risk_score": risk_report.get("risk_score"),
            "risk_level": risk_report.get("risk_level"),
            "risk_score_details": risk_report.get("risk_score_details"),
            "forward_secrecy": crypto_profile.get("crypto_properties", {}).get("forward_secrecy_supported", False),
            "weak_cipher_support": crypto_profile.get("cipher_inventory", {}).get("weak_cipher_count", 0) > 0
        },

        # -----------------------------
        # QUANTUM ANALYSIS
        # -----------------------------
        "quantum_risk_analysis": {
            "quantum_safe": risk_report.get("quantum_safe"),
            "quantum_safety_label": safety_label,

            # NEW HNDL
            "hndl_probability": hndl_result["hndl_probability"],
            "hndl_details": hndl_result["hndl_details"],

            # NEW READINESS
            "quantum_readiness_score": readiness_result["quantum_readiness_score"],
            "readiness_details": readiness_result["readiness_details"],

            "quantum_threat_model": quantum_threat_model
        },

        # -----------------------------
        # AI INSIGHTS
        # -----------------------------
        "ai_risk_insights": ai_insights,

        # -----------------------------
        # CRYPTO AGILITY
        # -----------------------------
        "crypto_agility": {
            "crypto_agility_score": agility_result["crypto_agility_score"],
            "agility_details": agility_result["agility_details"]
        },

        # -----------------------------
        # PQC RECOMMENDATIONS
        # -----------------------------
        "pqc_migration_recommendations": {
            "migration_plan": migration_plan,
            "recommended_actions": recommendations,
            "recommended_algorithms": {
                "key_exchange": "ML-KEM (FIPS 203)",
                "signature": "ML-DSA (FIPS 204)"
            },
            "strategy": "Hybrid classical + post-quantum TLS deployment"
        },

        "quantum_security_certificate": certificate,

        "visualization_data": visualization_data
    }