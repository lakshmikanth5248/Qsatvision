import React from 'react';
import { APMapView } from '../components/maps/APMapView';
import { TimelineSlider } from '../components/timeline/TimelineSlider';
import { useAnalysis } from '../context/AnalysisContext';
import { Map, Navigation, Info } from 'lucide-react';
import { GlassPanel } from '../components/glass/GlassPanel';

interface ExploreAPProps {
  setActiveTab: (tab: string) => void;
}

export const ExploreAP: React.FC<ExploreAPProps> = ({ setActiveTab }) => {
  const { setDistrictId } = useAnalysis();

  const handleAnalyzeDistrict = (dId: string) => {
    setDistrictId(dId);
    setActiveTab('analyze');
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Map className="w-6 h-6 text-sky-600" />
            <h1 className="text-2xl font-bold text-slate-900 font-sans">Explore Andhra Pradesh Interactive Map</h1>
          </div>
          <p className="text-xs text-slate-500">
            Click any of the 26 districts of Andhra Pradesh to inspect spatial boundaries, metadata, and launch satellite analysis.
          </p>
        </div>

        <GlassPanel variant="pill" className="flex items-center gap-2 text-xs font-sans text-slate-700 font-medium shadow-sm">
          <Navigation className="w-4 h-4 text-sky-600" />
          <span>Coverage: <strong>Rayalaseema & Coastal AP</strong></span>
        </GlassPanel>
      </div>

      {/* Large Map Canvas Centerpiece with Liquid Glass Overlays */}
      <APMapView onAnalyzeDistrict={handleAnalyzeDistrict} />

      {/* Liquid Glass Timeline Control */}
      <TimelineSlider />

      {/* Bottom Guidance Info Panel */}
      <GlassPanel variant="control" className="p-4 text-xs text-slate-600 flex items-start gap-3 shadow-sm">
        <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Liquid Glass Guidance:</strong> Search for an AP district using the top floating search bar or click directly on any district polygon. Adjust the historical timeline slider (2010–Present) to update observation boundaries before clicking <strong>Analyze This District</strong>.
        </p>
      </GlassPanel>
    </div>
  );
};
