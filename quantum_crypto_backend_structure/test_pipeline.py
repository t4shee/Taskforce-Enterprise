import json
from services.analysis_pipeline import run_full_analysis

# Load sample JSON file
with open("sample_scan.json", "r") as file:
    scan_data = json.load(file)

# Run the analysis
result = run_full_analysis(scan_data)

# Print result in terminal
print("\n=== Quantum Security Analysis Result ===\n")
print(json.dumps(result, indent=4))