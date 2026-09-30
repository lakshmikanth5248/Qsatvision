import React from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  Atom, 
  Sparkles,
  Zap,
  Cpu
} from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';
import { DemoDataBadge } from '../glass/GlassBadge';

export const PipelineStatus: React.FC = () => {
  const { pipelineSteps, isAnalyzing, activeResult, dataMode } = useAnalysis();

  return (
    <div className="w-full liquid-glass rounded-3xl p-6 lg:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Atom className="w-5 h-5 text-purple-700 animate-spin" />
            <h2 className="text-lg font-bold text-[#172033] font-sans">Hybrid Classical–Quantum Execution Pipeline</h2>
          </div>
          <p className="text-xs text-[#46566E]">
            {isAnalyzing ? "Executing processing stages on Classical CPU & Qiskit Quantum Simulator..." : "Pipeline execution completed."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAnalyzing && (
            <span className="liquid-glass-pill px-3 py-1 text-xs font-mono text-sky-950 font-bold border border-sky-400/50 bg-sky-50/70 flex items-center gap-1.5 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-700" /> Processing...
            </span>
          )}
          <DemoDataBadge text={`${dataMode} MODE`} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pipelineSteps.map((step, idx) => {
          const isDone = step.status === 'completed';
          const isRunning = step.status === 'running';

          return (
            <div
              key={step.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-2 ${
                isDone
                  ? 'bg-emerald-500/10 border-emerald-400/40 text-emerald-950 shadow-2xs'
                  : isRunning
                  ? 'bg-sky-500/15 border-sky-400/60 shadow-md ring-2 ring-sky-400/30'
                  : 'bg-white/20 border-white/60 text-[#46566E]'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/40 text-[#172033] font-bold border border-white/60">
                    STAGE 0{idx + 1}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold flex items-center gap-1 ${
                    step.isQuantum
                      ? 'bg-purple-500/15 text-purple-950 border-purple-400/40'
                      : 'bg-sky-500/15 text-sky-950 border-sky-400/40'
                  }`}>
                    {step.isQuantum ? <Zap className="w-3 h-3 text-purple-700" /> : <Cpu className="w-3 h-3 text-sky-700" />}
                    {step.isQuantum ? 'QML' : 'CLASSICAL'}
                  </span>
                </div>

                <h4 className="font-bold text-xs text-[#172033] font-sans">{step.title}</h4>
                <p className="text-[11px] text-[#46566E] leading-snug">{step.description}</p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-200/50">
                <div className="w-full bg-slate-200/60 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isDone
                        ? 'bg-emerald-600'
                        : isRunning
                        ? 'bg-sky-600 animate-pulse'
                        : 'bg-transparent'
                    }`}
                    style={{ width: `${step.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className={isDone ? 'text-emerald-800 font-bold' : isRunning ? 'text-sky-800 font-bold' : 'text-[#46566E]'}>
                    {isDone ? 'Complete ✓' : isRunning ? 'Running...' : 'Waiting'}
                  </span>
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  ) : isRunning ? (
                    <Loader2 className="w-3.5 h-3.5 text-sky-700 animate-spin" />
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activeResult && !isAnalyzing && (
        <div className="bg-white/25 p-4 rounded-2xl border border-white/60 flex flex-wrap items-center justify-between gap-4 text-xs font-mono shadow-xs">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-sky-700 shrink-0" />
            <div>
              <span className="text-[#172033] font-bold block">Execution Complete (DEMO DATA)</span>
              <span className="text-[#46566E]">
                Classical RF: {activeResult.overallAccuracy.classical}% Accuracy | QML VQC: {activeResult.overallAccuracy.quantum}% Accuracy
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[#46566E]">
            <span>Classical: {activeResult.metrics.classicalInferenceMs}ms</span>
            <span>QML Sim: {activeResult.metrics.quantumInferenceMs}ms</span>
          </div>
        </div>
      )}
    </div>
  );
};
