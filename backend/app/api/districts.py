from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.data.demo_districts import AP_DISTRICTS_DATA, get_district_by_id

router = APIRouter(prefix="/districts", tags=["Districts"])

@router.get("")
def list_districts():
    """List all 26 mapped districts of Andhra Pradesh with baseline environmental metrics."""
    return {
        "status": "success",
        "count": len(AP_DISTRICTS_DATA),
        "districts": AP_DISTRICTS_DATA
    }

@router.get("/{district_id}")
def get_district(district_id: str):
    """Retrieve details and environmental indices for a specific district."""
    dist = get_district_by_id(district_id)
    if not dist:
        raise HTTPException(
            status_code=404, 
            detail={
                "status": "error",
                "code": "DISTRICT_NOT_FOUND",
                "message": f"District identifier '{district_id}' was not found in Andhra Pradesh database."
            }
        )
    return {
        "status": "success",
        "district": dist
    }
