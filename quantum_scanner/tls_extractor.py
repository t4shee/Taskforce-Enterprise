import subprocess

def extract_tls_details(ip, port, hostname):

    try:
        cmd = f"echo | openssl s_client -connect {ip}:{port} -servername {hostname}"

        result = subprocess.check_output(
            cmd,
            shell=True,
            stderr=subprocess.DEVNULL,
            text=True,
            timeout=10
        )

        protocol_version = None
        cipher_suite = None

        for line in result.splitlines():

            line = line.strip()

            if line.startswith("Protocol"):
                protocol_version = line.split(":")[1].strip()

            # TLS 1.2 format
            if line.startswith("Cipher") and ":" in line:
                cipher_suite = line.split(":")[1].strip()

            # TLS 1.3 format
            if "Cipher is" in line:
                cipher_suite = line.split("Cipher is")[1].strip()

        if protocol_version is None:
            protocol_version = "unknown"

        if cipher_suite is None:
            cipher_suite = "unknown"

        return {
            "protocol": {
                "name": "TLS",
                "version": protocol_version,
                "oid": None
            },
            "supported_cipher_suites": [],
            "negotiated_cipher_suite": cipher_suite
        }

    except subprocess.TimeoutExpired:
        return {
            "error": True,
            "error_type": "tls_timeout",
            "message": "TLS handshake timed out"
        }

    except Exception as e:
        return {
            "error": True,
            "error_type": "tls_handshake_failed",
            "message": str(e)
        }
