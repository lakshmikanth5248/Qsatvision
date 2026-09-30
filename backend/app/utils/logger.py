import logging
import sys
import time
from typing import Optional

# Configure structured logging for QuantumSat-AP
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [%(name)s] %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger("QuantumSat-AP")

def log_stage_execution(stage_name: str, duration_sec: float, status: str = "SUCCESS", details: Optional[str] = None):
    """Structured logging helper for analysis pipeline stages."""
    msg = f"Stage: {stage_name} | Status: {status} | Duration: {duration_sec:.3f}s"
    if details:
        msg += f" | {details}"
    logger.info(msg)
