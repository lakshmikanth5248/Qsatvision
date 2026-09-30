from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class BenchmarkRequestSchema(BaseModel):
    districtId: str = Field(default="visakhapatnam", description="District identifier for evaluation")
    startYear: int = Field(default=2020, ge=2010, le=2026)
    endYear: int = Field(default=2026, ge=2010, le=2026)
    models: List[str] = Field(
        default=["random_forest", "svm", "vqc", "quantum_kernel"],
        description="List of classical and quantum models to benchmark"
    )
    features: List[str] = Field(
        default=["ndvi", "ndwi", "ndbi", "texture", "temporal", "spectral"],
        description="Feature types to extract"
    )
    qubits: int = Field(default=4, ge=2, le=6)
    circuitDepth: int = Field(default=2, ge=1, le=4)
    encodingMethod: str = Field(default="ZZ Feature Map")
    ansatz: str = Field(default="RealAmplitudes")
    shots: int = Field(default=1024, ge=256, le=4096)
    dataMode: str = Field(default="DEMO")
    sampleSize: int = Field(default=200, ge=60, le=600)

class PerClassMetric(BaseModel):
    className: str
    precision: float
    recall: float
    f1Score: float
    support: int

class ModelBenchmarkResult(BaseModel):
    modelId: str
    modelName: str
    modelType: str # "classical" | "quantum"
    accuracy: float
    precision: float
    recall: float
    f1Score: float
    trainingTimeSec: float
    inferenceTimeMs: float
    featuresCount: int
    trainableParametersCount: int
    qubits: Optional[int] = None
    circuitDepth: Optional[int] = None
    shots: Optional[int] = None
    backend: str
    memoryUsageMb: float
    perClassMetrics: List[PerClassMetric]
    confusionMatrix: List[List[int]]
    classesPresent: List[str]

class FeatureImportanceItem(BaseModel):
    feature: str
    importance: float

class QuantumKernelSample(BaseModel):
    matrix: List[List[float]]
    dimension: int
    samplesCount: int
    backend: str
    encoding: str

class PCAScreeItem(BaseModel):
    component: int
    explainedVarianceRatio: float
    cumulativeExplainedVariance: float

class FullBenchmarkResponse(BaseModel):
    benchmarkId: str
    timestamp: str
    district: str
    districtName: str
    sampleSize: int
    featuresUsed: List[str]
    models: List[ModelBenchmarkResult]
    featureImportances: List[FeatureImportanceItem]
    quantumKernelSample: Optional[QuantumKernelSample] = None
    pcaScreeData: List[PCAScreeItem]
    scientificRule: str = "Measured Results: Models are evaluated empirically without automatic winner ranking or unverified claims of quantum advantage."
