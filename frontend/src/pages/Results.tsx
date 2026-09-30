import React, { useState } from 'react';
import { ResultsMapView } from '../components/maps/ResultsMapView';
import { TrendChart } from '../components/charts/TrendChart';
import { HistoricalTrendsView } from '../components/charts/HistoricalTrendsView';
import { DualCompareMap } from '../components/maps/DualCompareMap';
import { DistrictCompChart } from '../components/charts/DistrictCompChart';
import { useAnalysis } from '../context/AnalysisContext';
import { AP_DISTRICTS } from '../data/apDistrictsGeoJSON';
import { DemoDataBadge } from '../components/glass/GlassBadge';
import { GlassButton } from '../components/glass/GlassButton';
import { CurrentAnalysisContextPanel } from '../components/common/CurrentAnalysisContextPanel';
import { BenchmarkTable } from '../components/charts/BenchmarkTable';
import { QuantumCircuit } from '../components/quantum/QuantumCircuit';
import { 
  RotateCcw, 
  Sliders, 
  GitCompare, 
  History, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  FileText,
  Download,
  Eye
} from 'lucide-react';

interface ResultsProps {
  setActiveTab: (tab: string) => void;
}

export type ResultsTabMode = 
  | 'single'
  | 'trends'
  | 'before_after'
  | 'district'
  | 'year'
  | 'month';

export const Results: React.FC<ResultsProps> = ({ setActiveTab }) => {
  const { 
    districtId, 
    activeResult, 
    startYear, 
    endYear, 
    domain, 
    satellite, 
    analysisId,
    classicalModel,
    quantumModel,
    quantumConfig,
    dataMode,
    analysisHistory,
    loadHistoryAnalysis,
    runAnalysis
  } = useAnalysis();

  const [activeResultsSubTab, setActiveResultsSubTab] = useState<ResultsTabMode>('single');
  const [isRerunning, setIsRerunning] = useState<boolean>(false);
  const districtObj = AP_DISTRICTS.find(d => d.id === districtId) || AP_DISTRICTS[0];

  const handleRunAgain = async () => {
    setIsRerunning(true);
    await runAnalysis();
    setIsRerunning(false);
  };

  const handleLoadHistory = async (histId: string) => {
    await loadHistoryAnalysis(histId);
  };

  /**
   * Export structured Report-Ready Data Object (Part 15)
   */
  const handleExportReportReadyData = () => {
    const reportReadyObject = {
      reportSchemaVersion: "1.0-report-ready",
      exportedAt: new Date().toISOString(),
      location: {
        districtId: districtObj.id,
        districtName: districtObj.name,
        code: districtObj.code,
        region: districtObj.region,
        areaSqKm: districtObj.areaSqKm,
        coordinates: districtObj.center
      },
      timePeriod: {
        startYear,
        endYear,
        window: `${startYear}–${endYear}`,
        archiveSpan: "2010–2026"
      },
      application: domain,
      dataset: {
        source: satellite,
        resolution: "10m GSD (Sentinel-2 / Landsat)",
        processingLevel: "Level-2A Surface Reflectance"
      },
      features: activeResult?.config.features || ['ndvi', 'spectral', 'texture', 'temporal'],
      model: {
        classical: classicalModel,
        quantum: quantumModel,
        quantumConfig: quantumConfig
      },
      metrics: activeResult?.metrics || {},
      accuracyComparison: activeResult?.overallAccuracy || {},
      historicalValues: activeResult?.temporalTrend || [],
      classification: activeResult?.classificationBreakdown || [],
      changeDetection: activeResult?.changeBreakdown || [],
      areaChangeStats: activeResult?.areaChangeStats || [],
      keyFindings: activeResult?.keyFindings || [],
      demoStatus: dataMode === 'DEMO' ? 'DEMO DATA' : 'REAL MEASUREMENT EVALUATION',
      scientificIntegrityNotice: "QML is benchmarked as an empirical research feature alongside classical models without claiming unproven quantum advantage."
    };

    const blob = new Blob([JSON.stringify(reportReadyObject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `QuantumSat-AP-Report-Ready-${districtObj.code}-${startYear}_${endYear}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. RESULTS HEADER */}
      <div className="liquid-glass-strong p-6 lg:p-8 rounded-3xl space-y-4 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-sky-800 uppercase tracking-widest font-sans">
                ANALYSIS RESULTS & SYNTHESIS
              </span>
              <span className="liquid-glass-pill px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-900 border border-emerald-400/40 bg-emerald-50/70">
                STATUS: COMPLETED
              </span>
              {dataMode === 'REAL' ? (
                <span className="liquid-glass-pill px-2.5 py-0.5 text-[10px] font-mono font-bold text-sky-950 border border-sky-400/40 bg-sky-50/70">
                  REAL ML/QML PIPELINE
                </span>
              ) : (
                <DemoDataBadge text="DEMO DATA" />
              )}
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-[#152238] tracking-tight uppercase font-sans">
              {districtObj.name} District ({districtObj.code})
            </h1>
            <p className="text-xs text-[#46566E] mt-0.5 font-medium">
              Observation Window: <strong className="font-mono text-emerald-800">{startYear} → {endYear}</strong> • Domain: <strong className="capitalize text-[#172033]">{domain}</strong> • Source: <strong className="uppercase text-[#172033]">{satellite}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="liquid-glass-pill px-3.5 py-1.5 text-xs font-mono font-bold text-sky-950 border border-sky-400/40 shadow-xs">
              ID: {analysisId}
            </span>
            <DemoDataBadge text="DEMO DATA" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <GlassButton
              variant="primary"
              size="sm"
              icon={RotateCcw}
              disabled={isRerunning}
              onClick={handleRunAgain}
            >
              {isRerunning ? 'Rerunning Pipeline...' : 'Run Again'}
            </GlassButton>

            <GlassButton
              variant="secondary"
              size="sm"
              icon={Sliders}
              onClick={() => setActiveTab('analyze')}
            >
              Modify Configuration
            </GlassButton>

            <GlassButton
              variant="secondary"
              size="sm"
              icon={GitCompare}
              onClick={() => setActiveTab('compare')}
            >
              Advanced Compare Module
            </GlassButton>
          </div>

          <div className="flex items-center gap-2">
            <GlassButton
              variant="secondary"
              size="sm"
              icon={Download}
              onClick={handleExportReportReadyData}
            >
              Download Report-Ready JSON
            </GlassButton>

            <GlassButton
              variant="secondary"
              size="sm"
              icon={FileText}
              onClick={() => setActiveTab('reports')}
            >
              PDF Reports
            </GlassButton>
          </div>
        </div>
      </div>

      {/* 2. RESULTS INTEGRATION TABS (PART 14) */}
      <div className="flex flex-wrap items-center gap-2 liquid-glass-pill p-1.5 border border-white/70 shadow-xs">
        <button
          onClick={() => setActiveResultsSubTab('single')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            activeResultsSubTab === 'single'
              ? 'bg-sky-500/20 text-sky-950 font-extrabold border border-sky-400/50 shadow-xs'
              : 'text-[#46566E] hover:text-[#172033]'
          }`}
        >
          Single Analysis
        </button>

        <button
          onClick={() => setActiveResultsSubTab('trends')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            activeResultsSubTab === 'trends'
              ? 'bg-sky-500/20 text-sky-950 font-extrabold border border-sky-400/50 shadow-xs'
              : 'text-[#46566E] hover:text-[#172033]'
          }`}
        >
          Historical Trends
        </button>

        <button
          onClick={() => setActiveResultsSubTab('before_after')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            activeResultsSubTab === 'before_after'
              ? 'bg-sky-500/20 text-sky-950 font-extrabold border border-sky-400/50 shadow-xs'
              : 'text-[#46566E] hover:text-[#172033]'
          }`}
        >
          Before / After Analysis
        </button>

        <button
          onClick={() => setActiveResultsSubTab('district')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            activeResultsSubTab === 'district'
              ? 'bg-sky-500/20 text-sky-950 font-extrabold border border-sky-400/50 shadow-xs'
              : 'text-[#46566E] hover:text-[#172033]'
          }`}
        >
          District Comparison
        </button>

        <button
          onClick={() => setActiveResultsSubTab('year')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            activeResultsSubTab === 'year'
              ? 'bg-sky-500/20 text-sky-950 font-extrabold border border-sky-400/50 shadow-xs'
              : 'text-[#46566E] hover:text-[#172033]'
          }`}
        >
          Year Comparison
        </button>

        <button
          onClick={() => setActiveResultsSubTab('month')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            activeResultsSubTab === 'month'
              ? 'bg-sky-500/20 text-sky-950 font-extrabold border border-sky-400/50 shadow-xs'
              : 'text-[#46566E] hover:text-[#172033]'
          }`}
        >
          Month Comparison
        </button>
      </div>

      <CurrentAnalysisContextPanel />

      {/* 3. TAB CONTENT ROUTING */}
      {activeResultsSubTab === 'single' && (
        <div className="space-y-8">
          {/* THEMATIC RESULT MAP & BREAKDOWN */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Thematic Results Map */}
            <div className="lg:col-span-2 space-y-4">
              <ResultsMapView />
            </div>

            {/* Right Col: Classification & Change Breakdown */}
            <div className="space-y-4">
              {/* Classification Breakdown */}
              <div className="liquid-glass p-5 rounded-3xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <h3 className="font-bold text-sm text-[#172033] font-sans">
                    Environmental Land Cover Breakdown
                  </h3>
                  <DemoDataBadge text="DEMO DATA" />
                </div>
                <div className="space-y-2.5">
                  {(activeResult?.classificationBreakdown || []).map((cat, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="flex items-center gap-2 text-[#34445B]">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                          {cat.category}
                        </span>
                        <span className="font-mono font-bold text-[#172033]">
                          {cat.coveragePct}% ({cat.areaKm2.toLocaleString()} km²)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${cat.coveragePct}%`, backgroundColor: cat.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Temporal Shift Breakdown */}
              <div className="liquid-glass p-5 rounded-3xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <h3 className="font-bold text-sm text-[#172033] font-sans">
                    Net Temporal Trajectory Vector
                  </h3>
                  <DemoDataBadge text="DEMO DATA" />
                </div>
                <div className="space-y-2">
                  {(activeResult?.changeBreakdown || []).map((chg, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-white/30 border border-white/60">
                      <div className="flex items-center gap-2">
                        {chg.direction === 'Increase' && <ArrowUpRight className="w-4 h-4 text-emerald-600" />}
                        {chg.direction === 'Decrease' && <ArrowDownRight className="w-4 h-4 text-rose-600" />}
                        {chg.direction === 'Stable' && <div className="w-2 h-2 rounded-full bg-slate-400" />}
                        <span className="font-medium text-[#172033]">{chg.category}</span>
                      </div>
                      <span className={`font-mono font-bold ${chg.pctChange > 0 ? 'text-emerald-700' : chg.pctChange < 0 ? 'text-rose-700' : 'text-slate-700'}`}>
                        {chg.pctChange > 0 ? `+${chg.pctChange}%` : `${chg.pctChange}%`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* HISTORICAL TRENDS PREVIEW */}
          <TrendChart />

          {/* CLASSICAL VS QML BENCHMARK TABLE */}
          <BenchmarkTable />

          {/* QUANTUM CIRCUIT VISUALIZATION */}
          <QuantumCircuit />

          {/* KEY FINDINGS */}
          <div className="liquid-glass p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
              <h3 className="text-base font-bold text-[#172033] font-sans flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-sky-700" />
                Key Findings & Analytical Summary
              </h3>
              <DemoDataBadge text="DEMO DATA" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="space-y-2 bg-white/25 p-4 rounded-2xl border border-white/60">
                <strong className="text-[#172033] block text-sm">Observation Profile</strong>
                <ul className="space-y-1.5 text-[#34445B]">
                  <li>• <strong>Target District:</strong> {districtObj.name} ({districtObj.areaSqKm.toLocaleString()} km²).</li>
                  <li>• <strong>Application Domain:</strong> {domain.toUpperCase()} environmental monitoring.</li>
                  <li>• <strong>Timeline Window:</strong> {startYear} Baseline to {endYear} Target.</li>
                  <li>• <strong>Algorithm Setup:</strong> {classicalModel.toUpperCase()} baseline & {quantumModel.toUpperCase()} on simulator.</li>
                </ul>
              </div>

              <div className="space-y-2 bg-white/25 p-4 rounded-2xl border border-white/60">
                <strong className="text-[#172033] block text-sm">Synthesis Summary</strong>
                <ul className="space-y-1.5 text-[#34445B]">
                  {(activeResult?.keyFindings || []).map((finding, idx) => (
                    <li key={idx}>• {finding}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeResultsSubTab === 'trends' && (
        <HistoricalTrendsView />
      )}

      {activeResultsSubTab === 'before_after' && (
        <div className="space-y-6">
          <div className="liquid-glass p-4 rounded-3xl flex items-center justify-between">
            <span className="text-xs font-bold text-[#172033]">
              Side-by-Side Synchronized Earth Imagery • {districtObj.name} District
            </span>
            <DemoDataBadge text="DEMO DATA — TEMPORAL OBSERVATION" />
          </div>
          <DualCompareMap yearA={startYear} yearB={endYear} />
        </div>
      )}

      {activeResultsSubTab === 'district' && (
        <DistrictCompChart />
      )}

      {activeResultsSubTab === 'year' && (
        <div className="space-y-6">
          <div className="liquid-glass p-4 rounded-3xl flex items-center justify-between">
            <span className="text-xs font-bold text-[#172033]">
              Year Comparison Analysis: {startYear} vs {endYear}
            </span>
            <DemoDataBadge text="DEMO DATA" />
          </div>
          <DualCompareMap yearA={startYear} yearB={endYear} />
        </div>
      )}

      {activeResultsSubTab === 'month' && (
        <div className="space-y-6">
          <div className="liquid-glass p-4 rounded-3xl flex items-center justify-between">
            <span className="text-xs font-bold text-[#172033]">
              Intra-Annual Phenological Cycle Comparison (Kharif vs Rabi Seasons)
            </span>
            <DemoDataBadge text="DEMO DATA" />
          </div>
          <DualCompareMap yearA={2024} yearB={2025} />
        </div>
      )}

      {/* 4. EXTENDED ANALYSIS EXECUTION HISTORY (PART 13) */}
      <div className="liquid-glass p-6 rounded-3xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
          <div>
            <h3 className="text-base font-bold text-[#172033] font-sans flex items-center gap-2">
              <History className="w-5 h-5 text-sky-700" />
              Historical Analysis Execution History (DEMO RECORDS)
            </h3>
            <p className="text-xs text-[#46566E]">
              Track recent analysis runs, inspect previous configurations, compare, and re-run pipelines.
            </p>
          </div>
          <span className="liquid-glass-pill px-3 py-1 text-xs text-sky-950 font-bold border border-sky-400/30">
            {analysisHistory.length} Runs Recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-white/60 rounded-2xl overflow-hidden shadow-xs">
            <thead className="bg-[rgba(225,235,247,0.7)] text-[#172033] font-bold font-sans">
              <tr>
                <th className="p-3.5 border-b border-slate-300/60">Analysis ID</th>
                <th className="p-3.5 border-b border-slate-300/60">District</th>
                <th className="p-3.5 border-b border-slate-300/60">Period</th>
                <th className="p-3.5 border-b border-slate-300/60">Domain</th>
                <th className="p-3.5 border-b border-slate-300/60">Models</th>
                <th className="p-3.5 border-b border-slate-300/60">Accuracy</th>
                <th className="p-3.5 border-b border-slate-300/60">Status</th>
                <th className="p-3.5 border-b border-slate-300/60 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 bg-white/20 backdrop-blur-md text-[#26364C]">
              {analysisHistory.map((item) => (
                <tr key={item.analysisId} className="hover:bg-[rgba(60,170,240,0.12)] transition-colors">
                  <td className="p-3.5 font-mono font-bold text-sky-900">{item.analysisId}</td>
                  <td className="p-3.5 font-bold text-[#172033]">{item.districtName}</td>
                  <td className="p-3.5 font-mono text-[#34445B]">{item.period}</td>
                  <td className="p-3.5 capitalize font-semibold text-[#172033]">{item.domain}</td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-700">
                    {item.classicalModel.replace('_', ' ')} + {item.quantumModel.toUpperCase()}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-emerald-800">{item.accuracy}%</td>
                  <td className="p-3.5">
                    <span className="liquid-glass-pill px-2.5 py-0.5 text-[10px] font-mono text-emerald-900 border border-emerald-400/40 bg-emerald-50/70 font-bold">
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <button
                        onClick={() => handleLoadHistory(item.analysisId)}
                        className="text-xs text-sky-700 hover:text-sky-900 font-bold flex items-center gap-1 cursor-pointer"
                        title="View result"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                      <button
                        onClick={() => setActiveResultsSubTab('before_after')}
                        className="text-xs text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1 cursor-pointer"
                        title="Compare result"
                      >
                        <GitCompare className="w-3.5 h-3.5" /> Compare
                      </button>
                      <button
                        onClick={handleRunAgain}
                        className="text-xs text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer"
                        title="Run pipeline again"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Run Again
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
