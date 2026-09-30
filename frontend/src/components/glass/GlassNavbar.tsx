import React from 'react';
import { Globe, Navigation, Menu, X, Server } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';
import { AP_DISTRICTS } from '../../data/apDistrictsGeoJSON';
import { GlassBadge } from './GlassBadge';

interface GlassNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const GlassNavbar: React.FC<GlassNavbarProps> = ({
  setActiveTab,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const { 
    dataMode, 
    setDataMode, 
    districtId, 
    setDistrictId, 
    domain, 
    backendConnected, 
    backendVersion 
  } = useAnalysis();

  return (
    <header className="sticky top-0 z-50 px-4 py-3 bg-[rgba(235,243,250,0.48)] backdrop-blur-[26px] border-b border-white/55 shadow-[0_10px_30px_rgba(40,65,95,0.08)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* LOGO & BRAND */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-sky-500/15 backdrop-blur-xl border border-sky-400/35 flex items-center justify-center shadow-sm group-hover:bg-sky-500/25 transition-all">
            <Globe className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-base text-[#152238] font-sans">QUANTUMSAT-AP</span>
              <GlassBadge variant="info" size="sm">PHASE 3 & 4</GlassBadge>
            </div>
            <p className="text-[11px] text-[#46566E] hidden sm:block font-medium">Explore Andhra Pradesh Through Time</p>
          </div>
        </div>

        {/* TARGET DISTRICT & DOMAIN QUICK SELECT */}
        <div className="hidden md:flex items-center gap-3 bg-[rgba(240,247,255,0.45)] backdrop-blur-xl px-4 py-1.5 rounded-2xl border border-white/65 text-xs shadow-sm">
          <div className="flex items-center gap-1.5 text-[#46566E]">
            <Navigation className="w-3.5 h-3.5 text-sky-600" />
            <span>Target:</span>
          </div>
          <select 
            value={districtId} 
            onChange={(e) => setDistrictId(e.target.value)}
            className="bg-transparent text-sky-900 font-extrabold font-sans focus:outline-none cursor-pointer"
          >
            {AP_DISTRICTS.map((d) => (
              <option key={d.id} value={d.id} className="bg-slate-100 text-slate-900 font-medium">{d.name} ({d.code})</option>
            ))}
          </select>

          <span className="text-slate-400">|</span>

          <span className="capitalize text-[#34445B] font-bold">
            {domain}
          </span>
        </div>

        {/* RIGHT CONTROLS: BACKEND HEALTH & DATA MODE SWITCHER */}
        <div className="flex items-center gap-3">
          {/* Real Backend Status Indicator (Part 4) */}
          <div 
            className="hidden lg:flex items-center gap-2 liquid-glass-pill px-3 py-1 text-xs border border-white/70"
            title={`FastAPI + Qiskit Engine v${backendVersion}`}
          >
            <Server className="w-3.5 h-3.5 text-sky-700" />
            <span className="text-[#46566E] font-medium">Backend:</span>
            {backendConnected ? (
              <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>CONNECTED</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-amber-800 font-extrabold">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>OFFLINE (Demo Active)</span>
              </div>
            )}
          </div>

          {/* Mode Switcher: DEMO DATA vs REAL DATA */}
          <div className="flex items-center bg-[rgba(228,238,249,0.45)] p-1 rounded-xl border border-white/55">
            <button
              onClick={() => setDataMode('DEMO')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                dataMode === 'DEMO'
                  ? 'bg-amber-500/20 text-amber-950 border border-amber-500/40 shadow-xs font-bold backdrop-blur-md'
                  : 'text-[#46566E] hover:text-[#172033]'
              }`}
            >
              DEMO DATA
            </button>
            <button
              onClick={() => setDataMode('REAL')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                dataMode === 'REAL'
                  ? 'bg-emerald-500/20 text-emerald-950 border border-emerald-500/40 shadow-xs font-bold backdrop-blur-md'
                  : 'text-[#46566E] hover:text-[#172033]'
              }`}
              title={backendConnected ? "Execute real Python FastAPI + Qiskit pipeline" : "Backend offline, local execution will be simulated"}
            >
              REAL DATA
            </button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/50 border border-white/65 text-slate-700 hover:text-slate-900"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
