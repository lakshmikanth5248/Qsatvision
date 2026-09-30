import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, Clock } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';
import { GlassPanel } from '../glass/GlassPanel';
import { GlassButton } from '../glass/GlassButton';
import { DemoDataBadge } from '../glass/GlassBadge';

export const TimelineSlider: React.FC = () => {
  const { startYear, endYear, selectedMonth, setTimelineRange, satellite } = useAnalysis();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activePlaybackYear, setActivePlaybackYear] = useState<number>(endYear);
  const [mode, setMode] = useState<'annual' | 'monthly' | 'custom'>('annual');

  const years = Array.from({ length: 17 }, (_, i) => 2010 + i);
  const months = [
    'All Months', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Sequential Playback 2010 -> 2026 (PART 10)
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setActivePlaybackYear((prev) => {
          if (prev >= 2026) {
            setIsPlaying(false);
            return 2010;
          }
          const nextYr = prev + 1;
          setTimelineRange(startYear, nextYr, selectedMonth);
          return nextYr;
        });
      }, 900);
    }
    return () => clearInterval(interval);
  }, [isPlaying, startYear, selectedMonth, setTimelineRange]);

  const handleStartYearChange = (sYr: number) => {
    const validEnd = Math.max(sYr, endYear);
    setTimelineRange(sYr, validEnd, selectedMonth);
    setActivePlaybackYear(validEnd);
  };

  const handleEndYearChange = (eYr: number) => {
    const validStart = Math.min(startYear, eYr);
    setTimelineRange(validStart, eYr, selectedMonth);
    setActivePlaybackYear(eYr);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTimelineRange(2018, 2026, 'all');
    setActivePlaybackYear(2026);
  };

  return (
    <GlassPanel variant="control" className="p-5 space-y-4 shadow-sm">
      {/* HEADER WITH PERIOD BADGE & MODE */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
            Historical Satellite Archive Timeline: <span className="text-sky-700">2010 → 2026</span>
          </span>
          <DemoDataBadge text="DEMO DATA" />
        </div>

        {/* Selected Period Bar Display (Part 9 Example) */}
        <div className="liquid-glass-pill px-3.5 py-1 text-xs font-mono font-extrabold text-sky-950 border border-sky-400/40">
          Selected Period: <strong className="text-sky-800">{startYear}</strong> ━━━━━━━━━━━━━ <strong className="text-sky-800">{endYear}</strong>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-white/80 p-1 rounded-xl border border-slate-200 text-xs shadow-xs">
          {(['annual', 'monthly', 'custom'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-lg capitalize transition-all ${
                mode === m ? 'bg-sky-500/15 text-sky-800 font-bold border border-sky-400/30' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* PLAYBACK CONTROLS & RANGE SLIDER TRACK */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Play / Pause / Reset Buttons (Part 9 & 10) */}
        <div className="flex items-center gap-2 shrink-0">
          <GlassButton
            variant="primary"
            size="md"
            icon={isPlaying ? Pause : Play}
            onClick={() => setIsPlaying(!isPlaying)}
            className="font-semibold shadow-xs"
          >
            {isPlaying ? 'Pause' : '▶ Play Timeline'}
          </GlassButton>

          <GlassButton
            variant="secondary"
            size="md"
            icon={RotateCcw}
            onClick={handleReset}
            className="font-semibold shadow-xs"
          >
            Reset
          </GlassButton>
        </div>

        {/* Timeline Slider Track */}
        <div className="flex-1 w-full space-y-2">
          <div className="flex items-center justify-between text-xs font-sans text-slate-500 font-semibold">
            <span>2010 Baseline</span>
            <span className="text-sky-900 font-extrabold font-mono bg-white/90 px-3.5 py-0.5 rounded-full border border-sky-300/60 shadow-xs">
              {isPlaying ? `Playback Step: ${activePlaybackYear}` : `Observation: ${startYear} → ${endYear}`}
            </span>
            <span>2026 (Present)</span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min={2010}
              max={2026}
              step={1}
              value={isPlaying ? activePlaybackYear : endYear}
              onChange={(e) => handleEndYearChange(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600 focus:outline-none shadow-inner"
            />
          </div>

          <div className="flex justify-between text-[10px] font-sans text-slate-500 font-medium px-1">
            {years.map((y) => (
              <span
                key={y}
                onClick={() => handleEndYearChange(y)}
                className={`cursor-pointer transition-all ${
                  y === endYear ? 'text-sky-700 font-bold scale-110' : 'hover:text-slate-800'
                }`}
              >
                {y % 2 === 0 ? `'${y.toString().slice(-2)}` : ''}
              </span>
            ))}
          </div>
        </div>

        {/* Custom Mode Start Year Selector */}
        {mode === 'custom' && (
          <div className="shrink-0 flex items-center gap-2 bg-white/80 px-3 py-2 rounded-2xl border border-slate-200 shadow-sm text-xs">
            <span className="text-slate-600 font-semibold">Start:</span>
            <select
              value={startYear}
              onChange={(e) => handleStartYearChange(Number(e.target.value))}
              className="bg-white text-sky-800 text-xs font-semibold border border-slate-200 rounded-xl px-2 py-1 focus:outline-none cursor-pointer"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        )}

        {/* Monthly Selector */}
        {mode === 'monthly' && (
          <div className="shrink-0 flex items-center gap-2 bg-white/80 px-3 py-2 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-600 font-semibold">Month:</span>
            <select
              value={selectedMonth === 'all' ? 0 : selectedMonth}
              onChange={(e) => {
                const val = Number(e.target.value);
                setTimelineRange(startYear, endYear, val === 0 ? 'all' : val);
              }}
              className="bg-white text-sky-800 text-xs font-semibold border border-slate-200 rounded-xl px-2 py-1 focus:outline-none cursor-pointer"
            >
              {months.map((m, idx) => (
                <option key={m} value={idx}>{m}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 font-sans">
        <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Active Satellite Stream: <strong>{satellite.toUpperCase()}</strong> ({endYear})</span>
        </div>
        <span className="font-semibold text-amber-900">DEMO DATA ARCHIVE — Simulated Temporal Evolution</span>
      </div>
    </GlassPanel>
  );
};
