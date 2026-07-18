import pandas as pd
import random

rows = []

asset_types = ["API", "WEB", "VPN"]
algorithms = ["RSA", "ECDHE", "ECDSA"]
tls_versions = ["TLS1.2", "TLS1.3"]

for i in range(500):

    asset = random.choice(asset_types)
    algo = random.choice(algorithms)
    tls = random.choice(tls_versions)

    data_longevity = random.randint(1, 20)
    traffic_volume = random.randint(1000, 100000)
    dependencies = random.randint(1, 10)

    risk = 40

    if tls == "TLS1.2":
        risk += 15

    if algo == "RSA":
        risk += 25

    if data_longevity > 10:
        risk += 20

    risk = min(risk, 100)

    rows.append([
        asset,
        algo,
        tls,
        data_longevity,
        traffic_volume,
        dependencies,
        risk
    ])

df = pd.DataFrame(rows, columns=[
    "asset_type",
    "algorithm",
    "tls_version",
    "data_longevity",
    "traffic_volume",
    "dependencies",
    "risk_score"
])

df.to_csv("quantum_risk_dataset.csv", index=False)

print("Dataset generated.")