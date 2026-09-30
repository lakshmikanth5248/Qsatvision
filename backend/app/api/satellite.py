from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

from app.services.data_provider import DemoSatelliteProvider, SATELLITE_OPERATIONAL_CONSTRAINTS

router = APIRouter(tags=["Satellite"])
provider = DemoSatelliteProvider()

class SceneSearchRequest(BaseModel):
    districtId: str = Field(default="visakhapatnam")
    satelliteSource: str = Field(default="sentinel-2")
    startYear: int = Field(default=2020, ge=2010, le=2026)
    endYear: int = Field(default=2026, ge=2010, le=2026)
    maxCloudCover: float = Field(default=20.0, ge=0.0, le=100.0)
    bbox: Optional[List[float]] = Field(default=None)

class SpectralIndexRequest(BaseModel):
    sensor: str = Field(default="sentinel-2")
    nir: float
    red: float
    swir: Optional[float] = None

@router.get("/satellite-data")
def get_satellite_sources():
    """Retrieve metadata on available Earth observation satellite constellations."""
    return {
        "status": "success",
        "sources": [
            {
                "id": "sentinel-2",
                "name": "Sentinel-2 MSI",
                "provider": "ESA Copernicus",
                "resolution": "10m Multispectral",
                "availableYears": [2015, 2026],
                "cloudCoverAvg": "< 10%",
                "status": "Operational",
                "operationalFrom": 2015,
                "bands": ["B2_Blue", "B3_Green", "B4_Red", "B8_NIR", "B11_SWIR1", "B12_SWIR2"]
            },
            {
                "id": "landsat-8",
                "name": "Landsat 8 OLI / TIRS",
                "provider": "USGS / NASA",
                "resolution": "30m Optical / 100m Thermal",
                "availableYears": [2013, 2026],
                "cloudCoverAvg": "< 12%",
                "status": "Operational",
                "operationalFrom": 2013,
                "bands": ["B2_Blue", "B3_Green", "B4_Red", "B5_NIR", "B6_SWIR1", "B7_SWIR2"]
            },
            {
                "id": "landsat-9",
                "name": "Landsat 9 OLI-2",
                "provider": "USGS / NASA",
                "resolution": "30m Optical",
                "availableYears": [2021, 2026],
                "cloudCoverAvg": "< 8%",
                "status": "Operational",
                "operationalFrom": 2021,
                "bands": ["B2_Blue", "B3_Green", "B4_Red", "B5_NIR", "B6_SWIR1", "B7_SWIR2"]
            },
            {
                "id": "sentinel-1",
                "name": "Sentinel-1 SAR C-Band",
                "provider": "ESA Copernicus",
                "resolution": "20m SAR Dual-Pol (VV+VH)",
                "availableYears": [2014, 2026],
                "cloudCoverAvg": "0% (All-Weather Radar)",
                "status": "Operational",
                "operationalFrom": 2014,
                "bands": ["SAR_VV", "SAR_VH"]
            },
            {
                "id": "combined",
                "name": "Sentinel-Landsat Optical-SAR Fusion",
                "provider": "QuantumSat-AP Fusion Engine",
                "resolution": "10m Fused Optical-Radar",
                "availableYears": [2015, 2026],
                "cloudCoverAvg": "< 5%",
                "status": "Available",
                "operationalFrom": 2015,
                "bands": ["Fused_10m_Composite"]
            }
        ]
    }

@router.get("/satellite/availability")
def check_satellite_availability(satellite: str, startYear: int, endYear: int):
    """
    Validates operational timeline constraints for selected Earth observation sensor.
    Ensures that historical imagery is never claimed prior to satellite deployment.
    """
    return provider.get_availability(satellite, startYear, endYear)

@router.post("/satellite/search")
def search_satellite_scenes(req: SceneSearchRequest):
    """
    Searches compatible Earth observation scenes for Andhra Pradesh district or AOI.
    Enforces satellite operational lifetime constraints and cloud cover thresholds.
    """
    avail = provider.get_availability(req.satelliteSource, req.startYear, req.endYear)
    if not avail["available"]:
        return {
            "status": "unavailable",
            "message": avail.get("message", "No compatible satellite data available for this period."),
            "scenes": [],
            "count": 0
        }

    scenes = provider.search(
        district_id=req.districtId,
        start_year=req.startYear,
        end_year=req.endYear,
        satellite_source=req.satelliteSource,
        max_cloud_cover=req.maxCloudCover,
        bbox=req.bbox
    )

    return {
        "status": "success",
        "districtId": req.districtId,
        "satellite": req.satelliteSource,
        "count": len(scenes),
        "scenes": scenes,
        "operationalNote": avail.get("message")
    }

@router.post("/satellite/indices")
def calculate_spectral_indices(req: SpectralIndexRequest):
    """
    Calculates verified geophysical spectral indices:
    - NDVI: (NIR - RED) / (NIR + RED)
    - NDWI: (NIR - SWIR) / (NIR + SWIR)
    - NDBI: (SWIR - NIR) / (SWIR + NIR)
    Protected against division by zero and nodata anomalies.
    """
    denom_ndvi = req.nir + req.red
    ndvi = (req.nir - req.red) / denom_ndvi if abs(denom_ndvi) > 1e-6 else 0.0

    ndwi = None
    ndbi = None
    if req.swir is not None:
        denom_ndwi = req.nir + req.swir
        ndwi = (req.nir - req.swir) / denom_ndwi if abs(denom_ndwi) > 1e-6 else 0.0

        denom_ndbi = req.swir + req.nir
        ndbi = (req.swir - req.nir) / denom_ndbi if abs(denom_ndbi) > 1e-6 else 0.0

    return {
        "status": "success",
        "sensor": req.sensor,
        "indices": {
            "ndvi": round(float(ndvi), 4),
            "ndwi": round(float(ndwi), 4) if ndwi is not None else None,
            "ndbi": round(float(ndbi), 4) if ndbi is not None else None
        },
        "interpretation": {
            "vegetationSignal": "High" if ndvi > 0.4 else ("Moderate" if ndvi > 0.2 else "Low / Barren"),
            "waterSignal": "Positive Water Body" if (ndwi is not None and ndwi > 0.0) else "Dry / Terrestrial"
        }
    }

@router.get("/timeline")
def get_timeline_metadata():
    """Retrieve temporal range metadata for Andhra Pradesh satellite archives."""
    return {
        "status": "success",
        "archiveStartYear": 2010,
        "archiveEndYear": 2026,
        "currentYear": 2026,
        "availableYears": list(range(2010, 2027)),
        "seasonalMonths": [
            {"id": "kharif", "name": "Kharif Season (Monsoon: Jun–Oct)", "months": [6, 7, 8, 9, 10]},
            {"id": "rabi", "name": "Rabi Season (Winter: Nov–Mar)", "months": [11, 12, 1, 2, 3]},
            {"id": "zaid", "name": "Zaid Season (Summer: Apr–May)", "months": [4, 5]}
        ],
        "allMonths": [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ]
    }
