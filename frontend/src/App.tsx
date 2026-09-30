import React, { useState } from 'react';
import { AnalysisProvider } from './context/AnalysisContext';
import { GlassNavbar } from './components/glass/GlassNavbar';
import { GlassSidebar } from './components/glass/GlassSidebar';

import { Dashboard } from './pages/Dashboard';
import { ExploreAP } from './pages/ExploreAP';
import { Analyze } from './pages/Analyze';
import { Results } from './pages/Results';
import { Compare } from './pages/Compare';
import { QuantumML } from './pages/QuantumML';
import { Benchmark } from './pages/Benchmark';
import { Reports } from './pages/Reports';
import { Methodology } from './pages/Methodology';
import { Limitations } from './pages/Limitations';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen text-slate-900 flex flex-col font-sans selection:bg-sky-500 selection:text-white relative overflow-x-hidden">
      {/* Real Atmospheric Ambient Glow Fields */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[620px] h-[620px] bg-sky-400/25 rounded-full blur-[140px]" />
        <div className="absolute top-12 -right-28 w-[680px] h-[680px] bg-indigo-400/22 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/4 w-[520px] h-[520px] bg-cyan-400/18 rounded-full blur-[130px]" />
        <div className="absolute -bottom-36 left-12 w-[620px] h-[620px] bg-blue-400/20 rounded-full blur-[140px]" />
        <div className="absolute -bottom-28 right-24 w-[680px] h-[680px] bg-purple-400/20 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Apple Liquid Glass Navbar */}
        <GlassNavbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Main Body Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          {/* Apple Liquid Glass Sidebar Navigation */}
          <GlassSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isMobileOpen={isMobileMenuOpen}
            setIsMobileOpen={setIsMobileMenuOpen}
          />

          {/* Main Content Workspace Area */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-transparent">
            <div className="max-w-7xl mx-auto">
              {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
              {activeTab === 'explore' && <ExploreAP setActiveTab={setActiveTab} />}
              {activeTab === 'analyze' && <Analyze setActiveTab={setActiveTab} />}
              {activeTab === 'results' && <Results setActiveTab={setActiveTab} />}
              {activeTab === 'compare' && <Compare />}
              {activeTab === 'qml' && <QuantumML />}
              {activeTab === 'benchmark' && <Benchmark />}
              {activeTab === 'reports' && <Reports />}
              {activeTab === 'methodology' && <Methodology />}
              {activeTab === 'limitations' && <Limitations />}
            </div>
          </main>
        </div>

        {/* Footer */}
        <footer className="bg-[rgba(235,243,252,0.52)] border-t border-white/60 text-slate-600 py-3.5 px-6 text-xs font-sans flex flex-wrap items-center justify-between gap-4 z-10 print:hidden backdrop-blur-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            <span className="font-semibold text-slate-800">🛰️ QuantumSat-AP Phase 1 • Apple-Inspired Liquid Glass Design System</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-600 font-semibold">
            <span>Andhra Pradesh (26 Districts)</span>
            <span>•</span>
            <span>Hybrid Classical–Quantum Platform</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AnalysisProvider>
      <AppContent />
    </AnalysisProvider>
  );
}

export default App;
