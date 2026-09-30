from fastapi import APIRouter, HTTPException
from typing import Dict, Any

from app.models.analysis import AnalysisRequestSchema
from app.services.job_service import job_manager, JobProgress

router = APIRouter(prefix="/jobs", tags=["Processing Jobs"])

@router.post("", response_model=Dict[str, Any])
def submit_processing_job(req: AnalysisRequestSchema):
    """
    Submits an asynchronous Earth observation processing job.
    Returns jobId for client status polling.
    """
    try:
        job_id = job_manager.submit_job(req)
        return {
            "status": "success",
            "jobId": job_id,
            "message": "Processing job dispatched into worker pool.",
            "pollUrl": f"/api/jobs/{job_id}"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "status": "error",
                "code": "JOB_DISPATCH_FAILED",
                "message": f"Failed submitting processing job: {str(e)}"
            }
        )

@router.get("/{job_id}", response_model=JobProgress)
def get_job_status(job_id: str):
    """Retrieves real-time stage progress and execution status for an active or completed job."""
    job = job_manager.get_job(job_id)
    if not job:
        raise HTTPException(
            status_code=404,
            detail={
                "status": "error",
                "code": "JOB_NOT_FOUND",
                "message": f"Processing job '{job_id}' not found."
            }
        )
    return job
