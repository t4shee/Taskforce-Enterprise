import subprocess

def discover_services(normalized_target):

    ip = normalized_target["resolved_ip"]
    hostname = normalized_target["original_input"]

    try:
        result = subprocess.check_output(
            ["nmap", "-sT", "-p", "443,8443,500,4500", "--version-light", ip],
            text=True
        )

        open_ports = []

        for line in result.splitlines():
            line = line.strip()

            # Only match valid open port lines
            if "/tcp" in line and "open" in line:

                parts = line.split()

                port = int(parts[0].split("/")[0])
                service = parts[2] if len(parts) > 2 else "unknown"

                open_ports.append({
                    "port": port,
                    "service": service,
                    "tls_enabled": True if port in [443, 8443] else False
                })

        return {
            "hostname": hostname,
            "ip_address": ip,
            "open_ports": open_ports
        }

    except subprocess.CalledProcessError as e:
        return {
            "error": True,
            "error_type": "service_discovery_failed",
            "message": str(e)
        }
