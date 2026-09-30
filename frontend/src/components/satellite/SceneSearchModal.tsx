import React, { useState } from 'react';
import { Search, Satellite, Calendar, Cloud, HardDrive, Check, AlertTriangle, X } from 'lucide-react';
import { apiService } from '../../services/apiService';
import type { SatelliteScene } from '../../types';

interface SceneSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  districtId: string;
  districtName: string;
  currentYear: number;
  onSelectScene?: (scene: SatelliteScene) => void;
}

export const SceneSearchModal: React.FC<SceneSearchModalProps> = ({
  isOpen,
  onClose,
  districtId,
  districtName,
  currentYear = 2026,
  onSelectScene
}) => {
  const [satellite, setSatellite] = useState('sentinel-2');
  const [startYear, setStartYear] = useState(2020);
  const [endYear, setEndYear] = useState(currentYear);
  const [maxCloud, setMaxCloud] = useState(20);
  const [loading, setLoading] = useState(false);
  const [scenes, setScenes] = useState<SatelliteScene[]>([]);
  const [searched, setSearched] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async () => {
    setLoading(true);
    setWarning(null);
    setSearched(true);
    try {
      // 1. Check availability
      const avail = await apiService.checkSatelliteAvailability(satellite, startYear, endYear);
      if (!avail.available) {
        setWarning(avail.message || 'No compatible satellite data available for this period.');
        setScenes([]);
        return;
      }

      // 2. Search catalog
      const res = await apiService.searchSatelliteScenes({
        districtId,
        satelliteSource: satellite,
        startYear,
        endYear,
        maxCloudCover: maxCloud
      });

      if (res.operationalNote) {
        setWarning(res.operationalNote);
      }
      setScenes(res.scenes || []);
    } catch (e: any) {
      setWarning(e.message || 'Failed to query satellite scenes');
      setScenes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl glass-card bg-white/95 border border-white/60 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600">
              <Satellite className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-800">Satellite Scene Catalog Search</h3>
              <p className="text-xs text-slate-500">Query Earth observation archives for {districtName} District</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="p-5 bg-slate-50/50 border-b border-slate-200/60 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="font-medium text-slate-700 block mb-1">Constellation</label>
            <select
              value={satellite}
              onChange={(e) => setSatellite(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-indigo-500"
            >
              <option value="sentinel-2">Sentinel-2 MSI (2015+)</option>
              <option value="landsat-8">Landsat 8 OLI (2013+)</option>
              <option value="landsat-9">Landsat 9 OLI-2 (2021+)</option>
              <option value="sentinel-1">Sentinel-1 SAR Radar (2014+)</option>
              <option value="combined">Optical-SAR Composite (2015+)</option>
            </select>
          </div>

          <div>
            <label className="font-medium text-slate-700 block mb-1">Start Year</label>
            <input
              type="number"
              min={2010}
              max={2026}
              value={startYear}
              onChange={(e) => setStartYear(parseInt(e.target.value) || 2020)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-indigo-500"
            />
          </div>

          <div>
            <label className="font-medium text-slate-700 block mb-1">End Year</label>
            <input
              type="number"
              min={2010}
              max={2026}
              value={endYear}
              onChange={(e) => setEndYear(parseInt(e.target.value) || 2026)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-indigo-500"
            />
          </div>

          <div>
            <label className="font-medium text-slate-700 block mb-1">Max Cloud Cover (%)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={100}
                value={maxCloud}
                onChange={(e) => setMaxCloud(parseInt(e.target.value) || 20)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-indigo-500"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1 shrink-0 transition-all shadow-xs"
              >
                <Search className="w-3.5 h-3.5" />
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>

        {/* Warning if any */}
        {warning && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Operational Availability Notice:</span>
              <span>{warning}</span>
            </div>
          </div>
        )}

        {/* Results Body */}
        <div className="p-5 flex-1 overflow-y-auto">
          {scenes.length > 0 ? (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>Matching Scenes: <b>{scenes.length}</b></span>
                <span className="text-[11px] text-slate-400">Download Threshold Safeguard: 1,000 MB</span>
              </div>
              {scenes.map((scene) => (
                <div
                  key={scene.sceneId}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-indigo-300 transition-all flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-slate-900">{scene.sceneId}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                        {scene.season}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-slate-500 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {scene.acquisitionDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Cloud className="w-3 h-3 text-slate-400" />
                        Cloud: {scene.cloudCoveragePct}%
                      </span>
                      <span className="flex items-center gap-1">
                        <HardDrive className="w-3 h-3 text-slate-400" />
                        Size: {scene.estimatedSizeFormatted}
                      </span>
                      <span>Res: {scene.resolution}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onSelectScene) onSelectScene(scene);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold transition-colors flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Select Scene
                  </button>
                </div>
              ))}
            </div>
          ) : searched && !loading ? (
            <div className="text-center py-10">
              <p className="text-sm font-medium text-slate-600">No scenes matched your filter criteria.</p>
              <p className="text-xs text-slate-400 mt-1">Try expanding the date range or increasing the cloud cover threshold.</p>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs">
              Select constellation criteria above and click Search to query the archive catalog.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
          <span>Provider: ESA Copernicus & USGS EarthExplorer Catalog</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-medium"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
