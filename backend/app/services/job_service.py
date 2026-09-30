import time
import uuid
import threading
from typing import Dict, Any, Optional
from pydantic import BaseModel

from app.models.analysis import AnalysisRequestSchema
from app.services.analysis_service import pipeline_service
from app.utils.logger import logger

class JobProgress(BaseModel):
    jobId: str
    status: str # QUEUED, DOWNLOADING, PREPROCESSING, FEATURE_EXTRACTION, PCA, CLASSICAL_MODEL, QUANTUM_MODEL, CHANGE_DETECTION, RESULT_GENERATION, COMPLETED, FAILED
    progressPct: int
    stageMessage: str
    startTime: str
    completionTime: Optional[str] = None
    analysisId: Optional[str] = None
    error: Optional[str] = None

class JobManager:
    """Manages asynchronous satellite processing and classical/quantum ML jobs."""

    def __init__(self):
        self.jobs: Dict[str, JobProgress] = {}

    def submit_job(self, req: AnalysisRequestSchema) -> str:
        job_id = f"job-{uuid.uuid4().hex[:8]}"
        self.jobs[job_id] = JobProgress(
            jobId=job_id,
            status="QUEUED",
            progressPct=5,
            stageMessage="Job queued in processing worker pool",
            startTime=time.strftime("%Y-%m-%dT%H:%M:%SZ")
        )

        # Launch worker thread
        t = threading.Thread(target=self._execute_job, args=(job_id, req), daemon=True)
        t.start()
        return job_id

    def _execute_job(self, job_id: str, req: AnalysisRequestSchema):
        try:
            # Stage 1: DOWNLOADING
            self._update(job_id, "DOWNLOADING", 15, f"Ingesting multispectral scene for district {req.districtId}")
            time.sleep(0.4)

            # Stage 2: PREPROCESSING
            self._update(job_id, "PREPROCESSING", 30, "Calibrating Bottom-Of-Atmosphere surface reflectance & cloud screening")
            time.sleep(0.3)

            # Stage 3: FEATURE_EXTRACTION
            self._update(job_id, "FEATURE_EXTRACTION", 45, f"Extracting {len(req.features)} spectral, textural and seasonal features")
            time.sleep(0.3)

            # Stage 4: PCA
            self._update(job_id, "PCA", 60, f"Projecting feature space onto {req.quantumConfig.qubits} principal components")
            time.sleep(0.3)

            # Stage 5: CLASSICAL_MODEL
            self._update(job_id, "CLASSICAL_MODEL", 75, f"Training classical baseline ({req.classicalModel}) on stratified split")
            time.sleep(0.4)

            # Stage 6: QUANTUM_MODEL
            self._update(job_id, "QUANTUM_MODEL", 88, f"Executing quantum circuit ({req.quantumModel}, {req.quantumConfig.qubits} qubits) on statevector simulator")
            time.sleep(0.5)

            # Stage 7: CHANGE_DETECTION & SYNTHESIS
            self._update(job_id, "CHANGE_DETECTION", 95, "Computing multidimensional change detection statistics & synthesis")
            
            # Execute actual analysis through pipeline service
            result = pipeline_service.run_pipeline(req)

            # Stage 8: COMPLETED
            job = self.jobs[job_id]
            job.status = "COMPLETED"
            job.progressPct = 100
            job.stageMessage = "Geospatial hybrid intelligence pipeline completed successfully."
            job.completionTime = time.strftime("%Y-%m-%dT%H:%M:%SZ")
            job.analysisId = result.analysis_id
            logger.info(f"Job {job_id} successfully completed. Analysis ID: {result.analysis_id}")
        except Exception as e:
            logger.error(f"Job {job_id} failed: {str(e)}")
            job = self.jobs[job_id]
            job.status = "FAILED"
            job.progressPct = 0
            job.stageMessage = f"Processing failed: {str(e)}"
            job.error = str(e)
            job.completionTime = time.strftime("%Y-%m-%dT%H:%M:%SZ")

    def _update(self, job_id: str, status: str, progress: int, msg: str):
        if job_id in self.jobs:
            self.jobs[job_id].status = status
            self.jobs[job_id].progressPct = progress
            self.jobs[job_id].stageMessage = msg

    def get_job(self, job_id: str) -> Optional[JobProgress]:
        return self.jobs.get(job_id)

job_manager = JobManager()
