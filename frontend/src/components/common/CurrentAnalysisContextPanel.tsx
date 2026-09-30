import React from 'react';
import { useAnalysis } from '../../context/AnalysisContext';
import { AP_DISTRICTS } from '../../data/apDistrictsGeoJSON';
import { GlassPanel } from '../glass/GlassPanel';
import { DemoDataBadge } from '../glass/GlassBadge';
import { MapPin, Calendar, Sparkles, Layers, Sliders } from 'lucide-react';

export const CurrentAnalysisContextPanel: React.FC = () => {
  const {
    districtId,
    startYear,
    endYear,
    domain,
    satellite,
    classicalModel,
    quantumModel,
    dataMode
  } = useAnalysis();

  const districtObj = AP_DISTRICTS.find(d => d.id === districtId) || AP_DISTRICTS[0];

  return (
    <GlassPanel variant="control" className="p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-sky-600" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
            Active Global Analysis Context
          </h3>
        </div>
        <DemoDataBadge text={`${dataMode} MODE`} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs font-sans">
        <div className="bg-white/80 p-3 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] text-slate-500 block flex items-center gap-1">
            <MapPin className="w-3 h-3 text-sky-600" /> Location
          </span>
          <span className="font-bold text-slate-900">{districtObj.name}</span>
        </div>

        <div className="bg-white/80 p-3 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] text-slate-500 block flex items-center gap-1">
            <Calendar className="w-3 h-3 text-emerald-600" /> Time Window
          </span>
          <span className="font-bold text-emerald-700">{startYear} → {endYear}</span>
        </div>

        <div className="bg-white/80 p-3 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] text-slate-500 block flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" /> Domain
          </span>
          <span className="font-bold text-amber-700 capitalize">{domain}</span>
        </div>

        <div className="bg-white/80 p-3 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] text-slate-500 block flex items-center gap-1">
            <Layers className="w-3 h-3 text-purple-600" /> Sensor
          </span>
          <span className="font-bold text-purple-700 uppercase">{satellite}</span>
        </div>

        <div className="bg-white/80 p-3 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] text-slate-500 block">Classical Model</span>
          <span className="font-bold text-slate-800 capitalize">{classicalModel.replace('_', ' ')}</span>
        </div>

        <div className="bg-white/80 p-3 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] text-slate-500 block">QML Algorithm</span>
          <span className="font-bold text-purple-700 uppercase">{quantumModel}</span>
        </div>
      </div>
    </GlassPanel>
  );
};
