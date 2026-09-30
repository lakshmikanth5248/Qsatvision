import React from 'react';
import { 
  Globe, 
  Map, 
  Microscope, 
  Atom, 
  Sparkles, 
  TrendingUp, 
  Sprout, 
  Droplets, 
  Building2, 
  AlertTriangle,
  Database,
  Layers,
  Clock
} from 'lucide-react';
import { useAnalysis } from '../context/AnalysisContext';
import { GlassPanel } from '../components/glass/GlassPanel';
import { GlassButton } from '../components/glass/GlassButton';
import { DemoDataBadge } from '../components/glass/GlassBadge';
import { ApplicationCard } from '../components/common/ApplicationCard';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const { setDomain } = useAnalysis();

  const appDomains = [
    {
      id: 'agriculture' as const,
      title: 'Agriculture & Crop Health',
      icon: Sprout,
      color: 'text-emerald-600',
      description: 'Track agricultural land-use, crop canopy vigour (NDVI), seasonal harvest patterns, and historical farmland expansion across AP.',
      metrics: 'NDVI Index • Vegetation Health'
    },
    {
      id: 'water' as const,
      title: 'Water Body Dynamics',
      icon: Droplets,
      color: 'text-sky-600',
      description: 'Monitor reservoirs, Godavari/Krishna river basin surface water changes, irrigation tanks, and seasonal aquatic boundaries.',
      metrics: 'NDWI Index • Lake Surface Area'
    },
    {
      id: 'urban' as const,
      title: 'Urban Growth & Built-Up',
      icon: Building2,
      color: 'text-slate-700',
      description: 'Quantify urban sprawl, infrastructure expansion in Amaravati/Vijayawada/Visakhapatnam, and impervious built-up shifts.',
      metrics: 'NDBI Index • Built-up Area (km²)'
    },
    {
      id: 'disaster' as const,
      title: 'Environmental & Disaster Impact',
      icon: AlertTriangle,
      color: 'text-amber-600',
      description: 'Detect cyclone damage along coastal Andhra, flood inundation zones, drought severity, and sudden land cover disruptions.',
      metrics: 'Change Matrix • Disaster Inundation'
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      <GlassPanel className="liquid-glass-strong p-8 lg:p-12 relative overflow-hidden space-y-6">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/35 text-sky-900 text-xs font-bold backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            Hybrid Classical–Quantum Satellite Intelligence Platform
          </div>

          <h1 className="text-3xl lg:text-5xl font-extrabold text-[#152238] tracking-tight leading-tight">
            Explore Andhra Pradesh <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600">Through Time</span>
          </h1>

          <p className="text-[#34445B] text-sm lg:text-base leading-relaxed font-sans font-medium">
            The project investigates whether hybrid Quantum Machine Learning can improve classification and change-detection workflows for high-dimensional satellite imagery while maintaining competitive accuracy across all 26 districts of Andhra Pradesh.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <GlassButton
              variant="primary"
              size="lg"
              icon={Map}
              onClick={() => setActiveTab('explore')}
            >
              Explore Andhra Pradesh
            </GlassButton>

            <GlassButton
              variant="secondary"
              size="lg"
              icon={Microscope}
              onClick={() => setActiveTab('analyze')}
            >
              Start Analysis Wizard
            </GlassButton>

            <GlassButton
              variant="secondary"
              size="lg"
              icon={TrendingUp}
              onClick={() => setActiveTab('compare')}
            >
              Historical Trends & Compare
            </GlassButton>
          </div>
        </div>
      </GlassPanel>

      <DemoDataBadge text="DEMO DATA MODE: All satellite observations and dataset timelines are simulated for Phase 1 frontend evaluation." />

      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <GlassPanel variant="card" className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">AP Coverage</span>
            <Globe className="w-4 h-4 text-sky-600" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-slate-900 font-mono">26 Districts</span>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Coastal & Rayalaseema</span>
          </div>
        </GlassPanel>

        <GlassPanel variant="card" className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Data Sources</span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-slate-900 font-mono">5 Providers</span>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Sentinel-1/2, Landsat 8/9</span>
          </div>
        </GlassPanel>

        <GlassPanel variant="card" className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Historical Range</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-slate-900 font-mono">2010 → 2026</span>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">17-Year Archive</span>
          </div>
        </GlassPanel>

        <GlassPanel variant="card" className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Quantum Engine</span>
            <Atom className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-slate-900 font-mono">Qiskit 2.5</span>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Aer Statevector Engine</span>
          </div>
        </GlassPanel>

        <GlassPanel variant="card" className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Backend Status</span>
            <Database className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-teal-700 font-mono">Online</span>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">FastAPI REST Pool</span>
          </div>
        </GlassPanel>

        <GlassPanel variant="card" className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Benchmarking</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-slate-900 font-mono">Measured</span>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Empirical Protocols</span>
          </div>
        </GlassPanel>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#152238]">Application Focus Domains</h2>
          <p className="text-xs text-[#46566E] font-medium">Select an environmental domain to launch satellite analysis configuration.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {appDomains.map((app) => (
            <ApplicationCard
              key={app.id}
              id={app.id}
              title={app.title}
              icon={app.icon}
              description={app.description}
              metrics={app.metrics}
              accentColor={app.color}
              onSelect={(selectedId) => {
                setDomain(selectedId);
                setActiveTab('analyze');
              }}
            />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassPanel variant="card" className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/60 pb-3">
            <h3 className="text-base font-extrabold text-[#152238]">Satellite Data Availability Overview</h3>
            <DemoDataBadge text="ARCHIVE STATUS" />
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center bg-[rgba(235,243,252,0.38)] backdrop-blur-md p-3.5 rounded-2xl border border-white/60 shadow-sm">
              <div>
                <span className="font-extrabold text-[#172033] block">Sentinel-2 MSI (10m Resolution)</span>
                <span className="text-[11px] text-[#46566E] font-medium">ESA Copernicus • 2015 – Present</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-900 font-mono text-[10px] font-extrabold border border-emerald-500/30">OPERATIONAL</span>
            </div>

            <div className="flex justify-between items-center bg-[rgba(235,243,252,0.38)] backdrop-blur-md p-3.5 rounded-2xl border border-white/60 shadow-sm">
              <div>
                <span className="font-extrabold text-[#172033] block">Landsat 8/9 OLI (30m Resolution)</span>
                <span className="text-[11px] text-[#46566E] font-medium">USGS / NASA • 2013 – Present</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-900 font-mono text-[10px] font-extrabold border border-emerald-500/30">OPERATIONAL</span>
            </div>

            <div className="flex justify-between items-center bg-[rgba(235,243,252,0.38)] backdrop-blur-md p-3.5 rounded-2xl border border-white/60 shadow-sm">
              <div>
                <span className="font-extrabold text-[#172033] block">Sentinel-1 C-Band SAR (20m Radar)</span>
                <span className="text-[11px] text-[#46566E] font-medium">ESA Copernicus • All-Weather Flood SAR</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-900 font-mono text-[10px] font-extrabold border border-emerald-500/30">OPERATIONAL</span>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel variant="card" className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/60 pb-3">
            <h3 className="text-base font-extrabold text-[#152238]">System Status & Phase 1 Execution</h3>
            <DemoDataBadge text="PHASE 1 FOUNDATION" />
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3 bg-[rgba(235,243,252,0.38)] backdrop-blur-md p-3.5 rounded-2xl border border-white/60 shadow-sm">
              <Clock className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-[#172033] block">Global Application State Active</span>
                <span className="text-[11px] text-[#46566E] font-medium">Target selection, time window, and domain context persist seamlessly across modules.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[rgba(235,243,252,0.38)] backdrop-blur-md p-3.5 rounded-2xl border border-white/60 shadow-sm">
              <Database className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-[#172033] block">FastAPI & Qiskit Simulator Ready</span>
                <span className="text-[11px] text-[#46566E] font-medium">Backend architecture configured for future Phase 2 execution hooks.</span>
              </div>
            </div>
          </div>
        </GlassPanel>
      </section>
    </div>
  );
};
