import socket

# Ports where APIs or VPNs commonly run
TARGET_PORTS = {
    443: "https",
    8443: "https-alt",
    8080: "api_http",
    8000: "api_http",
    3000: "node_api",
    5000: "flask_api",
    1194: "openvpn",
    4443: "vpn_ssl",
    10000: "vpn_webmin"
}


def scan_ports(ip):

    discovered = []

    for port, label in TARGET_PORTS.items():

        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(1)

            if s.connect_ex((ip, port)) == 0:

                discovered.append({
                    "port": port,
                    "service_hint": label
                })

            s.close()

        except Exception:
            pass

    return discovered
