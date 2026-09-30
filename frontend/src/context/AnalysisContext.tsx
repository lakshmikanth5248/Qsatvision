import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  ApplicationDomain,
  SatelliteSource,
  FeatureType,
  ClassicalModel,
  QuantumModel,
  QuantumConfig,
  PipelineStep,
  AnalysisResult,
  AnalysisStatus,
  TimePeriodMode,
  AnalysisConfiguration,
  AnalysisHistoryItem
} from '../types';
import { analysisService, DEFAULT_PIPELINE_STEPS } from '../services/analysisService';
import { apiService } from '../services/apiService';

interface AnalysisContextType {
  // Location & Time
  districtId: string;
  selectedArea: string;
  startYear: number;
  endYear: number;
  selectedMonth: number | 'all';
  timePeriodMode: TimePeriodMode;
  startDate: string;
  endDate: string;

  // Domain & Dataset
  domain: ApplicationDomain;
  satellite: SatelliteSource;

  // Features
  features: FeatureType[];

  // Models & Quantum Hyperparameters
  classicalModel: ClassicalModel;
  quantumModel: QuantumModel;
  quantumConfig: QuantumConfig;

  // Backend Connectivity
  backendConnected: boolean;
  backendVersion: string;
  checkBackendHealth: () => Promise<void>;

  // Execution & Status
  dataMode: 'DEMO' | 'REAL';
  analysisMode: 'DEMO' | 'REAL';
  analysisStatus: AnalysisStatus;
  analysisId: string;
  isAnalyzing: boolean;
  pipelineSteps: PipelineStep[];
  currentProcessingStep: number;
  activeResult: AnalysisResult | null;
  analysisHistory: AnalysisHistoryItem[];
  validationErrors: string[];

  // Actions
  setDistrictId: (id: string) => void;
  setSelectedArea: (area: string) => void;
  setTimelineRange: (start: number, end: number, month?: number | 'all') => void;
  setTimePeriodMode: (mode: TimePeriodMode) => void;
  setDomain: (domain: ApplicationDomain) => void;
  setSatellite: (sat: SatelliteSource) => void;
  setFeatures: (features: FeatureType[]) => void;
  toggleFeature: (feature: FeatureType) => void;
  selectAllFeatures: () => void;
  clearAllFeatures: () => void;
  setRecommendedFeaturesForDomain: (domain: ApplicationDomain) => void;
  setClassicalModel: (model: ClassicalModel) => void;
  setQuantumModel: (model: QuantumModel) => void;
  setQuantumConfig: (config: Partial<QuantumConfig>) => void;
  setDataMode: (mode: 'DEMO' | 'REAL') => void;
  runAnalysis: () => Promise<boolean>;
  loadHistoryAnalysis: (analysisId: string) => Promise<boolean>;
  resetToDefaults: () => void;
}

const DEFAULT_QUANTUM_CONFIG: QuantumConfig = {
  qubits: 4,
  circuitDepth: 2,
  encodingMethod: 'ZZ Feature Map',
  ansatz: 'RealAmplitudes',
  shots: 1024,
  optimizer: 'COBYLA',
  backend: 'qasm_simulator'
};

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Location
  const [districtId, setDistrictId] = useState<string>('ysr_kadapa');
  const [selectedArea, setSelectedArea] = useState<string>('District Boundary');

  // Time
  const [startYear, setStartYear] = useState<number>(2018);
  const [endYear, setEndYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [timePeriodMode, setTimePeriodMode] = useState<TimePeriodMode>('annual');
  const [startDate, setStartDate] = useState<string>('2018-01-01');
  const [endDate, setEndDate] = useState<string>('2026-12-31');

  // Domain & Dataset
  const [domain, setDomainState] = useState<ApplicationDomain>('agriculture');
  const [satellite, setSatellite] = useState<SatelliteSource>('sentinel-2');

  // Features
  const [features, setFeatures] = useState<FeatureType[]>(['ndvi', 'spectral', 'texture', 'temporal']);

  // Models
  const [classicalModel, setClassicalModel] = useState<ClassicalModel>('random_forest');
  const [quantumModel, setQuantumModel] = useState<QuantumModel>('vqc');
  const [quantumConfig, setQuantumConfigState] = useState<QuantumConfig>(DEFAULT_QUANTUM_CONFIG);

  // Backend Health
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [backendVersion, setBackendVersion] = useState<string>('1.0.0');

  // Status & Execution
  const [dataMode, setDataMode] = useState<'DEMO' | 'REAL'>('DEMO');
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('IDLE');
  const [analysisId, setAnalysisId] = useState<string>('ANALYSIS-2026-0812');
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>(DEFAULT_PIPELINE_STEPS);
  const [currentProcessingStep, setCurrentProcessingStep] = useState<number>(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistoryItem[]>(() => 
    analysisService.getAnalysisHistory()
  );

  const checkBackendHealth = async () => {
    try {
      const res = await apiService.checkHealth();
      if (res && res.status === 'CONNECTED') {
        setBackendConnected(true);
        setBackendVersion(res.version || '1.0.0');
      } else {
        setBackendConnected(false);
      }
    } catch {
      setBackendConnected(false);
    }
  };

  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  // Initial active result for preview
  const [activeResult, setActiveResult] = useState<AnalysisResult | null>(null);

  // Sync dates with years
  useEffect(() => {
    setStartDate(`${startYear}-01-01`);
    setEndDate(`${endYear}-12-31`);
  }, [startYear, endYear]);

  // Load initial demo result on mount
  useEffect(() => {
    const initDemo = async () => {
      const initialConfig: AnalysisConfiguration = {
        districtId: 'ysr_kadapa',
        selectedArea: 'District Boundary',
        startYear: 2018,
        endYear: 2026,
        selectedMonth: 'all',
        timePeriodMode: 'annual',
        startDate: '2018-01-01',
        endDate: '2026-12-31',
        domain: 'agriculture',
        satellite: 'sentinel-2',
        features: ['ndvi', 'spectral', 'texture', 'temporal'],
        classicalModel: 'random_forest',
        quantumModel: 'vqc',
        quantumConfig: DEFAULT_QUANTUM_CONFIG,
        dataMode: 'DEMO'
      };
      
      const validation = analysisService.validateConfiguration(initialConfig);
      if (validation.isValid) {
        const dummyResult = await analysisService.runAnalysis(initialConfig);
        setActiveResult(dummyResult);
        setAnalysisId(dummyResult.analysisId);
        setAnalysisStatus('COMPLETED');
        setAnalysisHistory(analysisService.getAnalysisHistory());
      }
    };
    initDemo();
  }, []);

  const setTimelineRange = (start: number, end: number, month: number | 'all' = 'all') => {
    setStartYear(start);
    setEndYear(end);
    setSelectedMonth(month);
    setValidationErrors([]);
  };

  const setDomain = (newDomain: ApplicationDomain) => {
    setDomainState(newDomain);
    // Auto-suggest domain recommended features (PART 5)
    setRecommendedFeaturesForDomain(newDomain);
  };

  const toggleFeature = (feat: FeatureType) => {
    setFeatures(prev => 
      prev.includes(feat) ? prev.filter(f => f !== feat) : [...prev, feat]
    );
  };

  const selectAllFeatures = () => {
    setFeatures(['spectral', 'ndvi', 'ndwi', 'ndbi', 'texture', 'temporal', 'land_cover']);
  };

  const clearAllFeatures = () => {
    setFeatures([]);
  };

  const setRecommendedFeaturesForDomain = (targetDomain: ApplicationDomain) => {
    switch (targetDomain) {
      case 'agriculture':
        setFeatures(['ndvi', 'spectral', 'texture', 'temporal']);
        break;
      case 'water':
        setFeatures(['ndwi', 'spectral', 'temporal']);
        break;
      case 'urban':
        setFeatures(['ndbi', 'spectral', 'texture']);
        break;
      case 'disaster':
        setFeatures(['temporal', 'ndvi', 'ndwi', 'texture']);
        break;
      default:
        setFeatures(['spectral', 'ndvi']);
    }
  };

  const setQuantumConfig = (configUpdate: Partial<QuantumConfig>) => {
    setQuantumConfigState(prev => ({ ...prev, ...configUpdate }));
  };

  /**
   * Launch Connected Demo Analysis (PART 5)
   */
  const runAnalysis = async (): Promise<boolean> => {
    const config: AnalysisConfiguration = {
      districtId,
      selectedArea,
      startYear,
      endYear,
      selectedMonth,
      timePeriodMode,
      startDate,
      endDate,
      domain,
      satellite,
      features,
      classicalModel,
      quantumModel,
      quantumConfig,
      dataMode
    };

    // 1. Validate configuration
    setAnalysisStatus('VALIDATING');
    const validation = analysisService.validateConfiguration(config);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setAnalysisStatus('INVALID_CONFIG');
      return false;
    }

    setValidationErrors([]);
    setAnalysisStatus('RUNNING');
    setCurrentProcessingStep(0);

    try {
      let result: AnalysisResult;

      if (dataMode === 'REAL') {
        // Step progression simulation for UI feedback during API execution
        let currentStep = 0;
        const stepInterval = setInterval(() => {
          if (currentStep < DEFAULT_PIPELINE_STEPS.length - 1) {
            currentStep += 1;
            setCurrentProcessingStep(currentStep);
            setPipelineSteps(prev => 
              prev.map((step, idx) => ({
                ...step,
                status: idx < currentStep ? 'completed' : idx === currentStep ? 'running' : 'waiting',
                progress: idx < currentStep ? 100 : idx === currentStep ? 60 : 0
              }))
            );
          }
        }, 120);

        try {
          result = await apiService.runAnalysis(config);
          clearInterval(stepInterval);
        } catch (apiErr) {
          clearInterval(stepInterval);
          console.warn('Real backend call failed, falling back to local simulation:', apiErr);
          result = await analysisService.runAnalysis(
            config,
            (steps, activeIdx) => {
              setPipelineSteps([...steps]);
              setCurrentProcessingStep(activeIdx);
            }
          );
        }
      } else {
        // DEMO mode execution
        result = await analysisService.runAnalysis(
          config,
          (steps, activeIdx) => {
            setPipelineSteps([...steps]);
            setCurrentProcessingStep(activeIdx);
          }
        );
      }

      // 3. Complete and store result
      setPipelineSteps(prev => prev.map(s => ({ ...s, status: 'completed', progress: 100 })));
      setActiveResult(result);
      setAnalysisId(result.analysisId);
      setAnalysisStatus('COMPLETED');
      setAnalysisHistory(prev => [
        {
          analysisId: result.analysisId,
          districtId: config.districtId,
          districtName: config.districtId.toUpperCase(),
          period: `${config.startYear}–${config.endYear}`,
          domain: config.domain,
          classicalModel: config.classicalModel,
          quantumModel: config.quantumModel,
          status: 'COMPLETED',
          timestamp: new Date().toISOString(),
          accuracy: result.overallAccuracy.classical
        },
        ...prev.slice(0, 9)
      ]);
      return true;
    } catch {
      setAnalysisStatus('FAILED');
      return false;
    }
  };

  const loadHistoryAnalysis = async (histId: string): Promise<boolean> => {
    const found = await analysisService.getAnalysis(histId);
    if (found) {
      setActiveResult(found);
      setDistrictId(found.config.districtId);
      setStartYear(found.config.startYear);
      setEndYear(found.config.endYear);
      setDomainState(found.config.domain);
      setSatellite(found.config.satellite);
      setFeatures(found.config.features);
      setClassicalModel(found.config.classicalModel);
      setQuantumModel(found.config.quantumModel);
      setAnalysisId(found.analysisId);
      setAnalysisStatus('COMPLETED');
      return true;
    }
    return false;
  };

  const resetToDefaults = () => {
    setDistrictId('ysr_kadapa');
    setSelectedArea('District Boundary');
    setStartYear(2018);
    setEndYear(2026);
    setSelectedMonth('all');
    setTimePeriodMode('annual');
    setDomainState('agriculture');
    setSatellite('sentinel-2');
    setFeatures(['ndvi', 'spectral', 'texture', 'temporal']);
    setClassicalModel('random_forest');
    setQuantumModel('vqc');
    setQuantumConfigState(DEFAULT_QUANTUM_CONFIG);
    setAnalysisStatus('IDLE');
    setValidationErrors([]);
  };

  return (
    <AnalysisContext.Provider value={{
      districtId,
      selectedArea,
      startYear,
      endYear,
      selectedMonth,
      timePeriodMode,
      startDate,
      endDate,
      domain,
      satellite,
      features,
      classicalModel,
      quantumModel,
      quantumConfig,
      backendConnected,
      backendVersion,
      checkBackendHealth,
      dataMode,
      analysisMode: dataMode,
      analysisStatus,
      analysisId,
      isAnalyzing: analysisStatus === 'RUNNING',
      pipelineSteps,
      currentProcessingStep,
      activeResult,
      analysisHistory,
      validationErrors,
      setDistrictId,
      setSelectedArea,
      setTimelineRange,
      setTimePeriodMode,
      setDomain,
      setSatellite,
      setFeatures,
      toggleFeature,
      selectAllFeatures,
      clearAllFeatures,
      setRecommendedFeaturesForDomain,
      setClassicalModel,
      setQuantumModel,
      setQuantumConfig,
      setDataMode,
      runAnalysis,
      loadHistoryAnalysis,
      resetToDefaults
    }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};
