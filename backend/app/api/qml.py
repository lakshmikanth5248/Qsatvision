import math
import uuid
import time
import numpy as np
from fastapi import APIRouter, HTTPException
from typing import Dict, Any, Optional

from app.models.analysis import QMLRunRequestSchema
from app.services.quantum_ml_service import QuantumMLService, VQCModel, QuantumKernelModel
from app.services.data_provider import DemoSatelliteProvider

router = APIRouter(prefix="/qml", tags=["Quantum Machine Learning"])

# In-memory store for standalone QML experiments
QML_EXPERIMENTS_STORE: Dict[str, Dict[str, Any]] = {}

@router.get("/models")
def get_qml_models():
    """Returns available Quantum ML models, ansatz architectures, and encoding schemes."""
    return {
        "status": "success",
        "models": [
            {
                "id": "vqc",
                "name": "Variational Quantum Classifier (VQC)",
                "description": "Hybrid parameterized quantum circuit trained via classical gradient optimization.",
                "supportedQubits": [2, 3, 4, 6],
                "ansatzOptions": ["RealAmplitudes", "EfficientSU2", "TwoLocal"],
                "encodingOptions": ["ZZ Feature Map", "Angle Encoding"],
                "defaultOptimizer": "COBYLA",
                "defaultShots": 1024
            },
            {
                "id": "quantum_kernel",
                "name": "Quantum Kernel Classifier (QSVM)",
                "description": "Nonlinear quantum state mapping computing statevector inner-product fidelity kernels.",
                "supportedQubits": [2, 3, 4],
                "ansatzOptions": ["Quantum Kernel Fidelity Statevector Evaluation"],
                "encodingOptions": ["ZZ Feature Map", "Angle Encoding"],
                "defaultOptimizer": "LIBSVM Dual Optimizer",
                "defaultShots": 1024
            }
        ],
        "disclaimer": "Evaluated strictly as an empirical research platform without asserting unproven quantum advantage."
    }

@router.post("/run")
def run_standalone_qml(req: QMLRunRequestSchema):
    """Executes a standalone QML circuit experiment and returns measured circuit performance."""
    try:
        exp_id = f"qml-exp-{uuid.uuid4().hex[:8]}"

        # Generate sample data if not supplied
        if req.featuresSample is not None and req.labelsSample is not None:
            X = np.array(req.featuresSample)
            y = np.array(req.labelsSample)
        else:
            provider = DemoSatelliteProvider()
            X, y = provider.get_data(district_id="visakhapatnam", start_year=2020, end_year=2026, n_samples=60)
            X = X[:, :req.qubits] # Take first n_qubits features

        # Split 80/20
        split_idx = int(len(X) * 0.8)
        X_train, X_test = X[:split_idx], X[split_idx:]
        y_train, y_test = y[:split_idx], y[split_idx:]

        qml_service = QuantumMLService()
        metrics, circuit_meta = qml_service.run_model(
            model_name=req.modelType,
            n_qubits=req.qubits,
            circuit_depth=req.circuitDepth,
            encoding=req.encodingMethod,
            ansatz=req.ansatz,
            X_train=X_train,
            X_test=X_test,
            y_train=y_train,
            y_test=y_test
        )

        result_payload = {
            "status": "success",
            "experimentId": exp_id,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "modelType": req.modelType,
            "config": {
                "qubits": req.qubits,
                "circuitDepth": req.circuitDepth,
                "encodingMethod": req.encodingMethod,
                "ansatz": req.ansatz,
                "shots": req.shots,
                "optimizer": req.optimizer,
                "datasetSize": len(X),
                "featuresCount": req.qubits
            },
            "metrics": metrics,
            "circuit": circuit_meta,
            "scientific_disclaimer": "Actual measured simulator evaluation. No synthetic benchmark values."
        }

        QML_EXPERIMENTS_STORE[exp_id] = result_payload
        return result_payload
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "status": "error",
                "code": "QML_EXECUTION_ERROR",
                "message": f"Quantum circuit evaluation failed: {str(e)}"
            }
        )

@router.get("/experiments/{experiment_id}")
def get_qml_experiment(experiment_id: str):
    """Retrieve metadata and results of a completed standalone QML experiment."""
    exp = QML_EXPERIMENTS_STORE.get(experiment_id)
    if not exp:
        raise HTTPException(
            status_code=404,
            detail={
                "status": "error",
                "code": "EXPERIMENT_NOT_FOUND",
                "message": f"QML Experiment '{experiment_id}' was not found."
            }
        )
    return exp

@router.get("/circuit/{model_type_or_id}")
def get_quantum_circuit_diagram(
    model_type_or_id: str,
    qubits: int = 4,
    depth: int = 2,
    encoding: str = "ZZ Feature Map",
    ansatz: str = "RealAmplitudes"
):
    """
    Returns authentic Qiskit ASCII circuit representation, depth, gate count,
    and parameter layout for visualization.
    """
    try:
        # Check if it's an existing experiment ID
        if model_type_or_id in QML_EXPERIMENTS_STORE:
            stored = QML_EXPERIMENTS_STORE[model_type_or_id]
            return {
                "status": "success",
                "experimentId": model_type_or_id,
                "circuit": stored.get("circuit")
            }

        # Otherwise synthesize circuit dynamically using Qiskit
        n_q = max(2, min(6, qubits))
        d = max(1, min(4, depth))

        if model_type_or_id.lower() in ["quantum_kernel", "qsvm"]:
            qk = QuantumKernelModel(n_qubits=n_q, encoding=encoding)
            c_str = str(qk.feature_map.draw(output="text"))
            return {
                "status": "success",
                "modelType": "quantum_kernel",
                "circuit": {
                    "qubits": n_q,
                    "encodingMethod": encoding,
                    "ansatz": "Fidelity Statevector Evaluation",
                    "circuitDepth": qk.feature_map.depth(),
                    "gateCount": qk.feature_map.size(),
                    "trainableParametersCount": 0,
                    "shots": 1024,
                    "backend": "Qiskit Aer Statevector Simulator",
                    "circuitAsciiDiagram": c_str
                }
            }
        else: # Default: VQC
            vqc = VQCModel(n_qubits=n_q, circuit_depth=d, encoding=encoding, ansatz_type=ansatz)
            c_str = str(vqc.circuit.draw(output="text"))
            return {
                "status": "success",
                "modelType": "vqc",
                "circuit": {
                    "qubits": n_q,
                    "encodingMethod": encoding,
                    "ansatz": ansatz,
                    "circuitDepth": vqc.circuit.depth(),
                    "gateCount": vqc.circuit.size(),
                    "trainableParametersCount": len(vqc.theta_params),
                    "shots": 1024,
                    "backend": "Qiskit Aer Statevector Simulator",
                    "circuitAsciiDiagram": c_str
                }
            }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "status": "error",
                "code": "CIRCUIT_GENERATION_FAILED",
                "message": f"Circuit generation failed: {str(e)}"
            }
        )
