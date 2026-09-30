import sys
import os
import time

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

print("=" * 60)
print("TESTING QUANTUMSAT-AP REAL BACKEND + ML + QML PIPELINE")
print("=" * 60)

# 1. Test Data Ingestion
print("\n[1/7] Testing Satellite Data Provider...")
from app.services.data_provider import DemoSatelliteProvider
provider = DemoSatelliteProvider(seed=42)
X_raw, y_raw = provider.get_data("tirupati", 2018, 2026, n_samples=200)
print(f"  [OK] Ingested raw multispectral pixels: shape={X_raw.shape}, labels={y_raw.shape}")
assert X_raw.shape == (200, 8), f"Expected (200, 8), got {X_raw.shape}"

# 2. Test Preprocessing
print("\n[2/7] Testing Preprocessing Service...")
from app.services.preprocessing_service import PreprocessingService
prep = PreprocessingService()
X_clean, y_clean, prep_meta = prep.process(X_raw, y_raw)
print(f"  [OK] Preprocessed {len(X_clean)} pixels with {prep_meta['normalizationMethod']}")

# 3. Test Feature Extraction & PCA
print("\n[3/7] Testing Feature Extraction & PCA...")
from app.services.feature_service import FeatureService
feat_svc = FeatureService()
X_feats, feat_meta = feat_svc.extract_features(X_clean, ["ndvi", "ndwi", "ndbi", "texture", "temporal", "spectral"])
print(f"  [OK] Extracted features: {feat_meta['extractedFeatures']}")
print(f"  [OK] Feature matrix shape: {X_feats.shape}")
X_pca, pca_meta, _ = feat_svc.reduce_dimensions(X_feats, target_components=4)
print(f"  [OK] PCA Reduced to {pca_meta['reducedDimensions']} components with {pca_meta['totalExplainedVariancePct']}% explained variance")

# 4. Test Classical ML (Random Forest and SVM)
print("\n[4/7] Testing Classical Baseline Models...")
from app.services.classical_ml_service import ClassicalMLService
classical_svc = ClassicalMLService(random_state=42)
X_tr, X_te, y_tr, y_te = classical_svc.split_data(X_feats, y_clean)

rf_metrics, _ = classical_svc.train_and_evaluate("random_forest", X_tr, X_te, y_tr, y_te)
print(f"  [OK] Random Forest -> Accuracy: {rf_metrics['accuracy']}%, F1: {rf_metrics['f1Score']}, TrainTime: {rf_metrics['trainingTimeSec']}s")

svm_metrics, _ = classical_svc.train_and_evaluate("svm", X_tr, X_te, y_tr, y_te)
print(f"  [OK] SVM -> Accuracy: {svm_metrics['accuracy']}%, F1: {svm_metrics['f1Score']}, TrainTime: {svm_metrics['trainingTimeSec']}s")

# 5. Test Quantum ML (VQC and Quantum Kernel)
print("\n[5/7] Testing Quantum Machine Learning Models (Qiskit)...")
from app.services.quantum_ml_service import QuantumMLService
qml_svc = QuantumMLService()
X_tr_pca, X_te_pca, _, _ = classical_svc.split_data(X_pca, y_clean)

# Test VQC
t_vqc0 = time.time()
vqc_metrics, vqc_circuit = qml_svc.run_model(
    model_name="vqc",
    n_qubits=4,
    circuit_depth=2,
    encoding="ZZ Feature Map",
    ansatz="RealAmplitudes",
    X_train=X_tr_pca,
    X_test=X_te_pca,
    y_train=y_tr,
    y_test=y_te
)
print(f"  [OK] VQC Model -> Accuracy: {vqc_metrics['accuracy']}%, F1: {vqc_metrics['f1Score']}, Depth: {vqc_circuit['circuitDepth']}, Qubits: {vqc_circuit['qubits']}")

# Test Quantum Kernel
t_qk0 = time.time()
qk_metrics, qk_circuit = qml_svc.run_model(
    model_name="quantum_kernel",
    n_qubits=4,
    circuit_depth=2,
    encoding="Angle Encoding",
    ansatz="Quantum Kernel Fidelity Statevector Evaluation",
    X_train=X_tr_pca,
    X_test=X_te_pca,
    y_train=y_tr,
    y_test=y_te
)
print(f"  [OK] Quantum Kernel Model -> Accuracy: {qk_metrics['accuracy']}%, F1: {qk_metrics['f1Score']}, TrainTime: {qk_metrics['trainingTimeSec']}s")

# 6. Test Full Pipeline Orchestration
print("\n[6/7] Testing Full Pipeline Orchestration...")
from app.models.analysis import AnalysisRequestSchema
from app.services.analysis_service import pipeline_service

req = AnalysisRequestSchema(
    districtId="ysr_kadapa",
    domain="agriculture",
    startYear=2018,
    endYear=2026,
    satellite="sentinel-2",
    features=["ndvi", "spectral", "texture", "temporal"],
    classicalModel="random_forest",
    quantumModel="vqc",
    dataMode="REAL"
)
result = pipeline_service.run_pipeline(req)
print(f"  [OK] Pipeline Output Analysis ID: {result.analysis_id}")
print(f"  [OK] Key findings count: {len(result.key_findings)}")
print(f"  [OK] Side-by-side comparison generated: {result.comparison['metrics'][0]}")

# 7. Test FastAPI Application Endpoints via TestClient
print("\n[7/7] Testing FastAPI API Endpoints...")
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

res_health = client.get("/api/health")
assert res_health.status_code == 200, f"Health check failed: {res_health.text}"
print(f"  [OK] GET /api/health -> {res_health.json()['status']}")

res_districts = client.get("/api/districts")
assert res_districts.status_code == 200, f"Districts list failed: {res_districts.text}"
print(f"  [OK] GET /api/districts -> {res_districts.json()['count']} districts mapped")

res_dist = client.get("/api/districts/tirupati")
assert res_dist.status_code == 200
print(f"  [OK] GET /api/districts/tirupati -> {res_dist.json()['district']['name']}")

res_sat = client.get("/api/satellite-data")
assert res_sat.status_code == 200
print(f"  [OK] GET /api/satellite-data -> {len(res_sat.json()['sources'])} sources")

res_timeline = client.get("/api/timeline")
assert res_timeline.status_code == 200
print(f"  [OK] GET /api/timeline -> {res_timeline.json()['archiveStartYear']} - {res_timeline.json()['archiveEndYear']}")

res_compare = client.post("/api/compare", json={"mode": "year", "districtId": "tirupati", "yearA": 2015, "yearB": 2026})
assert res_compare.status_code == 200
print(f"  [OK] POST /api/compare -> Year comparison metrics returned")

res_qml_models = client.get("/api/qml/models")
assert res_qml_models.status_code == 200
print(f"  [OK] GET /api/qml/models -> {len(res_qml_models.json()['models'])} models listed")

print("\n" + "=" * 60)
print("ALL BACKEND & ML/QML PIPELINE TESTS PASSED WITH DISTINCTION!")
print("=" * 60)
