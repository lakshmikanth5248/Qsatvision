import type { SatelliteDatasetInfo, AnalysisResult, BenchmarkComparison } from '../types';

export const SATELLITE_DATASETS: SatelliteDatasetInfo[] = [
  {
    id: 'sentinel-2',
    name: 'Sentinel-2 MSI',
    provider: 'ESA Copernicus Program',
    resolution: '10m Multispectral (B2, B3, B4, B8)',
    availableYears: [2015, 2026],
    cloudCoverAvg: '< 10%',
    revisitDays: 5,
    status: 'Operational'
  },
  {
    id: 'landsat-8',
    name: 'Landsat 8 OLI / TIRS',
    provider: 'USGS / NASA',
    resolution: '30m Optical / 100m Thermal',
    availableYears: [2013, 2026],
    cloudCoverAvg: '< 12%',
    revisitDays: 16,
    status: 'Operational'
  },
  {
    id: 'landsat-9',
    name: 'Landsat 9 OLI-2',
    provider: 'USGS / NASA',
    resolution: '30m Multispectral',
    availableYears: [2021, 2026],
    cloudCoverAvg: '< 8%',
    revisitDays: 16,
    status: 'Operational'
  },
  {
    id: 'sentinel-1',
    name: 'Sentinel-1 SAR (C-Band)',
    provider: 'ESA Copernicus Program',
    resolution: '20m SAR Radar Dual-Pol (VV+VH)',
    availableYears: [2014, 2026],
    cloudCoverAvg: '0% (All-Weather Radar)',
    revisitDays: 6,
    status: 'Operational'
  },
  {
    id: 'combined',
    name: 'Sentinel + Landsat Data Fusion',
    provider: 'QuantumSat-AP Fusion Pipeline',
    resolution: '10m Fused Optical-SAR',
    availableYears: [2015, 2026],
    cloudCoverAvg: '< 5%',
    revisitDays: 3,
    status: 'Available'
  }
];

export function generateTemporalTrend(districtId: string, domain: string) {
  const years = Array.from({ length: 17 }, (_, i) => 2010 + i);
  
  return years.map((yr) => {
    const seed = (districtId.length * 7 + yr * 13) % 100 / 100;
    
    let ndvi = 0.45 + seed * 0.25;
    let ndwi = 0.25 + (1 - seed) * 0.20;
    let ndbi = 0.28 + (yr - 2010) * 0.012 + seed * 0.05;

    if (domain === 'agriculture') {
      ndvi = Math.min(0.85, ndvi + (yr - 2010) * 0.008);
    } else if (domain === 'water') {
      ndwi = Math.max(0.12, ndwi - (yr - 2010) * 0.005);
    } else if (domain === 'urban') {
      ndbi = Math.min(0.72, ndbi + (yr - 2010) * 0.015);
    } else if (domain === 'disaster') {
      if (yr === 2015 || yr === 2023) {
        ndwi += 0.22;
        ndvi -= 0.15;
      }
    }

    const detectedChangeAreaKm2 = Math.round(15 + seed * 45 + Math.abs(yr - 2018) * 4);

    return {
      year: yr,
      ndvi: Number(ndvi.toFixed(3)),
      ndwi: Number(ndwi.toFixed(3)),
      ndbi: Number(ndbi.toFixed(3)),
      detectedChangeAreaKm2,
    };
  });
}

export function generateDemoResult(districtName: string, domain: string, startYr: number, endYr: number): AnalysisResult {
  const trend = generateTemporalTrend(districtName.toLowerCase(), domain);
  
  return {
    analysisId: `ANALYSIS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'COMPLETED',
    timestamp: new Date().toISOString(),
    config: {
      districtId: districtName.toLowerCase(),
      selectedArea: `Entire ${districtName} District`,
      startYear: startYr,
      endYear: endYr,
      selectedMonth: 'all',
      timePeriodMode: 'annual',
      startDate: `${startYr}-01-01`,
      endDate: `${endYr}-12-31`,
      domain: domain as any,
      satellite: 'sentinel-2',
      features: ['spectral', 'ndvi', 'ndwi', 'texture'],
      classicalModel: 'random_forest',
      quantumModel: 'vqc',
      quantumConfig: {
        qubits: 4,
        circuitDepth: 2,
        encodingMethod: 'ZZ Feature Map',
        ansatz: 'RealAmplitudes',
        shots: 1024,
        optimizer: 'COBYLA',
        backend: 'qasm_simulator'
      },
      dataMode: 'DEMO'
    },
    dataMode: 'DEMO',
    overallAccuracy: {
      classical: 91.4,
      quantum: 89.8
    },
    metrics: {
      accuracy: 91.4,
      precision: 0.902,
      recall: 0.891,
      f1Score: 0.896,
      classicalTrainTimeSec: 4.2,
      quantumTrainTimeSec: 18.7,
      classicalInferenceMs: 14.5,
      quantumInferenceMs: 142.0,
      isDemoValue: true,
      notes: 'Synthetic demo metrics for Phase 2 validation.'
    },
    classificationBreakdown: [
      { category: 'Dense Vegetation / Crops', coveragePct: 64.2, areaKm2: 7208, color: '#16a34a', isDemoData: true },
      { category: 'Surface Water Bodies', coveragePct: 17.5, areaKm2: 1965, color: '#0284c7', isDemoData: true },
      { category: 'Urban Built-Up Area', coveragePct: 11.8, areaKm2: 1325, color: '#9333ea', isDemoData: true },
      { category: 'Barren / Fallow Land', coveragePct: 6.5, areaKm2: 730, color: '#d97706', isDemoData: true },
    ],
    changeBreakdown: [
      { category: 'Vegetation Dynamics', direction: 'Increase', pctChange: 6.0, deltaKm2: 673, color: '#10b981', isDemoData: true },
      { category: 'Surface Water Extent', direction: 'Decrease', pctChange: -2.1, deltaKm2: 235, color: '#0ea5e9', isDemoData: true },
      { category: 'Built-Up Expansion', direction: 'Increase', pctChange: 4.0, deltaKm2: 449, color: '#e11d48', isDemoData: true },
      { category: 'Barren / Fallow Transition', direction: 'Decrease', pctChange: -7.9, deltaKm2: 887, color: '#f59e0b', isDemoData: true },
    ],
    areaChangeStats: [
      { category: 'Dense Vegetation / Crops', startValue: 1240, endValue: 1410, pctChange: 13.7 },
      { category: 'Surface Water Bodies', startValue: 420, endValue: 385, pctChange: -8.3 },
      { category: 'Urban Built-Up Area', startValue: 510, endValue: 740, pctChange: 45.1 },
      { category: 'Barren / Fallow Land', startValue: 890, endValue: 725, pctChange: -18.5 }
    ],
    temporalTrend: trend,
    keyFindings: [
      `Target District: ${districtName} evaluated from ${startYr} to ${endYr}.`,
      `Domain: ${domain.toUpperCase()} spatial tracking in DEMO mode.`,
      `Estimated Net Shifts: +6.0% Vegetation, -2.1% Surface Water, +4.0% Built-Up.`,
      `Quantum Register: 4 qubits encoded via ZZ Feature Map on QASM simulator.`,
      `Scientific Notice: Prototype result generated using simulated demonstration data.`
    ],
    quantumCircuitDiagram: [
      "q0: ──H──[Ry(x0)]──■───────[Ry(θ0)]──M",
      "q1: ──H──[Ry(x1)]──┼──■────[Ry(θ1)]──M",
      "q2: ──H──[Ry(x2)]──X──┼────[Ry(θ2)]──M",
      "q3: ──H──[Ry(x3)]─────X────[Ry(θ3)]──M"
    ]
  };
}

export const CLASSICAL_VS_QUANTUM_BENCHMARKS: BenchmarkComparison[] = [
  {
    metric: 'Classification Accuracy (%)',
    classicalValue: '91.4% ± 0.8',
    quantumValue: '89.8% ± 1.2',
    unit: '%',
    isExperimental: true,
    notes: 'QML tested on 4-qubit PCA features using ZZ Feature Map & VQC ansatz.'
  },
  {
    metric: 'Precision Score',
    classicalValue: 0.925,
    quantumValue: 0.902,
    unit: 'ratio',
    isExperimental: true,
    notes: 'Macro precision across 4 land cover classes.'
  },
  {
    metric: 'Recall Score',
    classicalValue: 0.908,
    quantumValue: 0.891,
    unit: 'ratio',
    isExperimental: true,
    notes: 'Sensitivity to subtle vegetation and water boundary shifts.'
  },
  {
    metric: 'F1 Score',
    classicalValue: 0.916,
    quantumValue: 0.896,
    unit: 'score',
    isExperimental: true,
    notes: 'Harmonic mean of precision and recall.'
  },
  {
    metric: 'Training Time (CPU / Simulator)',
    classicalValue: '4.2 s',
    quantumValue: '18.7 s',
    unit: 'seconds',
    isExperimental: true,
    notes: 'Qiskit QASM simulator with 1024 shots per circuit execution.'
  },
  {
    metric: 'Inference Latency',
    classicalValue: '14.5 ms',
    quantumValue: '142.0 ms',
    unit: 'milliseconds',
    isExperimental: true,
    notes: 'Classical RF evaluation vs simulator statevector sampling.'
  },
  {
    metric: 'Feature Space Dimensions',
    classicalValue: 32,
    quantumValue: 4,
    unit: 'features',
    isExperimental: true,
    notes: 'Classical uses full spectral bands + indices; QML uses 4-principal components.'
  },
  {
    metric: 'Noise Sensitivity (BQP Regime)',
    classicalValue: 'N/A (Deterministic)',
    quantumValue: 'Depolarizing Noise (T1/T2)',
    unit: 'character',
    isExperimental: true,
    notes: 'Quantum models evaluated under simulated hardware decoherence noise.'
  }
];
