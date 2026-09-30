import React, { useState } from 'react';
import { Atom } from 'lucide-react';

interface QuantumCircuitProps {
  qubits?: number;
  ansatz?: string;
  encoding?: string;
}

export const QuantumCircuit: React.FC<QuantumCircuitProps> = ({
  qubits = 4,
  ansatz = 'RealAmplitudes',
  encoding = 'ZZ Feature Map'
}) => {
  const [selectedQubit, setSelectedQubit] = useState<number>(0);
  const qubitArray = Array.from({ length: qubits }, (_, i) => i);

  return (
    <div className="w-full glass-quantum rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2 pb-3 border-b border-purple-200/80">
        <div>
          <div className="flex items-center gap-2">
            <Atom className="w-5 h-5 text-purple-700" />
            <h3 className="text-base font-extrabold text-slate-900 font-mono">Quantum Circuit Architecture</h3>
          </div>
          <p className="text-xs text-slate-600 font-sans font-medium">
            {encoding} + {ansatz} ({qubits} Qubits)
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 bg-white/70 rounded-xl border border-white/90 text-sky-800 font-bold shadow-sm backdrop-blur-md">
            Feature Space: 4D PCA
          </span>
          <span className="px-3 py-1 bg-white/70 rounded-xl border border-white/90 text-purple-900 font-bold shadow-sm backdrop-blur-md">
            Shots: 1024
          </span>
        </div>
      </div>

      <div className="w-full overflow-x-auto bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/80 shadow-sm mb-4">
        <div className="min-w-[650px] space-y-6">
          {qubitArray.map((qIndex) => (
            <div key={qIndex} className="relative flex items-center h-10 font-mono text-xs">
              <div 
                onClick={() => setSelectedQubit(qIndex)}
                className={`w-16 font-bold cursor-pointer transition-colors ${
                  selectedQubit === qIndex ? 'text-purple-700 font-extrabold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                |q{qIndex}⟩ ──
              </div>

              <div className="absolute left-16 right-0 h-0.5 bg-slate-300 top-1/2 -translate-y-1/2 z-0"></div>

              <div className="relative z-10 flex-1 flex items-center justify-around pl-4 pr-4">
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/60 text-sky-800 font-bold flex items-center justify-center shadow-sm">
                  H
                </div>

                <div className="px-2.5 py-1.5 rounded-xl bg-purple-600/20 border border-purple-500/50 text-purple-900 font-bold text-[11px] shadow-sm">
                  Ry(x[{qIndex}])
                </div>

                {qIndex < qubits - 1 ? (
                  <div className="flex flex-col items-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-sky-500 shadow-sm"></div>
                    <div className="w-0.5 h-6 bg-sky-500"></div>
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-sky-500 flex items-center justify-center bg-white">
                    <div className="w-2 h-0.5 bg-sky-500"></div>
                  </div>
                )}

                <div className="px-2.5 py-1.5 rounded-xl bg-white/80 border border-slate-300 text-slate-800 font-bold text-[11px] shadow-sm">
                  Ry(θ[{qIndex}])
                </div>

                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-800 font-bold flex items-center justify-center shadow-sm">
                  M
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/50 backdrop-blur-md p-3 rounded-2xl border border-white/80 flex items-center justify-between text-xs font-mono text-slate-700 shadow-sm">
        <div>
          Active Wire: <strong className="text-purple-900 font-bold">Qubit |q{selectedQubit}⟩</strong> | Encoded Feature: {['NDVI Spectral Index', 'NDWI Water Index', 'NDBI Urban Index', 'Texture Metric'][selectedQubit] || 'PCA Feature'}
        </div>
        <span className="text-[10px] text-slate-500 font-sans font-medium">Qiskit Terra 1.0 Simulator Gate Representation (DEMO)</span>
      </div>
    </div>
  );
};
