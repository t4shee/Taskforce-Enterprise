import requests
import socket

COMMON_API_PATHS = [
    "/api",
    "/v1",
    "/v2",
    "/graphql",
    "/rest"
]

VPN_PORTS = {
    500: "IPSec",
    4500: "IPSec-NAT-T",
    1194: "OpenVPN",
    51820: "WireGuard"
}


def discover_apis(hostname):
    discovered = []

    try:
        url = f"https://{hostname}"
        r = requests.get(url, timeout=5)
        html = r.text.lower()

        for path in COMMON_API_PATHS:
            if path in html:
                discovered.append(f"https://{hostname}{path}")

    except Exception:
        pass

    return list(set(discovered))


def discover_vpn_endpoints(ip):
    found = []

    for port, service in VPN_PORTS.items():
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(1)

            if s.connect_ex((ip, port)) == 0:
                found.append({
                    "port": port,
                    "service": service
                })

            s.close()

        except Exception:
            pass

    return found
