export interface T4skforceScanData {
    executive_summary: { overall_risk_level: string; quantum_readiness: string; primary_risk: string; recommended_action: string; };
    scan_summary: { scan_id: string; target: string; scan_timestamp: string; scanner_version: string; scan_mode: string; };
    asset_profile: { hostname: string; ip_address: string; port: number; service: string; asset_type: string; };
    
    cryptographic_bill_of_materials: {
      tls: { protocol: string; version: string; negotiated_cipher: string; supported_cipher_count: number; };
      cipher_inventory: { total_ciphers: number; encryption_algorithms: string[]; hash_algorithms: string[]; cipher_modes: string[]; key_exchange_methods: string[]; weak_cipher_count: number; weak_ciphers: string[]; };
      certificate: { subject: string; issuer: string; signature_algorithm: string; public_key_algorithm: string; key_size: number; security_bits: number; valid_from: string; valid_to: string; validity_days: number; };
      crypto_properties: { forward_secrecy_supported: boolean; legacy_hash_detected: boolean; weak_cipher_support: boolean; classical_public_key_crypto: boolean; };
    };
    
    security_assessment: { risk_score: number; risk_level: string; current_security_posture: string; forward_secrecy: boolean; weak_cipher_support: boolean; };
    
    quantum_risk_analysis: {
      quantum_safe: boolean; quantum_safety_label: string;
      quantum_readiness_score: { quantum_readiness_score: number; readiness_level: string; };
      hndl_exposure: { exposed: boolean; level: string; reason: string; algorithms: string[]; };
      quantum_threat_model: { quantum_threat_analysis: Array<{ algorithm: string; quantum_vulnerability_reason: string; standard_reference: string; }>; };
    };
    
    ai_risk_insights: {
      hndl_probability: number; migration_priority: string; predicted_break_window: string; crypto_agility_score: number;
      banking_compliance_context: { sector: string; regulatory_risk_weight: string; compliance_frameworks: string[]; compliance_impact: string; };
    };
    
    pqc_migration_recommendations: {
      migration_plan: { signature: { current: string; recommended: string; } };
      recommended_actions: string[];
      recommended_algorithms: { key_exchange: string; signature: string; };
      strategy: string;
    };
    
    quantum_security_certificate: { certificate_label: string; certificate_svg_base64: string; certificate_verification: { verification_id: string; issued_by: string; standard_reference: string; }; };
    
    visualization_data: {
      quantum_attack_timeline: Array<{ algorithm: string; risk_start_year: number; risk_end_year: number; risk_type: string; }>;
      quantum_risk_forecast: Array<{ year: number; risk: number; }>;
      pqc_migration_timeline: Array<{ phase: string; start_year: number; end_year: number; }>;
    };
  }
  
  // The exact backend payload provided!
  export const scanData: T4skforceScanData = {
      executive_summary: { overall_risk_level: "MODERATE", quantum_readiness: "NOT READY", primary_risk: "Classical public-key cryptography vulnerable to Shor's algorithm", recommended_action: "Begin transition to hybrid post-quantum TLS using ML-KEM and ML-DSA" },
      scan_summary: { scan_id: "58a9f758-c236-40eb-ba52-4fbcc352e5eb", target: "www.nfsu.ac.in", scan_timestamp: "2026-03-04T11:20:25Z", scanner_version: "1.0", scan_mode: "non_intrusive" },
      asset_profile: { hostname: "www.nfsu.ac.in", ip_address: "117.239.177.124", port: 443, service: "https", asset_type: "public_web" },
      cryptographic_bill_of_materials: {
          tls: { protocol: "TLS", version: "TLSv1.2", negotiated_cipher: "ECDHE-RSA-AES128-GCM-SHA256", supported_cipher_count: 2 },
          cipher_inventory: { total_ciphers: 2, encryption_algorithms: ["AES_128", "AES_256"], hash_algorithms: ["SHA384", "SHA256"], cipher_modes: ["GCM"], key_exchange_methods: ["ECDHE_RSA"], weak_cipher_count: 0, weak_ciphers: [] },
          certificate: { subject: "C=IN, ST=Gujarat, L=Gandhinagar, O=National Forensic Sciences University, CN=*.nfsu.ac.in", issuer: "C=BE, O=GlobalSign nv-sa, CN=GlobalSign RSA OV SSL CA 2018", signature_algorithm: "sha256WithRSAEncryption", public_key_algorithm: "rsaEncryption", key_size: 2048, security_bits: 112, valid_from: "2025-07-10T09:54:55Z", valid_to: "2026-08-11T09:54:54Z", validity_days: 396 },
          crypto_properties: { forward_secrecy_supported: true, legacy_hash_detected: false, weak_cipher_support: false, classical_public_key_crypto: true }
      },
      security_assessment: { risk_score: 42, risk_level: "MODERATE", current_security_posture: "SECURE_UNDER_CLASSICAL_CRYPTOGRAPHY", forward_secrecy: true, weak_cipher_support: false },
      quantum_risk_analysis: {
          quantum_safe: false, quantum_safety_label: "Not Quantum Safe",
          quantum_readiness_score: { quantum_readiness_score: 58, readiness_level: "MIGRATION NEEDED" },
          hndl_exposure: { exposed: true, level: "HIGH", reason: "Classical public-key cryptography vulnerable to quantum attacks", algorithms: ["sha256WithRSAEncryption"] },
          quantum_threat_model: { quantum_threat_analysis: [{ algorithm: "sha256WithRSAEncryption", quantum_vulnerability_reason: "Vulnerable to Shor's Algorithm (quantum factoring / discrete logarithm attack)", standard_reference: "NIST Post-Quantum Cryptography Migration Guidance" }, { algorithm: "rsaEncryption", quantum_vulnerability_reason: "Potential quantum vulnerability depending on implementation", standard_reference: "General Quantum Cryptanalysis Considerations" }] }
      },
      ai_risk_insights: { hndl_probability: 0.75, migration_priority: "HIGH", predicted_break_window: "2030-2040", crypto_agility_score: 25.0, banking_compliance_context: { sector: "Banking & Financial Services", regulatory_risk_weight: "CRITICAL", compliance_frameworks: ["RBI Cyber Security Framework", "NIST Post-Quantum Cryptography Migration", "PCI DSS 4.0", "ISO/IEC 27001"], compliance_impact: "Quantum-vulnerable cryptography may create future regulatory non-compliance risks for banking systems handling long-lived financial data." } },
      pqc_migration_recommendations: { migration_plan: { signature: { current: "sha256WithRSAEncryption", recommended: "ML-DSA or SLH-DSA (Post-Quantum Signature)" } }, recommended_actions: ["Upgrade TLS to TLSv1.3 for stronger security and forward secrecy.", "Prepare migration to Post-Quantum Cryptography (PQC) algorithms.", "Consider hybrid TLS using Post-Quantum algorithms such as ML-KEM."], recommended_algorithms: { key_exchange: "ML-KEM (FIPS 203)", signature: "ML-DSA (FIPS 204)" }, strategy: "Hybrid classical + post-quantum TLS deployment" },
      quantum_security_certificate: { certificate_label: "Quantum Migration Recommended", certificate_svg_base64: "CiAgICA8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjM2MCIgaGVpZ2h0PSIxMjAiPgogICAgICAgIDxyZWN0IHdpZHRoPSIzNjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMGIzZDkxIi8+CiAgICAgICAgPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMzQwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YxYzQwZiIgcng9IjEwIi8+CiAgICAgICAgCiAgICAgICAgPHRleHQgeD0iMTgwIiB5PSI0NSIgZm9udC1zaXplPSIxOCIgZmlsbD0iYmxhY2siIHRleHQtYW5jaG9yPSJtaWRkbGUiPgogICAgICAgICAgICBRdWFudHVtIFNlY3VyaXR5IENlcnRpZmljYXRpb24KICAgICAgICA8L3RleHQ+CgogICAgICAgIDx0ZXh0IHg9IjE4MCIgeT0iNzUiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9ImJsYWNrIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4KICAgICAgICAgICAgUXVhbnR1bSBNaWdyYXRpb24gUmVjb21tZW5kZWQKICAgICAgICA8L3RleHQ+CgogICAgICAgIDx0ZXh0IHg9IjE4MCIgeT0iMTAwIiBmb250LXNpemU9IjEyIiBmaWxsPSJibGFjayIgdGV4dC1hbmNob3I9Im1pZGRsZSI+CiAgICAgICAgICAgIElEOiBRUy1FMzIwRTNDRDI5CiAgICAgICAgPC90ZXh0PgogICAgPC9zdmc+CiAgICA=", certificate_verification: { verification_id: "QS-E320E3CD29", issued_by: "Quantum Security Scanner", standard_reference: "NIST FIPS 203 / 204 / 205" } },
      visualization_data: {
          quantum_attack_timeline: [{ algorithm: "rsaEncryption-2048", risk_start_year: 2030, risk_end_year: 2040, risk_type: "Shor_algorithm" }, { algorithm: "ECDHE_RSA", risk_start_year: 2030, risk_end_year: 2040, risk_type: "Shor_algorithm" }, { algorithm: "AES_128", risk_start_year: 2040, risk_end_year: 2050, risk_type: "Grover_speedup" }, { algorithm: "AES_256", risk_start_year: 2050, risk_end_year: 2060, risk_type: "Grover_speedup" }],
          quantum_risk_forecast: [{ year: 2025, risk: 15.0 }, { year: 2030, risk: 30.0 }, { year: 2035, risk: 52.5 }, { year: 2040, risk: 67.5 }, { year: 2045, risk: 75.0 }],
          pqc_migration_timeline: [{ phase: "Hybrid TLS Deployment", start_year: 2025, end_year: 2030 }, { phase: "RSA/ECC Phaseout", start_year: 2030, end_year: 2035 }, { phase: "Full PQC Deployment", start_year: 2035, end_year: 2040 }]
      }
  };
  export interface T4skforceScanData {
    // Add this block if it isn't there!
    executive_summary: {
      overall_risk_level: string;
      quantum_readiness: string;
      primary_risk: string;
      recommended_action: string;
    };
    // ... rest of the interface
  }