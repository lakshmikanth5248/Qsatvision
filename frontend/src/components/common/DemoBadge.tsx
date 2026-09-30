import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

interface DemoBadgeProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const DemoBadge: React.FC<DemoBadgeProps> = ({ 
  message = "DEMO DATA MODE: Simulated satellite observations & experimental QML metrics.",
  size = 'md' 
}) => {
  return (
    <div className={`flex items-center gap-2 bg-amber-500/15 border border-amber-500/35 text-amber-900 rounded-2xl px-3.5 py-2 font-mono text-xs font-bold shadow-sm backdrop-blur-md ${
      size === 'sm' ? 'text-[11px] py-1 px-2.5 rounded-xl' : ''
    }`}>
      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
      <span className="leading-snug">{message}</span>
    </div>
  );
};

export const QuantumDisclaimer: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <div className="flex items-start gap-2.5 bg-purple-500/10 border border-purple-500/30 text-slate-800 rounded-2xl p-3.5 text-xs shadow-sm backdrop-blur-md font-sans">
      <Info className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
      <p className="leading-relaxed font-medium">
        {text || "Research Note: Quantum Machine Learning (QML) is evaluated as an experimental feature. Results are compared against classical models using empirical accuracy & latency measurements without asserting unproven quantum advantage claims."}
      </p>
    </div>
  );
};
