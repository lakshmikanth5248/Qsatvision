import React, { useState } from 'react';
import { 
  Microscope, 
  MapPin, 
  Calendar, 
  Layers, 
  Sliders, 
  Cpu, 
  Atom, 
  Play, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  Search, 
  AlertCircle, 
  CheckSquare, 
  Square, 
  Info, 
  SlidersHorizontal, 
  Compass 
} from 'lucide-react';
import { useAnalysis } from '../context/AnalysisContext';
import { AP_DISTRICTS } from '../data/apDistrictsGeoJSON';
import { SATELLITE_DATASETS } from '../data/mockSatelliteData';
import type { ApplicationDomain, TimePeriodMode } from '../types';
import { GlassButton } from '../components/glass/GlassButton';
import { DemoDataBadge } from '../components/glass/GlassBadge';
import { CurrentAnalysisContextPanel } from '../components/common/CurrentAnalysisContextPanel';
import { ProcessingPipeline } from '../components/processing/ProcessingPipeline';

interface AnalyzeProps {
  setActiveTab: (tab: string) => void;
}

export const Analyze: React.FC<AnalyzeProps> = ({ setActiveTab }) => {
  const {
    districtId,
    setDistrictId,
    selectedArea,
    setSelectedArea,
    startYear,
    endYear,
    setTimelineRange,
    selectedMonth,
    timePeriodMode,
    setTimePeriodMode,
    domain,
    setDomain,
    satellite,
    setSatellite,
    features,
    toggleFeature,
    selectAllFeatures,
    clearAllFeatures,
    setRecommendedFeaturesForDomain,
    classicalModel,
    setClassicalModel,
    quantumModel,
    setQuantumModel,
    quantumConfig,
    isAnalyzing,
    analysisId,
    runAnalysis,
    validationErrors
  } = useAnalysis();

  const [step, setStep] = useState<number>(1);
  const [districtSearch, setDistrictSearch] = useState<string>('');
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false);

  const selectedDistrictObj = AP_DISTRICTS.find(d => d.id === districtId) || AP_DISTRICTS[0];

  // Filter districts by search
  const filteredDistricts = AP_DISTRICTS.filter(d => 
    d.name.toLowerCase().includes(districtSearch.toLowerCase()) ||
    d.code.toLowerCase().includes(districtSearch.toLowerCase()) ||
    d.hq.toLowerCase().includes(districtSearch.toLowerCase())
  );

  const handleLaunchAnalysis = async () => {
    setAnalysisComplete(false);
    const success = await runAnalysis();
    if (success) {
      setAnalysisComplete(true);
    }
  };

  const isInvalidTime = endYear < startYear;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center">
              <Microscope className="w-5 h-5 text-sky-700" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#152238] font-sans">
                Connected Analysis Workflow Wizard
              </h1>
              <p className="text-xs text-[#46566E] font-medium">
                End-to-end 7-step hybrid classical–quantum geospatial configuration & execution pipeline.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="liquid-glass-pill px-3 py-1.5 text-xs text-sky-950 font-bold border border-sky-400/40">
            Step 0{step} of 07
          </span>
          <DemoDataBadge text="PHASE 2 WORKFLOW" />
        </div>
      </div>

      <CurrentAnalysisContextPanel />

      {/* Validation Error Banner (PART 18) */}
      {validationErrors.length > 0 && (
        <div className="liquid-glass p-4 rounded-3xl border-rose-400/60 bg-rose-50/50 space-y-2">
          <div className="flex items-center gap-2 text-rose-900 font-bold text-xs font-sans">
            <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
            <span>Configuration Validation Alert:</span>
          </div>
          <ul className="list-disc list-inside text-xs text-rose-800 space-y-1 font-medium pl-1">
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 7-Step Wizard Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 liquid-glass-pill p-1.5 border border-white/70 text-xs font-sans shadow-xs">
        {[
          { id: 1, label: '1. Location' },
          { id: 2, label: '2. Time' },
          { id: 3, label: '3. Domain' },
          { id: 4, label: '4. Dataset' },
          { id: 5, label: '5. Features' },
          { id: 6, label: '6. ML Models' },
          { id: 7, label: '7. Launch' },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => setStep(s.id)}
            disabled={isAnalyzing}
            className={`py-2 px-3 rounded-full font-medium transition-all text-center ${
              step === s.id
                ? 'bg-sky-500/20 text-sky-950 font-extrabold border border-sky-400/50 shadow-xs'
                : step > s.id
                ? 'bg-emerald-500/15 text-emerald-900 border border-emerald-400/40 font-semibold'
                : 'bg-white/20 text-[#46566E] hover:text-[#172033] hover:bg-white/40'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Main Step Canvas */}
      <div className="liquid-glass p-6 lg:p-8 space-y-6 rounded-3xl">
        {/* STEP 1: LOCATION (PART 3) */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#172033] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-sky-700" /> Step 1: Select Target Location in Andhra Pradesh
                </h3>
                <p className="text-xs text-[#46566E]">
                  Choose from all 26 official AP districts or search by name / headquarters.
                </p>
              </div>
              <span className="liquid-glass-pill px-3 py-1 text-xs text-sky-950 font-bold border border-sky-400/30">
                26 Districts Available
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search AP districts (e.g. YSR Kadapa, Tirupati, Visakhapatnam)..."
                value={districtSearch}
                onChange={(e) => setDistrictSearch(e.target.value)}
                className="w-full bg-white/35 backdrop-blur-md border border-white/70 rounded-2xl pl-11 pr-4 py-3 text-xs text-[#172033] focus:outline-none focus:border-sky-500 font-semibold shadow-xs"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#46566E] font-semibold block mb-2">Target District</label>
                <select
                  value={districtId}
                  onChange={(e) => setDistrictId(e.target.value)}
                  className="w-full bg-white/35 backdrop-blur-md border border-white/70 rounded-2xl px-4 py-3 text-xs text-[#172033] focus:outline-none focus:border-sky-500 font-semibold shadow-xs cursor-pointer"
                >
                  {filteredDistricts.map((d) => (
                    <option key={d.id} value={d.id} className="bg-slate-100 text-slate-900">
                      {d.name} ({d.code}) — {d.region}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-[#46566E] font-semibold block mb-2">Area Boundary Scope</label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full bg-white/35 backdrop-blur-md border border-white/70 rounded-2xl px-4 py-3 text-xs text-[#172033] focus:outline-none focus:border-sky-500 font-semibold shadow-xs cursor-pointer"
                >
                  <option value="District Boundary" className="bg-slate-100 text-slate-900">District Boundary (Full Extents)</option>
                  <option value="Headquarters Urban Core" className="bg-slate-100 text-slate-900">Headquarters Urban Core ({selectedDistrictObj.hq})</option>
                  <option value="Agricultural Belt Zone" className="bg-slate-100 text-slate-900">Agricultural Belt Zone</option>
                  <option value="Water Basin Catchment" className="bg-slate-100 text-slate-900">Water Basin Catchment</option>
                </select>
              </div>
            </div>

            {/* Selected District Metadata Card (PART 3) */}
            <div className="bg-white/25 backdrop-blur-md p-4 rounded-2xl border border-white/60 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-900 uppercase tracking-wide font-sans">
                  Selected Geographic Coordinates & Extents
                </span>
                <span className="text-[10px] text-[#46566E] font-mono">Official Survey Data</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-[#46566E] block font-medium">Headquarters</span>
                  <strong className="text-[#172033]">{selectedDistrictObj.hq}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#46566E] block font-medium">Region</span>
                  <strong className="text-[#172033]">{selectedDistrictObj.region}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#46566E] block font-medium">Total Area</span>
                  <strong className="font-mono text-[#172033]">{selectedDistrictObj.areaSqKm.toLocaleString()} km²</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#46566E] block font-medium">Center Coordinates</span>
                  <strong className="font-mono text-sky-900">[{selectedDistrictObj.center[0].toFixed(4)}, {selectedDistrictObj.center[1].toFixed(4)}]</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: TIME (PART 3) */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#172033] flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-700" /> Step 2: Select Historical Time Range
                </h3>
                <p className="text-xs text-[#46566E]">
                  Define observation window between 2010 and 2026.
                </p>
              </div>
              <span className="liquid-glass-pill px-3 py-1 text-xs text-emerald-950 font-bold border border-emerald-400/30">
                Archive: 2010–2026
              </span>
            </div>

            {/* Time Period Mode Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#46566E] font-semibold">Period Mode:</span>
              <div className="flex items-center gap-1.5 liquid-glass-pill p-1 border border-white/60">
                {(['annual', 'monthly', 'custom'] as TimePeriodMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setTimePeriodMode(m)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                      timePeriodMode === m
                        ? 'bg-emerald-500/20 text-emerald-950 border border-emerald-400/40 shadow-xs'
                        : 'text-[#46566E] hover:text-[#172033]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#46566E] font-semibold block mb-2">Baseline Start Year</label>
                <select
                  value={startYear}
                  onChange={(e) => setTimelineRange(Number(e.target.value), endYear, selectedMonth)}
                  className="w-full bg-white/35 backdrop-blur-md border border-white/70 rounded-2xl px-4 py-3 text-xs text-[#172033] focus:outline-none focus:border-sky-500 font-semibold shadow-xs cursor-pointer"
                >
                  {Array.from({ length: 16 }, (_, i) => 2010 + i).map((y) => (
                    <option key={y} value={y} className="bg-slate-100 text-slate-900">{y} BASELINE</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-[#46566E] font-semibold block mb-2">Target Evaluation Year</label>
                <select
                  value={endYear}
                  onChange={(e) => setTimelineRange(startYear, Number(e.target.value), selectedMonth)}
                  className="w-full bg-white/35 backdrop-blur-md border border-white/70 rounded-2xl px-4 py-3 text-xs text-[#172033] focus:outline-none focus:border-sky-500 font-semibold shadow-xs cursor-pointer"
                >
                  {Array.from({ length: 17 }, (_, i) => 2010 + i).map((y) => (
                    <option key={y} value={y} className="bg-slate-100 text-slate-900">{y} EVALUATION</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Validation Warning if end < start */}
            {isInvalidTime && (
              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-400/60 text-xs text-rose-900 flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                <span>Validation Error: Target evaluation year ({endYear}) cannot be earlier than baseline start year ({startYear}).</span>
              </div>
            )}

            {/* Simulated Historical Source Note (PART 3) */}
            <div className="bg-white/25 backdrop-blur-md p-3.5 rounded-2xl border border-white/60 text-xs text-[#46566E] flex items-start gap-2 shadow-xs">
              <Info className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#172033] block">Historical Sensor Availability:</strong>
                <span>Historical source selection is simulated for Phase 2. Note: Sentinel-2 optical imagery is available from 2015 onwards; earlier baselines (2010–2014) are mapped to Landsat 8/7 archive in the demo.</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: APPLICATION DOMAIN (PART 3) */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#172033] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-700" /> Step 3: Choose Application Focus Domain
                </h3>
                <p className="text-xs text-[#46566E]">
                  Select the domain of interest. This automatically updates prototype feature recommendations.
                </p>
              </div>
              <span className="liquid-glass-pill px-3 py-1 text-xs text-amber-950 font-bold border border-amber-400/30">
                4 Domains
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { 
                  id: 'agriculture', 
                  title: '🌾 Agriculture & Crop Health', 
                  desc: 'Crop canopy health, NDVI vegetation index, agricultural land classification, and double-crop seasonal shifts.',
                  bullets: ['Land-use classification', 'Crop/vegetation analysis', 'NDVI spectral index', 'Agricultural seasonal change']
                },
                { 
                  id: 'water', 
                  title: '💧 Water Bodies & Reservoirs', 
                  desc: 'Surface water detection, NDWI water body index, reservoir volume fluctuation, and seasonal catchment shrinkage.',
                  bullets: ['Water-body detection', 'NDWI spectral absorption', 'Water-area change', 'Seasonal shoreline variation']
                },
                { 
                  id: 'urban', 
                  title: '🏙️ Urban Sprawl & Built-Up', 
                  desc: 'Impervious surface expansion, NDBI built-up index, road infrastructure tracking, and peri-urban land conversion.',
                  bullets: ['Built-up classification', 'NDBI index', 'Urban expansion corridors', 'Impervious land-use change']
                },
                { 
                  id: 'disaster', 
                  title: '🚨 Disaster & Flood Assessment', 
                  desc: 'Coastal cyclone inundation, flash flood extent mapping, drought severity estimation, and emergency change detection.',
                  bullets: ['Flood-related inundation', 'Cyclone impact tracking', 'Vegetation disturbance', 'Before/after event analysis']
                },
              ].map((d) => (
                <div
                  key={d.id}
                  onClick={() => setDomain(d.id as ApplicationDomain)}
                  className={`p-5 rounded-3xl border cursor-pointer transition-all space-y-3 ${
                    domain === d.id
                      ? 'bg-sky-500/20 border-sky-400/60 shadow-md ring-2 ring-sky-400/30'
                      : 'bg-white/25 border-white/60 text-[#34445B] hover:bg-white/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-base text-[#172033]">{d.title}</h4>
                    {domain === d.id && <CheckCircle2 className="w-5 h-5 text-sky-700" />}
                  </div>
                  <p className="text-xs text-[#46566E] leading-relaxed">{d.desc}</p>
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] font-medium text-[#172033]">
                    {d.bullets.map((b, bIdx) => (
                      <span key={bIdx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: DATASET SOURCE (PART 3) */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#172033] flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-700" /> Step 4: Select Satellite Dataset Source
                </h3>
                <p className="text-xs text-[#46566E]">
                  Select multi-spectral optical or radar earth observation imagery source.
                </p>
              </div>
              <span className="liquid-glass-pill px-3 py-1 text-xs text-purple-950 font-bold border border-purple-400/30">
                Multi-Mission Archive
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SATELLITE_DATASETS.map((sat) => (
                <div
                  key={sat.id}
                  onClick={() => setSatellite(sat.id)}
                  className={`p-5 rounded-3xl border cursor-pointer transition-all space-y-2 ${
                    satellite === sat.id
                      ? 'bg-purple-500/20 border-purple-400/60 shadow-md ring-2 ring-purple-400/30'
                      : 'bg-white/25 border-white/60 text-[#34445B] hover:bg-white/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-[#172033]">{sat.name}</h4>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-900 border border-purple-400/30 font-mono font-bold">
                      {sat.resolution}
                    </span>
                  </div>
                  <p className="text-xs text-[#46566E]">{sat.provider} • Revisit: {sat.revisitDays} days • Cloud Cover: {sat.cloudCoverAvg}</p>
                  
                  <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-600">Archive Range: {sat.availableYears[0]}–{sat.availableYears[1]}</span>
                    <span className="text-emerald-800 font-bold">Status: {sat.status}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Source Availability Status Area (PART 3) */}
            <div className="bg-white/25 backdrop-blur-md p-3.5 rounded-2xl border border-white/60 text-xs text-[#46566E] flex items-start gap-2 shadow-xs">
              <Info className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#172033] block">Dataset Availability Policy (DEMO MODE):</strong>
                <span>Source availability is simulated for Phase 2. Sentinel-2 provides high 10m resolution for modern years (2015+), Landsat provides deep historical continuity (2010+), and Sentinel-1 SAR offers all-weather cloud-penetrating radar.</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: FEATURES (PART 3) */}
        {step === 5 && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#172033] flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-sky-700" /> Step 5: Feature Extraction Selection
                </h3>
                <p className="text-xs text-[#46566E]">
                  Select spectral, index, and spatial features extracted for classical and quantum classification.
                </p>
              </div>

              {/* Quick Feature Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={selectAllFeatures}
                  className="liquid-glass-pill px-3 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-white/60"
                >
                  Select All
                </button>
                <button
                  onClick={clearAllFeatures}
                  className="liquid-glass-pill px-3 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-white/60"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setRecommendedFeaturesForDomain(domain)}
                  className="liquid-glass-pill px-3 py-1 text-xs font-bold text-sky-950 bg-sky-500/15 border border-sky-400/40"
                >
                  Prototype Recommendation ({domain})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { id: 'spectral' as const, label: 'Multi-Spectral Bands', desc: 'Raw surface reflectance (Red, Green, Blue, NIR, SWIR)' },
                { id: 'ndvi' as const, label: 'NDVI Vegetation Index', desc: '(NIR - Red) / (NIR + Red) canopy chlorophyll density' },
                { id: 'ndwi' as const, label: 'NDWI Water Index', desc: '(Green - NIR) / (Green + NIR) surface water absorption' },
                { id: 'ndbi' as const, label: 'NDBI Built-Up Index', desc: '(SWIR - NIR) / (SWIR + NIR) impervious surface index' },
                { id: 'texture' as const, label: 'GLCM Texture Metrics', desc: 'Gray-level co-occurrence matrix spatial heterogeneity' },
                { id: 'temporal' as const, label: 'Temporal PCA Time-Series', desc: 'Multi-temporal principal component shift vectors' },
                { id: 'land_cover' as const, label: 'Land Cover Baseline Mask', desc: 'Pre-computed geometric training partition masks' },
              ].map((f) => {
                const isSelected = features.includes(f.id);
                return (
                  <button
                    key={f.id}
                    onClick={() => toggleFeature(f.id)}
                    className={`p-4 rounded-2xl border text-xs text-left transition-all space-y-1.5 ${
                      isSelected
                        ? 'bg-sky-500/20 border-sky-400/60 text-sky-950 font-bold shadow-xs'
                        : 'bg-white/25 border-white/60 text-[#46566E] hover:text-[#172033] hover:bg-white/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#172033]">{f.label}</span>
                      {isSelected ? <CheckSquare className="w-4 h-4 text-sky-700" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </div>
                    <p className="text-[11px] text-[#46566E] font-normal leading-snug">{f.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="text-[11px] text-[#46566E] italic">
              * Note: Prototype recommendations are curated baseline presets for demonstration and not claimed as mathematically optimal.
            </div>
          </div>
        )}

        {/* STEP 6: ML MODELS (PART 3) */}
        {step === 6 && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#172033] flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-sky-700" /> Step 6: Select Classical & Quantum Machine Learning Models
                </h3>
                <p className="text-xs text-[#46566E]">
                  Select the classical baseline algorithm and quantum model architecture.
                </p>
              </div>
              <span className="liquid-glass-pill px-3 py-1 text-xs text-sky-950 font-bold border border-sky-400/30">
                Hybrid Architecture
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Classical Models */}
              <div className="space-y-3 bg-white/25 backdrop-blur-md p-5 rounded-3xl border border-white/60 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <h4 className="text-xs text-[#172033] uppercase font-bold flex items-center gap-1.5 font-mono">
                    <Cpu className="w-4 h-4 text-sky-700" /> Classical ML Baseline
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">32 Features</span>
                </div>

                {[
                  { id: 'random_forest' as const, label: 'Random Forest Classifier', desc: '100 decision tree ensemble with Gini impurity splitting.' },
                  { id: 'svm' as const, label: 'Support Vector Machine (RBF)', desc: 'Radial basis function kernel for non-linear boundaries.' },
                  { id: 'xgboost' as const, label: 'XGBoost Gradient Boosting', desc: 'Iterative residual error minimization decision trees.' }
                ].map((m) => (
                  <label key={m.id} className="flex items-start gap-3 p-3 rounded-2xl border border-white/50 bg-white/20 cursor-pointer hover:bg-white/40 transition-colors">
                    <input
                      type="radio"
                      name="classical"
                      checked={classicalModel === m.id}
                      onChange={() => setClassicalModel(m.id)}
                      className="accent-sky-700 mt-1"
                    />
                    <div>
                      <span className="font-bold text-xs text-[#172033] block">{m.label}</span>
                      <span className="text-[11px] text-[#46566E]">{m.desc}</span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Quantum Models */}
              <div className="space-y-3 glass-quantum p-5 rounded-3xl border border-purple-300/40 shadow-xs">
                <div className="flex items-center justify-between border-b border-purple-200/60 pb-2">
                  <h4 className="text-xs text-purple-950 uppercase font-bold flex items-center gap-1.5 font-mono">
                    <Atom className="w-4 h-4 text-purple-700" /> Quantum ML (QML) Architecture
                  </h4>
                  <span className="text-[10px] text-purple-900 font-mono font-bold">4-Qubit Register</span>
                </div>

                {[
                  { id: 'vqc' as const, label: 'Variational Quantum Classifier (VQC)', desc: 'Primary prototype algorithm with parameterized rotations and entangling CNOT layers.', tag: 'PROTOTYPE' },
                  { id: 'quantum_kernel' as const, label: 'Quantum Kernel Alignment (QKA)', desc: 'Maps data to high-dimensional Hilbert space kernel Gram matrix.', tag: 'PROTOTYPE' },
                  { id: 'qnn' as const, label: 'Quantum Neural Network (QNN)', desc: 'Multi-layer parameterized quantum perceptron circuit.', tag: 'PLANNED / EXPERIMENTAL' }
                ].map((qm) => (
                  <label key={qm.id} className="flex items-start gap-3 p-3 rounded-2xl border border-purple-200/50 bg-white/20 cursor-pointer hover:bg-white/40 transition-colors">
                    <input
                      type="radio"
                      name="quantum"
                      checked={quantumModel === qm.id}
                      onChange={() => setQuantumModel(qm.id)}
                      className="accent-purple-700 mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-purple-950">{qm.label}</span>
                        <span className="liquid-glass-pill px-2 py-0.5 text-[9px] font-mono font-bold text-purple-900 border border-purple-400/40">
                          {qm.tag}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#46566E]">{qm.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Feature Dimension Breakdown Box */}
            <div className="bg-white/25 backdrop-blur-md p-4 rounded-2xl border border-white/60 text-xs flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <Compass className="w-5 h-5 text-sky-700" />
                <div>
                  <strong className="text-[#172033] block">Architectural Dimensionality Mapping:</strong>
                  <span className="text-[#46566E]">Classical model processes full multi-spectral feature vectors (32 dims); Quantum model receives top 4 PCA components encoded via ZZ Feature Map on 4 qubits.</span>
                </div>
              </div>
              <DemoDataBadge text="HYBRID COUPLING" />
            </div>
          </div>
        )}

        {/* STEP 7: QUANTUM CONFIGURATION & SUMMARY (PART 3, 4, 5) */}
        {step === 7 && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#172033] flex items-center gap-2">
                  <Play className="w-5 h-5 text-sky-700" /> Step 7: Quantum Configuration, Review & Execution
                </h3>
                <p className="text-xs text-[#46566E]">
                  Review technical hyperparameters and launch connected Phase 2 demo pipeline.
                </p>
              </div>
              <span className="liquid-glass-pill px-3 py-1 text-xs text-purple-950 font-bold border border-purple-400/30">
                Ready to Launch
              </span>
            </div>

            {/* Compact Technical Quantum Configuration Panel (PART 3 STEP 7) */}
            <div className="glass-quantum p-5 rounded-3xl border border-purple-300/40 space-y-3">
              <div className="flex items-center justify-between border-b border-purple-200/60 pb-2">
                <span className="text-xs font-bold text-purple-950 uppercase tracking-wider font-mono flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-purple-700" />
                  Quantum Circuit Hyperparameters (CONFIGURATION ONLY)
                </span>
                <span className="liquid-glass-pill px-2.5 py-0.5 text-[10px] text-amber-900 font-mono font-bold border border-amber-400/40 bg-amber-50/70">
                  CONFIGURATION ONLY
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
                <div className="bg-white/30 p-2.5 rounded-xl border border-white/60">
                  <span className="text-[10px] text-slate-500 block">Model</span>
                  <strong className="text-purple-950 uppercase">{quantumModel}</strong>
                </div>
                <div className="bg-white/30 p-2.5 rounded-xl border border-white/60">
                  <span className="text-[10px] text-slate-500 block">Encoding</span>
                  <strong className="text-purple-950">{quantumConfig.encodingMethod}</strong>
                </div>
                <div className="bg-white/30 p-2.5 rounded-xl border border-white/60">
                  <span className="text-[10px] text-slate-500 block">Qubits</span>
                  <strong className="text-purple-950 font-bold">{quantumConfig.qubits} Qubits</strong>
                </div>
                <div className="bg-white/30 p-2.5 rounded-xl border border-white/60">
                  <span className="text-[10px] text-slate-500 block">Depth</span>
                  <strong className="text-purple-950 font-bold">{quantumConfig.circuitDepth} Layers</strong>
                </div>
                <div className="bg-white/30 p-2.5 rounded-xl border border-white/60">
                  <span className="text-[10px] text-slate-500 block">Backend</span>
                  <strong className="text-purple-950">QASM Simulator</strong>
                </div>
                <div className="bg-white/30 p-2.5 rounded-xl border border-white/60">
                  <span className="text-[10px] text-slate-500 block">Shots</span>
                  <strong className="text-purple-950">{quantumConfig.shots} Shots</strong>
                </div>
              </div>
            </div>

            {/* Complete Configuration Summary Card (PART 4) */}
            <div className="liquid-glass p-5 rounded-3xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                <h4 className="text-xs uppercase font-bold text-[#172033] font-mono tracking-wider">
                  Analysis Configuration Summary
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-sky-700 hover:text-sky-900 font-semibold underline cursor-pointer"
                  >
                    Edit Configuration
                  </button>
                  <DemoDataBadge text="DEMO DATA" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white/25 p-3 rounded-2xl border border-white/60">
                  <span className="text-[10px] text-[#46566E] block font-medium">Location</span>
                  <strong className="text-[#172033]">{selectedDistrictObj.name} District</strong>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{selectedArea}</span>
                </div>
                <div className="bg-white/25 p-3 rounded-2xl border border-white/60">
                  <span className="text-[10px] text-[#46566E] block font-medium">Period</span>
                  <strong className="text-emerald-800 font-mono">{startYear} → {endYear}</strong>
                  <span className="text-[10px] text-slate-500 block mt-0.5 capitalize">{timePeriodMode} mode</span>
                </div>
                <div className="bg-white/25 p-3 rounded-2xl border border-white/60">
                  <span className="text-[10px] text-[#46566E] block font-medium">Domain & Dataset</span>
                  <strong className="text-amber-800 capitalize">{domain}</strong>
                  <span className="text-[10px] text-slate-500 block mt-0.5 uppercase">{satellite}</span>
                </div>
                <div className="bg-white/25 p-3 rounded-2xl border border-white/60">
                  <span className="text-[10px] text-[#46566E] block font-medium">Coupled Models</span>
                  <strong className="text-sky-900 capitalize">{classicalModel.replace('_', ' ')}</strong>
                  <span className="text-[10px] text-purple-900 block mt-0.5 font-bold uppercase">+ {quantumModel} (4Q)</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[11px] text-[#46566E] font-medium block mb-1">Selected Features ({features.length}):</span>
                <div className="flex flex-wrap gap-1.5">
                  {features.map((feat) => (
                    <span key={feat} className="liquid-glass-pill px-2.5 py-0.5 text-[10px] font-mono text-[#172033] border border-white/60">
                      {feat.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Live 8-Stage Processing Pipeline View (PART 6 & 7) */}
            {isAnalyzing && (
              <ProcessingPipeline />
            )}

            {/* Results Ready Confirmation Banner */}
            {analysisComplete && !isAnalyzing && (
              <div className="liquid-glass p-5 rounded-3xl border border-emerald-400/50 bg-emerald-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    <div>
                      <h4 className="font-bold text-sm text-[#172033] font-sans">
                        Analysis Complete — Results Ready!
                      </h4>
                      <p className="text-xs text-[#46566E] font-mono">
                        Generated Analysis ID: <strong>{analysisId}</strong> • Status: <strong>COMPLETED (DEMO DATA)</strong>
                      </p>
                    </div>
                  </div>

                  <GlassButton
                    variant="primary"
                    size="md"
                    icon={ArrowRight}
                    iconPosition="right"
                    onClick={() => setActiveTab('results')}
                  >
                    Open Results Dashboard
                  </GlassButton>
                </div>
              </div>
            )}

            {/* Launch Action Button */}
            <div className="pt-2">
              <GlassButton
                variant="primary"
                size="lg"
                icon={isAnalyzing ? Loader2 : Play}
                className="w-full text-base py-4"
                disabled={isAnalyzing || isInvalidTime}
                onClick={handleLaunchAnalysis}
              >
                {isAnalyzing ? 'EXECUTING HYBRID DEMO PIPELINE...' : 'RUN ANALYSIS (EXECUTE DEMO PIPELINE)'}
              </GlassButton>
            </div>
          </div>
        )}

        {/* Wizard Previous / Next Buttons */}
        <div className="flex justify-between pt-4 border-t border-slate-200/60 text-xs">
          <GlassButton
            variant="secondary"
            size="sm"
            icon={ArrowLeft}
            disabled={step === 1 || isAnalyzing}
            onClick={() => setStep(step - 1)}
          >
            Previous
          </GlassButton>

          {step < 7 && (
            <GlassButton
              variant="primary"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
              disabled={isAnalyzing || (step === 2 && isInvalidTime)}
              onClick={() => setStep(step + 1)}
            >
              Next Step
            </GlassButton>
          )}
        </div>
      </div>
    </div>
  );
};
