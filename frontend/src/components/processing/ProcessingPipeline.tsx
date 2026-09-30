import React from 'react';
import { DemoDataBadge } from '../glass/GlassBadge';
import { Atom, Cpu, Zap, CheckCircle2, Loader2, Circle, ShieldCheck } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';

export const ProcessingPipeline: React.FC = () => {
  const { pipelineSteps, dataMode, currentProcessingStep, isAnalyzing } = useAnalysis();

  return (
    <div className="liquid-glass p-6 lg:p-8 space-y-6 rounded-3xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Atom className="w-5 h-5 text-purple-700 animate-spin" />
            <h2 className="text-lg font-bold text-[#172033] font-sans">
              Hybrid Classical–Quantum Processing Pipeline
            </h2>
          </div>
          <p className="text-xs text-[#46566E]">
            End-to-end 8-stage execution flow mapping satellite retrieval, classical preprocessing, PCA, quantum state encoding, and comparative evaluation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAnalyzing && (
            <span className="liquid-glass-pill px-3 py-1 text-xs font-mono text-sky-950 font-bold border border-sky-400/50 bg-sky-50/70 flex items-center gap-1.5 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-700" />
              Stage 0{currentProcessingStep + 1} / 08
            </span>
          )}
          <DemoDataBadge text={`${dataMode} PIPELINE`} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pipelineSteps.map((step) => {
          const isCompleted = step.status === 'completed';
          const isRunning = step.status === 'running';

          return (
            <div
              key={step.id}
              className={`p-4 rounded-2xl border transition-all space-y-3 relative overflow-hidden flex flex-col justify-between ${
                isRunning
                  ? 'bg-sky-500/15 border-sky-400/60 shadow-md ring-2 ring-sky-400/30'
                  : isCompleted
                  ? 'bg-emerald-500/10 border-emerald-400/40 shadow-2xs'
                  : 'bg-white/20 border-white/60 text-[#46566E]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/40 text-[#172033] font-bold border border-white/60">
                    STAGE 0{step.stageNum}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold flex items-center gap-1 ${
                    step.isQuantum
                      ? 'bg-purple-500/15 text-purple-950 border-purple-400/40'
                      : 'bg-sky-500/15 text-sky-950 border-sky-400/40'
                  }`}>
                    {step.isQuantum ? <Zap className="w-3 h-3 text-purple-700" /> : <Cpu className="w-3 h-3 text-sky-700" />}
                    {step.isQuantum ? 'QUANTUM STAGE' : 'CLASSICAL STAGE'}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-[#172033] font-sans leading-snug">
                  {step.title}
                </h4>
                <p className="text-xs text-[#46566E] leading-relaxed">
                  {step.description}
                </p>

                {step.details && (
                  <div className="bg-white/30 backdrop-blur-md p-2 rounded-xl border border-white/60 text-[10px] font-mono text-[#34445B] leading-tight">
                    {step.details}
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200/50">
                {/* Progress bar */}
                <div className="w-full bg-slate-200/60 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isCompleted
                        ? 'bg-emerald-600'
                        : isRunning
                        ? 'bg-sky-600 animate-pulse'
                        : 'bg-transparent'
                    }`}
                    style={{ width: `${step.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className={isCompleted ? 'text-emerald-800 font-bold' : isRunning ? 'text-sky-800 font-bold' : 'text-[#46566E]'}>
                    {isCompleted ? 'Status: Completed ✓' : isRunning ? 'Executing Stage...' : 'Status: Waiting'}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  ) : isRunning ? (
                    <Loader2 className="w-4 h-4 text-sky-700 animate-spin" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 pt-1 text-xs text-[#46566E] italic">
        <ShieldCheck className="w-4 h-4 text-sky-700 shrink-0" />
        <span>Scientific Integrity Notice: Processing pipeline executes simulated prototype models for Phase 2 demonstration. Measured experimental benchmarks will be incorporated in later phases.</span>
      </div>
    </div>
  );
};
