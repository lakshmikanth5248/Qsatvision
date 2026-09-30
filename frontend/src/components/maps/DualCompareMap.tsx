import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Rectangle, CircleMarker, Popup, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import { AP_DISTRICTS } from '../../data/apDistrictsGeoJSON';
import { useAnalysis } from '../../context/AnalysisContext';
import { Calendar, ArrowUpRight, ArrowDownRight, Layers, CheckSquare, Square, Compass, Info } from 'lucide-react';
import { DemoDataBadge } from '../glass/GlassBadge';

interface DualCompareMapProps {
  yearA?: number;
  yearB?: number;
}

export interface MapLayersConfig {
  satellite: boolean;
  landCover: boolean;
  ndvi: boolean;
  ndwi: boolean;
  ndbi: boolean;
  changeDetection: boolean;
  districtBoundary: boolean;
  selectedArea: boolean;
}

// Synchronizer component to coordinate camera across both views
function MapSynchronizer({
  center,
  zoom,
  onSyncMove,
}: {
  center: [number, number];
  zoom: number;
  onSyncMove: (c: [number, number], z: number) => void;
}) {
  const map = useMap();

  useEffect(() => {
    const curCenter = map.getCenter();
    const curZoom = map.getZoom();
    const dLat = Math.abs(curCenter.lat - center[0]);
    const dLng = Math.abs(curCenter.lng - center[1]);
    if (dLat > 0.0005 || dLng > 0.0005 || curZoom !== zoom) {
      map.setView(center, zoom, { animate: false });
    }
  }, [center, zoom, map]);

  useMapEvents({
    moveend: () => {
      const curCenter = map.getCenter();
      const curZoom = map.getZoom();
      const dLat = Math.abs(curCenter.lat - center[0]);
      const dLng = Math.abs(curCenter.lng - center[1]);
      if (dLat > 0.0005 || dLng > 0.0005 || curZoom !== zoom) {
        onSyncMove([curCenter.lat, curCenter.lng], curZoom);
      }
    }
  });

  return null;
}

export const DualCompareMap: React.FC<DualCompareMapProps> = ({ 
  yearA = 2013, 
  yearB = 2026 
}) => {
  const { districtId } = useAnalysis();
  const districtObj = AP_DISTRICTS.find(d => d.id === districtId) || AP_DISTRICTS.find(d => d.id === 'ysr_kadapa') || AP_DISTRICTS[0];
  const center = districtObj.center;

  // Synced camera state
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);
  const [mapZoom, setMapZoom] = useState<number>(10);
  const [isSyncActive, setIsSyncActive] = useState<boolean>(true);

  // Update map center when district changes
  useEffect(() => {
    setMapCenter(districtObj.center);
    setMapZoom(10);
  }, [districtObj]);

  const handleSyncMove = (newCenter: [number, number], newZoom: number) => {
    if (isSyncActive) {
      setMapCenter(newCenter);
      setMapZoom(newZoom);
    }
  };

  // 8 Map Layers state
  const [layers, setLayers] = useState<MapLayersConfig>({
    satellite: true,
    landCover: true,
    ndvi: false,
    ndwi: false,
    ndbi: false,
    changeDetection: false,
    districtBoundary: true,
    selectedArea: false,
  });

  const toggleLayer = (layerKey: keyof MapLayersConfig) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const activeLayerCount = Object.values(layers).filter(Boolean).length;

  // Geometric coordinates calculated around center [lat, lng]
  const [lat, lng] = center;

  // 1. District Boundary Polygon
  const districtBoundaryCoords: [number, number][] = [
    [lat + 0.32, lng - 0.26],
    [lat + 0.40, lng + 0.10],
    [lat + 0.22, lng + 0.36],
    [lat - 0.18, lng + 0.38],
    [lat - 0.36, lng + 0.12],
    [lat - 0.32, lng - 0.28],
    [lat - 0.08, lng - 0.40],
    [lat + 0.32, lng - 0.26],
  ];

  // 2. Selected Area Boundary (AOI Bounding Box)
  const aoiBounds: [[number, number], [number, number]] = [
    [lat - 0.14, lng - 0.16],
    [lat + 0.14, lng + 0.16],
  ];

  // 3. Land Cover Polygons
  // Period A Land Cover
  const lcAgriCoordsA: [number, number][] = [
    [lat + 0.04, lng - 0.14],
    [lat + 0.14, lng - 0.12],
    [lat + 0.16, lng - 0.02],
    [lat + 0.06, lng - 0.04],
    [lat + 0.04, lng - 0.14]
  ];
  const lcWaterCoordsA: [number, number][] = [
    [lat - 0.08, lng + 0.04],
    [lat - 0.02, lng + 0.06],
    [lat - 0.04, lng + 0.14],
    [lat - 0.10, lng + 0.12],
    [lat - 0.08, lng + 0.04]
  ];
  const lcUrbanCoordsA: [number, number][] = [
    [lat + 0.02, lng + 0.01],
    [lat + 0.06, lng + 0.02],
    [lat + 0.05, lng + 0.06],
    [lat + 0.01, lng + 0.04],
    [lat + 0.02, lng + 0.01]
  ];
  const lcBarrenCoordsA: [number, number][] = [
    [lat - 0.15, lng - 0.12],
    [lat - 0.08, lng - 0.10],
    [lat - 0.09, lng - 0.02],
    [lat - 0.17, lng - 0.04],
    [lat - 0.15, lng - 0.12]
  ];

  // Period B Land Cover (Expanded agriculture +6%, Receded water -2.1%, Expanded urban +4%, Reduced barren -7.9%)
  const lcAgriCoordsB: [number, number][] = [
    [lat + 0.03, lng - 0.16],
    [lat + 0.16, lng - 0.14],
    [lat + 0.18, lng - 0.01],
    [lat + 0.05, lng - 0.03],
    [lat + 0.03, lng - 0.16]
  ];
  const lcWaterCoordsB: [number, number][] = [
    [lat - 0.07, lng + 0.05],
    [lat - 0.03, lng + 0.07],
    [lat - 0.05, lng + 0.12],
    [lat - 0.09, lng + 0.10],
    [lat - 0.07, lng + 0.05]
  ];
  const lcUrbanCoordsB: [number, number][] = [
    [lat + 0.01, lng + 0.00],
    [lat + 0.08, lng + 0.01],
    [lat + 0.07, lng + 0.08],
    [lat + 0.00, lng + 0.06],
    [lat + 0.01, lng + 0.00]
  ];
  const lcBarrenCoordsB: [number, number][] = [
    [lat - 0.13, lng - 0.10],
    [lat - 0.09, lng - 0.09],
    [lat - 0.10, lng - 0.04],
    [lat - 0.15, lng - 0.05],
    [lat - 0.13, lng - 0.10]
  ];

  // Comparison metrics demo data
  const comparisonMetrics = [
    { metric: 'Dense Vegetation / Crops', periodA: '62.4%', periodB: '68.4%', change: '+6.0%', isPositive: true },
    { metric: 'Surface Water Bodies', periodA: '18.2%', periodB: '16.1%', change: '-2.1%', isPositive: false },
    { metric: 'Urban Built-Up Area', periodA: '10.1%', periodB: '14.1%', change: '+4.0%', isPositive: true },
    { metric: 'Barren / Fallow Land', periodA: '9.3%', periodB: '1.4%', change: '-7.9%', isPositive: false },
  ];

  // Render map layers overlay function
  const renderMapLayers = (isPeriodB: boolean) => {
    return (
      <>
        {/* Layer 1: Satellite Base Tile Layer */}
        {layers.satellite && (
          <TileLayer
            attribution='&copy; Esri World Imagery'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={17}
          />
        )}

        {/* Layer 7: District Boundary */}
        {layers.districtBoundary && (
          <Polygon
            positions={districtBoundaryCoords}
            pathOptions={{
              color: '#0284c7',
              weight: 2.5,
              dashArray: '6, 6',
              fillColor: '#38bdf8',
              fillOpacity: 0.06,
            }}
          >
            <Tooltip sticky>
              <div className="font-sans text-xs">
                <strong className="text-sky-800">{districtObj.name} District Perimeter</strong><br/>
                Total Area: {districtObj.areaSqKm.toLocaleString()} km²<br/>
                <span className="text-amber-700 font-bold text-[10px]">DEMO DATA BOUNDARY</span>
              </div>
            </Tooltip>
          </Polygon>
        )}

        {/* Layer 8: Selected Area Boundary (AOI) */}
        {layers.selectedArea && (
          <Rectangle
            bounds={aoiBounds}
            pathOptions={{
              color: '#06b6d4',
              weight: 2,
              dashArray: '5, 5',
              fillColor: '#22d3ee',
              fillOpacity: 0.12,
            }}
          >
            <Tooltip sticky>
              <div className="font-sans text-xs">
                <strong className="text-cyan-900">Selected AOI Analysis Sector</strong><br/>
                Center: [{lat.toFixed(3)}, {lng.toFixed(3)}]<br/>
                <span className="text-amber-700 font-bold text-[10px]">DEMO DATA</span>
              </div>
            </Tooltip>
          </Rectangle>
        )}

        {/* Layer 2: Land Cover Classification */}
        {layers.landCover && (
          <>
            {/* Agriculture */}
            <Polygon
              positions={isPeriodB ? lcAgriCoordsB : lcAgriCoordsA}
              pathOptions={{
                color: '#15803d',
                weight: 1.5,
                fillColor: '#16a34a',
                fillOpacity: 0.52,
              }}
            >
              <Popup>
                <div className="font-sans text-xs p-1">
                  <strong className="text-emerald-800">{isPeriodB ? `Period B (${yearB})` : `Period A (${yearA})`} Agricultural Canopy</strong><br/>
                  Coverage: {isPeriodB ? '68.4% (+6.0%)' : '62.4%'}<br/>
                  Class: Dense Vegetation / Crops<br/>
                  <span className="text-amber-700 font-bold text-[10px]">DEMO DATA</span>
                </div>
              </Popup>
            </Polygon>

            {/* Surface Water */}
            <Polygon
              positions={isPeriodB ? lcWaterCoordsB : lcWaterCoordsA}
              pathOptions={{
                color: '#0369a1',
                weight: 1.5,
                fillColor: '#0284c7',
                fillOpacity: 0.58,
              }}
            >
              <Popup>
                <div className="font-sans text-xs p-1">
                  <strong className="text-sky-800">{isPeriodB ? `Period B (${yearB})` : `Period A (${yearA})`} Surface Water Reservoir</strong><br/>
                  Coverage: {isPeriodB ? '16.1% (-2.1%)' : '18.2%'}<br/>
                  Class: Surface Water Bodies<br/>
                  <span className="text-amber-700 font-bold text-[10px]">DEMO DATA</span>
                </div>
              </Popup>
            </Polygon>

            {/* Urban Built-Up */}
            <Polygon
              positions={isPeriodB ? lcUrbanCoordsB : lcUrbanCoordsA}
              pathOptions={{
                color: '#7e22ce',
                weight: 1.5,
                fillColor: '#9333ea',
                fillOpacity: 0.52,
              }}
            >
              <Popup>
                <div className="font-sans text-xs p-1">
                  <strong className="text-purple-800">{isPeriodB ? `Period B (${yearB})` : `Period A (${yearA})`} Urban Built-Up Area</strong><br/>
                  Coverage: {isPeriodB ? '14.1% (+4.0%)' : '10.1%'}<br/>
                  Class: Settlement & Transport<br/>
                  <span className="text-amber-700 font-bold text-[10px]">DEMO DATA</span>
                </div>
              </Popup>
            </Polygon>

            {/* Barren / Fallow */}
            <Polygon
              positions={isPeriodB ? lcBarrenCoordsB : lcBarrenCoordsA}
              pathOptions={{
                color: '#b45309',
                weight: 1.5,
                fillColor: '#d97706',
                fillOpacity: isPeriodB ? 0.35 : 0.48,
              }}
            >
              <Popup>
                <div className="font-sans text-xs p-1">
                  <strong className="text-amber-800">{isPeriodB ? `Period B (${yearB})` : `Period A (${yearA})`} Barren & Fallow Tract</strong><br/>
                  Coverage: {isPeriodB ? '1.4% (-7.9%)' : '9.3%'}<br/>
                  Class: Uncultivated Land<br/>
                  <span className="text-amber-700 font-bold text-[10px]">DEMO DATA</span>
                </div>
              </Popup>
            </Polygon>
          </>
        )}

        {/* Layer 3: NDVI — Vegetation Intensity Visualization */}
        {layers.ndvi && (
          <>
            <CircleMarker
              center={[lat + 0.08, lng - 0.08]}
              radius={24}
              pathOptions={{
                fillColor: '#15803d',
                fillOpacity: 0.65,
                color: '#ffffff',
                weight: 2
              }}
            >
              <Popup>
                <div className="font-sans text-xs p-1">
                  <strong className="text-emerald-800">High Density Canopy</strong><br/>
                  NDVI Index: {isPeriodB ? '0.74 (+0.08)' : '0.66'}<br/>
                  Band ratio: (NIR - Red) / (NIR + Red)<br/>
                  <span className="text-amber-700 font-bold text-[10px]">DEMO DATA</span>
                </div>
              </Popup>
            </CircleMarker>
            <CircleMarker
              center={[lat + 0.02, lng - 0.14]}
              radius={20}
              pathOptions={{
                fillColor: '#22c55e',
                fillOpacity: 0.55,
                color: '#ffffff',
                weight: 1.5
              }}
            >
              <Popup>
                <div className="font-sans text-xs p-1">
                  <strong className="text-emerald-700">Moderate Agricultural Crop</strong><br/>
                  NDVI Index: {isPeriodB ? '0.58' : '0.51'}<br/>
                  <span className="text-amber-700 font-bold text-[10px]">DEMO DATA</span>
                </div>
              </Popup>
            </CircleMarker>
          </>
        )}

        {/* Layer 4: NDWI — Surface Water Intensity Visualization */}
        {layers.ndwi && (
          <CircleMarker
            center={[lat - 0.06, lng + 0.08]}
            radius={22}
            pathOptions={{
              fillColor: '#0284c7',
              fillOpacity: 0.70,
              color: '#ffffff',
              weight: 2
            }}
          >
            <Popup>
              <div className="font-sans text-xs p-1">
                <strong className="text-sky-800">Surface Water Absorption Index (NDWI)</strong><br/>
                NDWI Index: {isPeriodB ? '+0.41 (Storage Receded)' : '+0.52 (High Pool)'}<br/>
                Band ratio: (Green - NIR) / (Green + NIR)<br/>
                <span className="text-amber-700 font-bold text-[10px]">DEMO DATA</span>
              </div>
            </Popup>
          </CircleMarker>
        )}

        {/* Layer 5: NDBI — Built-up Area Visualization */}
        {layers.ndbi && (
          <CircleMarker
            center={[lat + 0.04, lng + 0.03]}
            radius={18}
            pathOptions={{
              fillColor: '#be123c',
              fillOpacity: 0.70,
              color: '#ffffff',
              weight: 2
            }}
          >
            <Popup>
              <div className="font-sans text-xs p-1">
                <strong className="text-rose-800">Normalized Difference Built-up Index (NDBI)</strong><br/>
                NDBI Index: {isPeriodB ? '+0.39 (Urban Expansion)' : '+0.28'}<br/>
                Band ratio: (SWIR - NIR) / (SWIR + NIR)<br/>
                <span className="text-amber-700 font-bold text-[10px]">DEMO DATA</span>
              </div>
            </Popup>
          </CircleMarker>
        )}

        {/* Layer 6: Change Detection Temporal Vector Overlay */}
        {layers.changeDetection && (
          <>
            <CircleMarker
              center={[lat + 0.07, lng - 0.06]}
              radius={20}
              pathOptions={{
                fillColor: '#10b981',
                fillOpacity: 0.75,
                color: '#059669',
                weight: 2.5,
                dashArray: isPeriodB ? '3, 3' : undefined
              }}
            >
              <Popup>
                <div className="font-sans text-xs p-1">
                  <strong className="text-emerald-800">Vegetation Increase Zone (+6.0%)</strong><br/>
                  Shift: Fallow to irrigated double-crop agricultural land<br/>
                  Time Vector: {yearA} &rarr; {yearB}<br/>
                  <span className="text-amber-700 font-bold text-[10px]">DEMO DATA CHANGE</span>
                </div>
              </Popup>
            </CircleMarker>

            <CircleMarker
              center={[lat - 0.06, lng + 0.06]}
              radius={17}
              pathOptions={{
                fillColor: '#f59e0b',
                fillOpacity: 0.75,
                color: '#d97706',
                weight: 2.5,
                dashArray: '3, 3'
              }}
            >
              <Popup>
                <div className="font-sans text-xs p-1">
                  <strong className="text-amber-800">Water Body Recession (-2.1%)</strong><br/>
                  Shift: Seasonal shoreline retreat in storage basin<br/>
                  Time Vector: {yearA} &rarr; {yearB}<br/>
                  <span className="text-amber-700 font-bold text-[10px]">DEMO DATA CHANGE</span>
                </div>
              </Popup>
            </CircleMarker>

            <CircleMarker
              center={[lat + 0.05, lng + 0.04]}
              radius={18}
              pathOptions={{
                fillColor: '#e11d48',
                fillOpacity: 0.75,
                color: '#be123c',
                weight: 2.5,
                dashArray: isPeriodB ? '3, 3' : undefined
              }}
            >
              <Popup>
                <div className="font-sans text-xs p-1">
                  <strong className="text-rose-800">Urban Expansion (+4.0%)</strong><br/>
                  Shift: Impervious surface and peri-urban corridor development<br/>
                  Time Vector: {yearA} &rarr; {yearB}<br/>
                  <span className="text-amber-700 font-bold text-[10px]">DEMO DATA CHANGE</span>
                </div>
              </Popup>
            </CircleMarker>
          </>
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      {/* FLOATING LIQUID GLASS MAP LAYER CONTROL BAR */}
      <div className="liquid-glass p-4 rounded-3xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center">
              <Layers className="w-4 h-4 text-sky-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#172033] tracking-wide font-sans uppercase">Map Layers Control</span>
                <span className="liquid-glass-pill px-2.5 py-0.5 text-[10px] font-bold text-sky-800 border border-sky-400/30">
                  {activeLayerCount} / 8 Active
                </span>
                <DemoDataBadge text="DEMO DATA" />
              </div>
              <p className="text-[11px] text-[#46566E]">
                Toggle analytical overlays simultaneously across Period A ({yearA}) and Period B ({yearB})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSyncActive(!isSyncActive)}
              className={`liquid-glass-pill px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isSyncActive 
                  ? 'bg-sky-500/15 text-sky-900 border-sky-400/40' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-sky-600" />
              <span>{isSyncActive ? 'Camera Sync: ON' : 'Camera Sync: OFF'}</span>
            </button>

            <button
              onClick={() => setLayers({
                satellite: true,
                landCover: true,
                ndvi: false,
                ndwi: false,
                ndbi: false,
                changeDetection: false,
                districtBoundary: true,
                selectedArea: false,
              })}
              className="liquid-glass-pill px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
            >
              Reset Layers
            </button>
          </div>
        </div>

        {/* 8 LAYER CHECKBOXES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-1">
          {/* 1. Satellite Imagery */}
          <button
            onClick={() => toggleLayer('satellite')}
            className={`flex items-center gap-2 p-2 rounded-2xl border text-xs font-sans font-medium transition-all ${
              layers.satellite
                ? 'bg-sky-500/15 border-sky-400/50 text-sky-950 font-bold shadow-xs'
                : 'bg-white/20 border-white/60 text-[#46566E] hover:bg-white/40'
            }`}
          >
            {layers.satellite ? <CheckSquare className="w-4 h-4 text-sky-600 shrink-0" /> : <Square className="w-4 h-4 text-slate-400 shrink-0" />}
            <span className="truncate">Satellite Base</span>
          </button>

          {/* 2. Land Cover Classification */}
          <button
            onClick={() => toggleLayer('landCover')}
            className={`flex items-center gap-2 p-2 rounded-2xl border text-xs font-sans font-medium transition-all ${
              layers.landCover
                ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-950 font-bold shadow-xs'
                : 'bg-white/20 border-white/60 text-[#46566E] hover:bg-white/40'
            }`}
          >
            {layers.landCover ? <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" /> : <Square className="w-4 h-4 text-slate-400 shrink-0" />}
            <span className="truncate">Land Cover</span>
          </button>

          {/* 3. NDVI — Vegetation */}
          <button
            onClick={() => toggleLayer('ndvi')}
            className={`flex items-center gap-2 p-2 rounded-2xl border text-xs font-sans font-medium transition-all ${
              layers.ndvi
                ? 'bg-green-500/15 border-green-400/50 text-green-950 font-bold shadow-xs'
                : 'bg-white/20 border-white/60 text-[#46566E] hover:bg-white/40'
            }`}
          >
            {layers.ndvi ? <CheckSquare className="w-4 h-4 text-green-600 shrink-0" /> : <Square className="w-4 h-4 text-slate-400 shrink-0" />}
            <span className="truncate">NDVI Vegetation</span>
          </button>

          {/* 4. NDWI — Surface Water */}
          <button
            onClick={() => toggleLayer('ndwi')}
            className={`flex items-center gap-2 p-2 rounded-2xl border text-xs font-sans font-medium transition-all ${
              layers.ndwi
                ? 'bg-cyan-500/15 border-cyan-400/50 text-cyan-950 font-bold shadow-xs'
                : 'bg-white/20 border-white/60 text-[#46566E] hover:bg-white/40'
            }`}
          >
            {layers.ndwi ? <CheckSquare className="w-4 h-4 text-cyan-600 shrink-0" /> : <Square className="w-4 h-4 text-slate-400 shrink-0" />}
            <span className="truncate">NDWI Water</span>
          </button>

          {/* 5. NDBI — Built-up Area */}
          <button
            onClick={() => toggleLayer('ndbi')}
            className={`flex items-center gap-2 p-2 rounded-2xl border text-xs font-sans font-medium transition-all ${
              layers.ndbi
                ? 'bg-rose-500/15 border-rose-400/50 text-rose-950 font-bold shadow-xs'
                : 'bg-white/20 border-white/60 text-[#46566E] hover:bg-white/40'
            }`}
          >
            {layers.ndbi ? <CheckSquare className="w-4 h-4 text-rose-600 shrink-0" /> : <Square className="w-4 h-4 text-slate-400 shrink-0" />}
            <span className="truncate">NDBI Built-up</span>
          </button>

          {/* 6. Change Detection */}
          <button
            onClick={() => toggleLayer('changeDetection')}
            className={`flex items-center gap-2 p-2 rounded-2xl border text-xs font-sans font-medium transition-all ${
              layers.changeDetection
                ? 'bg-purple-500/15 border-purple-400/50 text-purple-950 font-bold shadow-xs'
                : 'bg-white/20 border-white/60 text-[#46566E] hover:bg-white/40'
            }`}
          >
            {layers.changeDetection ? <CheckSquare className="w-4 h-4 text-purple-600 shrink-0" /> : <Square className="w-4 h-4 text-slate-400 shrink-0" />}
            <span className="truncate">Change Vector</span>
          </button>

          {/* 7. District Boundary */}
          <button
            onClick={() => toggleLayer('districtBoundary')}
            className={`flex items-center gap-2 p-2 rounded-2xl border text-xs font-sans font-medium transition-all ${
              layers.districtBoundary
                ? 'bg-sky-500/15 border-sky-400/50 text-sky-950 font-bold shadow-xs'
                : 'bg-white/20 border-white/60 text-[#46566E] hover:bg-white/40'
            }`}
          >
            {layers.districtBoundary ? <CheckSquare className="w-4 h-4 text-sky-600 shrink-0" /> : <Square className="w-4 h-4 text-slate-400 shrink-0" />}
            <span className="truncate">District Boundary</span>
          </button>

          {/* 8. Selected Area Boundary */}
          <button
            onClick={() => toggleLayer('selectedArea')}
            className={`flex items-center gap-2 p-2 rounded-2xl border text-xs font-sans font-medium transition-all ${
              layers.selectedArea
                ? 'bg-indigo-500/15 border-indigo-400/50 text-indigo-950 font-bold shadow-xs'
                : 'bg-white/20 border-white/60 text-[#46566E] hover:bg-white/40'
            }`}
          >
            {layers.selectedArea ? <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0" /> : <Square className="w-4 h-4 text-slate-400 shrink-0" />}
            <span className="truncate">Selected AOI</span>
          </button>
        </div>
      </div>

      {/* DUAL COMPARISON SATELLITE MAP CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 h-[530px]">
        {/* LEFT MAP CANVAS — PERIOD A (SATELLITE BASELINE) */}
        <div className="relative rounded-3xl overflow-hidden border border-white/70 shadow-md h-full bg-slate-200/40">
          {/* Top-Left: Floating Glass Period Indicator */}
          <div className="absolute top-3 left-3 z-10 liquid-glass-pill px-3.5 py-1.5 text-xs font-bold text-sky-950 flex items-center gap-2 border border-white/80 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-sky-700" />
            <span>PERIOD A: <strong>{yearA} BASELINE</strong></span>
          </div>

          {/* Top-Right: Floating Glass Demo Badge */}
          <div className="absolute top-3 right-3 z-10">
            <span className="liquid-glass-pill px-3 py-1 text-[11px] font-bold text-amber-900 border border-amber-400/40 bg-amber-50/70 shadow-xs">
              DEMO MAP A
            </span>
          </div>

          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <MapSynchronizer 
              center={mapCenter} 
              zoom={mapZoom} 
              onSyncMove={handleSyncMove} 
            />
            {renderMapLayers(false)}
          </MapContainer>

          {/* Bottom-Left: Floating Glass Extents Info */}
          <div className="absolute bottom-3 left-3 z-10 liquid-glass-pill px-3.5 py-1.5 text-[11px] text-[#172033] font-semibold border border-white/80 shadow-xs">
            Extents: {districtObj.name} ({districtObj.areaSqKm.toLocaleString()} km²)
          </div>

          {/* Bottom-Right: Floating Glass Satellite Sensor Spec */}
          <div className="absolute bottom-3 right-3 z-10 liquid-glass-pill px-3 py-1 text-[10px] text-[#46566E] font-medium border border-white/80 shadow-xs hidden sm:block">
            Esri World Imagery • 0.5m GSD • DEMO DATA
          </div>
        </div>

        {/* RIGHT MAP CANVAS — PERIOD B (SATELLITE EVALUATION) */}
        <div className="relative rounded-3xl overflow-hidden border border-white/70 shadow-md h-full bg-slate-200/40">
          {/* Top-Left: Floating Glass Period Indicator */}
          <div className="absolute top-3 left-3 z-10 liquid-glass-pill px-3.5 py-1.5 text-xs font-bold text-purple-950 flex items-center gap-2 border border-white/80 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-purple-700" />
            <span>PERIOD B: <strong>{yearB} EVALUATION</strong></span>
          </div>

          {/* Top-Right: Floating Glass Demo Badge */}
          <div className="absolute top-3 right-3 z-10">
            <span className="liquid-glass-pill px-3 py-1 text-[11px] font-bold text-amber-900 border border-amber-400/40 bg-amber-50/70 shadow-xs">
              DEMO MAP B
            </span>
          </div>

          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <MapSynchronizer 
              center={mapCenter} 
              zoom={mapZoom} 
              onSyncMove={handleSyncMove} 
            />
            {renderMapLayers(true)}
          </MapContainer>

          {/* Bottom-Left: Floating Glass Extents Info */}
          <div className="absolute bottom-3 left-3 z-10 liquid-glass-pill px-3.5 py-1.5 text-[11px] text-[#172033] font-semibold border border-white/80 shadow-xs">
            Extents: {districtObj.name} ({districtObj.areaSqKm.toLocaleString()} km²)
          </div>

          {/* Bottom-Right: Floating Glass Satellite Sensor Spec */}
          <div className="absolute bottom-3 right-3 z-10 liquid-glass-pill px-3 py-1 text-[10px] text-[#46566E] font-medium border border-white/80 shadow-xs hidden sm:block">
            Esri World Imagery • 0.5m GSD • DEMO DATA
          </div>
        </div>
      </div>

      {/* FLOATING GLASS MAP LEGEND (PART 22) */}
      <div className="liquid-glass p-4 rounded-3xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#172033] uppercase tracking-wider font-sans">
              Map Analytical Legend
            </span>
            <span className="text-[10px] text-[#46566E] font-medium">• All overlays reflect simulated Phase 1 data</span>
          </div>
          <DemoDataBadge text="DEMO DATA" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Land Cover Classification Legend */}
          <div className="space-y-1.5 bg-white/20 p-3 rounded-2xl border border-white/50">
            <span className="text-[11px] font-bold text-[#172033] block mb-1">LAND COVER CLASSIFICATION</span>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-emerald-600 border border-white/80 shadow-xs shrink-0"></span>
                <span className="text-[#34445B] font-medium">Vegetation / Agriculture</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-sky-600 border border-white/80 shadow-xs shrink-0"></span>
                <span className="text-[#34445B] font-medium">Water Bodies / Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-md bg-purple-600 border border-white/80 shadow-xs shrink-0"></div>
                <span className="text-[#34445B] font-medium">Urban Built-up Core</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-md bg-amber-600 border border-white/80 shadow-xs shrink-0"></div>
                <span className="text-[#34445B] font-medium">Barren / Fallow Tracts</span>
              </div>
            </div>
          </div>

          {/* Change Detection Legend */}
          <div className="space-y-1.5 bg-white/20 p-3 rounded-2xl border border-white/50">
            <span className="text-[11px] font-bold text-[#172033] block mb-1">CHANGE DETECTION & SHIFT VECTORS</span>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white/80 shadow-xs shrink-0"></span>
                <span className="text-[#34445B] font-medium">Vegetation Increase (+6.0%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-white/80 shadow-xs shrink-0"></span>
                <span className="text-[#34445B] font-medium">Water Body Recession (-2.1%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-white/80 shadow-xs shrink-0"></span>
                <span className="text-[#34445B] font-medium">Urban Expansion (+4.0%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-slate-400 border border-white/80 shadow-xs shrink-0"></span>
                <span className="text-[#34445B] font-medium">Stable Environmental Cover</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COMPARISON METRICS SUMMARY CARDS (PART 20) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="liquid-glass p-4 rounded-3xl space-y-1">
          <span className="text-[11px] text-[#46566E] font-semibold block uppercase tracking-wider">VEGETATION CHANGE</span>
          <span className="text-2xl font-extrabold text-emerald-800 font-mono flex items-center gap-1">
            +6.0% <ArrowUpRight className="w-5 h-5 text-emerald-700" />
          </span>
          <span className="text-[10px] text-emerald-900 font-bold block font-sans">DEMO DATA</span>
        </div>

        <div className="liquid-glass p-4 rounded-3xl space-y-1">
          <span className="text-[11px] text-[#46566E] font-semibold block uppercase tracking-wider">SURFACE WATER CHANGE</span>
          <span className="text-2xl font-extrabold text-amber-800 font-mono flex items-center gap-1">
            -2.1% <ArrowDownRight className="w-5 h-5 text-amber-700" />
          </span>
          <span className="text-[10px] text-amber-900 font-bold block font-sans">DEMO DATA</span>
        </div>

        <div className="liquid-glass p-4 rounded-3xl space-y-1">
          <span className="text-[11px] text-[#46566E] font-semibold block uppercase tracking-wider">BUILT-UP GROWTH</span>
          <span className="text-2xl font-extrabold text-rose-800 font-mono flex items-center gap-1">
            +4.0% <ArrowUpRight className="w-5 h-5 text-rose-700" />
          </span>
          <span className="text-[10px] text-rose-900 font-bold block font-sans">DEMO DATA</span>
        </div>

        <div className="liquid-glass p-4 rounded-3xl space-y-1">
          <span className="text-[11px] text-[#46566E] font-semibold block uppercase tracking-wider">BARREN / FALLOW LAND</span>
          <span className="text-2xl font-extrabold text-sky-800 font-mono flex items-center gap-1">
            -7.9% <ArrowDownRight className="w-5 h-5 text-sky-700" />
          </span>
          <span className="text-[10px] text-sky-900 font-bold block font-sans">DEMO DATA</span>
        </div>
      </div>

      {/* COMPARISON METRICS TABLE (PART 21) */}
      <div className="liquid-glass p-5 rounded-3xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
          <div>
            <h3 className="font-bold text-base text-[#172033] font-sans flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-700" />
              <span>Land Cover Temporal Transition Matrix ({yearA} &rarr; {yearB})</span>
            </h3>
            <p className="text-xs text-[#46566E]">
              District Analysis: <strong className="text-sky-900">{districtObj.name}</strong> • Total Area: <strong className="font-mono text-[#172033]">{districtObj.areaSqKm.toLocaleString()} km²</strong>
            </p>
          </div>
          <DemoDataBadge text="DEMO DATA" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-white/60 rounded-2xl overflow-hidden shadow-xs">
            <thead className="bg-[rgba(225,235,247,0.7)] text-[#172033] font-bold font-sans">
              <tr>
                <th className="p-3.5 border-b border-slate-300/60">Land Cover Class</th>
                <th className="p-3.5 border-b border-slate-300/60">Period A ({yearA})</th>
                <th className="p-3.5 border-b border-slate-300/60">Period B ({yearB})</th>
                <th className="p-3.5 border-b border-slate-300/60">Net Shift Change</th>
                <th className="p-3.5 border-b border-slate-300/60">Data Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 bg-white/20 backdrop-blur-md text-[#26364C]">
              {comparisonMetrics.map((row, idx) => (
                <tr key={idx} className="hover:bg-[rgba(60,170,240,0.12)] transition-colors">
                  <td className="p-3.5 font-bold text-[#172033]">{row.metric}</td>
                  <td className="p-3.5 text-[#34445B] font-mono font-semibold">{row.periodA}</td>
                  <td className="p-3.5 text-[#34445B] font-mono font-semibold">{row.periodB}</td>
                  <td className={`p-3.5 font-extrabold font-mono ${row.isPositive ? 'text-emerald-800' : 'text-amber-800'}`}>
                    {row.change}
                  </td>
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

        <div className="flex items-center gap-2 pt-1 text-[11px] text-[#46566E] italic">
          <Info className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          <span>Note: Comparative analytical layers and metrics displayed above represent simulated synthetic demo data for Phase 1 UI validation.</span>
        </div>
      </div>
    </div>
  );
};
