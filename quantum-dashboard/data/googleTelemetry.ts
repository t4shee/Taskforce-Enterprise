export const GOOGLE_TELEMETRY_DATA = {
    "scan_metadata": {
        "scan_id": "852000e5-a94d-43cd-a3fc-30aa516028e8",
        "target": "google.com",
        "ip_address": "216.58.196.110",
        "scan_timestamp": "2026-03-08T10:02:21Z",
        "scanner_version": "1.0",
        "scan_mode": "non_intrusive"
    },
    "asset": {
        "asset_id": "396456f7-85ff-4d34-9037-bb68e5e67ccd",
        "asset_type": "public_web",
        "hostname": "google.com",
        "port": 443,
        "service": "https"
    },
    "protocol": {
        "name": "TLS",
        "version": "TLSv1.3",
        "oid": null,
        "supported_cipher_suites": [
            {
                "name": "TLS_RSA_WITH_AES_256_GCM_SHA384",
                "key_exchange": "RSA",
                "encryption_algorithm": "AES_256",
                "hash_algorithm": "SHA384",
                "mode": "GCM"
            },
            {
                "name": "TLS_RSA_WITH_AES_256_CBC_SHA",
                "key_exchange": "RSA",
                "encryption_algorithm": "AES_256",
                "hash_algorithm": "SHA",
                "mode": "CBC"
            },
            {
                "name": "TLS_RSA_WITH_AES_128_GCM_SHA256",
                "key_exchange": "RSA",
                "encryption_algorithm": "AES_128",
                "hash_algorithm": "SHA256",
                "mode": "GCM"
            },
            {
                "name": "TLS_RSA_WITH_AES_128_CBC_SHA",
                "key_exchange": "RSA",
                "encryption_algorithm": "AES_128",
                "hash_algorithm": "SHA",
                "mode": "CBC"
            },
            {
                "name": "TLS_RSA_WITH_3DES_EDE_CBC_SHA",
                "key_exchange": "RSA",
                "encryption_algorithm": "3DES_EDE",
                "hash_algorithm": "SHA",
                "mode": "CBC"
            },
            {
                "name": "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256",
                "key_exchange": "ECDHE_RSA",
                "encryption_algorithm": "CHACHA20_POLY1305",
                "hash_algorithm": "SHA256",
                "mode": null
            },
            {
                "name": "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
                "key_exchange": "ECDHE_RSA",
                "encryption_algorithm": "AES_256",
                "hash_algorithm": "SHA384",
                "mode": "GCM"
            },
            {
                "name": "TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA",
                "key_exchange": "ECDHE_RSA",
                "encryption_algorithm": "AES_256",
                "hash_algorithm": "SHA",
                "mode": "CBC"
            },
            {
                "name": "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
                "key_exchange": "ECDHE_RSA",
                "encryption_algorithm": "AES_128",
                "hash_algorithm": "SHA256",
                "mode": "GCM"
            },
            {
                "name": "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA",
                "key_exchange": "ECDHE_RSA",
                "encryption_algorithm": "AES_128",
                "hash_algorithm": "SHA",
                "mode": "CBC"
            },
            {
                "name": "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256",
                "key_exchange": "ECDHE_ECDSA",
                "encryption_algorithm": "CHACHA20_POLY1305",
                "hash_algorithm": "SHA256",
                "mode": null
            },
            {
                "name": "TLS_CHACHA20_POLY1305_SHA256",
                "key_exchange": null,
                "encryption_algorithm": "CHACHA20",
                "hash_algorithm": "SHA256",
                "mode": null
            },
            {
                "name": "TLS_AES_256_GCM_SHA384",
                "key_exchange": null,
                "encryption_algorithm": "AES_256",
                "hash_algorithm": "SHA384",
                "mode": "GCM"
            },
            {
                "name": "TLS_AES_128_GCM_SHA256",
                "key_exchange": null,
                "encryption_algorithm": "AES_128",
                "hash_algorithm": "SHA256",
                "mode": "GCM"
            }
        ],
        "negotiated_cipher_suite": "TLS_AES_256_GCM_SHA384"
    },
    "certificate": {
        "name": "google.com",
        "certificate_format": "X.509",
        "certificate_extension": ".crt",
        "subject_name": "CN=*.google.com",
        "issuer_name": "C=US, O=Google Trust Services, CN=WR2",
        "not_valid_before": "2026-02-02T08:36:38Z",
        "not_valid_after": "2026-04-27T08:36:37Z",
        "signature_algorithm": {
            "name": "sha256WithRSAEncryption",
            "oid": null
        },
        "public_key": {
            "algorithm": "id-ecPublicKey",
            "key_size": 256,
            "oid": null,
            "classical_security_bits": 128
        },
        "key_state": "active"
    },
    "discovered_apis": [
        "https://google.com/v2"
    ],
    "discovered_vpn_endpoints": [],
    "discovered_services": [
        {
            "port": 443,
            "asset_type": "web_service"
        }
    ]
};