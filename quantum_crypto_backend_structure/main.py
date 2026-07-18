from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.analysis_pipeline import run_full_analysis

app = FastAPI()

# ✅ Correct CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",            # frontend (local)
        "https://t4skforce.vercel.app"      # frontend (production)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*", "ngrok-skip-browser-warning"]
)

@app.get("/")
def root():
    return {"message": "Quantum Crypto Analyzer API Running"}

@app.post("/api/analyze")
def analyze(scan_data: dict):
    result = run_full_analysis(scan_data)
    return result