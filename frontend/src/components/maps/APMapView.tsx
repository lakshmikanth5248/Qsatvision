import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { AP_DISTRICTS, generateAPGeoJSONFeatureCollection } from '../../data/apDistrictsGeoJSON';
import { useAnalysis } from '../../context/AnalysisContext';
import type { DistrictInfo } from '../../types';
import { Search, Layers, Navigation, Calendar, Play } from 'lucide-react';
import { GlassPanel } from '../glass/GlassPanel';
import { GlassInput } from '../glass/GlassInput';
import { GlassDropdown } from '../glass/GlassDropdown';
import { DemoDataBadge } from '../glass/GlassBadge';

interface APMapViewProps {
  onAnalyzeDistrict?: (districtId: string) => void;
}

function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(center, 8, { duration: 1.2 });
  }, [center, map]);
  return null;
}

export const APMapView: React.FC<APMapViewProps> = ({ onAnalyzeDistrict }) => {
  const { districtId, setDistrictId, startYear, endYear } = useAnalysis();
  const [tileLayer, setTileLayer] = useState<'satellite' | 'dark' | 'streets'>('satellite');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictInfo | null>(null);

  const geoJsonData = generateAPGeoJSONFeatureCollection();
  const selectedDistrictObj = AP_DISTRICTS.find(d => d.id === districtId) || AP_DISTRICTS[0];

  const filteredDistricts = AP_DISTRICTS.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDistrictStyle = (feature: any) => {
    const isSelected = feature.properties.id === districtId;
    const isHovered = hoveredDistrict?.id === feature.properties.id;

    return {
      fillColor: isSelected ? '#0284c7' : isHovered ? '#a855f7' : '#334155',
      weight: isSelected ? 3 : isHovered ? 2 : 1,
      opacity: 1,
      color: isSelected ? '#38bdf8' : isHovered ? '#c084fc' : '#64748b',
      dashArray: isSelected ? '' : '3',
      fillOpacity: isSelected ? 0.65 : isHovered ? 0.45 : 0.25,
    };
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    const dId = feature.properties.id;
    const distInfo = AP_DISTRICTS.find(d => d.id === dId);

    layer.on({
      mouseover: () => {
        if (distInfo) setHoveredDistrict(distInfo);
      },
      mouseout: () => {
        setHoveredDistrict(null);
      },
      click: () => {
        setDistrictId(dId);
      }
    });

    if (distInfo) {
      layer.bindTooltip(
        `<div class="font-sans text-xs p-1">
          <strong class="text-sky-300 font-bold">${distInfo.name} (${distInfo.code})</strong><br/>
          Region: ${distInfo.region}<br/>
          Area: ${distInfo.areaSqKm.toLocaleString()} sq km
        </div>`,
        { sticky: true, className: 'leaflet-tooltip-dark' }
      );
    }
  };

  const tiles = {
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    dark: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  };

  return (
    <div className="relative w-full h-[650px] lg:h-[750px] rounded-3xl overflow-hidden border border-slate-200/80 shadow-lg bg-slate-100">
      <MapContainer
        center={selectedDistrictObj.center}
        zoom={7}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <MapRecenter center={selectedDistrictObj.center} />
        
        <TileLayer
          attribution='&copy; Esri & OpenStreetMap'
          url={tiles[tileLayer]}
        />

        <GeoJSON
          key={`geojson-${districtId}-${tileLayer}`}
          data={geoJsonData as any}
          style={getDistrictStyle}
          onEachFeature={onEachFeature}
        />
      </MapContainer>

      <div className="absolute top-4 left-4 z-20 w-80">
        <GlassPanel variant="control" className="p-2">
          <GlassInput
            icon={Search}
            placeholder="Search AP District (e.g., YSR Kadapa, Tirupati)..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            clearable
            onClear={() => setSearchTerm('')}
          />
        </GlassPanel>

        {isSearchOpen && searchTerm && (
          <GlassDropdown className="z-30">
            {filteredDistricts.length > 0 ? (
              filteredDistricts.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    setDistrictId(d.id);
                    setIsSearchOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-sans text-left transition-all ${
                    d.id === districtId
                      ? 'bg-sky-500/15 text-sky-800 font-bold border border-sky-400/30'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{d.name} ({d.code})</span>
                  <span className="text-[10px] text-slate-500">{d.region}</span>
                </button>
              ))
            ) : (
              <div className="p-3 text-center text-xs text-slate-500">
                No district matching "{searchTerm}"
              </div>
            )}
          </GlassDropdown>
        )}
      </div>

      <div className="absolute top-4 right-4 hidden md:flex items-center gap-3 z-20">
        <GlassPanel variant="control" className="px-4 py-2 flex items-center gap-3 text-xs text-slate-700 font-sans">
          <div className="flex items-center gap-1.5 text-sky-700 font-semibold">
            <Navigation className="w-4 h-4" />
            <span>Andhra Pradesh (26 Districts)</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Timeline: {startYear}–{endYear}</span>
          </div>
        </GlassPanel>
      </div>

      <div className="absolute bottom-4 left-4 z-20 w-80 lg:w-96">
        <GlassPanel variant="control" className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-[10px] font-mono text-sky-700 font-bold uppercase tracking-wider block">Selected AP District</span>
              <h3 className="text-xl font-bold text-slate-900">{selectedDistrictObj.name}</h3>
            </div>
            <DemoDataBadge />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-sans">
            <div className="bg-white/80 p-2.5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] text-slate-500 block">Headquarters</span>
              <span className="text-slate-900 font-semibold">{selectedDistrictObj.hq}</span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] text-slate-500 block">Region</span>
              <span className="text-slate-900 font-semibold">{selectedDistrictObj.region}</span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] text-slate-500 block">Total Area</span>
              <span className="text-slate-900 font-semibold">{selectedDistrictObj.areaSqKm.toLocaleString()} km²</span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-[10px] text-slate-500 block">Historical Archive</span>
              <span className="text-emerald-700 font-semibold">2010 – Present</span>
            </div>
          </div>

          {onAnalyzeDistrict && (
            <button
              onClick={() => onAnalyzeDistrict(selectedDistrictObj.id)}
              className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-500/20 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Analyze {selectedDistrictObj.name}
            </button>
          )}
        </GlassPanel>
      </div>

      <div className="absolute top-20 right-4 z-20">
        <GlassPanel variant="control" className="p-2 space-y-1">
          <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1 font-sans">
            <Layers className="w-3 h-3 text-sky-600" /> Map Layer
          </div>
          {(['satellite', 'dark', 'streets'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setTileLayer(mode)}
              className={`w-full px-3 py-1.5 rounded-xl text-xs capitalize text-left transition-all ${
                tileLayer === mode
                  ? 'bg-sky-500/15 text-sky-800 font-bold border border-sky-400/40'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {mode}
            </button>
          ))}
        </GlassPanel>
      </div>

      <div className="absolute bottom-4 right-4 z-20 hidden sm:block">
        <GlassPanel variant="control" className="p-3 text-xs space-y-1.5">
          <div className="text-[10px] uppercase text-slate-500 font-bold mb-1 font-sans">Spatial Legend</div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-sky-500 border border-sky-400"></span>
            <span className="text-slate-800 font-medium">{selectedDistrictObj.name} (Selected)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-purple-500 border border-purple-400"></span>
            <span className="text-slate-800 font-medium">Hovered District</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-slate-300 border border-slate-400"></span>
            <span className="text-slate-600">Other AP Districts</span>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};
