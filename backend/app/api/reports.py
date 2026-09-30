from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import StreamingResponse
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field

from app.services.report_service import report_generator
from app.services.analysis_service import pipeline_service

router = APIRouter(prefix="/reports", tags=["Reports"])

class ReportGenerateRequest(BaseModel):
    analysisId: Optional[str] = Field(default=None)
    experimentId: Optional[str] = Field(default=None)
    districtId: str = Field(default="visakhapatnam")
    domain: str = Field(default="agriculture")
    startYear: int = Field(default=2018)
    endYear: int = Field(default=2026)
    satellite: str = Field(default="sentinel-2")
    classicalModel: str = Field(default="random_forest")
    quantumModel: str = Field(default="vqc")
    qubits: int = Field(default=4)
    circuitDepth: int = Field(default=2)
    encodingMethod: str = Field(default="ZZ Feature Map")
    dataMode: str = Field(default="DEMO")
    notes: Optional[str] = Field(default=None)

@router.post("/generate")
def generate_pdf_report(req: ReportGenerateRequest):
    """
    Generates and streams a formal PDF research report documenting
    the Classical and Quantum satellite intelligence experiment.
    """
    try:
        pdf_buffer = report_generator.generate_pdf(req.model_dump())
        exp_tag = req.analysisId or req.experimentId or "experiment"
        filename = f"QuantumSat_AP_Research_Report_{req.districtId}_{exp_tag}.pdf"
        
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"'
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "status": "error",
                "code": "REPORT_GENERATION_FAILED",
                "message": f"Failed to generate scientific PDF report: {str(e)}"
            }
        )

@router.get("/{report_id}")
def get_report_metadata(report_id: str):
    """Retrieves metadata of a previously generated research report."""
    analysis = pipeline_service.get_result(report_id)
    if not analysis:
        return {
            "status": "success",
            "reportId": report_id,
            "title": f"QuantumSat-AP Analysis Dossier ({report_id})",
            "status": "available",
            "format": "application/pdf"
        }
    
    return {
        "status": "success",
        "reportId": report_id,
        "title": f"QuantumSat-AP Analysis Dossier — {analysis.configuration.get('districtId', 'AP')}",
        "district": analysis.configuration.get("districtId"),
        "period": f"{analysis.configuration.get('startYear')}–{analysis.configuration.get('endYear')}",
        "dataMode": analysis.data_mode,
        "timestamp": analysis.timestamp,
        "format": "application/pdf"
    }
