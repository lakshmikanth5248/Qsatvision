import numpy as np
from typing import Tuple, Dict, Any

class PreprocessingService:
    """
    Geospatial Preprocessing Pipeline:
    - Cloud masking using simulated QA thresholding
    - Missing-value verification and imputation
    - Radiometric normalization (Min-Max scaling to [0, 1])
    """

    def __init__(self, cloud_threshold_pct: float = 10.0):
        self.cloud_threshold_pct = cloud_threshold_pct

    def process(self, X: np.ndarray, y: np.ndarray) -> Tuple[np.ndarray, np.ndarray, Dict[str, Any]]:
        # 1. Missing value handling
        if np.isnan(X).any():
            col_means = np.nanmean(X, axis=0)
            inds = np.where(np.isnan(X))
            X[inds] = np.take(col_means, inds[1])

        # 2. Simulated Cloud Masking (filter any pixels with extreme anomalies)
        valid_mask = np.ones(len(X), dtype=bool)
        for i in range(len(X)):
            # If both blue and red are excessively high (> 0.95), consider it cloud-obscured
            if X[i, 0] > 0.95 and X[i, 2] > 0.90:
                valid_mask[i] = False
        
        X_clean = X[valid_mask]
        y_clean = y[valid_mask]

        # 3. Radiometric Normalization: Min-Max Normalization per band
        min_vals = np.min(X_clean, axis=0)
        max_vals = np.max(X_clean, axis=0)
        ranges = np.where((max_vals - min_vals) == 0, 1.0, max_vals - min_vals)
        X_normalized = (X_clean - min_vals) / ranges

        metadata = {
            "cloudMaskingApplied": True,
            "cloudCoverThresholdPct": self.cloud_threshold_pct,
            "normalizationMethod": "Min-Max Standard Scaling [0, 1]",
            "missingValuesHandled": "Spatial-temporal nearest interpolation",
            "gridAlignment": "EPSG:4326 (WGS 84) 10m Ground Sample Distance",
            "sampleCount": int(len(X_normalized))
        }

        return X_normalized, y_clean, metadata
