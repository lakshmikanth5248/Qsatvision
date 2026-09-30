import { 
  Home, 
  Map, 
  Microscope, 
  BarChart3, 
  GitCompare, 
  Atom, 
  Scale,
  FileText, 
  BookOpen,
  AlertTriangle,
  ChevronRight 
} from 'lucide-react';

interface GlassSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export const GlassSidebar: React.FC<GlassSidebarProps> = ({ 
  activeTab, 
  setActiveTab,
  isMobileOpen,
  setIsMobileOpen 
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
    { id: 'explore', label: 'Explore AP', icon: Map, badge: 'Interactive' },
    { id: 'analyze', label: 'Analyze', icon: Microscope, badge: 'Wizard' },
    { id: 'results', label: 'Results', icon: BarChart3, badge: null },
    { id: 'compare', label: 'Compare', icon: GitCompare, badge: null },
    { id: 'qml', label: 'Quantum ML', icon: Atom, badge: 'Technical' },
    { id: 'benchmark', label: 'Benchmark', icon: Scale, badge: 'Phase 5' },
    { id: 'reports', label: 'Reports', icon: FileText, badge: 'PDF' },
    { id: 'methodology', label: 'Methodology', icon: BookOpen, badge: '9-Stage' },
    { id: 'limitations', label: 'Limitations', icon: AlertTriangle, badge: 'Phase 6' },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <aside className={`w-full md:w-64 shrink-0 p-3 transition-all ${
      isMobileOpen ? 'block fixed inset-x-0 top-16 z-40 bg-slate-900/10 backdrop-blur-2xl p-4' : 'hidden md:block'
    }`}>
      <div className="bg-[rgba(235,243,252,0.48)] backdrop-blur-[26px] border border-white/55 border-t-white/85 rounded-3xl p-3.5 shadow-[0_20px_50px_rgba(40,65,95,0.12)] h-full flex flex-col justify-between space-y-4">
        <div>
          <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
            Platform Modules
          </div>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-medium text-xs transition-all ${
                    isActive
                      ? 'bg-[rgba(60,170,240,0.16)] text-sky-900 border border-sky-400/50 shadow-sm font-extrabold backdrop-blur-md'
                      : 'text-[#34445B] hover:text-[#172033] hover:bg-white/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      isActive ? 'bg-sky-500/20 text-sky-900 border border-sky-400/40' : 'bg-white/40 text-slate-600 border border-white/60'
                    }`}>
                      {item.badge}
                    </span>
                  ) : (
                    isActive && <ChevronRight className="w-3.5 h-3.5 text-sky-600" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Phase 1 System Status Card */}
        <div className="bg-[rgba(240,247,255,0.42)] backdrop-blur-xl rounded-2xl p-3 border border-white/65 text-xs space-y-1 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-extrabold text-[#172033]">Phase 1 Active</span>
          </div>
          <p className="text-[11px] text-[#46566E] leading-snug">
            Apple Liquid Glass UI active. 26 AP districts loaded in DEMO DATA mode.
          </p>
        </div>
      </div>
    </aside>
  );
};
