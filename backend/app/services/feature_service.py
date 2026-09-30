import numpy as np
from typing import Tuple, Dict, Any, List
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

class FeatureService:
    """
    Feature Extraction and Dimensionality Reduction:
    - Calculates spectral ratios with safe epsilon to prevent division by zero
    - Computes GLCM-like texture and spatial variance features
    - Applies Principal Component Analysis (PCA) to project onto NISQ qubit dimensions (e.g. 4)
    """

    def __init__(self, eps: float = 1e-7):
        self.eps = eps

    def extract_features(self, X: np.ndarray, requested_features: List[str]) -> Tuple[np.ndarray, Dict[str, Any]]:
        # Bands: [0: Blue, 1: Green, 2: Red, 3: NIR, 4: SWIR1, 5: SWIR2, 6: SAR_VV, 7: SAR_VH]
        blue = X[:, 0]
        green = X[:, 1]
        red = X[:, 2]
        nir = X[:, 3]
        swir1 = X[:, 4]
        swir2 = X[:, 5]
        sar_vv = X[:, 6]
        sar_vh = X[:, 7]

        feature_cols = []
        feature_names = []

        # 1. Base Spectral Bands
        if "spectral" in requested_features or len(feature_cols) == 0:
            feature_cols.extend([blue, green, red, nir, swir1, swir2, sar_vv, sar_vh])
            feature_names.extend(["Blue", "Green", "Red", "NIR", "SWIR1", "SWIR2", "SAR_VV", "SAR_VH"])

        # 2. NDVI: (NIR - Red) / (NIR + Red)
        if "ndvi" in requested_features:
            ndvi = (nir - red) / (nir + red + self.eps)
            feature_cols.append(ndvi)
            feature_names.append("NDVI")

        # 3. NDWI: (NIR - SWIR1) / (NIR + SWIR1)
        if "ndwi" in requested_features:
            ndwi = (nir - swir1) / (nir + swir1 + self.eps)
            feature_cols.append(ndwi)
            feature_names.append("NDWI")

        # 4. NDBI: (SWIR1 - NIR) / (SWIR1 + NIR)
        if "ndbi" in requested_features:
            ndbi = (swir1 - nir) / (swir1 + nir + self.eps)
            feature_cols.append(ndbi)
            feature_names.append("NDBI")

        # 5. Texture features: local variance simulation
        if "texture" in requested_features:
            texture_var = np.abs(nir - np.roll(nir, 1))
            texture_contrast = np.abs(sar_vv - sar_vh)
            feature_cols.extend([texture_var, texture_contrast])
            feature_names.extend(["Texture_NIR_Var", "Texture_SAR_Contrast"])

        # 6. Temporal features: simulated seasonal gradient
        if "temporal" in requested_features:
            temporal_grad = (nir - red) * 0.15
            feature_cols.append(temporal_grad)
            feature_names.append("Temporal_Seasonal_Delta")

        feature_matrix = np.column_stack(feature_cols)

        # Compute summary stats
        means = {name: float(np.mean(feature_matrix[:, i])) for i, name in enumerate(feature_names)}
        stds = {name: float(np.std(feature_matrix[:, i])) for i, name in enumerate(feature_names)}

        metadata = {
            "extractedFeatures": feature_names,
            "totalFeatureDimensions": int(feature_matrix.shape[1]),
            "spectralBandsUsed": ["B2", "B3", "B4", "B8", "B11", "B12", "SAR-VV", "SAR-VH"],
            "featureMeans": means,
            "featureStdDevs": stds
        }

        return feature_matrix, metadata

    def reduce_dimensions(self, X: np.ndarray, target_components: int = 4) -> Tuple[np.ndarray, Dict[str, Any], PCA]:
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        n_comp = min(target_components, X.shape[1])
        pca = PCA(n_components=n_comp, random_state=42)
        X_reduced = pca.fit_transform(X_scaled)

        explained_var = [float(v) for v in pca.explained_variance_ratio_]
        total_explained_pct = float(np.sum(explained_var) * 100.0)

        metadata = {
            "method": "Principal Component Analysis (scikit-learn)",
            "originalDimensions": int(X.shape[1]),
            "reducedDimensions": int(n_comp),
            "explainedVarianceRatio": explained_var,
            "totalExplainedVariancePct": round(total_explained_pct, 2)
        }

        return X_reduced, metadata, pca
