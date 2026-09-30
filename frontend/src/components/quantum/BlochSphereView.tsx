import React, { useState } from 'react';
import { Atom } from 'lucide-react';

export const BlochSphereView: React.FC = () => {
  const [theta, setTheta] = useState<number>(1.047);
  const [phi, setPhi] = useState<number>(0.785);

  const radius = 90;
  const cx = 130;
  const cy = 130;

  const vx = cx + radius * Math.sin(theta) * Math.cos(phi);
  const vy = cy - radius * Math.sin(theta) * Math.sin(phi) * 0.4 - radius * Math.cos(theta) * 0.6;

  const prob0 = Math.pow(Math.cos(theta / 2), 2);
  const prob1 = Math.pow(Math.sin(theta / 2), 2);

  return (
    <div className="w-full glass-quantum rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between mb-2 pb-3 border-b border-purple-200/80">
        <div className="flex items-center gap-2">
          <Atom className="w-5 h-5 text-purple-700" />
          <h3 className="text-base font-extrabold text-slate-900 font-mono">Qubit Bloch Sphere Visualizer</h3>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-xl bg-purple-600/15 text-purple-900 font-bold border border-purple-500/30 shadow-sm backdrop-blur-md">
          State Vector |ψ⟩
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="flex flex-col items-center justify-center bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/80 shadow-sm">
          <svg width="260" height="260" viewBox="0 0 260 260" className="drop-shadow-md">
            <circle cx={cx} cy={cy} r={radius} fill="#1e293b" stroke="#475569" strokeWidth="2" />
            <ellipse cx={cx} cy={cy} rx={radius} ry={radius * 0.35} fill="none" stroke="#64748b" strokeDasharray="4,4" strokeWidth="1.5" />
            <line x1={cx} y1={cy - radius} x2={cx} y2={cy + radius} stroke="#94a3b8" strokeWidth="1.5" />
            <line x1={cx - radius} y1={cy} x2={cx + radius} y2={cy} stroke="#64748b" strokeWidth="1" strokeDasharray="2,2" />

            <text x={cx - 10} y={cy - radius - 10} fill="#0284c7" fontSize="12" fontFamily="monospace" fontWeight="bold">|0⟩ (+Z)</text>
            <text x={cx - 10} y={cy + radius + 20} fill="#7c3aed" fontSize="12" fontFamily="monospace" fontWeight="bold">|1⟩ (-Z)</text>

            <line x1={cx} y1={cy} x2={vx} y2={vy} stroke="#9333ea" strokeWidth="3" />
            <circle cx={vx} cy={vy} r="6" fill="#0284c7" className="animate-ping" />
            <circle cx={vx} cy={vy} r="4" fill="#38bdf8" />
          </svg>

          <div className="mt-2 text-center text-xs font-mono text-slate-700 font-semibold">
            State Vector: |ψ⟩ = {(Math.cos(theta/2)).toFixed(2)}|0⟩ + {(Math.sin(theta/2)).toFixed(2)}e^(i{(phi/Math.PI).toFixed(2)}π)|1⟩
          </div>
        </div>

        <div className="space-y-4 text-xs font-mono">
          <div>
            <div className="flex justify-between text-slate-800 font-bold mb-1">
              <span>Polar Angle (θ): {(theta * 180 / Math.PI).toFixed(0)}°</span>
              <span className="text-sky-700 font-extrabold">P(|0⟩): {(prob0 * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={Math.PI}
              step={0.05}
              value={theta}
              onChange={(e) => setTheta(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-800 font-bold mb-1">
              <span>Azimuthal Phase (φ): {(phi * 180 / Math.PI).toFixed(0)}°</span>
              <span className="text-purple-700 font-extrabold">P(|1⟩): {(prob1 * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={2 * Math.PI}
              step={0.05}
              value={phi}
              onChange={(e) => setPhi(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
          </div>

          <div className="bg-white/60 backdrop-blur-md p-3.5 rounded-2xl border border-white/80 space-y-1.5 text-slate-800 shadow-sm">
            <div className="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Quantum Measurement Probability</div>
            <div className="flex justify-between font-semibold">
              <span>Ground State |0⟩:</span>
              <span className="text-emerald-700 font-extrabold font-mono">{(prob0).toFixed(3)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Excited State |1⟩:</span>
              <span className="text-purple-800 font-extrabold font-mono">{(prob1).toFixed(3)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
