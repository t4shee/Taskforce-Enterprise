from input_manager import get_normalized_target
from service_discovery import discover_services
from tls_extractor import extract_tls_details
from cert_parser import parse_certificate
from key_analyzer import analyze_key_strength
from cbom_builder import build_cbom
from cipher_extractor import extract_supported_ciphers
from web_asset_discovery import discover_apis, discover_vpn_endpoints

# NEW IMPORTS
from port_service_discovery import scan_ports
from asset_classifier import classify_asset

import json


def main():

    target_input = input("Enter website URL or domain: ").strip()

    target = get_normalized_target(target_input)

    services = discover_services(target)

    if not services["open_ports"]:
        print("No TLS ports found")
        return

    port_info = services["open_ports"][0]

    # STEP 1 — TLS Negotiation
    tls_data = extract_tls_details(
        target["resolved_ip"],
        port_info["port"],
        target["original_input"]
    )

    # STEP 2 — Extract Supported Ciphers
    supported_ciphers = extract_supported_ciphers(target["original_input"])
    tls_data["supported_cipher_suites"] = supported_ciphers

    # STEP 3 — Certificate Parsing
    certificate_data = parse_certificate(
        target["resolved_ip"],
        port_info["port"],
        target["original_input"]
    )

    # STEP 4 — Key Analysis
    key_analysis = analyze_key_strength(certificate_data)

    # STEP 5 — Build Final Output
    final_output = build_cbom(
        target,
        port_info,
        tls_data,
        certificate_data,
        key_analysis
    )

    # STEP 6 — Discover APIs and VPN endpoints (existing feature)
    apis = discover_apis(target["original_input"])
    vpns = discover_vpn_endpoints(target["resolved_ip"])

    final_output["discovered_apis"] = apis
    final_output["discovered_vpn_endpoints"] = vpns

    # STEP 7 — Multi-port service discovery (NEW FEATURE)
    port_results = scan_ports(target["resolved_ip"])

    classified_assets = []

    for p in port_results:

        asset_type = classify_asset(p["port"])

        classified_assets.append({
            "port": p["port"],
            "asset_type": asset_type
        })

    final_output["discovered_services"] = classified_assets

    print(json.dumps(final_output, indent=4))


if __name__ == "__main__":
    main()
