from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import PlainTextResponse, JSONResponse
from typing import Dict, Any
from app.services.analysis_service import pipeline_service

router = APIRouter(prefix="/results", tags=["Results"])

@router.get("/{analysis_id}")
def get_analysis_result(analysis_id: str):
    """Retrieve structured scientific results for a completed analysis."""
    result = pipeline_service.get_result(analysis_id)
    if not result:
        raise HTTPException(
            status_code=404,
            detail={
                "status": "error",
                "code": "RESULT_NOT_FOUND",
                "message": f"Result for analysis ID '{analysis_id}' has expired or does not exist."
            }
        )
    return {
        "status": "success",
        "analysisId": analysis_id,
        "result": result
    }

@router.get("/{analysis_id}/csv")
def export_analysis_csv(analysis_id: str):
    """Exports land cover classification, temporal change statistics, and benchmark metrics as CSV."""
    result = pipeline_service.get_result(analysis_id)
    if not result:
        raise HTTPException(
            status_code=404,
            detail={
                "status": "error",
                "code": "RESULT_NOT_FOUND",
                "message": f"Result for analysis ID '{analysis_id}' does not exist."
            }
        )
    
    lines = [
        f"# QuantumSat-AP Analysis Result Export",
        f"# Analysis ID: {result.analysis_id}",
        f"# Data Mode: {result.data_mode}",
        f"# Timestamp: {result.timestamp}",
        "",
        "# Land Cover Classification Breakdown",
        "Category,Coverage Percentage (%),Estimated Area (km2),Is Demo Data",
    ]
    for c in result.classification_breakdown:
        lines.append(f'"{c.category}",{c.coveragePct},{c.areaKm2},{c.isDemoData}')

    lines.append("")
    lines.append("# Temporal Land Cover Change Detection")
    lines.append("Category,Direction,Percentage Change (%),Delta Area (km2),Is Demo Data")
    for chg in result.change_breakdown:
        lines.append(f'"{chg.category}","{chg.direction}",{chg.pctChange},{chg.deltaKm2},{chg.isDemoData}')

    lines.append("")
    lines.append("# Empirical ML & QML Metrics")
    lines.append("Model Type,Accuracy (%),Precision,Recall,F1 Score,Training Time (s),Inference Latency (ms/sample)")
    lines.append(
        f'"Classical Baseline ({result.configuration.get("classicalModel", "RF")})",'
        f'{result.classical_result.accuracy},{result.classical_result.precision},'
        f'{result.classical_result.recall},{result.classical_result.f1Score},'
        f'{result.classical_result.trainingTimeSec},{result.classical_result.inferenceTimeMs}'
    )
    lines.append(
        f'"Quantum Model ({result.configuration.get("quantumModel", "VQC")})",'
        f'{result.quantum_result.accuracy},{result.quantum_result.precision},'
        f'{result.quantum_result.recall},{result.quantum_result.f1Score},'
        f'{result.quantum_result.trainingTimeSec},{result.quantum_result.inferenceTimeMs}'
    )

    csv_content = "\n".join(lines)
    return PlainTextResponse(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="QuantumSat_Result_{analysis_id}.csv"'}
    )

@router.get("/{analysis_id}/json")
def export_analysis_json(analysis_id: str):
    """Exports complete structured experiment JSON."""
    result = pipeline_service.get_result(analysis_id)
    if not result:
        raise HTTPException(
            status_code=404,
            detail={
                "status": "error",
                "code": "RESULT_NOT_FOUND",
                "message": f"Result for analysis ID '{analysis_id}' does not exist."
            }
        )
    return JSONResponse(
        content=result.model_dump(),
        headers={"Content-Disposition": f'attachment; filename="QuantumSat_Experiment_{analysis_id}.json"'}
    )
