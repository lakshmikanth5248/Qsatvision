import React from 'react';
import { Download, AlertCircle } from 'lucide-react';
import type { QuantumKernelSample } from '../../types';

interface QuantumKernelHeatmapProps {
  kernelData?: QuantumKernelSample;
  isExecuted?: boolean;
}

export const QuantumKernelHeatmap: React.FC<QuantumKernelHeatmapProps> = ({
  kernelData,
  isExecuted = true
}) => {
  if (!isExecuted || !kernelData || !kernelData.matrix || kernelData.matrix.length === 0) {
    return (
      <div className="glass-card p-6 border border-white/40 shadow-sm text-center">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
          <AlertCircle className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-semibold text-slate-700">Quantum kernel experiment not available.</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Run a Quantum Kernel Classifier experiment under Benchmark or QML to evaluate statevector inner-product fidelity matrices.
        </p>
      </div>
    );
  }

  const { matrix, dimension, samplesCount, backend, encoding } = kernelData;

  const downloadCsv = () => {
    const csvRows = [
      `# QuantumSat-AP Quantum Kernel Fidelity Matrix K(x_i, x_j)`,
      `# Samples: ${samplesCount}, Dimension: ${dimension}x${dimension}, Backend: ${backend}, Encoding: ${encoding}`,
      matrix.map((_, idx) => `Sample_${idx + 1}`).join(',')
    ];
    matrix.forEach((row) => {
      csvRows.push(row.map(val => val.toFixed(4)).join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Quantum_Kernel_Matrix_${dimension}x${dimension}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  // Color generator for fidelity values [0, 1]
  const getFidelityColor = (val: number) => {
    // 0 -> soft dark blue/indigo, 1 -> bright emerald/amber
    const opacity = Math.min(1, Math.max(0.15, val));
    if (val > 0.85) return `rgba(16, 185, 129, ${opacity})`; // High overlap (emerald)
    if (val > 0.50) return `rgba(59, 130, 246, ${opacity})`; // Medium overlap (blue)
    if (val > 0.20) return `rgba(99, 102, 241, ${opacity})`; // Moderate (indigo)
    return `rgba(148, 163, 184, ${opacity * 0.8})`;         // Orthogonal/low
  };

  return (
    <div className="glass-card p-5 border border-white/40 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-slate-800 text-sm">Quantum State Fidelity Matrix Heatmap</h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              K(xᵢ, xⱼ) = |⟨ψ(xᵢ)|ψ(xⱼ)⟩|²
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {samplesCount} Earth observation samples projected into Hilbert state space via {encoding}
          </p>
        </div>

        <button
          onClick={downloadCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white/70 hover:bg-white border border-slate-200 transition-all shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          Download Matrix as CSV
        </button>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div 
          className="grid gap-1 p-2 bg-slate-900/90 rounded-xl border border-slate-800 w-fit mx-auto"
          style={{ gridTemplateColumns: `repeat(${dimension}, minmax(28px, 1fr))` }}
        >
          {matrix.map((row, rIdx) =>
            row.map((val, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                title={`K(x_${rIdx + 1}, x_${cIdx + 1}) = ${val.toFixed(4)}`}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center text-[10px] font-mono font-medium transition-transform hover:scale-115 hover:z-10 cursor-pointer shadow-xs"
                style={{
                  backgroundColor: getFidelityColor(val),
                  color: val > 0.5 ? '#ffffff' : '#0f172a'
                }}
              >
                {val === 1 ? '1.0' : val.toFixed(2).replace('0.', '.')}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Legend & Metadata */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3 mt-3 gap-2">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-medium text-slate-400">Overlap Scale:</span>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-slate-400"></span>
            <span className="text-[10px]">0.0 Orthogonal</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-blue-500"></span>
            <span className="text-[10px]">0.5 Partial</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
            <span className="text-[10px]">1.0 Identity</span>
          </div>
        </div>

        <span className="text-[11px] text-slate-400">
          Engine: {backend}
        </span>
      </div>
    </div>
  );
};
