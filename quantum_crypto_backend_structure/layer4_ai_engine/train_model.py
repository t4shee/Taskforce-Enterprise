import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib

df = pd.read_csv("quantum_risk_dataset.csv")

le_asset = LabelEncoder()
le_algo = LabelEncoder()
le_tls = LabelEncoder()

df["asset_type"] = le_asset.fit_transform(df["asset_type"])
df["algorithm"] = le_algo.fit_transform(df["algorithm"])
df["tls_version"] = le_tls.fit_transform(df["tls_version"])

X = df.drop("risk_score", axis=1)
y = df["risk_score"]

model = RandomForestRegressor(n_estimators=100)

model.fit(X, y)

joblib.dump({
    "model": model,
    "encoders": {
        "asset": le_asset,
        "algo": le_algo,
        "tls": le_tls
    }
}, "model.pkl")

print("Model trained.")