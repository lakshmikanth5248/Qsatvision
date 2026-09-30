import React from 'react';
import { SATELLITE_DATASETS } from '../../data/mockSatelliteData';
import type { SatelliteSource } from '../../types';
import { GlassPanel } from '../glass/GlassPanel';
import { DemoDataBadge } from '../glass/GlassBadge';

interface SatelliteSelectorProps {
  selectedSatellite: SatelliteSource;
  onSelectSatellite: (source: SatelliteSource) => void;
}

export const SatelliteSelector: React.FC<SatelliteSelectorProps> = ({
  selectedSatellite,
  onSelectSatellite,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {SATELLITE_DATASETS.map((sat) => {
        const isSelected = selectedSatellite === sat.id;
        return (
          <GlassPanel
            key={sat.id}
            variant="card"
            onClick={() => onSelectSatellite(sat.id)}
            className={`p-5 cursor-pointer transition-all duration-300 ${
              isSelected
                ? 'ring-2 ring-sky-500/80 bg-white/75 border-white shadow-md'
                : 'hover:bg-white/70'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-extrabold text-sm text-slate-900">{sat.name}</h4>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-800 border border-sky-400/30 font-mono font-bold">
                {sat.resolution}
              </span>
            </div>

            <p className="text-xs text-slate-600 font-medium mb-3">{sat.provider} • Cloud Cover: {sat.cloudCoverAvg}</p>

            <div className="flex items-center justify-between text-[11px] font-sans pt-2 border-t border-slate-200/80">
              <span className="text-slate-600 font-semibold">Available: {sat.availableYears[0]} – {sat.availableYears[1]}</span>
              <DemoDataBadge text="DEMO ARCHIVE" />
            </div>
          </GlassPanel>
        );
      })}
    </div>
  );
};
