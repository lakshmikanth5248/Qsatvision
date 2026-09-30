import React from 'react';
import { 
  Home, 
  Map, 
  Microscope, 
  BarChart3, 
  GitCompare, 
  Atom, 
  FileText, 
  BookOpen,
  ChevronRight 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
    { id: 'explore', label: 'Explore AP', icon: Map, badge: 'Interactive' },
    { id: 'analyze', label: 'Analyze', icon: Microscope, badge: 'Wizard' },
    { id: 'results', label: 'Results', icon: BarChart3, badge: null },
    { id: 'compare', label: 'Compare', icon: GitCompare, badge: 'Split-Map' },
    { id: 'qml', label: 'Quantum ML', icon: Atom, badge: 'Qiskit' },
    { id: 'reports', label: 'Reports', icon: FileText, badge: 'PDF' },
    { id: 'methodology', label: 'Methodology', icon: BookOpen, badge: null },
  ];

  return (
    <aside className="w-full md:w-64 bg-space-950 border-r border-space-700/50 text-slate-300 flex flex-col justify-between shrink-0">
      <div className="p-3">
        <div className="px-3 py-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">
          Navigation Modules
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-quantum-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-space-900/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive ? 'bg-cyan-400/20 text-cyan-300' : 'bg-space-850 text-slate-500'
                  }`}>
                    {item.badge}
                  </span>
                ) : (
                  isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status Card */}
      <div className="p-3 border-t border-space-800">
        <div className="bg-space-900/90 rounded-xl p-3 border border-space-700 text-xs">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-semibold text-slate-200">System Ready</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            26 Districts of AP mapped. Hybrid QML simulator connected.
          </p>
        </div>
      </div>
    </aside>
  );
};
