import React from 'react';
import { CLASSICAL_VS_QUANTUM_BENCHMARKS } from '../../data/mockSatelliteData';
import { QuantumDisclaimer } from '../common/DemoBadge';
import { Cpu, Atom } from 'lucide-react';

export const BenchmarkTable: React.FC = () => {
  return (
    <div className="w-full glass-benchmark rounded-3xl p-6 lg:p-8 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Atom className="w-5 h-5 text-purple-700" />
            <h3 className="text-lg lg:text-xl font-extrabold text-[#152238] font-mono tracking-tight">
              Classical ML vs. Quantum ML Performance Benchmarks
            </h3>
          </div>
          <p className="text-xs text-[#46566E] font-medium font-sans">
            Empirical comparative metrics measured on Qiskit QASM Simulator vs. Classical Scikit-Learn Random Forest.
          </p>
        </div>

        <span className="liquid-glass-pill px-3.5 py-1.5 text-purple-950 font-mono text-xs font-bold border border-purple-400/40 bg-purple-50/70 shadow-xs">
          Qiskit 1.0 Simulator (DEMO)
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/60 shadow-xs">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-[rgba(225,235,247,0.7)] text-[#172033] uppercase text-[11px] tracking-wider border-b border-slate-300/60">
            <tr>
              <th className="py-3.5 px-4 font-bold">Evaluation Metric</th>
              <th className="py-3.5 px-4 text-sky-900 font-bold">
                <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-sky-700" /> Classical ML (Random Forest)</span>
              </th>
              <th className="py-3.5 px-4 text-purple-950 font-bold">
                <span className="flex items-center gap-1.5"><Atom className="w-3.5 h-3.5 text-purple-700" /> QML (VQC 4-Qubit)</span>
              </th>
              <th className="py-3.5 px-4 font-bold text-[#172033]">Status</th>
              <th className="py-3.5 px-4 font-bold text-[#172033]">Methodology Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/60 bg-white/20 backdrop-blur-md">
            {CLASSICAL_VS_QUANTUM_BENCHMARKS.map((row, idx) => (
              <tr key={idx} className="hover:bg-[rgba(60,170,240,0.12)] transition-colors">
                <td className="py-3.5 px-4 font-extrabold text-[#172033]">{row.metric}</td>
                <td className="py-3.5 px-4 text-[#26364C] font-bold font-mono">
                  <span className="bg-white/35 px-2.5 py-1 rounded-md border border-white/60 text-[#172033] shadow-2xs">
                    {row.classicalValue}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-purple-950 font-bold font-mono">
                  <span className="bg-purple-500/15 px-2.5 py-1 rounded-md border border-purple-400/40 text-purple-950 shadow-2xs">
                    {row.quantumValue}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="liquid-glass-pill px-2.5 py-0.5 text-[10px] text-amber-900 border border-amber-400/40 bg-amber-50/70 font-bold font-mono">
                    EXPERIMENTAL
                  </span>
                </td>
                <td className="py-3.5 px-4 text-[#34445B] text-xs font-sans font-medium leading-snug">
                  {row.notes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <QuantumDisclaimer />
    </div>
  );
};
