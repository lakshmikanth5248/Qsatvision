import React, { useState } from 'react';
import { Cpu, Copy, Check, Info } from 'lucide-react';

interface QuantumCircuitViewerProps {
  circuitDiagram?: string | string[];
  qubits?: number;
  circuitDepth?: number;
  gateCount?: number;
  trainableParameters?: number;
  encodingMethod?: string;
  ansatz?: string;
  backend?: string;
  isDemo?: boolean;
}

export const QuantumCircuitViewer: React.FC<QuantumCircuitViewerProps> = ({
  circuitDiagram,
  qubits = 4,
  circuitDepth = 2,
  gateCount,
  trainableParameters,
  encodingMethod = 'ZZ Feature Map',
  ansatz = 'RealAmplitudes',
  backend = 'Qiskit Statevector Simulator',
  isDemo = false
}) => {
  const [copied, setCopied] = useState(false);

  // Normalize circuit diagram text
  const rawText = Array.isArray(circuitDiagram) 
    ? circuitDiagram.join('\n') 
    : (circuitDiagram || '');

  const hasCircuit = rawText.trim().length > 0;

  const handleCopy = () => {
    if (!hasCircuit) return;
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card p-5 border border-white/40 shadow-sm relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-slate-800 text-sm">Quantum Circuit Architecture</h4>
              {isDemo ? (
                <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20">
                  CONFIGURATION ONLY
                </span>
              ) : (
                <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                  QISKIT COMPILED
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">{encodingMethod} + {ansatz}</p>
          </div>
        </div>

        {hasCircuit && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white/70 hover:bg-white border border-slate-200 transition-all shadow-xs"
            title="Copy ASCII circuit to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            {copied ? 'Copied' : 'Copy Circuit'}
          </button>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <div className="p-2.5 rounded-xl bg-slate-50/60 border border-slate-200/60">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Qubits</span>
          <span className="text-base font-semibold text-slate-800">{qubits} Wires</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50/60 border border-slate-200/60">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Depth & Gates</span>
          <span className="text-base font-semibold text-slate-800">
            {circuitDepth} Layers {gateCount ? `(${gateCount} G)` : ''}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50/60 border border-slate-200/60">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Parameters</span>
          <span className="text-base font-semibold text-slate-800">{trainableParameters ?? (qubits * (circuitDepth + 1))} θ Weights</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50/60 border border-slate-200/60">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Backend</span>
          <span className="text-xs font-semibold text-indigo-700 truncate block mt-0.5" title={backend}>{backend}</span>
        </div>
      </div>

      {/* Circuit Body */}
      {hasCircuit ? (
        <div className="relative rounded-xl border border-slate-300/80 bg-slate-950 p-4 overflow-x-auto shadow-inner">
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2 mb-3 font-mono">
            <span>Qiskit 2.5 Statevector DAG</span>
            <span>Horizontal Scroller (Drag/Scroll) →</span>
          </div>
          <pre className="font-mono text-xs leading-relaxed text-emerald-400 select-all whitespace-pre cursor-text">
            {rawText}
          </pre>
        </div>
      ) : (
        <div className="p-8 text-center rounded-xl bg-slate-50/60 border border-dashed border-slate-300">
          <Info className="w-6 h-6 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-600">Circuit visualization unavailable for this experiment.</p>
          <p className="text-xs text-slate-400 mt-1">Execute the QML model or select an active analysis run to compile the live DAG.</p>
        </div>
      )}
    </div>
  );
};
