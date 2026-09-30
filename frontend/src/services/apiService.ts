import type {
  AnalysisConfiguration,
  AnalysisResult,
  DistrictInfo
} from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface BackendHealthResponse {
  status: string;
  timestamp: number;
  backend: string;
  version: string;
  qiskit_version: string;
  mode: string;
}

export const apiService = {
  /**
   * Check connection to FastAPI backend
   */
  async checkHealth(): Promise<BackendHealthResponse | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  },

  /**
   * Fetch all 26 AP districts from backend
   */
  async getDistricts(): Promise<DistrictInfo[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/districts`);
      if (!response.ok) throw new Error('Failed to fetch districts');
      const data = await response.json();
      return data.districts;
    } catch (e) {
      console.warn('API getDistricts failed, fallback to local', e);
      return [];
    }
  },

  /**
   * Submit and run real hybrid Classical-QML pipeline on FastAPI backend
   */
  async runAnalysis(config: AnalysisConfiguration): Promise<AnalysisResult> {
    const payload = {
      districtId: config.districtId,
      selectedArea: config.selectedArea || 'District Boundary',
      startYear: config.startYear,
      endYear: config.endYear,
      startDate: config.startDate,
      endDate: config.endDate,
      selectedMonth: config.selectedMonth || 'all',
      domain: config.domain,
      satellite: config.satellite,
      features: config.features,
      classicalModel: config.classicalModel,
      quantumModel: config.quantumModel,
      quantumConfig: config.quantumConfig,
      dataMode: 'REAL'
    };

    const response = await fetch(`${API_BASE_URL}/analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail?.message || 'Backend real pipeline execution failed');
    }

    const data = await response.json();
    const raw = data.result;

    // Map structured backend result into frontend AnalysisResult format
    const mappedResult: AnalysisResult = {
      analysisId: raw.analysis_id,
      status: 'COMPLETED',
      timestamp: raw.timestamp,
      config: config,
      dataMode: 'REAL',
      overallAccuracy: {
        classical: raw.classical_result.accuracy,
        quantum: raw.quantum_result.accuracy
      },
      metrics: {
        accuracy: raw.classical_result.accuracy,
        precision: raw.classical_result.precision,
        recall: raw.classical_result.recall,
        f1Score: raw.classical_result.f1Score,
        classicalTrainTimeSec: raw.classical_result.trainingTimeSec,
        quantumTrainTimeSec: raw.quantum_result.trainingTimeSec,
        classicalInferenceMs: raw.classical_result.inferenceTimeMs,
        quantumInferenceMs: raw.quantum_result.inferenceTimeMs,
        isDemoValue: false,
        notes: `Real Qiskit execution on ${raw.quantum_circuit.qubits} qubits (${raw.quantum_circuit.backend})`
      },
      classificationBreakdown: raw.classification_breakdown,
      changeBreakdown: raw.change_breakdown,
      areaChangeStats: raw.area_change_stats,
      temporalTrend: raw.temporal_trend,
      keyFindings: raw.key_findings,
      quantumCircuitDiagram: raw.quantum_circuit.circuitAsciiDiagram ? raw.quantum_circuit.circuitAsciiDiagram.split('\n') : []
    };

    return mappedResult;
  },

  /**
   * Run comparative analytics (Year, Month, District)
   */
  async compare(params: {
    mode: 'year' | 'month' | 'district';
    districtId: string;
    targetDistrictIds?: string[];
    yearA?: number;
    yearB?: number;
    monthA?: string;
    monthB?: string;
    metric?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!response.ok) throw new Error('Comparison API error');
    return await response.json();
  },

  /**
   * PHASE 5: Fetch live Qiskit circuit diagram and metadata
   */
  async fetchQmlCircuit(modelType: string = 'vqc', qubits: number = 4, depth: number = 2, encoding: string = 'ZZ Feature Map', ansatz: string = 'RealAmplitudes') {
    const url = `${API_BASE_URL}/qml/circuit/${encodeURIComponent(modelType)}?qubits=${qubits}&depth=${depth}&encoding=${encodeURIComponent(encoding)}&ansatz=${encodeURIComponent(ansatz)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch quantum circuit diagram');
    return await response.json();
  },

  /**
   * PHASE 5: Run empirical Classical vs Quantum benchmark
   */
  async runBenchmark(params: {
    districtId: string;
    startYear: number;
    endYear: number;
    models?: string[];
    features?: string[];
    qubits?: number;
    circuitDepth?: number;
    encodingMethod?: string;
    ansatz?: string;
    shots?: number;
    sampleSize?: number;
    dataMode?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/benchmark`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail?.message || 'Benchmark execution failed');
    }
    return await response.json();
  },

  /**
   * PHASE 5: Fetch benchmark by ID
   */
  async fetchBenchmark(benchmarkId: string) {
    const response = await fetch(`${API_BASE_URL}/benchmark/${benchmarkId}`);
    if (!response.ok) throw new Error('Failed to retrieve benchmark');
    return await response.json();
  },

  /**
   * PHASE 5: Download benchmark as CSV
   */
  async downloadBenchmarkCsv(benchmarkId: string, districtName: string = 'AP') {
    const response = await fetch(`${API_BASE_URL}/benchmark/${benchmarkId}/csv`);
    if (!response.ok) throw new Error('CSV download failed');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QuantumSat_Benchmark_${districtName}_${benchmarkId}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  /**
   * PHASE 5: Generate and download Research PDF report
   */
  async generatePdfReport(params: {
    analysisId?: string;
    districtId: string;
    domain: string;
    startYear: number;
    endYear: number;
    satellite: string;
    qubits?: number;
    circuitDepth?: number;
    dataMode: 'DEMO' | 'REAL';
  }) {
    const response = await fetch(`${API_BASE_URL}/reports/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail?.message || 'Failed generating research PDF');
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QuantumSat_AP_Research_Report_${params.districtId}_${params.startYear}_${params.endYear}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  /**
   * PHASE 5: Download analysis results as CSV
   */
  async downloadResultCsv(analysisId: string) {
    const response = await fetch(`${API_BASE_URL}/results/${analysisId}/csv`);
    if (!response.ok) throw new Error('CSV download failed');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QuantumSat_Result_${analysisId}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  /**
   * PHASE 5: Download analysis results as JSON
   */
  async downloadResultJson(analysisId: string) {
    const response = await fetch(`${API_BASE_URL}/results/${analysisId}/json`);
    if (!response.ok) throw new Error('JSON download failed');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QuantumSat_Experiment_${analysisId}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  /**
   * PHASE 6: Check satellite operational availability
   */
  async checkSatelliteAvailability(satellite: string, startYear: number, endYear: number) {
    const response = await fetch(`${API_BASE_URL}/satellite/availability?satellite=${satellite}&startYear=${startYear}&endYear=${endYear}`);
    if (!response.ok) return { available: true };
    return await response.json();
  },

  /**
   * PHASE 6: Search satellite scenes catalog
   */
  async searchSatelliteScenes(params: {
    districtId: string;
    satelliteSource: string;
    startYear: number;
    endYear: number;
    maxCloudCover: number;
  }) {
    const response = await fetch(`${API_BASE_URL}/satellite/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!response.ok) throw new Error('Failed searching satellite catalog');
    return await response.json();
  },

  /**
   * PHASE 6: Dispatch asynchronous processing job
   */
  async submitProcessingJob(params: any) {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!response.ok) throw new Error('Failed dispatching processing job');
    return await response.json();
  },

  /**
   * PHASE 6: Poll asynchronous job progress
   */
  async getJobStatus(jobId: string) {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
    if (!response.ok) throw new Error('Job status check failed');
    return await response.json();
  }
};
