import React, { useState } from 'react';
import { DualCompareMap } from '../components/maps/DualCompareMap';
import { DistrictCompChart } from '../components/charts/DistrictCompChart';
import { useAnalysis } from '../context/AnalysisContext';
import { AP_DISTRICTS } from '../data/apDistrictsGeoJSON';
import { GitCompare, Calendar, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { DemoDataBadge } from '../components/glass/GlassBadge';

export type CompareTabMode = 'before_after' | 'district' | 'year' | 'month';

export const Compare: React.FC = () => {
  const { districtId, setDistrictId } = useAnalysis();
  const [activeTab, setActiveTab] = useState<CompareTabMode>('before_after');
  
  // Year comparison state
  const [yearA, setYearA] = useState<number>(2013);
  const [yearB, setYearB] = useState<number>(2026);

  // Month comparison state (e.g. Jan 2025 vs Aug 2025)
  const [monthA, setMonthA] = useState<string>('January');
  const [monthB, setMonthB] = useState<string>('August');
  const [monthYear, setMonthYear] = useState<number>(2025);

  const districtObj = AP_DISTRICTS.find(d => d.id === districtId) || AP_DISTRICTS[0];
  const allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="space-y-6 pb-12">
      {/* TOP HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center">
              <GitCompare className="w-5 h-5 text-sky-700" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#152238] font-sans">
                Comparative Analytics Module
              </h1>
              <p className="text-xs text-[#46566E] font-medium">
                Synchronized dual-satellite temporal analysis, multi-district benchmarks, and seasonal phenology.
              </p>
            </div>
          </div>
        </div>

        {/* 4 VIEW MODE TABS */}
        <div className="flex flex-wrap items-center gap-1.5 liquid-glass-pill p-1.5 border border-white/70 shadow-xs">
          <button
            onClick={() => setActiveTab('before_after')}
            className={`px-3.5 py-1.5 rounded-full text-xs transition-all ${
              activeTab === 'before_after'
                ? 'bg-sky-500/20 text-sky-950 font-extrabold border border-sky-400/50 shadow-xs'
                : 'text-[#46566E] hover:text-[#172033] font-semibold'
            }`}
          >
            Before / After Analysis
          </button>
          <button
            onClick={() => setActiveTab('district')}
            className={`px-3.5 py-1.5 rounded-full text-xs transition-all ${
              activeTab === 'district'
                ? 'bg-sky-500/20 text-sky-950 font-extrabold border border-sky-400/50 shadow-xs'
                : 'text-[#46566E] hover:text-[#172033] font-semibold'
            }`}
          >
            District Comparison (2–5)
          </button>
          <button
            onClick={() => setActiveTab('year')}
            className={`px-3.5 py-1.5 rounded-full text-xs transition-all ${
              activeTab === 'year'
                ? 'bg-sky-500/20 text-sky-950 font-extrabold border border-sky-400/50 shadow-xs'
                : 'text-[#46566E] hover:text-[#172033] font-semibold'
            }`}
          >
            Year Comparison
          </button>
          <button
            onClick={() => setActiveTab('month')}
            className={`px-3.5 py-1.5 rounded-full text-xs transition-all ${
              activeTab === 'month'
                ? 'bg-sky-500/20 text-sky-950 font-extrabold border border-sky-400/50 shadow-xs'
                : 'text-[#46566E] hover:text-[#172033] font-semibold'
            }`}
          >
            Month Comparison
          </button>
        </div>
      </div>

      {/* VIEW 1: BEFORE / AFTER ANALYSIS */}
      {activeTab === 'before_after' && (
        <div className="space-y-6">
          <div className="liquid-glass-strong p-6 rounded-3xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
              <div>
                <span className="text-[11px] font-bold text-sky-800 uppercase tracking-widest block font-sans">
                  BEFORE / AFTER ANALYSIS
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-5 h-5 text-sky-700" />
                  <h2 className="text-2xl font-black text-[#152238] tracking-tight uppercase font-sans">
                    {districtObj.name} District
                  </h2>
                </div>
                <p className="text-xs text-[#46566E] mt-0.5">
                  Official AP Boundary • Area: <strong className="font-mono text-[#172033]">{districtObj.areaSqKm.toLocaleString()} km²</strong> • Region: <strong className="text-[#172033]">{districtObj.region}</strong>
                </p>
              </div>

              {/* YEAR SELECTION VS BADGE */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Period A Selector */}
                <div className="flex items-center gap-2 liquid-glass-pill px-3.5 py-2 border border-sky-400/40 bg-sky-500/10">
                  <Calendar className="w-4 h-4 text-sky-700" />
                  <div className="text-left">
                    <span className="text-[9px] uppercase tracking-wider text-sky-800 font-bold block">BEFORE PERIOD</span>
                    <select
                      value={yearA}
                      onChange={(e) => setYearA(Number(e.target.value))}
                      className="bg-transparent text-sky-950 font-extrabold font-mono text-sm focus:outline-none cursor-pointer"
                    >
                      {Array.from({ length: 16 }, (_, i) => 2010 + i).map(y => (
                        <option key={y} value={y} className="bg-slate-100 text-slate-900">{y} BASELINE</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="text-sm font-black text-[#46566E] font-mono px-1">VS</div>

                {/* Period B Selector */}
                <div className="flex items-center gap-2 liquid-glass-pill px-3.5 py-2 border border-purple-400/40 bg-purple-500/10">
                  <Calendar className="w-4 h-4 text-purple-700" />
                  <div className="text-left">
                    <span className="text-[9px] uppercase tracking-wider text-purple-800 font-bold block">AFTER PERIOD</span>
                    <select
                      value={yearB}
                      onChange={(e) => setYearB(Number(e.target.value))}
                      className="bg-transparent text-purple-950 font-extrabold font-mono text-sm focus:outline-none cursor-pointer"
                    >
                      {Array.from({ length: 17 }, (_, i) => 2010 + i).filter(y => y > yearA).map(y => (
                        <option key={y} value={y} className="bg-slate-100 text-slate-900">{y} EVALUATION</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* District Switcher */}
                <div className="flex items-center gap-2 liquid-glass-pill px-3 py-2 border border-white/70">
                  <span className="text-xs text-[#46566E] font-medium">District:</span>
                  <select
                    value={districtId}
                    onChange={(e) => setDistrictId(e.target.value)}
                    className="bg-transparent text-[#172033] font-bold text-xs focus:outline-none cursor-pointer"
                  >
                    {AP_DISTRICTS.map(d => (
                      <option key={d.id} value={d.id} className="bg-slate-100 text-slate-900">
                        {d.name} ({d.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#46566E]">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Identical Esri Satellite Earth Imagery Basemap • Synchronized Camera Viewports</span>
              </div>
              <DemoDataBadge text="DEMO DATA — TEMPORAL OBSERVATION" />
            </div>
          </div>

          {/* DUAL SYNCHRONIZED MAP COMPONENT */}
          <DualCompareMap yearA={yearA} yearB={yearB} />
        </div>
      )}

      {/* VIEW 2: DISTRICT COMPARISON (2-5 DISTRICTS) */}
      {activeTab === 'district' && (
        <div className="space-y-6">
          <DistrictCompChart />
        </div>
      )}

      {/* VIEW 3: YEAR COMPARISON */}
      {activeTab === 'year' && (
        <div className="space-y-6">
          <div className="liquid-glass-strong p-6 rounded-3xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/60 pb-3">
              <div>
                <span className="text-[11px] font-bold text-sky-800 uppercase tracking-widest block font-sans">
                  YEAR COMPARISON
                </span>
                <h3 className="text-xl font-black text-[#152238] tracking-tight uppercase font-sans">
                  {districtObj.name} • {yearA} vs {yearB}
                </h3>
                <p className="text-xs text-[#46566E]">
                  Full multi-temporal transition comparison across the historical archive.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="liquid-glass-pill px-3 py-1.5 font-mono text-xs font-bold text-sky-900">
                  Year A: {yearA}
                </div>
                <ArrowRight className="w-4 h-4 text-[#46566E]" />
                <div className="liquid-glass-pill px-3 py-1.5 font-mono text-xs font-bold text-purple-900">
                  Year B: {yearB}
                </div>
                <DemoDataBadge text="DEMO DATA" />
              </div>
            </div>

            {/* Year Comparison Map & Matrix */}
            <DualCompareMap yearA={yearA} yearB={yearB} />
          </div>
        </div>
      )}

      {/* VIEW 4: MONTH COMPARISON (SEASONAL PHENOLOGY) */}
      {activeTab === 'month' && (
        <div className="space-y-6">
          <div className="liquid-glass-strong p-6 rounded-3xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-sky-800 uppercase tracking-widest block font-sans">
                    MONTH COMPARISON (SEASONAL PHENOLOGY)
                  </span>
                  <DemoDataBadge text="DEMO DATA" />
                </div>
                <h3 className="text-xl font-black text-[#152238] tracking-tight font-sans mt-0.5">
                  {districtObj.name} • {monthA} vs {monthB} ({monthYear})
                </h3>
                <p className="text-xs text-[#46566E]">
                  Compare intra-annual phenological seasonal variation (e.g. Kharif Monsoon vs Rabi Winter seasons).
                </p>
              </div>

              {/* Month Selectors */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-2 liquid-glass-pill px-3 py-1.5 border border-sky-400/40">
                  <span className="font-bold text-sky-800">Month A:</span>
                  <select
                    value={monthA}
                    onChange={(e) => setMonthA(e.target.value)}
                    className="bg-transparent font-bold text-[#172033] focus:outline-none cursor-pointer"
                  >
                    {allMonths.map(m => (
                      <option key={m} value={m} className="bg-slate-100 text-slate-900">{m}</option>
                    ))}
                  </select>
                </div>

                <span className="font-mono font-bold text-[#46566E]">VS</span>

                <div className="flex items-center gap-2 liquid-glass-pill px-3 py-1.5 border border-purple-400/40">
                  <span className="font-bold text-purple-800">Month B:</span>
                  <select
                    value={monthB}
                    onChange={(e) => setMonthB(e.target.value)}
                    className="bg-transparent font-bold text-[#172033] focus:outline-none cursor-pointer"
                  >
                    {allMonths.map(m => (
                      <option key={m} value={m} className="bg-slate-100 text-slate-900">{m}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 liquid-glass-pill px-3 py-1.5 border border-white/70">
                  <span className="font-bold text-[#46566E]">Year:</span>
                  <select
                    value={monthYear}
                    onChange={(e) => setMonthYear(Number(e.target.value))}
                    className="bg-transparent font-bold text-[#172033] focus:outline-none cursor-pointer"
                  >
                    {[2023, 2024, 2025, 2026].map(yr => (
                      <option key={yr} value={yr} className="bg-slate-100 text-slate-900">{yr}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Seasonal Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="liquid-glass p-4 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block">{monthA} Baseline</span>
                <div className="text-lg font-bold text-[#172033]">Dry / Post-Harvest Season</div>
                <div className="text-xs text-[#46566E]">Lower vegetation greenness and surface water levels.</div>
              </div>

              <div className="liquid-glass p-4 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block">{monthB} Peak</span>
                <div className="text-lg font-bold text-[#172033]">Monsoon / Kharif Peak</div>
                <div className="text-xs text-[#46566E]">High NDVI canopy index and replenished reservoirs.</div>
              </div>

              <div className="liquid-glass p-4 rounded-2xl space-y-1 bg-emerald-500/10 border border-emerald-400/40">
                <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">Phenological Shift</span>
                <div className="text-lg font-extrabold text-emerald-950 font-mono">+24.8% NDVI Delta</div>
                <div className="text-xs text-emerald-800">Seasonal agricultural greening cycle.</div>
              </div>
            </div>

            {/* Maps for Month comparison */}
            <DualCompareMap yearA={2024} yearB={2025} />
          </div>
        </div>
      )}
    </div>
  );
};
