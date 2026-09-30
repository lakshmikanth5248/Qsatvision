import React from 'react';
import { Download, CheckCircle2 } from 'lucide-react';

interface ConfusionMatrixCardProps {
  matrix?: number[][];
  classes?: string[];
  modelName?: string;
  isExecuted?: boolean;
}

export const ConfusionMatrixCard: React.FC<ConfusionMatrixCardProps> = ({
  matrix,
  classes = ['Dense Veg', 'Water Body', 'Urban Area', 'Barren Land'],
  modelName = 'Classification Model',
  isExecuted = true
}) => {
  if (!isExecuted || !matrix || matrix.length === 0) {
    return (
      <div className="glass-card p-6 border border-white/40 shadow-sm text-center">
        <p className="text-sm font-medium text-slate-600">Awaiting experiment execution</p>
        <p className="text-xs text-slate-400 mt-1">Confusion matrix will populate once test partition inference completes.</p>
      </div>
    );
  }

  // Calculate totals
  const totalSamples = matrix.reduce((acc, row) => acc + row.reduce((rAcc, cell) => rAcc + cell, 0), 0);

  const downloadCsv = () => {
    const csvLines = [
      `# Confusion Matrix for ${modelName}`,
      `Actual / Predicted,${classes.join(',')}`,
      ...matrix.map((row, i) => `"${classes[i]}",${row.join(',')}`)
    ];
    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Confusion_Matrix_${modelName.replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-card p-5 border border-white/40 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="font-semibold text-slate-800 text-sm">Empirical Confusion Matrix</h4>
          <p className="text-xs text-slate-500">{modelName} • Actual vs. Predicted Class Allocations</p>
        </div>
        <button
          onClick={downloadCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white/70 hover:bg-white border border-slate-200 transition-all shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          Export Matrix CSV
        </button>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="p-2 border-b border-r border-slate-200 bg-slate-100/60 text-slate-400 font-medium text-left">
                  Actual \ Predicted
                </th>
                {classes.map((cls, idx) => (
                  <th key={idx} className="p-2 border-b border-slate-200 bg-slate-50 font-semibold text-slate-700 text-center">
                    {cls}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, rIdx) => {
                const rowSum = row.reduce((a, b) => a + b, 0);
                return (
                  <tr key={rIdx} className="border-b border-slate-100">
                    <td className="p-2.5 font-medium text-slate-700 bg-slate-50/50 border-r border-slate-200 whitespace-nowrap">
                      {classes[rIdx] || `Class ${rIdx}`}
                    </td>
                    {row.map((count, cIdx) => {
                      const isDiagonal = rIdx === cIdx;
                      const pctOfClass = rowSum > 0 ? ((count / rowSum) * 100).toFixed(0) : 0;
                      return (
                        <td
                          key={cIdx}
                          className={`p-3 text-center transition-colors ${
                            isDiagonal
                              ? 'bg-emerald-500/10 text-emerald-800 font-bold border-emerald-200/50'
                              : count > 0
                              ? 'bg-rose-500/5 text-slate-600'
                              : 'text-slate-300'
                          }`}
                        >
                          <div className="text-sm font-semibold">{count}</div>
                          {rowSum > 0 && (
                            <div className="text-[10px] opacity-75">{pctOfClass}%</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-3 mt-2">
        <div className="flex items-center gap-1.5 text-emerald-700">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Diagonal elements denote correct class predictions</span>
        </div>
        <span>Total Test Samples: <b>{totalSamples}</b></span>
      </div>
    </div>
  );
};
