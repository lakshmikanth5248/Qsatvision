from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import time

from app.config import settings
from app.utils.logger import logger
from app.api.health import router as health_router
from app.api.districts import router as districts_router
from app.api.satellite import router as satellite_router
from app.api.analysis import router as analysis_router
from app.api.results import router as results_router
from app.api.comparison import router as comparison_router
from app.api.qml import router as qml_router
from app.api.benchmark import router as benchmark_router
from app.api.reports import router as reports_router
from app.api.jobs import router as jobs_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Hybrid Classical–Quantum Satellite Intelligence Platform for Andhra Pradesh (2010–Present)",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler (Part 21 - Structured Error Responses)
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception during {request.method} {request.url}: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "code": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected error occurred during analysis processing. Please try again or check parameters."
        }
    )

# Include API Routers under /api
app.include_router(health_router, prefix="/api")
app.include_router(districts_router, prefix="/api")
app.include_router(satellite_router, prefix="/api")
app.include_router(analysis_router, prefix="/api")
app.include_router(results_router, prefix="/api")
app.include_router(comparison_router, prefix="/api")
app.include_router(qml_router, prefix="/api")
app.include_router(benchmark_router, prefix="/api")
app.include_router(reports_router, prefix="/api")
app.include_router(jobs_router, prefix="/api")

@app.get("/")
def root_status():
    return {
        "title": "QuantumSat-AP REST API 🛰️",
        "description": "Exploration of Andhra Pradesh Through Time (2010–Present)",
        "status": "Operational",
        "version": settings.VERSION,
        "quantum_engine": "Qiskit 2.5 Statevector Simulator Engine",
        "docs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
