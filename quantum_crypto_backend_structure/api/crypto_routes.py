from fastapi import APIRouter
from services.analysis_pipeline import run_crypto_analysis

router = APIRouter()


@router.post("/crypto-analysis")
def crypto_analysis(scan_data: dict):
    """
    Layer-2 endpoint

    Receives raw scan JSON from Layer-1 scanner
    and returns parsed cryptographic inventory.
    """

    crypto_profile = run_crypto_analysis(scan_data)

    return {
        "status": "success",
        "analysis_type": "crypto_inventory",
        "data": crypto_profile
    }# Placeholder file for crypto_routes.py
