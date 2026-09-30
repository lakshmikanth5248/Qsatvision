import React from 'react';
import { Cpu, Globe, Database, ShieldAlert, Sparkles, Navigation } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';
import { AP_DISTRICTS } from '../../data/apDistrictsGeoJSON';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setActiveTab }) => {
  const { dataMode, setDataMode, districtId, setDistrictId, domain } = useAnalysis();

  return (
    <header className="sticky top-0 z-40 bg-space-950/90 backdrop-blur-md border-b border-space-700/50 text-white px-4 lg:px-6 py-3 shadow-glass">
      <div className="flex items-center justify-between gap-4">
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-quantum-600 p-0.5 shadow-glow-cyan group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-space-900 rounded-[10px] flex items-center justify-center">
              <Globe className="w-5 h-5 text-cyanCustom-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-lg text-white font-mono">QUANTUMSAT-AP</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">
                v1.0-PROTO
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Explore Andhra Pradesh Through Time</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 bg-space-900/80 px-4 py-1.5 rounded-lg border border-space-700 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            <span>Target:</span>
          </div>
          <select 
            value={districtId} 
            onChange={(e) => setDistrictId(e.target.value)}
            className="bg-space-850 text-cyan-300 font-medium font-mono focus:outline-none cursor-pointer border border-space-700 rounded px-2 py-0.5"
          >
            {AP_DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
            ))}
          </select>

          <span className="text-space-600">|</span>

          <span className="capitalize text-quantum-300 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-quantum-400" />
            {domain}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-space-900 rounded-lg p-1 border border-space-700">
            <button
              onClick={() => setDataMode('DEMO')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                dataMode === 'DEMO'
                  ? 'bg-cyan-500 text-space-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              DEMO DATA
            </button>
            <button
              onClick={() => setDataMode('REAL')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                dataMode === 'REAL'
                  ? 'bg-emerald-500 text-space-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white opacity-60 cursor-not-allowed'
              }`}
              title="Real satellite API connection available in backend"
            >
              <Database className="w-3.5 h-3.5" />
              REAL DATA
            </button>
          </div>

          <button
            onClick={() => setActiveTab('analyze')}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-quantum-600 to-cyan-600 text-white font-medium text-xs hover:brightness-110 shadow-glow-purple transition-all"
          >
            <Cpu className="w-4 h-4" />
            <span>Launch QML</span>
          </button>
        </div>
      </div>
    </header>
  );
};
