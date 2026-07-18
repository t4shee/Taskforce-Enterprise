from fastapi import APIRouter
from services.analysis_pipeline import run_crypto_analysis, run_full_analysis

router = APIRouter()


@router.post("/analyze")
async def analyze_asset(scan_data: dict):

    # Layer 2
    layer2_cbom = run_crypto_analysis(scan_data)

    # Layer 3
    layer3_analysis = run_full_analysis(scan_data)

    return {
        "status": "success",
        "analysis_type": "quantum_crypto_assessment",

        "layer2_cbom": layer2_cbom,

        "layer3_quantum_analysis": {
            "risk_report": layer3_analysis.get("risk_report"),
            "quantum_safety_label": layer3_analysis.get("quantum_safety_label"),
            "quantum_readiness": layer3_analysis.get("quantum_readiness"),
            "hndl_exposure": layer3_analysis.get("hndl_exposure"),
            "migration_plan": layer3_analysis.get("migration_plan"),
            "recommendations": layer3_analysis.get("recommendations"),
            "quantum_threat_model": layer3_analysis.get("quantum_threat_model")
        }
    }