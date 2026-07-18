import uuid
from datetime import datetime

def generate_scan_metadata(target):

    return {
        "scan_id": str(uuid.uuid4()),
        "target": target["original_input"],
        "ip_address": target["resolved_ip"],
        "scan_timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "scanner_version": "1.0",
        "scan_mode": "non_intrusive"
    }


def build_asset_object(target, port_info):

    return {
        "asset_id": str(uuid.uuid4()),
        "asset_type": target["asset_type"],
        "hostname": target["original_input"],
        "port": port_info["port"],
        "service": port_info["service"]
    }


def build_cbom(target, port_info, tls_data, certificate_data, key_analysis):

    scan_metadata = generate_scan_metadata(target)

    asset = build_asset_object(target, port_info)

    protocol = tls_data["protocol"]
    protocol["supported_cipher_suites"] = tls_data["supported_cipher_suites"]
    negotiated_cipher = tls_data["negotiated_cipher_suite"]

    certificate = certificate_data["certificate"]

    # Merge key analysis into certificate public_key
    certificate["public_key"] = key_analysis["public_key"]
    certificate["key_state"] = key_analysis["key_state"]

    return {
        "scan_metadata": scan_metadata,
        "asset": asset,
        "protocol": {
            "name": protocol["name"],
            "version": protocol["version"],
            "oid": protocol["oid"],
            "supported_cipher_suites": protocol["supported_cipher_suites"],
            "negotiated_cipher_suite": negotiated_cipher
        },
        "certificate": certificate
    }
