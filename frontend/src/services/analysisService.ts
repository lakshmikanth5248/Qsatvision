import type {
  AnalysisConfiguration,
  AnalysisResult,
  PipelineStep,
  AnalysisHistoryItem,
  ClassificationCategoryResult,
  ChangeCategoryResult,
  AnalysisMetrics
} from '../types';
import { AP_DISTRICTS } from '../data/apDistrictsGeoJSON';
import { generateTemporalTrend } from '../data/mockSatelliteData';

// 8 Dedicated Pipeline Stages (PART 6 & 7)
export const DEFAULT_PIPELINE_STEPS: PipelineStep[] = [
  {
    id: 'data_selection',
    stageNum: 1,
    title: 'Data Selection',
    description: 'Query satellite archive for spatial extents and observation timeline',
    isQuantum: false,
    status: 'waiting',
    progress: 0,
    explanation: 'District boundary clipping and multi-sensor archive querying (Landsat/Sentinel-2).',
    details: 'Resolution: 10m/30m optical imagery • Demo archive 2010–2026'
  },
  {
    id: 'preprocessing',
    stageNum: 2,
    title: 'Classical Preprocessing',
    description: 'Atmospheric correction, cloud masking, and radiometric normalization',
    isQuantum: false,
    status: 'waiting',
    progress: 0,
    explanation: 'Atmospheric correction (Sen2Cor / LaSRC) and cloud masking (QA60 band).',
    details: 'DEMO PROCESS: Simulated radiometric calibration & reprojection (EPSG:4326)'
  },
  {
    id: 'feature_extraction',
    stageNum: 3,
    title: 'Feature Extraction',
    description: 'Compute spectral indices (NDVI, NDWI, NDBI) and GLCM texture metrics',
    isQuantum: false,
    status: 'waiting',
    progress: 0,
    explanation: 'Spectral ratio calculations (NIR, Red, SWIR, Green) and spatial texture metrics.',
    details: 'Indices: NDVI (vegetation), NDWI (water bodies), NDBI (impervious urban)'
  },
  {
    id: 'dimensionality_reduction',
    stageNum: 4,
    title: 'Dimensionality Reduction (PCA)',
    description: 'Principal Component Analysis reducing 32 spectral features to 4 components',
    isQuantum: false,
    status: 'waiting',
    progress: 0,
    explanation: 'Linear dimensionality reduction to match NISQ multi-qubit register constraints.',
    details: 'DEMO: Input dimension: 32 spectral/textural features → Reduced dimension: 4 principal components'
  },
  {
    id: 'quantum_encoding',
    stageNum: 5,
    title: 'Quantum State Encoding',
    description: 'Map 4-dimensional feature vectors into multi-qubit Hilbert state space',
    isQuantum: true,
    status: 'waiting',
    progress: 0,
    explanation: 'Quantum feature mapping using second-order Pauli-Z expansion (ZZ Feature Map).',
    details: 'Register: 4 Qubits • Entanglement: Full circular CNOT ladder • Backend: QASM Simulator'
  },
  {
    id: 'model_evaluation',
    stageNum: 6,
    title: 'Model Evaluation (Classical vs QML)',
    description: 'Execute Random Forest baseline alongside Variational Quantum Classifier (VQC)',
    isQuantum: true,
    status: 'waiting',
    progress: 0,
    explanation: 'Parameterized quantum circuit optimization with classical optimizer (COBYLA).',
    details: 'Ansatz: RealAmplitudes • Circuit Depth: 2 • Shots: 1024 • Simulator Backend'
  },
  {
    id: 'classification',
    stageNum: 7,
    title: 'Land Cover Classification',
    description: 'Partition geographic pixels into 4 primary AP environmental classes',
    isQuantum: false,
    status: 'waiting',
    progress: 0,
    explanation: 'Cluster assignment for Dense Vegetation, Surface Water, Urban Built-up, Barren land.',
    details: 'Spatial resolution: 10m grid • Confusion matrix cross-validation'
  },
  {
    id: 'change_detection',
    stageNum: 8,
    title: 'Change Detection & Vector Synthesis',
    description: 'Calculate temporal deltas between baseline year and target evaluation year',
    isQuantum: false,
    status: 'waiting',
    progress: 0,
    explanation: 'Post-classification comparison matrix measuring net shift and directional trends.',
    details: 'Outputs: Vegetation gain/loss, water contraction/expansion, urban sprawl'
  }
];

// Initial mock analysis history items (PART 17)
const INITIAL_ANALYSIS_HISTORY: AnalysisHistoryItem[] = [
  {
    analysisId: 'ANALYSIS-2026-0812',
    districtId: 'ysr_kadapa',
    districtName: 'YSR Kadapa',
    period: '2018 → 2026',
    domain: 'agriculture',
    classicalModel: 'random_forest',
    quantumModel: 'vqc',
    status: 'COMPLETED',
    timestamp: '2026-09-24T14:32:00Z',
    accuracy: 91.4
  },
  {
    analysisId: 'ANALYSIS-2026-0745',
    districtId: 'visakhapatnam',
    districtName: 'Visakhapatnam',
    period: '2020 → 2026',
    domain: 'urban',
    classicalModel: 'xgboost',
    quantumModel: 'quantum_kernel',
    status: 'COMPLETED',
    timestamp: '2026-09-23T11:15:00Z',
    accuracy: 89.6
  },
  {
    analysisId: 'ANALYSIS-2026-0619',
    districtId: 'tirupati',
    districtName: 'Tirupati',
    period: '2019 → 2025',
    domain: 'water',
    classicalModel: 'random_forest',
    quantumModel: 'vqc',
    status: 'COMPLETED',
    timestamp: '2026-09-22T09:45:00Z',
    accuracy: 90.2
  }
];

class AnalysisService {
  private history: AnalysisHistoryItem[] = [...INITIAL_ANALYSIS_HISTORY];
  private resultsCache: Map<string, AnalysisResult> = new Map();

  /**
   * Validate configuration prior to launch (PART 18)
   */
  public validateConfiguration(config: Partial<AnalysisConfiguration>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.districtId) {
      errors.push('Please select a target district in Andhra Pradesh.');
    }

    if (!config.startYear || !config.endYear) {
      errors.push('Please select a valid time period.');
    } else if (config.endYear < config.startYear) {
      errors.push('Target evaluation year cannot be earlier than baseline start year.');
    }

    if (!config.domain) {
      errors.push('Please select an application domain (Agriculture, Water, Urban, Disaster).');
    }

    if (!config.features || config.features.length === 0) {
      errors.push('Select at least one feature extraction type for model input.');
    }

    if (!config.classicalModel) {
      errors.push('Please select a classical ML baseline model.');
    }

    if (!config.quantumModel) {
      errors.push('Please select a quantum machine learning algorithm.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Execute connected demo analysis workflow (PART 5, 6, 7)
   */
  public async runAnalysis(
    config: AnalysisConfiguration,
    onStepUpdate?: (steps: PipelineStep[], activeIdx: number) => void
  ): Promise<AnalysisResult> {
    const districtObj = AP_DISTRICTS.find(d => d.id === config.districtId) || AP_DISTRICTS[0];
    const analysisId = `ANALYSIS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const steps: PipelineStep[] = DEFAULT_PIPELINE_STEPS.map(s => ({
      ...s,
      status: 'waiting',
      progress: 0
    }));

    if (onStepUpdate) onStepUpdate([...steps], 0);

    // Controlled simulated delay across each pipeline step
    for (let i = 0; i < steps.length; i++) {
      steps[i].status = 'running';
      steps[i].progress = 30;
      if (onStepUpdate) onStepUpdate([...steps], i);

      await new Promise(r => setTimeout(r, 140));

      steps[i].progress = 80;
      if (onStepUpdate) onStepUpdate([...steps], i);

      await new Promise(r => setTimeout(r, 120));

      steps[i].status = 'completed';
      steps[i].progress = 100;
      if (onStepUpdate) onStepUpdate([...steps], i);
    }

    // Generate comprehensive domain & district-adapted demo results
    const result = this.generateResultForConfig(analysisId, config, districtObj.name);

    // Save in cache and history
    this.resultsCache.set(analysisId, result);
    this.history.unshift({
      analysisId: result.analysisId,
      districtId: config.districtId,
      districtName: districtObj.name,
      period: `${config.startYear} → ${config.endYear}`,
      domain: config.domain,
      classicalModel: config.classicalModel,
      quantumModel: config.quantumModel,
      status: 'COMPLETED',
      timestamp: new Date().toISOString(),
      accuracy: result.metrics.accuracy
    });

    return result;
  }

  /**
   * Retrieve cached or generated analysis result (PART 26)
   */
  public async getAnalysis(analysisId: string): Promise<AnalysisResult | null> {
    if (this.resultsCache.has(analysisId)) {
      return this.resultsCache.get(analysisId)!;
    }
    return null;
  }

  /**
   * Retrieve recent analysis runs (PART 17)
   */
  public getAnalysisHistory(): AnalysisHistoryItem[] {
    return [...this.history];
  }

  /**
   * Internal generator for authentic, domain-tailored DEMO results
   */
  private generateResultForConfig(
    analysisId: string,
    config: AnalysisConfiguration,
    districtName: string
  ): AnalysisResult {
    const trend = generateTemporalTrend(config.districtId, config.domain);

    // Calculate domain-adjusted metrics
    let agriPct = 64.2;
    let waterPct = 17.5;
    let urbanPct = 11.8;
    let barrenPct = 6.5;

    let agriDelta = +6.0;
    let waterDelta = -2.1;
    let urbanDelta = +4.0;
    let barrenDelta = -7.9;

    if (config.domain === 'urban') {
      urbanPct = 24.5;
      urbanDelta = +8.4;
      barrenDelta = -5.2;
    } else if (config.domain === 'water') {
      waterPct = 22.0;
      waterDelta = -4.5;
    } else if (config.domain === 'disaster') {
      waterPct = 26.8;
      waterDelta = +11.2;
      agriDelta = -8.5;
    }

    const classificationBreakdown: ClassificationCategoryResult[] = [
      { category: 'Dense Vegetation / Crops', coveragePct: agriPct, areaKm2: Math.round(11228 * (agriPct / 100)), color: '#16a34a', isDemoData: true },
      { category: 'Surface Water Bodies', coveragePct: waterPct, areaKm2: Math.round(11228 * (waterPct / 100)), color: '#0284c7', isDemoData: true },
      { category: 'Urban Built-Up Area', coveragePct: urbanPct, areaKm2: Math.round(11228 * (urbanPct / 100)), color: '#9333ea', colorAlt: '#be123c', isDemoData: true } as any,
      { category: 'Barren / Fallow Land', coveragePct: barrenPct, areaKm2: Math.round(11228 * (barrenPct / 100)), color: '#d97706', isDemoData: true },
    ];

    const changeBreakdown: ChangeCategoryResult[] = [
      { category: 'Vegetation Dynamics', direction: agriDelta >= 0 ? 'Increase' : 'Decrease', pctChange: agriDelta, deltaKm2: Math.round(11228 * (Math.abs(agriDelta) / 100)), color: '#10b981', isDemoData: true },
      { category: 'Surface Water Extent', direction: waterDelta >= 0 ? 'Increase' : 'Decrease', pctChange: waterDelta, deltaKm2: Math.round(11228 * (Math.abs(waterDelta) / 100)), color: '#0ea5e9', isDemoData: true },
      { category: 'Built-Up Expansion', direction: urbanDelta >= 0 ? 'Increase' : 'Decrease', pctChange: urbanDelta, deltaKm2: Math.round(11228 * (Math.abs(urbanDelta) / 100)), color: '#e11d48', isDemoData: true },
      { category: 'Barren / Fallow Transition', direction: barrenDelta >= 0 ? 'Increase' : 'Decrease', pctChange: barrenDelta, deltaKm2: Math.round(11228 * (Math.abs(barrenDelta) / 100)), color: '#f59e0b', isDemoData: true },
    ];

    const metrics: AnalysisMetrics = {
      accuracy: 91.4,
      precision: 0.902,
      recall: 0.891,
      f1Score: 0.896,
      classicalTrainTimeSec: 4.2,
      quantumTrainTimeSec: 18.7,
      classicalInferenceMs: 14.5,
      quantumInferenceMs: 142.0,
      isDemoValue: true,
      notes: 'Values represent synthetic prototype estimates; measured experimental results will be incorporated in later phases.'
    };

    const keyFindings = [
      `Target District: ${districtName} official perimeter evaluated between ${config.startYear} and ${config.endYear}.`,
      `Application Focus: ${config.domain.toUpperCase()} workflow executed with ${config.classicalModel.toUpperCase()} & ${config.quantumModel.toUpperCase()}.`,
      `Detected Net Shifts: Vegetation change ${agriDelta > 0 ? '+' : ''}${agriDelta}%, Surface water change ${waterDelta > 0 ? '+' : ''}${waterDelta}%, Built-up growth ${urbanDelta > 0 ? '+' : ''}${urbanDelta}%.`,
      `Quantum Feature Encoding: 4-qubit Hilbert space projection via ${config.quantumConfig.encodingMethod} on simulator hook.`,
      `Scientific Verification Notice: Prototype result generated using simulated demonstration data without unproven performance claims.`
    ];

    return {
      analysisId,
      status: 'COMPLETED',
      timestamp: new Date().toISOString(),
      config: { ...config, analysisId },
      dataMode: 'DEMO',
      overallAccuracy: {
        classical: 91.4,
        quantum: 89.8
      },
      metrics,
      classificationBreakdown,
      changeBreakdown,
      areaChangeStats: [
        { category: 'Dense Vegetation / Crops', startValue: Math.round(11228 * 0.62), endValue: Math.round(11228 * (agriPct / 100)), pctChange: agriDelta },
        { category: 'Surface Water Bodies', startValue: Math.round(11228 * 0.18), endValue: Math.round(11228 * (waterPct / 100)), pctChange: waterDelta },
        { category: 'Urban Built-Up Area', startValue: Math.round(11228 * 0.10), endValue: Math.round(11228 * (urbanPct / 100)), pctChange: urbanDelta },
        { category: 'Barren / Fallow Land', startValue: Math.round(11228 * 0.10), endValue: Math.round(11228 * (barrenPct / 100)), pctChange: barrenDelta },
      ],
      temporalTrend: trend,
      keyFindings,
      quantumCircuitDiagram: [
        "q0: ──H──[Ry(x0)]──■───────[Ry(θ0)]──M",
        "q1: ──H──[Ry(x1)]──┼──■────[Ry(θ1)]──M",
        "q2: ──H──[Ry(x2)]──X──┼────[Ry(θ2)]──M",
        "q3: ──H──[Ry(x3)]─────X────[Ry(θ3)]──M"
      ]
    };
  }
}

export const analysisService = new AnalysisService();
