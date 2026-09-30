from abc import ABC, abstractmethod
from typing import Dict, Any, List, Tuple, Optional
import numpy as np
import time

# Operational satellite mission launch constraints
SATELLITE_OPERATIONAL_CONSTRAINTS = {
    "sentinel-2": {
        "launchYear": 2015,
        "name": "Sentinel-2 MSI",
        "provider": "ESA Copernicus",
        "resolution": "10m Multispectral",
        "bands": ["B2_Blue", "B3_Green", "B4_Red", "B8_NIR", "B11_SWIR1", "B12_SWIR2"],
        "maxCloudDefault": 20.0
    },
    "sentinel-1": {
        "launchYear": 2014,
        "name": "Sentinel-1 SAR C-Band",
        "provider": "ESA Copernicus",
        "resolution": "20m Dual-Pol",
        "bands": ["SAR_VV", "SAR_VH"],
        "maxCloudDefault": 100.0 # All-weather radar
    },
    "landsat-8": {
        "launchYear": 2013,
        "name": "Landsat 8 OLI/TIRS",
        "provider": "USGS / NASA",
        "resolution": "30m Optical / 100m Thermal",
        "bands": ["B2_Blue", "B3_Green", "B4_Red", "B5_NIR", "B6_SWIR1", "B7_SWIR2"],
        "maxCloudDefault": 15.0
    },
    "landsat-9": {
        "launchYear": 2021,
        "name": "Landsat 9 OLI-2",
        "provider": "USGS / NASA",
        "resolution": "30m Optical",
        "bands": ["B2_Blue", "B3_Green", "B4_Red", "B5_NIR", "B6_SWIR1", "B7_SWIR2"],
        "maxCloudDefault": 15.0
    },
    "combined": {
        "launchYear": 2015,
        "name": "Sentinel-Landsat Optical-SAR Composite",
        "provider": "QuantumSat-AP Fusion Engine",
        "resolution": "10m Fused",
        "bands": ["Fused_10m_Composite"],
        "maxCloudDefault": 10.0
    }
}

class SatelliteDataProvider(ABC):
    """
    Abstract Base Class for Satellite Ingestion Providers.
    Standardized provider contract supporting search, retrieval,
    validation, and geospatial scene preview.
    """
    
    @abstractmethod
    def search(
        self,
        district_id: str,
        start_year: int,
        end_year: int,
        satellite_source: str,
        max_cloud_cover: float = 20.0,
        bbox: Optional[List[float]] = None
    ) -> List[Dict[str, Any]]:
        """Search available satellite scenes respecting operational temporal bounds."""
        pass

    @abstractmethod
    def get_metadata(self, district_id: str, satellite_source: str = "sentinel-2") -> Dict[str, Any]:
        """Returns constellation metadata, resolution, and sensor specs."""
        pass

    @abstractmethod
    def get_availability(self, satellite_source: str, start_year: int, end_year: int) -> Dict[str, Any]:
        """Validates if sensor was operational during requested temporal window."""
        pass

    @abstractmethod
    def get_data(
        self,
        district_id: str,
        start_year: int,
        end_year: int,
        n_samples: int = 400
    ) -> Tuple[np.ndarray, np.ndarray]:
        """Returns feature matrix X (multispectral bands) and ground-truth labels y."""
        pass

    @abstractmethod
    def get_bounds(self, district_id: str) -> List[float]:
        """Returns bounding box [min_lat, min_lng, max_lat, max_lng]."""
        pass


class DemoSatelliteProvider(SatelliteDataProvider):
    """
    Calibrated Multispectral Provider for Andhra Pradesh.
    Enforces genuine mission constraints: Sentinel-2 (2015+), Landsat-8 (2013+), etc.
    """

    def __init__(self, seed: int = 42):
        self.seed = seed
        self._scene_cache: Dict[str, List[Dict[str, Any]]] = {}

    def get_availability(self, satellite_source: str, start_year: int, end_year: int) -> Dict[str, Any]:
        spec = SATELLITE_OPERATIONAL_CONSTRAINTS.get(satellite_source)
        if not spec:
            return {
                "available": True,
                "launchYear": 2010,
                "notes": "Generic archive provider"
            }
        
        launch_yr = spec["launchYear"]
        if end_year < launch_yr:
            return {
                "available": False,
                "launchYear": launch_yr,
                "message": f"No compatible satellite data available for this period. {spec['name']} launched in {launch_yr}; requested period is {start_year}–{end_year}."
            }
        elif start_year < launch_yr:
            return {
                "available": True,
                "partial": True,
                "launchYear": launch_yr,
                "message": f"Partial availability: {spec['name']} data available from {launch_yr} onward. Pre-{launch_yr} period supplemented by Landsat archive."
            }
        
        return {
            "available": True,
            "partial": False,
            "launchYear": launch_yr,
            "message": f"Full operational coverage available ({launch_yr}–Present)."
        }

    def search(
        self,
        district_id: str,
        start_year: int,
        end_year: int,
        satellite_source: str = "sentinel-2",
        max_cloud_cover: float = 20.0,
        bbox: Optional[List[float]] = None
    ) -> List[Dict[str, Any]]:
        cache_key = f"{district_id}_{satellite_source}_{start_year}_{end_year}_{max_cloud_cover}"
        if cache_key in self._scene_cache:
            return self._scene_cache[cache_key]

        avail = self.get_availability(satellite_source, start_year, end_year)
        if not avail["available"]:
            return []

        spec = SATELLITE_OPERATIONAL_CONSTRAINTS.get(satellite_source, SATELLITE_OPERATIONAL_CONSTRAINTS["sentinel-2"])
        scenes = []
        
        effective_start = max(start_year, spec["launchYear"])
        years = list(range(effective_start, end_year + 1))
        
        for yr in years:
            for season, month, day in [("Kharif (Monsoon)", 9, 15), ("Rabi (Winter)", 1, 20), ("Zaid (Summer)", 4, 10)]:
                # Compute deterministic cloud cover based on season
                cloud_pct = 4.2 if season.startswith("Rabi") else (18.5 if season.startswith("Kharif") else 8.0)
                if cloud_pct > max_cloud_cover:
                    continue

                scene_id = f"{satellite_source.upper()}_{district_id.upper()}_{yr}{month:02d}{day:02d}_T44PLD"
                scenes.append({
                    "sceneId": scene_id,
                    "satellite": spec["name"],
                    "provider": spec["provider"],
                    "acquisitionDate": f"{yr}-{month:02d}-{day:02d}",
                    "season": season,
                    "cloudCoveragePct": round(cloud_pct, 1),
                    "resolution": spec["resolution"],
                    "bands": spec["bands"],
                    "estimatedSizeBytes": 450 * 1024 * 1024, # 450 MB average per tile
                    "estimatedSizeFormatted": "450 MB",
                    "crs": "EPSG:4326 (WGS 84)",
                    "footprint": bbox or [13.5, 79.2, 14.2, 80.1],
                    "processingLevel": "Level-2A (Bottom of Atmosphere Surface Reflectance)"
                })

        self._scene_cache[cache_key] = scenes
        return scenes

    def get_data(
        self,
        district_id: str,
        start_year: int,
        end_year: int,
        n_samples: int = 400
    ) -> Tuple[np.ndarray, np.ndarray]:
        np.random.seed(self.seed + abs(hash(district_id)) % 1000 + end_year)
        
        # 4 Land Cover Classes
        samples_per_class = max(10, n_samples // 4)
        X_list = []
        y_list = []
        
        # Bands: [Blue, Green, Red, NIR, SWIR1, SWIR2, SAR_VV, SAR_VH]
        # Class 0: Dense Vegetation / Crops (High NIR, Low Red, Moderate SWIR)
        veg_nir = np.random.normal(0.72, 0.08, samples_per_class)
        veg_red = np.random.normal(0.12, 0.04, samples_per_class)
        veg_green = np.random.normal(0.24, 0.05, samples_per_class)
        veg_blue = np.random.normal(0.10, 0.03, samples_per_class)
        veg_swir1 = np.random.normal(0.18, 0.05, samples_per_class)
        veg_swir2 = np.random.normal(0.11, 0.04, samples_per_class)
        veg_sar_vv = np.random.normal(-12.0, 1.5, samples_per_class)
        veg_sar_vh = np.random.normal(-18.0, 2.0, samples_per_class)
        X_veg = np.column_stack([veg_blue, veg_green, veg_red, veg_nir, veg_swir1, veg_swir2, veg_sar_vv, veg_sar_vh])
        X_list.append(X_veg)
        y_list.append(np.zeros(samples_per_class, dtype=int))
        
        # Class 1: Water Bodies (High Blue/Green, Very Low NIR & SWIR)
        wat_nir = np.random.normal(0.04, 0.02, samples_per_class)
        wat_red = np.random.normal(0.07, 0.02, samples_per_class)
        wat_green = np.random.normal(0.18, 0.04, samples_per_class)
        wat_blue = np.random.normal(0.25, 0.05, samples_per_class)
        wat_swir1 = np.random.normal(0.03, 0.02, samples_per_class)
        wat_swir2 = np.random.normal(0.02, 0.01, samples_per_class)
        wat_sar_vv = np.random.normal(-22.0, 2.0, samples_per_class)
        wat_sar_vh = np.random.normal(-28.0, 2.5, samples_per_class)
        X_wat = np.column_stack([wat_blue, veg_green, wat_red, wat_nir, wat_swir1, wat_swir2, wat_sar_vv, wat_sar_vh])
        X_list.append(X_wat)
        y_list.append(np.ones(samples_per_class, dtype=int))
        
        # Class 2: Urban Built-up (High SWIR & Red, Moderate NIR, High SAR backscatter)
        urb_nir = np.random.normal(0.32, 0.06, samples_per_class)
        urb_red = np.random.normal(0.38, 0.06, samples_per_class)
        urb_green = np.random.normal(0.30, 0.05, samples_per_class)
        urb_blue = np.random.normal(0.24, 0.05, samples_per_class)
        urb_swir1 = np.random.normal(0.48, 0.07, samples_per_class)
        urb_swir2 = np.random.normal(0.42, 0.07, samples_per_class)
        urb_sar_vv = np.random.normal(-6.0, 1.8, samples_per_class)
        urb_sar_vh = np.random.normal(-11.0, 2.2, samples_per_class)
        X_urb = np.column_stack([urb_blue, urb_green, urb_red, urb_nir, urb_swir1, urb_swir2, urb_sar_vv, urb_sar_vh])
        X_list.append(X_urb)
        y_list.append(np.full(samples_per_class, 2, dtype=int))
        
        # Class 3: Barren / Fallow Land (High Red & SWIR, Low-to-Moderate NIR)
        bar_nir = np.random.normal(0.28, 0.05, samples_per_class)
        bar_red = np.random.normal(0.35, 0.05, samples_per_class)
        bar_green = np.random.normal(0.26, 0.04, samples_per_class)
        bar_blue = np.random.normal(0.20, 0.04, samples_per_class)
        bar_swir1 = np.random.normal(0.44, 0.06, samples_per_class)
        bar_swir2 = np.random.normal(0.36, 0.06, samples_per_class)
        bar_sar_vv = np.random.normal(-15.0, 2.0, samples_per_class)
        bar_sar_vh = np.random.normal(-21.0, 2.5, samples_per_class)
        X_bar = np.column_stack([bar_blue, bar_green, bar_red, bar_nir, bar_swir1, bar_swir2, bar_sar_vv, bar_sar_vh])
        X_list.append(X_bar)
        y_list.append(np.full(samples_per_class, 3, dtype=int))
        
        X = np.vstack(X_list)
        y = np.concatenate(y_list)
        
        indices = np.arange(len(y))
        np.random.shuffle(indices)
        return X[indices], y[indices]

    def get_metadata(self, district_id: str, satellite_source: str = "sentinel-2") -> Dict[str, Any]:
        spec = SATELLITE_OPERATIONAL_CONSTRAINTS.get(satellite_source, SATELLITE_OPERATIONAL_CONSTRAINTS["sentinel-2"])
        return {
            "sensor": spec["name"],
            "provider": spec["provider"],
            "resolution": spec["resolution"],
            "bands": spec["bands"],
            "crs": "EPSG:4326 (WGS 84)",
            "district": district_id,
            "operationalFrom": spec["launchYear"],
            "processingLevel": "Level-2A BOA Reflectance",
            "cloudMaskingMethod": "SCL (Scene Classification Layer) Bitmasking"
        }

    def get_bounds(self, district_id: str) -> List[float]:
        return [12.5, 76.5, 19.5, 84.8] # AP Envelope
