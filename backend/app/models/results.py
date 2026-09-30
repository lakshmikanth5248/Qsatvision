from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class PreprocessingMetadata(BaseModel):
    cloudMaskingApplied: bool = True
    cloudCoverThresholdPct: float = 10.0
    normalizationMethod: str = "Min-Max Standard Scaling [0, 1]"
    missingValuesHandled: str = "Spatial-temporal nearest interpolation"
    gridAlignment: str = "EPSG:4326 (WGS 84) 10m Ground Sample Distance"
    sampleCount: int = 400

class FeatureMetadata(BaseModel):
    extractedFeatures: List[str]
    totalFeatureDimensions: int
    spectralBandsUsed: List[str]
    spectralIndicesFormulas: Dict[str, str] = {
        "ndvi": "(NIR - Red) / (NIR + Red)",
        "ndwi": "(NIR - SWIR) / (NIR + SWIR)",
        "ndbi": "(SWIR - NIR) / (SWIR + NIR)"
    }
    featureMeans: Dict[str, float]
    featureStdDevs: Dict[str, float]

class DimensionalityReductionMetadata(BaseModel):
    method: str = "Principal Component Analysis (scikit-learn)"
    originalDimensions: int
    reducedDimensions: int
    explainedVarianceRatio: List[float]
    totalExplainedVariancePct: float

class EvaluationMetrics(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1Score: float
    confusionMatrix: List[List[int]]
    trainingTimeSec: float
    inferenceTimeMs: float
    testSamplesCount: int

class QuantumCircuitMetadata(BaseModel):
    qubits: int
    encodingMethod: str
    ansatz: str
    circuitDepth: int
    trainableParametersCount: int
    shots: int
    backend: str
    circuitAsciiDiagram: str

class AreaChangeItem(BaseModel):
    category: str
    startValue: float
    endValue: float
    pctChange: float

class TemporalTrendPoint(BaseModel):
    year: int
    ndvi: float
    ndwi: float
    ndbi: float
    detectedChangeAreaKm2: float

class ClassificationCategory(BaseModel):
    category: str
    coveragePct: float
    areaKm2: float
    color: str
    isDemoData: bool = False

class ChangeCategory(BaseModel):
    category: str
    direction: str # Increase, Decrease, Stable
    pctChange: float
    deltaKm2: float
    color: str
    isDemoData: bool = False

class StructuredAnalysisResult(BaseModel):
    analysis_id: str
    status: str # completed, failed
    timestamp: str
    data_mode: str # DEMO or REAL
    reproducibility: Dict[str, Any]
    configuration: Dict[str, Any]
    preprocessing: PreprocessingMetadata
    features: FeatureMetadata
    dimensionality_reduction: DimensionalityReductionMetadata
    classical_result: EvaluationMetrics
    quantum_result: EvaluationMetrics
    quantum_circuit: QuantumCircuitMetadata
    comparison: Dict[str, Any]
    classification_breakdown: List[ClassificationCategory]
    change_breakdown: List[ChangeCategory]
    area_change_stats: List[AreaChangeItem]
    temporal_trend: List[TemporalTrendPoint]
    key_findings: List[str]
    scientific_disclaimer: str = (
        "Experimental comparative research platform. QML metrics are measured empirically "
        "on statevector/circuit simulation and evaluated alongside classical ML baselines "
        "without claiming unproven quantum advantage."
    )
