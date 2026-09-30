from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import PlainTextResponse
from typing import Dict, Any

from app.models.benchmark import BenchmarkRequestSchema, FullBenchmarkResponse
from app.services.benchmark_service import benchmark_service

router = APIRouter(prefix="/benchmark", tags=["Benchmarking"])

@router.post("", response_model=FullBenchmarkResponse)
def run_model_benchmark(req: BenchmarkRequestSchema):
    """
    Executes a head-to-head empirical benchmark across Random Forest, SVM, VQC,
    and Quantum Kernel Classifier on identical train/test splits.
    Adheres strictly to scientific objectivity: Reports factual measured performance.
    """
    try:
        return benchmark_service.run_benchmark(req)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "status": "error",
                "code": "BENCHMARK_EXECUTION_ERROR",
                "message": f"Failed executing empirical benchmark: {str(e)}"
            }
        )

@router.get("/{benchmark_id}", response_model=FullBenchmarkResponse)
def get_benchmark_result(benchmark_id: str):
    """Retrieves a previously executed benchmark report."""
    res = benchmark_service.get_benchmark(benchmark_id)
    if not res:
        raise HTTPException(
            status_code=404,
            detail={
                "status": "error",
                "code": "BENCHMARK_NOT_FOUND",
                "message": f"Benchmark with ID '{benchmark_id}' was not found."
            }
        )
    return res

@router.get("/{benchmark_id}/csv")
def export_benchmark_csv(benchmark_id: str):
    """Exports benchmark metrics and per-class classification breakdown as downloadable CSV."""
    res = benchmark_service.get_benchmark(benchmark_id)
    if not res:
        raise HTTPException(
            status_code=404,
            detail={
                "status": "error",
                "code": "BENCHMARK_NOT_FOUND",
                "message": f"Benchmark with ID '{benchmark_id}' was not found."
            }
        )
    csv_data = benchmark_service.export_csv(benchmark_id)
    return PlainTextResponse(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=QuantumSat_Benchmark_{benchmark_id}.csv"}
    )
