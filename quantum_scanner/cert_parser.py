import subprocess
from datetime import datetime

def convert_to_iso(date_string):
    try:
        dt = datetime.strptime(date_string, "%b %d %H:%M:%S %Y %Z")
        return dt.strftime("%Y-%m-%dT%H:%M:%SZ")
    except:
        return None


def parse_certificate(ip, port, hostname):

    try:
        cmd = f"echo | openssl s_client -connect {ip}:{port} -servername {hostname} 2>/dev/null | openssl x509 -noout -text"

        result = subprocess.check_output(
            cmd,
            shell=True,
            text=True,
            timeout=10
        )

        subject = None
        issuer = None
        not_before = None
        not_after = None
        signature_algorithm = None
        public_key_algorithm = None
        key_size = None

        for line in result.splitlines():

            line = line.strip()

            if line.startswith("Subject:"):
                subject = line.replace("Subject:", "").strip()

            elif line.startswith("Issuer:"):
                issuer = line.replace("Issuer:", "").strip()

            elif line.startswith("Not Before:"):
                raw_date = line.replace("Not Before:", "").strip()
                not_before = convert_to_iso(raw_date)

            elif line.startswith("Not After :"):
                raw_date = line.replace("Not After :", "").strip()
                not_after = convert_to_iso(raw_date)

            elif line.startswith("Signature Algorithm:") and signature_algorithm is None:
                signature_algorithm = line.replace("Signature Algorithm:", "").strip()

            elif "Public Key Algorithm:" in line:
                public_key_algorithm = line.split(":")[1].strip()

            elif "Public-Key:" in line:
                key_size = int(line.split("(")[1].split()[0])

        return {
            "certificate": {
                "name": hostname,
                "certificate_format": "X.509",
                "certificate_extension": ".crt",
                "subject_name": subject,
                "issuer_name": issuer,
                "not_valid_before": not_before,
                "not_valid_after": not_after,
                "signature_algorithm": {
                    "name": signature_algorithm,
                    "oid": None
                },
                "public_key": {
                    "algorithm": public_key_algorithm,
                    "key_size": key_size,
                    "oid": None
                }
            }
        }

    except subprocess.TimeoutExpired:
        return {
            "error": True,
            "error_type": "certificate_timeout",
            "message": "Certificate extraction timed out"
        }

    except Exception as e:
        return {
            "error": True,
            "error_type": "certificate_parse_failed",
            "message": str(e)
        }
