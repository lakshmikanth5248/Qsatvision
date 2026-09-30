import sys
import os
import time

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

print("=" * 70)
print("TESTING QUANTUMSAT-AP PHASE 5 & PHASE 6 ENHANCEMENTS")
print("=" * 70)

# 1. Test Standalone Circuit Generation
print("\n[1/8] Testing Quantum Circuit Retrieval (/api/qml/circuit)...")
res = client.get("/api/qml/circuit/vqc?qubits=4&depth=2&encoding=ZZ+Feature+Map")
assert res.status_code == 200, f"Failed: {res.text}"
data = res.json()
assert data["circuit"]["qubits"] == 4
assert "circuitAsciiDiagram" in data["circuit"]
print("  [OK] VQC Circuit retrieved (Depth:", data["circuit"]["circuitDepth"], "Qubits:", data["circuit"]["qubits"], ")")
print("  ASCII Sample:\n", "\n".join(data["circuit"]["circuitAsciiDiagram"].splitlines()[:5]))

# 2. Test Empirical Classical vs Quantum Benchmark
print("\n[2/8] Testing Scientific Benchmark (/api/benchmark)...")
bench_payload = {
    "districtId": "visakhapatnam",
    "startYear": 2020,
    "endYear": 2026,
    "models": ["random_forest", "svm", "vqc", "quantum_kernel"],
    "features": ["ndvi", "ndwi", "ndbi", "texture", "temporal", "spectral"],
    "qubits": 4,
    "circuitDepth": 2,
    "encodingMethod": "ZZ Feature Map",
    "ansatz": "RealAmplitudes",
    "shots": 1024,
    "sampleSize": 100
}
res = client.post("/api/benchmark", json=bench_payload)
assert res.status_code == 200, f"Benchmark failed: {res.text}"
bench_data = res.json()
bench_id = bench_data["benchmarkId"]
print(f"  [OK] Benchmark completed! ID: {bench_id}")
print(f"  [OK] Models evaluated: {[m['modelName'] for m in bench_data['models']]}")
for m in bench_data["models"]:
    print(f"    - {m['modelName']}: Accuracy={m['accuracy']}%, F1={m['f1Score']}, TrainTime={m['trainingTimeSec']}s, Latency={m['inferenceTimeMs']}ms")
assert len(bench_data["models"]) == 4
assert "scientificRule" in bench_data
assert "pcaScreeData" in bench_data and len(bench_data["pcaScreeData"]) == 4
assert bench_data["quantumKernelSample"] is not None

# 3. Test Benchmark CSV Export
print("\n[3/8] Testing Benchmark CSV Export (/api/benchmark/{id}/csv)...")
res = client.get(f"/api/benchmark/{bench_id}/csv")
assert res.status_code == 200, f"CSV Export failed: {res.text}"
assert "Random Forest Classifier" in res.text
assert "Variational Quantum Classifier" in res.text
print(f"  [OK] CSV Export returned {len(res.text)} bytes")

# 4. Test Research PDF Generation (ReportLab)
print("\n[4/8] Testing Research PDF Generation (/api/reports/generate)...")
pdf_payload = {
    "districtId": "tirupati",
    "domain": "agriculture",
    "startYear": 2018,
    "endYear": 2026,
    "satellite": "sentinel-2",
    "qubits": 4,
    "circuitDepth": 2,
    "dataMode": "DEMO"
}
res = client.post("/api/reports/generate", json=pdf_payload)
assert res.status_code == 200, f"PDF generation failed: {res.text}"
assert res.headers.get("content-type") == "application/pdf"
assert len(res.content) > 1000
print(f"  [OK] Research PDF generated successfully: {len(res.content)} bytes binary PDF payload")

# 5. Test Full Pipeline and Analysis Results CSV & JSON Export
print("\n[5/8] Testing Analysis Pipeline & Results CSV/JSON Exports...")
ana_payload = {
    "districtId": "ysr_kadapa",
    "domain": "agriculture",
    "startYear": 2018,
    "endYear": 2026,
    "satellite": "sentinel-2",
    "features": ["ndvi", "spectral", "texture", "temporal"],
    "classicalModel": "random_forest",
    "quantumModel": "vqc",
    "quantumConfig": {
        "qubits": 4,
        "circuitDepth": 2,
        "encodingMethod": "ZZ Feature Map",
        "ansatz": "RealAmplitudes",
        "shots": 1024,
        "optimizer": "COBYLA",
        "backend": "statevector_simulator"
    },
    "dataMode": "DEMO"
}
res = client.post("/api/analysis", json=ana_payload)
assert res.status_code == 200
ana_id = res.json()["analysisId"]

# Export CSV
res_csv = client.get(f"/api/results/{ana_id}/csv")
assert res_csv.status_code == 200
assert "Land Cover Classification Breakdown" in res_csv.text
print(f"  [OK] Results CSV Exported ({len(res_csv.text)} bytes)")

# Export JSON
res_json = client.get(f"/api/results/{ana_id}/json")
assert res_json.status_code == 200
assert res_json.json()["analysis_id"] == ana_id
print(f"  [OK] Results JSON Exported successfully")

# 6. Test Operational Timeline Availability (Phase 6)
print("\n[6/8] Testing Operational Timeline Availability Validation...")
# Sentinel-2 was launched in 2015, querying 2010-2012 should flag unavailable
res_avail_fail = client.get("/api/satellite/availability?satellite=sentinel-2&startYear=2010&endYear=2012")
assert res_avail_fail.status_code == 200
assert res_avail_fail.json()["available"] is False
assert "No compatible satellite data available for this period" in res_avail_fail.json()["message"]
print("  [OK] Operational timeline constraint verified: Sentinel-2 correctly rejected for 2010-2012")

# Sentinel-2 for 2018-2024 should be fully available
res_avail_ok = client.get("/api/satellite/availability?satellite=sentinel-2&startYear=2018&endYear=2024")
assert res_avail_ok.status_code == 200
assert res_avail_ok.json()["available"] is True
print("  [OK] Sentinel-2 confirmed available for operational era (2018-2024)")

# 7. Test Satellite Scene Search (Phase 6)
print("\n[7/8] Testing Satellite Scene Search (/api/satellite/search)...")
search_payload = {
    "districtId": "guntur",
    "satelliteSource": "sentinel-2",
    "startYear": 2021,
    "endYear": 2023,
    "maxCloudCover": 20.0
}
res_search = client.post("/api/satellite/search", json=search_payload)
assert res_search.status_code == 200
scenes_data = res_search.json()
assert scenes_data["count"] > 0
print(f"  [OK] Found {scenes_data['count']} scenes for Guntur (2021-2023)")
sample_scene = scenes_data["scenes"][0]
print(f"    - First scene: {sample_scene['sceneId']} ({sample_scene['acquisitionDate']}, Cloud={sample_scene['cloudCoveragePct']}%)")

# 8. Test Spectral Indices & Job Processing Queue
print("\n[8/8] Testing Spectral Index Formulas & Asynchronous Jobs...")
idx_payload = {
    "sensor": "sentinel-2",
    "nir": 0.65,
    "red": 0.12,
    "swir": 0.22
}
res_idx = client.post("/api/satellite/indices", json=idx_payload)
assert res_idx.status_code == 200
idx_res = res_idx.json()["indices"]
expected_ndvi = round((0.65 - 0.12) / (0.65 + 0.12), 4)
assert abs(idx_res["ndvi"] - expected_ndvi) < 1e-3
print(f"  [OK] NDVI calculated verified: {idx_res['ndvi']}")

# Asynchronous Job Submission
res_job = client.post("/api/jobs", json=ana_payload)
assert res_job.status_code == 200
job_id = res_job.json()["jobId"]
print(f"  [OK] Job dispatched: {job_id}")
time.sleep(1.0) # Allow worker thread to progress through stages
res_job_status = client.get(f"/api/jobs/{job_id}")
assert res_job_status.status_code == 200
status_data = res_job_status.json()
print(f"  [OK] Job stage progress: {status_data['status']} ({status_data['progressPct']}%) - {status_data['stageMessage']}")

print("\n" + "=" * 70)
print("ALL PHASE 5 & PHASE 6 BACKEND TESTS PASSED WITH 100% SUCCESS!")
print("=" * 70)
