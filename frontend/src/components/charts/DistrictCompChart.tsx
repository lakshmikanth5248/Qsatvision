import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from 'recharts';
import { AP_DISTRICTS } from '../../data/apDistrictsGeoJSON';
import { GitCompare, Layers, MapPin, Table as TableIcon, BarChart3, LineChart as LineChartIcon, Check } from 'lucide-react';
import { DemoDataBadge } from '../glass/GlassBadge';

export const DistrictCompChart: React.FC = () => {
  // Allow 2 to 5 districts (Part 6)
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'ysr_kadapa', 
    'tirupati', 
    'visakhapatnam', 
    'ntr'
  ]);
  const [metricKey, setMetricKey] = useState<'ndvi' | 'ndwi' | 'ndbi' | 'builtUp' | 'agri' | 'water'>('ndvi');
  const [displayMode, setDisplayMode] = useState<'bar' | 'line' | 'table'>('bar');

  const toggleDistrict = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 2) {
        setSelectedIds(selectedIds.filter(item => item !== id));
      }
    } else {
      if (selectedIds.length < 5) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const selectedDistricts = AP_DISTRICTS.filter(d => selectedIds.includes(d.id));

  const chartData = selectedDistricts.map(d => ({
    name: d.name,
    code: d.code,
    region: d.region,
    areaSqKm: d.areaSqKm,
    ndvi: d.baselineMetrics.ndvi,
    ndwi: d.baselineMetrics.ndwi,
    ndbi: d.baselineMetrics.ndbi,
    builtUp: d.baselineMetrics.builtUpAreaKm2,
    agri: d.baselineMetrics.agriculturalAreaKm2,
    water: d.baselineMetrics.waterBodyAreaKm2,
    status: 'DEMO DATA'
  }));

  const metricLabels: Record<string, { label: string; unit: string; color: string }> = {
    ndvi: { label: 'NDVI (Vegetation Index)', unit: 'Index [0–1]', color: '#16a34a' },
    ndwi: { label: 'NDWI (Water Index)', unit: 'Index [0–1]', color: '#0284c7' },
    ndbi: { label: 'NDBI (Built-Up Index)', unit: 'Index [0–1]', color: '#9333ea' },
    agri: { label: 'Agricultural Area', unit: 'km²', color: '#15803d' },
    builtUp: { label: 'Built-Up Area', unit: 'km²', color: '#7e22ce' },
    water: { label: 'Surface Water Body Area', unit: 'km²', color: '#0369a1' },
  };

  const activeMetric = metricLabels[metricKey];

  return (
    <div className="liquid-glass p-6 rounded-3xl space-y-6 shadow-sm">
      {/* HEADER & CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center">
            <GitCompare className="w-5 h-5 text-sky-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-sky-800 uppercase tracking-widest font-sans">
                DISTRICT COMPARISON
              </span>
              <DemoDataBadge text="DEMO DATA" />
            </div>
            <h3 className="text-xl font-black text-[#152238] tracking-tight font-sans">
              Cross-District Andhra Pradesh Environmental Benchmark
            </h3>
            <p className="text-xs text-[#46566E]">
              Select 2 to 5 districts across AP to compare baseline environmental indices and land cover factuals.
            </p>
          </div>
        </div>

        {/* VIEW MODE TOGGLE */}
        <div className="flex items-center gap-1.5 liquid-glass-pill p-1 border border-white/70">
          <button
            onClick={() => setDisplayMode('bar')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              displayMode === 'bar'
                ? 'bg-sky-500/20 text-sky-950 font-bold border border-sky-400/50'
                : 'text-[#46566E] hover:text-[#172033]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Bar Chart
          </button>
          <button
            onClick={() => setDisplayMode('line')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              displayMode === 'line'
                ? 'bg-sky-500/20 text-sky-950 font-bold border border-sky-400/50'
                : 'text-[#46566E] hover:text-[#172033]'
            }`}
          >
            <LineChartIcon className="w-3.5 h-3.5" /> Profile Line
          </button>
          <button
            onClick={() => setDisplayMode('table')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              displayMode === 'table'
                ? 'bg-sky-500/20 text-sky-950 font-bold border border-sky-400/50'
                : 'text-[#46566E] hover:text-[#172033]'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" /> Table
          </button>
        </div>
      </div>

      {/* METRIC SELECTION ROW */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[#46566E] font-bold">Comparison Metric:</span>
          <select
            value={metricKey}
            onChange={(e) => setMetricKey(e.target.value as any)}
            className="liquid-glass-pill px-3 py-1.5 text-sky-950 font-bold border border-white/80 focus:outline-none cursor-pointer"
          >
            <option value="ndvi" className="bg-slate-100 text-slate-900">NDVI (Vegetation Index)</option>
            <option value="ndwi" className="bg-slate-100 text-slate-900">NDWI (Water Index)</option>
            <option value="ndbi" className="bg-slate-100 text-slate-900">NDBI (Built-Up Index)</option>
            <option value="agri" className="bg-slate-100 text-slate-900">Agricultural Area (km²)</option>
            <option value="water" className="bg-slate-100 text-slate-900">Water Body Area (km²)</option>
            <option value="builtUp" className="bg-slate-100 text-slate-900">Built-Up Area (km²)</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-slate-600">
          <span className="font-semibold">Selected:</span>
          <span className="liquid-glass-pill px-3 py-1 font-bold text-sky-900 border border-sky-400/30">
            {selectedIds.length} / 5 Districts (Min 2, Max 5)
          </span>
        </div>
      </div>

      {/* DISTRICT SELECTOR PILLS (2-5 SELECTION) */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#172033] flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-sky-700" /> Click to Toggle Districts (2 to 5 allowed):
        </span>
        <div className="flex flex-wrap gap-2">
          {AP_DISTRICTS.map((d) => {
            const isSelected = selectedIds.includes(d.id);
            return (
              <button
                key={d.id}
                onClick={() => toggleDistrict(d.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-sans transition-all ${
                  isSelected
                    ? 'bg-sky-500/25 text-sky-950 font-extrabold border border-sky-400/60 shadow-xs'
                    : 'bg-white/25 text-[#46566E] border border-white/60 hover:bg-white/45 font-medium'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-sky-700 shrink-0" />}
                <span>{d.name} ({d.code})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SELECTED DISTRICTS OVERVIEW TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {selectedDistricts.map((d) => (
          <div key={d.id} className="liquid-glass p-3.5 rounded-2xl border border-white/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider">{d.code}</span>
              <span className="text-[9px] text-[#46566E] font-medium">{d.region}</span>
            </div>
            <h4 className="font-extrabold text-sm text-[#152238] truncate">{d.name}</h4>
            <div className="text-[11px] font-mono text-[#34445B] pt-1 border-t border-slate-200/50 flex justify-between">
              <span>{metricKey.toUpperCase()}:</span>
              <strong className="text-sky-950">{d.baselineMetrics[metricKey === 'builtUp' ? 'builtUpAreaKm2' : metricKey === 'agri' ? 'agriculturalAreaKm2' : metricKey === 'water' ? 'waterBodyAreaKm2' : metricKey as 'ndvi' | 'ndwi' | 'ndbi']}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* DISPLAY CANVAS: BAR, LINE, OR TABLE */}
      {displayMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-white/60 rounded-2xl overflow-hidden shadow-xs">
            <thead className="bg-[rgba(225,235,247,0.7)] text-[#172033] font-bold font-sans">
              <tr>
                <th className="p-3.5 border-b border-slate-300/60">District Name</th>
                <th className="p-3.5 border-b border-slate-300/60">Region</th>
                <th className="p-3.5 border-b border-slate-300/60">Total Area (km²)</th>
                <th className="p-3.5 border-b border-slate-300/60">NDVI (Vegetation)</th>
                <th className="p-3.5 border-b border-slate-300/60">NDWI (Water)</th>
                <th className="p-3.5 border-b border-slate-300/60">NDBI (Built-up)</th>
                <th className="p-3.5 border-b border-slate-300/60">Cropland (km²)</th>
                <th className="p-3.5 border-b border-slate-300/60">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 bg-white/20 backdrop-blur-md text-[#26364C]">
              {chartData.map((row, idx) => (
                <tr key={idx} className="hover:bg-[rgba(60,170,240,0.12)] transition-colors">
                  <td className="p-3.5 font-bold text-[#172033]">{row.name} ({row.code})</td>
                  <td className="p-3.5 text-[#34445B]">{row.region}</td>
                  <td className="p-3.5 font-mono text-[#34445B]">{row.areaSqKm.toLocaleString()}</td>
                  <td className="p-3.5 font-mono font-bold text-emerald-800">{row.ndvi}</td>
                  <td className="p-3.5 font-mono font-bold text-sky-800">{row.ndwi}</td>
                  <td className="p-3.5 font-mono font-bold text-purple-800">{row.ndbi}</td>
                  <td className="p-3.5 font-mono text-[#34445B]">{row.agri.toLocaleString()}</td>
                  <td className="p-3.5">
                    <span className="liquid-glass-pill px-2.5 py-0.5 text-amber-900 text-[10px] font-mono border border-amber-400/40 bg-amber-50/70 font-bold">
                      DEMO DATA
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {displayMode === 'line' ? (
              <LineChart data={chartData} margin={{ top: 10, right: 25, left: -5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
                <XAxis dataKey="name" stroke="#46566E" fontSize={11} fontFamily="sans-serif" />
                <YAxis stroke="#46566E" fontSize={11} fontFamily="sans-serif" />
                <Tooltip
                  formatter={(val: any) => [`${val} (${activeMetric.unit})`, activeMetric.label]}
                  labelFormatter={(lbl) => `District: ${lbl} [DEMO DATA]`}
                  contentStyle={{
                    backgroundColor: 'rgba(235, 244, 254, 0.90)',
                    backdropFilter: 'blur(20px)',
                    borderColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '1.25rem',
                    fontSize: '12px',
                    color: '#172033',
                    boxShadow: '0 18px 40px rgba(45, 65, 105, 0.15)'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#172033' }} />
                <Line
                  type="monotone"
                  dataKey={metricKey}
                  name={activeMetric.label}
                  stroke={activeMetric.color}
                  strokeWidth={2.5}
                  dot={{ r: 5, fill: activeMetric.color }}
                />
              </LineChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 10, right: 25, left: -5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
                <XAxis dataKey="name" stroke="#46566E" fontSize={11} fontFamily="sans-serif" />
                <YAxis stroke="#46566E" fontSize={11} fontFamily="sans-serif" />
                <Tooltip
                  formatter={(val: any) => [`${val} (${activeMetric.unit})`, activeMetric.label]}
                  labelFormatter={(lbl) => `District: ${lbl} [DEMO DATA]`}
                  contentStyle={{
                    backgroundColor: 'rgba(235, 244, 254, 0.90)',
                    backdropFilter: 'blur(20px)',
                    borderColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '1.25rem',
                    fontSize: '12px',
                    color: '#172033',
                    boxShadow: '0 18px 40px rgba(45, 65, 105, 0.15)'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#172033' }} />
                <Bar
                  dataKey={metricKey}
                  name={activeMetric.label}
                  fill={activeMetric.color}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}

      {/* FOOTER NOTE (Factual metrics only, no ranking) */}
      <div className="pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs text-[#46566E]">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-sky-600" />
          <span>Factual administrative metrics comparison • No subjective district ranking</span>
        </div>
        <span className="font-mono text-amber-900 font-bold">DEMO DATA — Simulated Baseline</span>
      </div>
    </div>
  );
};
