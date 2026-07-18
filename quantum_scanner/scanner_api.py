from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# scanner modules
from input_manager import get_normalized_target
from service_discovery import discover_services
from tls_extractor import extract_tls_details
from cert_parser import parse_certificate
from key_analyzer import analyze_key_strength
from cbom_builder import build_cbom
from cipher_extractor import extract_supported_ciphers
from web_asset_discovery import discover_apis, discover_vpn_endpoints
from port_service_discovery import scan_ports
from asset_classifier import classify_asset


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://t4skforce.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ScanRequest(BaseModel):
    url: str


def run_scan(target_input):

    target = get_normalized_target(target_input)

    services = discover_services(target)

    if not services["open_ports"]:
        return {"error": "No TLS ports found"}

    port_info = services["open_ports"][0]

    tls_data = extract_tls_details(
        target["resolved_ip"],
        port_info["port"],
        target["original_input"]
    )

    supported_ciphers = extract_supported_ciphers(target["original_input"])
    tls_data["supported_cipher_suites"] = supported_ciphers

    certificate_data = parse_certificate(
        target["resolved_ip"],
        port_info["port"],
        target["original_input"]
    )

    key_analysis = analyze_key_strength(certificate_data)

    final_output = build_cbom(
        target,
        port_info,
        tls_data,
        certificate_data,
        key_analysis
    )

    apis = discover_apis(target["original_input"])
    vpns = discover_vpn_endpoints(target["resolved_ip"])

    final_output["discovered_apis"] = apis
    final_output["discovered_vpn_endpoints"] = vpns

    port_results = scan_ports(target["resolved_ip"])

    classified_assets = []

    for p in port_results:

        asset_type = classify_asset(p["port"])

        classified_assets.append({
            "port": p["port"],
            "asset_type": asset_type
        })

    final_output["discovered_services"] = classified_assets

    return final_output


@app.post("/scan")
def scan(request: ScanRequest):

    return run_scan(request.url)
