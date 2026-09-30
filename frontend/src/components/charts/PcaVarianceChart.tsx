import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { GitCommit } from 'lucide-react';
import type { PCAScreeItem } from '../../types';

interface PcaVarianceChartProps {
  screeData?: PCAScreeItem[];
  originalFeatureCount?: number;
  reducedComponentCount?: number;
  isExecuted?: boolean;
}

export const PcaVarianceChart: React.FC<PcaVarianceChartProps> = ({
  screeData = [
    { component: 1, explainedVarianceRatio: 48.5, cumulativeExplainedVariance: 48.5 },
    { component: 2, explainedVarianceRatio: 22.3, cumulativeExplainedVariance: 70.8 },
    { component: 3, explainedVarianceRatio: 12.1, cumulativeExplainedVariance: 82.9 },
    { component: 4, explainedVarianceRatio: 6.4, cumulativeExplainedVariance: 89.3 }
  ],
  originalFeatureCount = 14,
  reducedComponentCount = 4
}) => {
  const chartData = screeData.map(item => ({
    name: `PC ${item.component}`,
    individual: item.explainedVarianceRatio,
    cumulative: item.cumulativeExplainedVariance
  }));

  const totalVariance = screeData.length > 0 
    ? screeData[screeData.length - 1].cumulativeExplainedVariance 
    : 0;

  return (
    <div className="glass-card p-5 border border-white/40 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="font-semibold text-slate-800 text-sm">Dimensionality Reduction Scree Analysis</h4>
          <p className="text-xs text-slate-500">
            PCA Projection: {originalFeatureCount} Classical Features → {reducedComponentCount} Quantum Wires
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
            Total Retained Variance: {totalVariance.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Feature Reduction Ratio Pill */}
      <div className="flex items-center gap-2 p-2.5 mb-4 rounded-xl bg-slate-50/70 border border-slate-200/60 text-xs">
        <GitCommit className="w-4 h-4 text-indigo-600 shrink-0" />
        <div className="flex flex-wrap items-center gap-1.5 text-slate-700">
          <span>Feature Space Compression:</span>
          <span className="font-semibold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
            {originalFeatureCount} Features
          </span>
          <span className="text-slate-400">→</span>
          <span className="font-semibold text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded border border-indigo-200">
            {reducedComponentCount} Principal Components
          </span>
          <span className="text-slate-500 text-[11px]">
            (Fits NISQ qubit register without statevector explosion)
          </span>
        </div>
      </div>

      {/* Scree Chart */}
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis
              yAxisId="left"
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: '#64748b' }}
              unit="%"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: '#64748b' }}
              unit="%"
            />
            <Tooltip
              formatter={(value: any, name: any) => [
                `${Number(value).toFixed(1)}%`,
                name === 'individual' ? 'Individual Variance' : 'Cumulative Variance'
              ]}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '12px'
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }}
              formatter={(val) => (val === 'individual' ? 'Component Variance Ratio' : 'Cumulative Explained Variance')}
            />
            <Bar
              yAxisId="left"
              dataKey="individual"
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cumulative"
              stroke="#0d9488"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#0d9488' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
