import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useAnalysis } from '../../context/AnalysisContext';
import { AP_DISTRICTS } from '../../data/apDistrictsGeoJSON';
import { DemoDataBadge } from '../glass/GlassBadge';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  BarChart3, 
  LineChart as LineChartIcon, 
  Activity,
  Trees,
  Droplets,
  Building2,
  AlertTriangle
} from 'lucide-react';

export type HistoricalMetric = 
  | 'ndvi'
  | 'ndwi'
  | 'ndbi'
  | 'vegArea'
  | 'waterArea'
  | 'urbanArea'
  | 'barrenArea'
  | 'detectedChange';

export type HistoricalChartType = 'line' | 'area' | 'bar';
export type TemporalGranularity = 'annual' | 'monthly' | 'custom';

export const HistoricalTrendsView: React.FC = () => {
  const { 
    districtId, 
    setDistrictId, 
    domain, 
    setDomain, 
    startYear, 
    endYear, 
    setTimelineRange 
  } = useAnalysis();

  const [selectedMetric, setSelectedMetric] = useState<HistoricalMetric>('ndvi');
  const [chartType, setChartType] = useState<HistoricalChartType>('line');
  const [granularity, setGranularity] = useState<TemporalGranularity>('annual');
  const [selectedMonthYear, setSelectedMonthYear] = useState<number>(2025);

  const districtObj = AP_DISTRICTS.find(d => d.id === districtId) || AP_DISTRICTS[0];

  // Generate complete annual dataset (2010 to 2026)
  const annualYears = Array.from({ length: 17 }, (_, i) => 2010 + i);
  const annualData = annualYears.map((yr) => {
    const seed = (districtId.length * 7 + yr * 13) % 100 / 100;
    const progress = (yr - 2010) / 16;
    
    // Baseline metrics
    const baseNdvi = districtObj.baselineMetrics.ndvi;
    const baseNdwi = districtObj.baselineMetrics.ndwi;
    const baseNdbi = districtObj.baselineMetrics.ndbi;
    const totalArea = districtObj.areaSqKm;

    let ndvi = baseNdvi + (domain === 'agriculture' ? 0.08 * progress : 0.03 * progress) + seed * 0.04;
    let ndwi = baseNdwi - (domain === 'water' ? 0.05 * progress : 0.02 * progress) + (1 - seed) * 0.03;
    let ndbi = baseNdbi + 0.12 * progress + seed * 0.03;

    if (domain === 'disaster' && (yr === 2015 || yr === 2023)) {
      ndwi += 0.20;
      ndvi -= 0.15;
    }

    ndvi = Math.max(0.1, Math.min(0.9, ndvi));
    ndwi = Math.max(0.05, Math.min(0.85, ndwi));
    ndbi = Math.max(0.1, Math.min(0.85, ndbi));

    const vegArea = Math.round(totalArea * (0.35 + ndvi * 0.35));
    const waterArea = Math.round(totalArea * (0.05 + ndwi * 0.25));
    const urbanArea = Math.round(totalArea * (0.08 + ndbi * 0.30));
    const barrenArea = Math.max(50, totalArea - vegArea - waterArea - urbanArea);
    const detectedChange = Math.round(15 + seed * 50 + progress * 35);

    return {
      timeLabel: `${yr}`,
      year: yr,
      ndvi: Number(ndvi.toFixed(3)),
      ndwi: Number(ndwi.toFixed(3)),
      ndbi: Number(ndbi.toFixed(3)),
      vegArea,
      waterArea,
      urbanArea,
      barrenArea,
      detectedChange,
      status: 'DEMO DATA'
    };
  });

  // Generate monthly dataset for seasonal phenology (12 months of selected year)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyData = monthNames.map((mName, mIdx) => {
    // Monsoon peak around Aug-Sep (months 7, 8)
    const seasonalFactor = Math.sin(((mIdx - 2) / 12) * Math.PI * 2);
    const baseNdvi = districtObj.baselineMetrics.ndvi;
    const baseNdwi = districtObj.baselineMetrics.ndwi;
    const baseNdbi = districtObj.baselineMetrics.ndbi;
    const totalArea = districtObj.areaSqKm;

    const ndvi = Number(Math.max(0.2, baseNdvi + 0.12 * seasonalFactor).toFixed(3));
    const ndwi = Number(Math.max(0.1, baseNdwi + 0.15 * seasonalFactor).toFixed(3));
    const ndbi = Number(Math.max(0.1, baseNdbi - 0.05 * seasonalFactor).toFixed(3));

    const vegArea = Math.round(totalArea * (0.35 + ndvi * 0.35));
    const waterArea = Math.round(totalArea * (0.05 + ndwi * 0.25));
    const urbanArea = Math.round(totalArea * (0.08 + ndbi * 0.30));
    const barrenArea = Math.max(50, totalArea - vegArea - waterArea - urbanArea);
    const detectedChange = Math.round(10 + Math.abs(seasonalFactor) * 40);

    return {
      timeLabel: `${mName} ${selectedMonthYear}`,
      year: selectedMonthYear,
      month: mIdx + 1,
      ndvi,
      ndwi,
      ndbi,
      vegArea,
      waterArea,
      urbanArea,
      barrenArea,
      detectedChange,
      status: 'DEMO DATA'
    };
  });

  // Filter based on granularity
  const rawChartData = granularity === 'monthly'
    ? monthlyData
    : annualData.filter(d => d.year >= startYear && d.year <= endYear);

  // Metric configuration
  const metricConfigs: Record<HistoricalMetric, { label: string; unit: string; color: string; domain: [number, number | 'auto'] }> = {
    ndvi: { label: 'NDVI (Vegetation Index)', unit: 'Index [-1 to +1]', color: '#16a34a', domain: [0, 1] },
    ndwi: { label: 'NDWI (Water Bodies Index)', unit: 'Index [-1 to +1]', color: '#0284c7', domain: [0, 1] },
    ndbi: { label: 'NDBI (Built-Up Index)', unit: 'Index [-1 to +1]', color: '#9333ea', domain: [0, 1] },
    vegArea: { label: 'Vegetation Area', unit: 'km²', color: '#15803d', domain: [0, 'auto'] },
    waterArea: { label: 'Water Body Area', unit: 'km²', color: '#0369a1', domain: [0, 'auto'] },
    urbanArea: { label: 'Built-Up Urban Area', unit: 'km²', color: '#7e22ce', domain: [0, 'auto'] },
    barrenArea: { label: 'Barren / Fallow Land Area', unit: 'km²', color: '#b45309', domain: [0, 'auto'] },
    detectedChange: { label: 'Detected Spatial Change', unit: 'km²', color: '#e11d48', domain: [0, 'auto'] }
  };

  const activeConfig = metricConfigs[selectedMetric];

  // Compute trend statistics (initial, latest, change, pct change, trend direction)
  const initialPoint = rawChartData[0];
  const latestPoint = rawChartData[rawChartData.length - 1];
  const initialVal = initialPoint ? (initialPoint[selectedMetric] as number) : 0;
  const latestVal = latestPoint ? (latestPoint[selectedMetric] as number) : 0;
  const absChange = Number((latestVal - initialVal).toFixed(3));
  const pctChange = initialVal !== 0 ? Number(((absChange / initialVal) * 100).toFixed(1)) : 0;

  const trendDirection = absChange > 0.005 ? 'increasing' : absChange < -0.005 ? 'decreasing' : 'stable';

  return (
    <div className="space-y-6">
      {/* 1. SELECTION CONTROLS HEADER */}
      <div className="liquid-glass p-6 rounded-3xl space-y-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-sky-800 uppercase tracking-widest font-sans">
                HISTORICAL TRENDS
              </span>
              <DemoDataBadge text="DEMO DATA" />
            </div>
            <h2 className="text-xl font-black text-[#152238] tracking-tight mt-0.5 font-sans">
              Temporal Geospatial Trends ({granularity === 'monthly' ? selectedMonthYear : `${startYear}–${endYear}`})
            </h2>
            <p className="text-xs text-[#46566E]">
              Interactive spectral index & spatial area trajectories across 2010–2026 archives.
            </p>
          </div>

          {/* Granularity Switcher */}
          <div className="flex items-center gap-1.5 liquid-glass-pill p-1.5 border border-white/70">
            <button
              onClick={() => setGranularity('annual')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                granularity === 'annual'
                  ? 'bg-sky-500/20 text-sky-950 font-bold border border-sky-400/50 shadow-xs'
                  : 'text-[#46566E] hover:text-[#172033]'
              }`}
            >
              Annual View (2010–2026)
            </button>
            <button
              onClick={() => setGranularity('monthly')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                granularity === 'monthly'
                  ? 'bg-sky-500/20 text-sky-950 font-bold border border-sky-400/50 shadow-xs'
                  : 'text-[#46566E] hover:text-[#172033]'
              }`}
            >
              Monthly Phenology
            </button>
          </div>
        </div>

        {/* CONTROLS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* District Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#172033] block">District:</label>
            <select
              value={districtId}
              onChange={(e) => setDistrictId(e.target.value)}
              className="w-full liquid-glass-pill px-3 py-2 text-[#172033] font-bold border border-white/80 focus:outline-none cursor-pointer"
            >
              {AP_DISTRICTS.map((d) => (
                <option key={d.id} value={d.id} className="bg-slate-100 text-slate-900">
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          {/* Application Domain */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#172033] block">Domain / Application:</label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value as any)}
              className="w-full liquid-glass-pill px-3 py-2 text-[#172033] font-bold border border-white/80 focus:outline-none cursor-pointer capitalize"
            >
              <option value="agriculture" className="bg-slate-100 text-slate-900">Agriculture (Crops & Vegetation)</option>
              <option value="water" className="bg-slate-100 text-slate-900">Water (Reservoirs & Wetlands)</option>
              <option value="urban" className="bg-slate-100 text-slate-900">Urban (Settlement Expansion)</option>
              <option value="disaster" className="bg-slate-100 text-slate-900">Disaster (Flood & Disturbance)</option>
            </select>
          </div>

          {/* Metric Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#172033] block">Target Metric:</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as HistoricalMetric)}
              className="w-full liquid-glass-pill px-3 py-2 text-[#172033] font-bold border border-white/80 focus:outline-none cursor-pointer"
            >
              <option value="ndvi" className="bg-slate-100 text-slate-900">NDVI (Vegetation Index)</option>
              <option value="ndwi" className="bg-slate-100 text-slate-900">NDWI (Water Index)</option>
              <option value="ndbi" className="bg-slate-100 text-slate-900">NDBI (Built-Up Index)</option>
              <option value="vegArea" className="bg-slate-100 text-slate-900">Vegetation Area (km²)</option>
              <option value="waterArea" className="bg-slate-100 text-slate-900">Water Body Area (km²)</option>
              <option value="urbanArea" className="bg-slate-100 text-slate-900">Built-Up Area (km²)</option>
              <option value="barrenArea" className="bg-slate-100 text-slate-900">Barren / Fallow Area (km²)</option>
              <option value="detectedChange" className="bg-slate-100 text-slate-900">Detected Spatial Change (km²)</option>
            </select>
          </div>

          {/* Time Range / Year Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#172033] block">
              {granularity === 'monthly' ? 'Observation Year:' : 'Time Range Window:'}
            </label>
            {granularity === 'monthly' ? (
              <select
                value={selectedMonthYear}
                onChange={(e) => setSelectedMonthYear(Number(e.target.value))}
                className="w-full liquid-glass-pill px-3 py-2 text-[#172033] font-bold border border-white/80 focus:outline-none cursor-pointer"
              >
                {annualYears.map(yr => (
                  <option key={yr} value={yr} className="bg-slate-100 text-slate-900">Year {yr}</option>
                ))}
              </select>
            ) : (
              <div className="flex items-center gap-2">
                <select
                  value={startYear}
                  onChange={(e) => setTimelineRange(Number(e.target.value), endYear)}
                  className="w-1/2 liquid-glass-pill px-2 py-2 text-xs font-bold focus:outline-none"
                >
                  {annualYears.map(yr => (
                    <option key={yr} value={yr} className="bg-slate-100 text-slate-900">{yr}</option>
                  ))}
                </select>
                <span className="text-[#46566E] font-bold">→</span>
                <select
                  value={endYear}
                  onChange={(e) => setTimelineRange(startYear, Number(e.target.value))}
                  className="w-1/2 liquid-glass-pill px-2 py-2 text-xs font-bold focus:outline-none"
                >
                  {annualYears.filter(y => y >= startYear).map(yr => (
                    <option key={yr} value={yr} className="bg-slate-100 text-slate-900">{yr}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. TREND SUMMARY METRIC CARDS (PART 3) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="liquid-glass p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-bold text-[#46566E] uppercase tracking-wider block">Initial Value</span>
          <div className="text-xl font-extrabold text-[#152238] font-mono">
            {initialVal.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#46566E]">{initialPoint?.timeLabel}</span>
        </div>

        <div className="liquid-glass p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-bold text-[#46566E] uppercase tracking-wider block">Latest Value</span>
          <div className="text-xl font-extrabold text-[#152238] font-mono">
            {latestVal.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#46566E]">{latestPoint?.timeLabel}</span>
        </div>

        <div className="liquid-glass p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-bold text-[#46566E] uppercase tracking-wider block">Absolute Change</span>
          <div className={`text-xl font-extrabold font-mono ${absChange >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
            {absChange >= 0 ? `+${absChange}` : absChange}
          </div>
          <span className="text-[10px] text-[#46566E]">{activeConfig.unit}</span>
        </div>

        <div className="liquid-glass p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-bold text-[#46566E] uppercase tracking-wider block">Percent Change</span>
          <div className={`text-xl font-extrabold font-mono ${pctChange >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
            {pctChange >= 0 ? `+${pctChange}%` : `${pctChange}%`}
          </div>
          <span className="text-[10px] text-[#46566E]">Cumulative</span>
        </div>

        <div className="liquid-glass p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-bold text-[#46566E] uppercase tracking-wider block">Trajectory</span>
          <div className="flex items-center gap-1 mt-0.5">
            {trendDirection === 'increasing' && <TrendingUp className="w-5 h-5 text-emerald-600" />}
            {trendDirection === 'decreasing' && <TrendingDown className="w-5 h-5 text-rose-600" />}
            {trendDirection === 'stable' && <Minus className="w-5 h-5 text-amber-600" />}
            <span className="text-xs font-bold capitalize text-[#172033]">{trendDirection}</span>
          </div>
          <span className="text-[10px] text-[#46566E]">Trend Direction</span>
        </div>

        <div className="liquid-glass p-4 rounded-2xl space-y-1 bg-amber-500/10 border border-amber-400/40">
          <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">Data Status</span>
          <div className="text-xs font-black font-mono text-amber-950 mt-1">
            DEMO DATA
          </div>
          <span className="text-[9px] text-amber-800">Simulated Trajectory</span>
        </div>
      </div>

      {/* 3. INTERACTIVE CHART (LINE / AREA / BAR) */}
      <div className="liquid-glass p-6 rounded-3xl space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center">
              <Activity className="w-4 h-4 text-sky-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#172033] font-sans">
                {districtObj.name} • {activeConfig.label} Trajectory
              </h3>
              <p className="text-xs text-[#46566E]">Unit: {activeConfig.unit} • Demo Dataset Mode</p>
            </div>
          </div>

          {/* Chart Type Toggles */}
          <div className="flex items-center gap-1.5 liquid-glass-pill p-1 border border-white/70">
            <button
              onClick={() => setChartType('line')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                chartType === 'line'
                  ? 'bg-sky-500/20 text-sky-950 font-bold border border-sky-400/50'
                  : 'text-[#46566E] hover:text-[#172033]'
              }`}
            >
              <LineChartIcon className="w-3.5 h-3.5" /> Line
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                chartType === 'area'
                  ? 'bg-sky-500/20 text-sky-950 font-bold border border-sky-400/50'
                  : 'text-[#46566E] hover:text-[#172033]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Area
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                chartType === 'bar'
                  ? 'bg-sky-500/20 text-sky-950 font-bold border border-sky-400/50'
                  : 'text-[#46566E] hover:text-[#172033]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Bar
            </button>
          </div>
        </div>

        {/* CHART CANVAS */}
        <div className="h-80 w-full pt-3">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={rawChartData} margin={{ top: 10, right: 25, left: -5, bottom: 0 }}>
                <defs>
                  <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeConfig.color} stopOpacity={0.65}/>
                    <stop offset="95%" stopColor={activeConfig.color} stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
                <XAxis dataKey="timeLabel" stroke="#46566E" fontSize={11} fontFamily="sans-serif" />
                <YAxis stroke="#46566E" fontSize={11} fontFamily="sans-serif" domain={activeConfig.domain} />
                <Tooltip
                  formatter={(val: any) => [`${val} (${activeConfig.unit})`, activeConfig.label]}
                  labelFormatter={(lbl) => `Observation: ${lbl} [DEMO DATA]`}
                  contentStyle={{
                    backgroundColor: 'rgba(235, 244, 254, 0.92)',
                    backdropFilter: 'blur(20px)',
                    borderColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '1.25rem',
                    fontSize: '12px',
                    color: '#172033',
                    boxShadow: '0 18px 40px rgba(45, 65, 105, 0.15)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={selectedMetric}
                  name={activeConfig.label}
                  stroke={activeConfig.color}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#metricGradient)"
                />
              </AreaChart>
            ) : chartType === 'bar' ? (
              <BarChart data={rawChartData} margin={{ top: 10, right: 25, left: -5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
                <XAxis dataKey="timeLabel" stroke="#46566E" fontSize={11} fontFamily="sans-serif" />
                <YAxis stroke="#46566E" fontSize={11} fontFamily="sans-serif" domain={activeConfig.domain} />
                <Tooltip
                  formatter={(val: any) => [`${val} (${activeConfig.unit})`, activeConfig.label]}
                  labelFormatter={(lbl) => `Observation: ${lbl} [DEMO DATA]`}
                  contentStyle={{
                    backgroundColor: 'rgba(235, 244, 254, 0.92)',
                    backdropFilter: 'blur(20px)',
                    borderColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '1.25rem',
                    fontSize: '12px',
                    color: '#172033',
                    boxShadow: '0 18px 40px rgba(45, 65, 105, 0.15)'
                  }}
                />
                <Bar dataKey={selectedMetric} name={activeConfig.label} fill={activeConfig.color} radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={rawChartData} margin={{ top: 10, right: 25, left: -5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
                <XAxis dataKey="timeLabel" stroke="#46566E" fontSize={11} fontFamily="sans-serif" />
                <YAxis stroke="#46566E" fontSize={11} fontFamily="sans-serif" domain={activeConfig.domain} />
                <Tooltip
                  formatter={(val: any) => [`${val} (${activeConfig.unit})`, activeConfig.label]}
                  labelFormatter={(lbl) => `Observation: ${lbl} [DEMO DATA]`}
                  contentStyle={{
                    backgroundColor: 'rgba(235, 244, 254, 0.92)',
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
                  dataKey={selectedMetric}
                  name={activeConfig.label}
                  stroke={activeConfig.color}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: activeConfig.color }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. DOMAIN-SPECIFIC MONITORING PANELS (PART 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Agriculture Panel */}
        <div className={`liquid-glass p-5 rounded-3xl space-y-3 border ${domain === 'agriculture' ? 'border-emerald-400/60 bg-emerald-500/5' : 'border-white/70'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trees className="w-5 h-5 text-emerald-600" />
              <h4 className="font-bold text-sm text-[#172033]">Agriculture</h4>
            </div>
            <DemoDataBadge text="DEMO DATA" />
          </div>
          <p className="text-xs text-[#46566E]">
            NDVI trend, agricultural canopy coverage, and crop phenological variations.
          </p>
          <div className="space-y-1.5 text-xs font-mono pt-1">
            <div className="flex justify-between">
              <span className="text-[#46566E]">Baseline NDVI:</span>
              <strong className="text-emerald-700">{districtObj.baselineMetrics.ndvi}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#46566E]">Cropland Area:</span>
              <strong>{districtObj.baselineMetrics.agriculturalAreaKm2.toLocaleString()} km²</strong>
            </div>
          </div>
        </div>

        {/* Water Panel */}
        <div className={`liquid-glass p-5 rounded-3xl space-y-3 border ${domain === 'water' ? 'border-sky-400/60 bg-sky-500/5' : 'border-white/70'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-sky-600" />
              <h4 className="font-bold text-sm text-[#172033]">Water Resources</h4>
            </div>
            <DemoDataBadge text="DEMO DATA" />
          </div>
          <p className="text-xs text-[#46566E]">
            NDWI surface water index, reservoir capacity tracking, and wetland extent.
          </p>
          <div className="space-y-1.5 text-xs font-mono pt-1">
            <div className="flex justify-between">
              <span className="text-[#46566E]">Baseline NDWI:</span>
              <strong className="text-sky-700">{districtObj.baselineMetrics.ndwi}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#46566E]">Water Extent:</span>
              <strong>{districtObj.baselineMetrics.waterBodyAreaKm2.toLocaleString()} km²</strong>
            </div>
          </div>
        </div>

        {/* Urban Panel */}
        <div className={`liquid-glass p-5 rounded-3xl space-y-3 border ${domain === 'urban' ? 'border-purple-400/60 bg-purple-500/5' : 'border-white/70'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              <h4 className="font-bold text-sm text-[#172033]">Urban Expansion</h4>
            </div>
            <DemoDataBadge text="DEMO DATA" />
          </div>
          <p className="text-xs text-[#46566E]">
            NDBI built-up index, impervious surface expansion, and infrastructure sprawl.
          </p>
          <div className="space-y-1.5 text-xs font-mono pt-1">
            <div className="flex justify-between">
              <span className="text-[#46566E]">Baseline NDBI:</span>
              <strong className="text-purple-700">{districtObj.baselineMetrics.ndbi}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#46566E]">Settlement Area:</span>
              <strong>{districtObj.baselineMetrics.builtUpAreaKm2.toLocaleString()} km²</strong>
            </div>
          </div>
        </div>

        {/* Disaster Panel */}
        <div className={`liquid-glass p-5 rounded-3xl space-y-3 border ${domain === 'disaster' ? 'border-rose-400/60 bg-rose-500/5' : 'border-white/70'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <h4 className="font-bold text-sm text-[#172033]">Disaster Response</h4>
            </div>
            <DemoDataBadge text="DEMO DATA" />
          </div>
          <p className="text-xs text-[#46566E]">
            Inundation anomaly detection, storm impact disturbance, and cyclone aftermath.
          </p>
          <div className="space-y-1.5 text-xs font-mono pt-1">
            <div className="flex justify-between">
              <span className="text-[#46566E]">Disturbance Event:</span>
              <strong className="text-rose-700">Simulated 2015/2023</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#46566E]">Estimated Affected:</span>
              <strong>~45 km²</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
