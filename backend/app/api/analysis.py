from fastapi import APIRouter, HTTPException
from typing import Dict, Any

from app.models.analysis import AnalysisRequestSchema
from app.services.analysis_service import pipeline_service
from app.utils.logger import logger

router = APIRouter(prefix="/analysis", tags=["Analysis"])

@router.post("")
def trigger_analysis(req: AnalysisRequestSchema):
    """
    Submits a hybrid classical-quantum analysis job.
    Executes the modular pipeline:
    Data Loading -> Preprocessing -> Features -> PCA -> Classical ML -> Quantum ML -> Evaluation.
    """
    try:
        logger.info(f"Received analysis request for district={req.districtId}, domain={req.domain}, mode={req.dataMode}")
        result = pipeline_service.run_pipeline(req)
        return {
            "status": "success",
            "analysisId": result.analysis_id,
            "pipelineStatus": "COMPLETED",
            "dataMode": req.dataMode,
            "result": result
        }
    except Exception as e:
        logger.error(f"Analysis pipeline execution failure: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "status": "error",
                "code": "ANALYSIS_PIPELINE_ERROR",
                "message": f"Pipeline processing encountered an issue: {str(e)}"
            }
        )

@router.get("/{analysis_id}")
def get_analysis_status(analysis_id: str):
    """Checks the status of an ongoing or completed analysis."""
    status = pipeline_service.get_analysis_status(analysis_id)
    if not status:
        raise HTTPException(
            status_code=404,
            detail={
                "status": "error",
                "code": "ANALYSIS_NOT_FOUND",
                "message": f"Analysis with ID '{analysis_id}' was not found in the server cache."
            }
        )
    return {
        "status": "success",
        "analysisId": analysis_id,
        "pipelineStatus": status
    }
