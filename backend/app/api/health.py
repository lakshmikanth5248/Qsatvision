import time
from fastapi import APIRouter
from qiskit import __version__ as qiskit_version

router = APIRouter(tags=["Health"])

@router.get("/health")
def health_check():
    """Health check endpoint exposing system operational state."""
    return {
        "status": "CONNECTED",
        "timestamp": time.time(),
        "backend": "FastAPI + Qiskit Simulator Engine",
        "version": "1.0.0",
        "qiskit_version": qiskit_version,
        "mode": "REAL_PROCESSING_READY"
    }
