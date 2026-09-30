from pydantic import BaseModel, Field
from typing import List, Optional, Union, Dict, Any

class QuantumConfigSchema(BaseModel):
    qubits: int = Field(default=4, ge=2, le=8, description="Number of qubits in register")
    circuitDepth: int = Field(default=2, ge=1, le=10, description="Parameterized circuit depth")
    encodingMethod: str = Field(default="ZZ Feature Map", description="Quantum feature encoding scheme")
    ansatz: str = Field(default="RealAmplitudes", description="Variational ansatz architecture")
    shots: int = Field(default=1024, ge=100, le=8192, description="Measurement shots")
    optimizer: str = Field(default="COBYLA", description="Classical optimizer")
    backend: str = Field(default="qasm_simulator", description="Quantum simulator backend")

class AnalysisRequestSchema(BaseModel):
    districtId: str = Field(..., description="Target Andhra Pradesh district identifier")
    selectedArea: Optional[str] = Field(default="District Boundary", description="Area of interest")
    startYear: int = Field(default=2018, ge=2010, le=2026)
    endYear: int = Field(default=2026, ge=2010, le=2026)
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    selectedMonth: Optional[Union[int, str]] = "all"
    domain: str = Field(default="agriculture", description="Application domain (agriculture, water, urban, disaster)")
    satellite: str = Field(default="sentinel-2", description="Satellite constellation")
    features: List[str] = Field(default=["ndvi", "spectral", "texture", "temporal"])
    classicalModel: str = Field(default="random_forest", description="Classical baseline (random_forest, svm)")
    quantumModel: str = Field(default="vqc", description="Quantum model (vqc, quantum_kernel)")
    quantumConfig: QuantumConfigSchema = Field(default_factory=QuantumConfigSchema)
    dataMode: str = Field(default="REAL", description="Execution mode: DEMO or REAL")

class ComparisonRequestSchema(BaseModel):
    mode: str = Field(default="year", description="Comparison mode: year, month, or district")
    districtId: str
    targetDistrictIds: Optional[List[str]] = None
    yearA: int = 2015
    yearB: int = 2026
    monthA: Optional[str] = None
    monthB: Optional[str] = None
    domain: str = "agriculture"
    metric: str = "ndvi"
    satellite: str = "sentinel-2"

class QMLRunRequestSchema(BaseModel):
    qubits: int = 4
    circuitDepth: int = 2
    encodingMethod: str = "ZZ Feature Map"
    ansatz: str = "RealAmplitudes"
    modelType: str = "vqc" # or quantum_kernel
    shots: int = 1024
    featuresSample: Optional[List[List[float]]] = None
    labelsSample: Optional[List[int]] = None
