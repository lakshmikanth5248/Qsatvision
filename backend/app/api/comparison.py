from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from app.models.analysis import ComparisonRequestSchema
from app.data.demo_districts import get_district_by_id, AP_DISTRICTS_DATA

router = APIRouter(prefix="/compare", tags=["Comparison"])

@router.post("")
def run_comparison(req: ComparisonRequestSchema):
    """
    Executes a structured comparative analysis:
    - Year Comparison (Year A vs Year B)
    - Month Comparison (Month A vs Month B)
    - District Comparison (2–5 AP Districts)
    """
    dist_info = get_district_by_id(req.districtId) or AP_DISTRICTS_DATA[0]

    if req.mode == "district":
        # Compare 2-5 districts
        target_ids = req.targetDistrictIds or [req.districtId, "tirupati", "visakhapatnam"]
        # Limit to 5
        target_ids = target_ids[:5]
        
        districts_data = []
        for d_id in target_ids:
            d = get_district_by_id(d_id)
            if d:
                districts_data.append({
                    "id": d["id"],
                    "name": d["name"],
                    "code": d["code"],
                    "region": d["region"],
                    "areaSqKm": d["areaSqKm"],
                    "metrics": {
                        "ndvi": d["baselineMetrics"]["ndvi"],
                        "ndwi": d["baselineMetrics"]["ndwi"],
                        "ndbi": d["baselineMetrics"]["ndbi"],
                        "agriculturalAreaKm2": d["baselineMetrics"]["agriculturalAreaKm2"],
                        "waterBodyAreaKm2": d["baselineMetrics"]["waterBodyAreaKm2"],
                        "builtUpAreaKm2": d["baselineMetrics"]["builtUpAreaKm2"],
                    }
                })

        return {
            "status": "success",
            "mode": "district",
            "districtsCount": len(districts_data),
            "comparison": districts_data,
            "metric": req.metric,
            "disclaimer": "DEMO DATA — Factual comparative metrics across selected Andhra Pradesh administrative regions."
        }

    elif req.mode == "month":
        # Month comparison (e.g. Kharif vs Rabi)
        month_a = req.monthA or "January"
        month_b = req.monthB or "August"
        
        base_ndvi = float(dist_info["baselineMetrics"]["ndvi"])
        base_ndwi = float(dist_info["baselineMetrics"]["ndwi"])
        
        # Seasonal shifts: August (Monsoon/Kharif) has higher NDVI & NDWI than January (Winter/Rabi)
        ndvi_a = round(base_ndvi * 0.92, 3)
        ndvi_b = round(base_ndvi * 1.15, 3)
        ndwi_a = round(base_ndwi * 0.88, 3)
        ndwi_b = round(base_ndwi * 1.25, 3)

        return {
            "status": "success",
            "mode": "month",
            "district": dist_info["name"],
            "monthA": month_a,
            "monthB": month_b,
            "metrics": {
                "ndvi": {"monthA": ndvi_a, "monthB": ndvi_b, "change": round(ndvi_b - ndvi_a, 3), "pctChange": round(((ndvi_b - ndvi_a) / ndvi_a) * 100, 1)},
                "ndwi": {"monthA": ndwi_a, "monthB": ndwi_b, "change": round(ndwi_b - ndwi_a, 3), "pctChange": round(((ndwi_b - ndwi_a) / ndwi_a) * 100, 1)},
            },
            "disclaimer": "DEMO DATA — Simulated seasonal phenological variation."
        }

    else:
        # Default: Year comparison (Year A vs Year B)
        year_a = req.yearA
        year_b = req.yearB
        
        base_ndvi = float(dist_info["baselineMetrics"]["ndvi"])
        base_ndwi = float(dist_info["baselineMetrics"]["ndwi"])
        base_ndbi = float(dist_info["baselineMetrics"]["ndbi"])
        
        delta_years = year_b - year_a
        ndvi_a = round(base_ndvi + 0.005 * (year_a - 2010), 3)
        ndvi_b = round(base_ndvi + 0.005 * (year_b - 2010) + 0.04, 3)
        ndwi_a = round(base_ndwi - 0.002 * (year_a - 2010), 3)
        ndwi_b = round(base_ndwi - 0.002 * (year_b - 2010) - 0.02, 3)
        ndbi_a = round(base_ndbi + 0.008 * (year_a - 2010), 3)
        ndbi_b = round(base_ndbi + 0.008 * (year_b - 2010) + 0.05, 3)

        return {
            "status": "success",
            "mode": "year",
            "district": dist_info["name"],
            "yearA": year_a,
            "yearB": year_b,
            "metrics": {
                "ndvi": {"yearA": ndvi_a, "yearB": ndvi_b, "delta": round(ndvi_b - ndvi_a, 3), "pctChange": round(((ndvi_b - ndvi_a) / ndvi_a) * 100, 1)},
                "ndwi": {"yearA": ndwi_a, "yearB": ndwi_b, "delta": round(ndwi_b - ndwi_a, 3), "pctChange": round(((ndwi_b - ndwi_a) / ndwi_a) * 100, 1)},
                "ndbi": {"yearA": ndbi_a, "yearB": ndbi_b, "delta": round(ndbi_b - ndbi_a, 3), "pctChange": round(((ndbi_b - ndbi_a) / ndbi_a) * 100, 1)},
            },
            "landCoverChangeSummary": [
                {"category": "Dense Vegetation / Crops", "yearA": "61.2%", "yearB": "67.8%", "change": "+6.6%"},
                {"category": "Surface Water Bodies", "yearA": "18.5%", "yearB": "16.1%", "change": "-2.4%"},
                {"category": "Urban Built-Up Area", "yearA": "9.8%", "yearB": "14.5%", "change": "+4.7%"},
                {"category": "Barren / Fallow Land", "yearA": "10.5%", "yearB": "1.6%", "change": "-8.9%"}
            ],
            "disclaimer": "DEMO DATA — Synchronized multi-temporal comparison."
        }
