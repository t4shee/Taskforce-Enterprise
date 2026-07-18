from fastapi import APIRouter
from services.analysis_pipeline import run_full_analysis

router = APIRouter()


@router.post("/quantum-risk")
def quantum_risk_analysis(scan_data: dict):
    """
    Layer-2 + Layer-3 endpoint.

    Receives raw scan JSON from Layer-1 scanner
    and returns full quantum security analysis.
    """

    result = run_full_analysis(scan_data)

    return {
        "status": "success",
        "analysis_type": "quantum_risk_assessment",
        "data": result
    }# Placeholder file for risk_routes.py
