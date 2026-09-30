import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { AP_DISTRICTS } from '../../data/apDistrictsGeoJSON';
import { useAnalysis } from '../../context/AnalysisContext';
import { Layers } from 'lucide-react';
import { DemoDataBadge } from '../glass/GlassBadge';

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, 9);
  }, [center, map]);
  return null;
}

export const ResultsMapView: React.FC = () => {
  const { districtId } = useAnalysis();
  const [activeOverlay, setActiveOverlay] = useState<'classification' | 'change' | 'ndvi'>('classification');

  const districtObj = AP_DISTRICTS.find(d => d.id === districtId) || AP_DISTRICTS[0];
  const center = districtObj.center;

  const samplePoints = React.useMemo(() => {
    const points = [];
    const [lat, lng] = center;
    for (let i = 0; i < 35; i++) {
      const pLat = lat + (Math.sin(i * 1.5) * 0.12);
      const pLng = lng + (Math.cos(i * 1.5) * 0.15);
      
      let cls = 'Agriculture';
      let color = '#16a34a';
      let changeLevel = 'Stable Vegetation';

      if (i % 4 === 0) {
        cls = 'Surface Water Body';
        color = '#0284c7';
        changeLevel = 'Water Change (-2.1%)';
      } else if (i % 5 === 0) {
        cls = 'Urban Built-Up';
        color = '#e11d48';
        changeLevel = 'Urban Expansion (+5.7%)';
      } else if (i % 7 === 0) {
        cls = 'Barren / Fallow';
        color = '#d97706';
        changeLevel = 'Stable Barren';
      }

      points.push({
        id: i,
        lat: pLat,
        lng: pLng,
        class: cls,
        color: color,
        changeLevel,
        ndviVal: Number((0.3 + (i % 6) * 0.1).toFixed(2)),
      });
    }
    return points;
  }, [center]);

  return (
    <div className="relative w-full h-[500px] lg:h-[600px] rounded-3xl overflow-hidden border border-white/70 shadow-md flex flex-col bg-slate-200/40">
      <div className="bg-[rgba(235,243,250,0.65)] backdrop-blur-xl px-4 py-3 border-b border-white/60 flex flex-wrap items-center justify-between gap-2 z-10 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-sans text-[#172033]">
          <Layers className="w-4 h-4 text-sky-700" />
          <span>Thematic Results Canvas: <strong className="text-sky-900">{districtObj.name}</strong></span>
          <DemoDataBadge text="DEMO DATA" />
        </div>

        <div className="flex items-center gap-1.5 font-sans text-xs">
          <button
            onClick={() => setActiveOverlay('classification')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeOverlay === 'classification'
                ? 'bg-sky-500/20 text-sky-950 border border-sky-400/50 shadow-xs font-bold'
                : 'text-[#46566E] hover:text-[#172033] bg-white/30'
            }`}
          >
            Classification Map
          </button>
          <button
            onClick={() => setActiveOverlay('change')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeOverlay === 'change'
                ? 'bg-purple-500/20 text-purple-950 border border-purple-400/50 shadow-xs font-bold'
                : 'text-[#46566E] hover:text-[#172033] bg-white/30'
            }`}
          >
            Change Detection Overlay
          </button>
          <button
            onClick={() => setActiveOverlay('ndvi')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeOverlay === 'ndvi'
                ? 'bg-emerald-500/20 text-emerald-950 border border-emerald-400/50 shadow-xs font-bold'
                : 'text-[#46566E] hover:text-[#172033] bg-white/30'
            }`}
          >
            NDVI Canopy Density
          </button>
        </div>
      </div>

      <div className="relative flex-1">
        <MapContainer center={center} zoom={9} style={{ height: '100%', width: '100%' }}>
          <RecenterMap center={center} />
          <TileLayer
            attribution='&copy; Esri World Imagery'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />

          {samplePoints.map((pt) => {
            const markerColor = activeOverlay === 'change' 
              ? (pt.changeLevel.includes('Expansion') ? '#e11d48' : pt.changeLevel.includes('Change') ? '#d97706' : '#2563eb')
              : activeOverlay === 'ndvi'
              ? (pt.ndviVal > 0.5 ? '#16a34a' : pt.ndviVal > 0.3 ? '#65a30d' : '#d97706')
              : pt.color;

            return (
              <CircleMarker
                key={pt.id}
                center={[pt.lat, pt.lng]}
                radius={12}
                pathOptions={{
                  fillColor: markerColor,
                  fillOpacity: 0.75,
                  color: '#ffffff',
                  weight: 1.5
                }}
              >
                <Popup>
                  <div className="font-sans text-xs p-1">
                    <strong className="text-sky-800">{pt.class} (DEMO DATA)</strong><br />
                    Change Category: {pt.changeLevel}<br />
                    NDVI Score: {pt.ndviVal}<br />
                    QML Classified: <span className="text-emerald-800 font-bold">VQC Demo Result</span>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        <div className="absolute bottom-4 left-4 z-10 liquid-glass-control p-3.5 rounded-2xl border border-white/70 text-xs font-sans space-y-1.5 shadow-md">
          <div className="text-[10px] uppercase text-[#172033] font-bold tracking-wider mb-1">
            {activeOverlay === 'classification' ? 'Land Cover Legend (DEMO DATA)' : activeOverlay === 'change' ? 'Change Matrix (DEMO DATA)' : 'NDVI Density Scale (DEMO DATA)'}
          </div>
          {activeOverlay === 'classification' && (
            <>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-600"></span><span className="text-[#34445B] font-semibold">Agriculture / Crops</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-sky-600"></span><span className="text-[#34445B] font-semibold">Surface Water Bodies</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-rose-600"></span><span className="text-[#34445B] font-semibold">Urban Built-Up Area</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-600"></span><span className="text-[#34445B] font-semibold">Barren / Fallow Land</span></div>
            </>
          )}
          {activeOverlay === 'change' && (
            <>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-rose-600"></span><span className="text-[#34445B] font-semibold">Urban Expansion</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-600"></span><span className="text-[#34445B] font-semibold">Water Change</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-600"></span><span className="text-[#34445B] font-semibold">Stable Environmental Cover</span></div>
            </>
          )}
          {activeOverlay === 'ndvi' && (
            <>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-600"></span><span className="text-[#34445B] font-semibold">High Canopy (NDVI &gt; 0.5)</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-lime-600"></span><span className="text-[#34445B] font-semibold">Moderate Vegetation (0.3-0.5)</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-600"></span><span className="text-[#34445B] font-semibold">Sparse / Built-up (&lt; 0.3)</span></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
