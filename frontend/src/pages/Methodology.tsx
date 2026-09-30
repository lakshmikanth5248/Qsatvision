import React from 'react';
import { 
  BookOpen, 
  Layers, 
  ArrowDown, 
  Satellite, 
  Sliders, 
  GitCommit, 
  Atom, 
  Zap, 
  CheckCircle, 
  Clock, 
  MapPin 
} from 'lucide-react';
import { QuantumDisclaimer } from '../components/common/DemoBadge';

export const Methodology: React.FC = () => {
  const pipelineStages = [
    {
      step: '01',
      title: 'Satellite Data Retrieval & Ingestion',
      category: 'CLASSICAL',
      categoryColor: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: Satellite,
      purpose: 'Query Sentinel-2 MSI (10m), Landsat 8/9 OLI (30m), and Sentinel-1 SAR C-Band radar tiles across all 26 districts of Andhra Pradesh.',
      input: 'USGS EarthExplorer / ESA Copernicus Dataspace API catalogs.',
      output: 'Multi-spectral Bottom-Of-Atmosphere (BOA) GeoTIFF rasters in EPSG:4326.',
      technologies: 'Rasterio, GDAL, STAC API, GeoPandas'
    },
    {
      step: '02',
      title: 'Preprocessing & Atmospheric Cloud Masking',
      category: 'CLASSICAL',
      categoryColor: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: Sliders,
      purpose: 'Detect and mask monsoon cloud obscuration, calculate Scene Classification Layers (SCL), and normalize radiance values.',
      input: 'Raw Top-of-Atmosphere (TOA) and BOA surface reflectance bands.',
      output: 'Calibrated reflectance matrices clipped to Andhra Pradesh district GeoJSON boundaries.',
      technologies: 'NumPy, SCL Bitmasking, OpenCV Atmospheric Correction'
    },
    {
      step: '03',
      title: 'Feature Extraction & Spectral Indexing',
      category: 'CLASSICAL',
      categoryColor: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: Layers,
      purpose: 'Derive biophysical indices: NDVI (vegetation vitality), NDWI (water boundaries), NDBI (built-up impervious surfaces), and SAR GLCM texture.',
      input: 'B2 (Blue), B3 (Green), B4 (Red), B8 (NIR), B11 (SWIR1), B12 (SWIR2), SAR_VV, SAR_VH.',
      output: '14-dimensional feature vector per geographic pixel coordinate.',
      technologies: 'Spectral Differencing Formulas, GLCM Gray-Level Co-occurrence'
    },
    {
      step: '04',
      title: 'Dimensionality Reduction (PCA to NISQ Register)',
      category: 'CLASSICAL',
      categoryColor: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: GitCommit,
      purpose: 'Project the 14-dimensional classical spectral space into 2–6 orthogonal principal components, avoiding exponential (2ⁿ) statevector explosion on classical CPUs.',
      input: '14-dimensional feature matrix X ∈ ℝ^(N×14).',
      output: '4 principal component vectors retaining >85% cumulative explained variance.',
      technologies: 'Scikit-Learn IncrementalPCA, Scree Analysis'
    },
    {
      step: '05',
      title: 'Quantum State Encoding (Hilbert Space Mapping)',
      category: 'QUANTUM',
      categoryColor: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Atom,
      purpose: 'Map classical normalized principal components into non-linear, multi-qubit Hilbert space (ℂ²)^⊗n via parameterized rotation gates.',
      input: 'Continuous 4-vector x = [x₁, x₂, x₃, x₄] scaled to [-π, π].',
      output: 'Quantum statevector |ψ(x)⟩ = U_encoding(x)|0⟩^⊗4 via Angle or ZZ Feature Maps.',
      technologies: 'Qiskit 2.5 Circuit Library, Statevector Simulator'
    },
    {
      step: '06',
      title: 'Quantum Machine Learning Execution (VQC / QSVM)',
      category: 'HYBRID',
      categoryColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Zap,
      purpose: 'Evaluate quantum state evolution: Variational Quantum Classifier (RealAmplitudes ansatz trained with COBYLA) or Quantum Kernel inner-product fidelity matrices K(xᵢ, xⱼ).',
      input: 'Encoded quantum state |ψ(x)⟩ and training reference labels.',
      output: 'Optimized variational parameter weights θ* and state projection probability distributions.',
      technologies: 'Qiskit Aer Engine, ParameterVector, COBYLA / LIBSVM'
    },
    {
      step: '07',
      title: 'Land Cover Classification',
      category: 'HYBRID',
      categoryColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle,
      purpose: 'Assign each pixel to one of four environmental classes: Dense Vegetation, Water Bodies, Urban Built-Up, or Barren / Fallow Land.',
      input: 'State probabilities and classical classifier outputs.',
      output: 'Categorized geospatial raster array with confusion matrix evaluation.',
      technologies: 'Scikit-Learn Metrics, Argmax Projection, Stratified Test Splits'
    },
    {
      step: '08',
      title: 'Temporal Change Detection (ΔNDVI, ΔNDWI, ΔNDBI)',
      category: 'CLASSICAL',
      categoryColor: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: Clock,
      purpose: 'Compare classified rasters and spectral indices between Year A and Year B to quantify expansion, contraction, or stable trajectories.',
      input: 'Multi-temporal observation rasters (e.g. 2018 vs 2026).',
      output: 'Net area change statistics (km²), directional percentages, and transition matrices.',
      technologies: 'Index Differencing, Area Statistics Engine'
    },
    {
      step: '09',
      title: 'Geospatial Visualization & Synchronized Mapping',
      category: 'CLASSICAL',
      categoryColor: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: MapPin,
      purpose: 'Render interactive dual synchronized Leaflet maps with dynamic layer toggles, historical trend charts, and exportable research dossiers.',
      input: 'Classified geo-arrays, boundary GeoJSON, and benchmark results.',
      output: 'Interactive map canvas, PDF research report, and CSV data downloads.',
      technologies: 'React-Leaflet, Esri World Imagery, Recharts, ReportLab'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Research Pipeline & Technical Methodology
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
            Nine-stage hybrid classical-quantum earth observation workflow from raw satellite radiance ingestion 
            to quantum statevector classification and geospatial reporting.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 font-bold">CLASSICAL</span>
          <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-bold">QUANTUM</span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">HYBRID</span>
        </div>
      </div>

      <QuantumDisclaimer />

      {/* Spectral Formula Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-card p-4 border border-white/50 shadow-xs space-y-2">
          <span className="text-xs font-bold text-emerald-700 block">NDVI (Normalized Vegetation Index)</span>
          <div className="p-2 rounded-xl bg-white/70 border border-slate-200 text-center font-mono text-xs font-bold text-slate-800">
            NDVI = (NIR - Red) / (NIR + Red)
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Quantifies chlorophyll absorption and green canopy density across agricultural acreage.
          </p>
        </div>

        <div className="glass-card p-4 border border-white/50 shadow-xs space-y-2">
          <span className="text-xs font-bold text-sky-700 block">NDWI (Normalized Water Index)</span>
          <div className="p-2 rounded-xl bg-white/70 border border-slate-200 text-center font-mono text-xs font-bold text-slate-800">
            NDWI = (Green - NIR) / (Green + NIR)
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Accentuates surface water body contours, reservoirs, and river channels while suppressing soil/vegetation.
          </p>
        </div>

        <div className="glass-card p-4 border border-white/50 shadow-xs space-y-2">
          <span className="text-xs font-bold text-indigo-700 block">NDBI (Normalized Built-Up Index)</span>
          <div className="p-2 rounded-xl bg-white/70 border border-slate-200 text-center font-mono text-xs font-bold text-slate-800">
            NDBI = (SWIR - NIR) / (SWIR + NIR)
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Distinguishes impervious urban built-up infrastructure from surrounding fallow and agricultural ground.
          </p>
        </div>
      </div>

      {/* 9-Stage Pipeline Workflow */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-slate-400">
          Nine-Stage Architecture Pipeline
        </h2>

        <div className="space-y-3">
          {pipelineStages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <React.Fragment key={stage.step}>
                <div className="glass-card p-5 border border-white/50 shadow-xs hover:border-indigo-200 transition-all space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-700 font-mono font-bold text-xs">
                        {stage.step}
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-slate-500" />
                        <h3 className="font-bold text-slate-900 text-sm">{stage.title}</h3>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${stage.categoryColor}`}>
                      {stage.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {stage.purpose}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-200/60">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Input Specification</span>
                      <span className="text-slate-800 font-medium">{stage.input}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-200/60">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Stage Output</span>
                      <span className="text-slate-800 font-medium">{stage.output}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-200/60">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Core Stack</span>
                      <span className="text-indigo-700 font-semibold">{stage.technologies}</span>
                    </div>
                  </div>
                </div>

                {idx < pipelineStages.length - 1 && (
                  <div className="flex justify-center">
                    <ArrowDown className="w-4 h-4 text-slate-300 animate-pulse" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
