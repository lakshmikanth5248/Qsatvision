export type ApplicationDomain = 'agriculture' | 'water' | 'urban' | 'disaster';

export type SatelliteSource = 'landsat-8' | 'landsat-9' | 'sentinel-2' | 'sentinel-1' | 'combined';

export type FeatureType = 
  | 'spectral' 
  | 'ndvi' 
  | 'ndwi' 
  | 'ndbi' 
  | 'texture' 
  | 'temporal' 
  | 'land_cover';

export type ClassicalModel = 'random_forest' | 'svm' | 'xgboost';

export type QuantumModel = 'vqc' | 'quantum_kernel' | 'qnn';

export type AnalysisStatus = 
  | 'IDLE' 
  | 'VALIDATING' 
  | 'RUNNING' 
  | 'COMPLETED' 
  | 'FAILED' 
  | 'NO_DATA' 
  | 'INVALID_CONFIG';

export type TimePeriodMode = 'annual' | 'monthly' | 'custom';

export interface DistrictInfo {
  id: string;
  name: string;
  code: string;
  hq: string;
  region: 'Coastal Andhra' | 'Rayalaseema';
  areaSqKm: number;
  population: string;
  center: [number, number]; // [lat, lng]
  historicalRange: string;
  baselineMetrics: {
    ndvi: number;
    ndwi: number;
    ndbi: number;
    agriculturalAreaKm2: number;
    waterBodyAreaKm2: number;
    builtUpAreaKm2: number;
  };
}

export interface SatelliteDatasetInfo {
  id: SatelliteSource;
  name: string;
  provider: string;
  resolution: string;
  availableYears: [number, number];
  cloudCoverAvg: string;
  revisitDays: number;
  status: 'Operational' | 'Available';
  description?: string;
  sensorType?: 'Optical' | 'SAR Radar' | 'Optical-SAR Fusion';
  availabilityNote?: string;
}

export interface QuantumConfig {
  qubits: number;
  circuitDepth: number;
  encodingMethod: 'Angle Encoding' | 'ZZ Feature Map' | 'Pauli Feature Map';
  ansatz: 'RealAmplitudes' | 'EfficientSU2' | 'TwoLocal';
  shots: number;
  optimizer: 'COBYLA' | 'SPSA' | 'Adam';
  backend: 'qasm_simulator' | 'statevector_simulator' | 'ibmq_qasm_simulator';
}

export interface AnalysisConfiguration {
  analysisId?: string;
  districtId: string;
  selectedArea: string;
  startYear: number;
  endYear: number;
  selectedMonth: number | 'all';
  timePeriodMode: TimePeriodMode;
  startDate: string;
  endDate: string;
  domain: ApplicationDomain;
  satellite: SatelliteSource;
  features: FeatureType[];
  classicalModel: ClassicalModel;
  quantumModel: QuantumModel;
  quantumConfig: QuantumConfig;
  dataMode: 'DEMO' | 'REAL';
}

// Backwards-compatibility alias
export type AnalysisConfig = AnalysisConfiguration;

export type PipelineStepStatus = 'waiting' | 'pending' | 'running' | 'completed' | 'failed';

export interface PipelineStep {
  id: string;
  stageNum: number;
  title: string;
  description: string;
  isQuantum: boolean;
  status: PipelineStepStatus;
  progress: number;
  explanation: string;
  details?: string;
}

export interface ClassificationCategoryResult {
  category: string;
  coveragePct: number;
  areaKm2: number;
  color: string;
  isDemoData: boolean;
}

export interface ChangeCategoryResult {
  category: string;
  direction: 'Increase' | 'Decrease' | 'Stable';
  pctChange: number;
  deltaKm2: number;
  color: string;
  isDemoData: boolean;
}

export interface AnalysisMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  classicalTrainTimeSec: number;
  quantumTrainTimeSec: number;
  classicalInferenceMs: number;
  quantumInferenceMs: number;
  isDemoValue: boolean;
  notes?: string;
}

export interface AnalysisResult {
  analysisId: string;
  status: AnalysisStatus;
  timestamp: string;
  config: AnalysisConfiguration;
  dataMode: 'DEMO' | 'REAL';
  overallAccuracy: {
    classical: number;
    quantum: number;
  };
  metrics: AnalysisMetrics;
  classificationBreakdown: ClassificationCategoryResult[];
  changeBreakdown: ChangeCategoryResult[];
  areaChangeStats: {
    category: string;
    startValue: number; // e.g. sq km
    endValue: number;
    pctChange: number;
  }[];
  temporalTrend: {
    year: number;
    ndvi: number;
    ndwi: number;
    ndbi: number;
    detectedChangeAreaKm2: number;
  }[];
  keyFindings: string[];
  quantumCircuitDiagram: string[];
}

export interface AnalysisHistoryItem {
  analysisId: string;
  districtId: string;
  districtName: string;
  period: string;
  domain: ApplicationDomain;
  classicalModel: ClassicalModel;
  quantumModel: QuantumModel;
  status: AnalysisStatus;
  timestamp: string;
  accuracy: number;
}

export interface BenchmarkComparison {
  metric: string;
  classicalValue: string | number;
  quantumValue: string | number;
  unit: string;
  isExperimental: boolean;
  notes: string;
}

// ==========================================
// PHASE 5 & 6 TYPE DEFINITIONS
// ==========================================

export interface PerClassMetric {
  className: string;
  precision: number;
  recall: number;
  f1Score: number;
  support: number;
}

export interface ModelBenchmarkResult {
  modelId: string;
  modelName: string;
  modelType: 'classical' | 'quantum';
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainingTimeSec: number;
  inferenceTimeMs: number;
  featuresCount: number;
  trainableParametersCount: number;
  qubits?: number;
  circuitDepth?: number;
  shots?: number;
  backend: string;
  memoryUsageMb: number;
  perClassMetrics: PerClassMetric[];
  confusionMatrix: number[][];
  classesPresent: string[];
}

export interface FeatureImportanceItem {
  feature: string;
  importance: number;
}

export interface QuantumKernelSample {
  matrix: number[][];
  dimension: number;
  samplesCount: number;
  backend: string;
  encoding: string;
}

export interface PCAScreeItem {
  component: number;
  explainedVarianceRatio: number;
  cumulativeExplainedVariance: number;
}

export interface FullBenchmarkResponse {
  benchmarkId: string;
  timestamp: string;
  district: string;
  districtName: string;
  sampleSize: number;
  featuresUsed: string[];
  models: ModelBenchmarkResult[];
  featureImportances: FeatureImportanceItem[];
  quantumKernelSample?: QuantumKernelSample;
  pcaScreeData: PCAScreeItem[];
  scientificRule: string;
}

export interface SatelliteScene {
  sceneId: string;
  satellite: string;
  provider: string;
  acquisitionDate: string;
  season: string;
  cloudCoveragePct: number;
  resolution: string;
  bands: string[];
  estimatedSizeBytes: number;
  estimatedSizeFormatted: string;
  crs: string;
  footprint: number[];
  processingLevel: string;
}

export interface ProcessingJobStatus {
  jobId: string;
  status: 'QUEUED' | 'DOWNLOADING' | 'PREPROCESSING' | 'FEATURE_EXTRACTION' | 'PCA' | 'CLASSICAL_MODEL' | 'QUANTUM_MODEL' | 'CHANGE_DETECTION' | 'RESULT_GENERATION' | 'COMPLETED' | 'FAILED';
  progressPct: number;
  stageMessage: string;
  startTime: string;
  completionTime?: string;
  analysisId?: string;
  error?: string;
}
