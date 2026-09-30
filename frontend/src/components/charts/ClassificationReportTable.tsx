import React from 'react';
import type { PerClassMetric } from '../../types';

interface ClassificationReportTableProps {
  metrics?: PerClassMetric[];
  overallAccuracy?: number;
  modelName?: string;
  isExecuted?: boolean;
}

export const ClassificationReportTable: React.FC<ClassificationReportTableProps> = ({
  metrics,
  overallAccuracy,
  modelName = 'Model',
  isExecuted = true
}) => {
  if (!isExecuted || !metrics || metrics.length === 0) {
    return (
      <div className="glass-card p-6 border border-white/40 shadow-sm text-center">
        <p className="text-sm font-medium text-slate-600">Awaiting experiment</p>
        <p className="text-xs text-slate-400 mt-1">Classification report will calculate following test partition evaluation.</p>
      </div>
    );
  }

  // Calculate Macro Average
  const totalClasses = metrics.length;
  const macroPrecision = metrics.reduce((a, b) => a + b.precision, 0) / Math.max(1, totalClasses);
  const macroRecall = metrics.reduce((a, b) => a + b.recall, 0) / Math.max(1, totalClasses);
  const macroF1 = metrics.reduce((a, b) => a + b.f1Score, 0) / Math.max(1, totalClasses);
  const totalSupport = metrics.reduce((a, b) => a + b.support, 0);

  // Calculate Weighted Average
  const weightedPrecision = totalSupport > 0 
    ? metrics.reduce((a, b) => a + b.precision * b.support, 0) / totalSupport 
    : 0;
  const weightedRecall = totalSupport > 0 
    ? metrics.reduce((a, b) => a + b.recall * b.support, 0) / totalSupport 
    : 0;
  const weightedF1 = totalSupport > 0 
    ? metrics.reduce((a, b) => a + b.f1Score * b.support, 0) / totalSupport 
    : 0;

  return (
    <div className="glass-card p-5 border border-white/40 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h4 className="font-semibold text-slate-800 text-sm">Classification Performance Report</h4>
          <p className="text-xs text-slate-500">{modelName} • Scikit-Learn Empirical Statistics</p>
        </div>
        {overallAccuracy !== undefined && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            Overall Accuracy: {overallAccuracy.toFixed(1)}%
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 font-medium">
              <th className="pb-2 text-slate-600">Land Cover Class</th>
              <th className="pb-2 text-right">Precision</th>
              <th className="pb-2 text-right">Recall</th>
              <th className="pb-2 text-right">F1-Score</th>
              <th className="pb-2 text-right">Support (Samples)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {metrics.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-2.5 font-medium text-slate-700">{row.className}</td>
                <td className="py-2.5 text-right font-mono text-slate-600">{row.precision.toFixed(3)}</td>
                <td className="py-2.5 text-right font-mono text-slate-600">{row.recall.toFixed(3)}</td>
                <td className="py-2.5 text-right font-mono font-semibold text-indigo-600">{row.f1Score.toFixed(3)}</td>
                <td className="py-2.5 text-right font-mono text-slate-500">{row.support}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-slate-200 font-medium text-slate-700">
            <tr className="bg-slate-50/60">
              <td className="py-2">Macro Average</td>
              <td className="py-2 text-right font-mono">{macroPrecision.toFixed(3)}</td>
              <td className="py-2 text-right font-mono">{macroRecall.toFixed(3)}</td>
              <td className="py-2 text-right font-mono font-semibold text-indigo-700">{macroF1.toFixed(3)}</td>
              <td className="py-2 text-right font-mono">{totalSupport}</td>
            </tr>
            <tr className="bg-slate-100/50">
              <td className="py-2">Weighted Average</td>
              <td className="py-2 text-right font-mono">{weightedPrecision.toFixed(3)}</td>
              <td className="py-2 text-right font-mono">{weightedRecall.toFixed(3)}</td>
              <td className="py-2 text-right font-mono font-semibold text-indigo-700">{weightedF1.toFixed(3)}</td>
              <td className="py-2 text-right font-mono">{totalSupport}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
