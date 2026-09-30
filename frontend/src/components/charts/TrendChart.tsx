import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { generateTemporalTrend } from '../../data/mockSatelliteData';
import { useAnalysis } from '../../context/AnalysisContext';
import { BarChart3 } from 'lucide-react';
import { DemoDataBadge } from '../glass/GlassBadge';

interface TrendChartProps {
  districtId?: string;
  domain?: string;
}

export const TrendChart: React.FC<TrendChartProps> = ({ 
  districtId: propDistrict, 
  domain: propDomain 
}) => {
  const { districtId: ctxDistrict, domain: ctxDomain, startYear, endYear } = useAnalysis();
  const dId = propDistrict || ctxDistrict;
  const dom = propDomain || ctxDomain;

  const fullData = generateTemporalTrend(dId, dom);
  const chartData = fullData.filter(d => d.year >= startYear && d.year <= endYear);

  return (
    <div className="liquid-glass p-6 rounded-3xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-sky-700" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#172033] font-sans">
              Historical Environmental Trend ({startYear}–{endYear})
            </h3>
            <p className="text-xs text-[#46566E]">Multi-index spectral change trend (NDVI, NDWI, NDBI)</p>
          </div>
        </div>

        <DemoDataBadge text="DEMO DATA TREND" />
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
            <XAxis dataKey="year" stroke="#46566E" fontSize={11} fontFamily="sans-serif" />
            <YAxis stroke="#46566E" fontSize={11} fontFamily="sans-serif" domain={[0, 1]} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(235, 244, 254, 0.85)',
                backdropFilter: 'blur(20px)',
                borderColor: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '1.25rem',
                fontSize: '12px',
                fontFamily: 'sans-serif',
                color: '#172033',
                boxShadow: '0 18px 40px rgba(45, 65, 105, 0.15)'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'sans-serif', color: '#172033' }} />
            <Line
              type="monotone"
              dataKey="ndvi"
              name="NDVI (Vegetation Index)"
              stroke="#16a34a"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#16a34a' }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="ndwi"
              name="NDWI (Water Body Index)"
              stroke="#0284c7"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#0284c7' }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="ndbi"
              name="NDBI (Built-Up Index)"
              stroke="#e11d48"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#e11d48' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-2 text-[10px] text-[#46566E] text-right font-sans">
        * Temporal trends are generated from synthetic AP district baseline metrics.
      </div>
    </div>
  );
};
