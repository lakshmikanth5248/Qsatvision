import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  Scale,
  Play,
  Download,
  HelpCircle
} from 'lucide-react';
import { useAnalysis } from '../context/AnalysisContext';
import { AP_DISTRICTS } from '../data/apDistrictsGeoJSON';
import { apiService } from '../services/apiService';
import { ConfusionMatrixCard } from '../components/charts/ConfusionMatrixCard';
import { ClassificationReportTable } from '../components/charts/ClassificationReportTable';
import type { FullBenchmarkResponse, ModelBenchmarkResult } from '../types';

export const Benchmark: React.FC = () => {
  const { districtId, quantumConfig } = useAnalysis();
  const districtObj = AP_DISTRICTS.find(d => d.id === districtId) || AP_DISTRICTS[0];

  const [loading, setLoading] = useState(false);
  const [benchmarkData, setBenchmarkData] = useState<FullBenchmarkResponse | null>(null);
  const [selectedModelForDetails, setSelectedModelForDetails] = useState<string>('random_forest');

  // Run benchmark on load or user action
  const runBenchmark = async () => {
    setLoading(true);
    try {
      const data = await apiService.runBenchmark({
        districtId: districtObj.id || 'visakhapatnam',
        startYear: 2020,
        endYear: 2026,
        qubits: quantumConfig.qubits,
        circuitDepth: quantumConfig.circuitDepth,
        encodingMethod: quantumConfig.encodingMethod,
        ansatz: quantumConfig.ansatz,
        shots: quantumConfig.shots,
        sampleSize: 200
      });
      setBenchmarkData(data);
    } catch (e) {
      console.error('Failed to run benchmark', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runBenchmark();
  }, [districtObj.id, quantumConfig.qubits]);

  const handleDownloadCsv = async () => {
    if (!benchmarkData) return;
    await apiService.downloadBenchmarkCsv(benchmarkData.benchmarkId, benchmarkData.districtName);
  };

  const models: ModelBenchmarkResult[] = benchmarkData?.models || [];
  const selectedModel = models.find(m => m.modelId === selectedModelForDetails) || models[0];

  // Chart data formatting
  const chartData = models.map(m => ({
    name: m.modelName.replace('Classifier', '').replace('(RBF Kernel)', '').trim(),
    modelType: m.modelType === 'quantum' ? 'Quantum Circuit' : 'Classical ML',
    accuracy: m.accuracy,
    precision: Number((m.precision * 100).toFixed(1)),
    recall: Number((m.recall * 100).toFixed(1)),
    f1Score: Number((m.f1Score * 100).toFixed(1)),
    trainingTime: m.trainingTimeSec,
    inferenceTime: m.inferenceTimeMs
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Classical vs. Quantum Empirical Benchmark
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Peer-to-peer empirical evaluation on identical stratified 80/20 train/test partitions for {districtObj.name} District.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {benchmarkData && (
            <button
              onClick={handleDownloadCsv}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white/80 hover:bg-white border border-slate-200 transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Export Benchmark CSV
            </button>
          )}

          <button
            onClick={runBenchmark}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md"
          >
            <Play className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Evaluating Models...' : 'Re-Run Benchmark'}
          </button>
        </div>
      </div>

      {/* Scientific Principle Notice (Mandatory Rule) */}
      <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
        <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-900 block mb-0.5">
            Strict Scientific Protocol: Measured Results Only
          </span>
          <span className="text-slate-600">
            This platform presents genuine measured values. In accordance with empirical standards, models are not automatically ranked, 
            scored, or declared "winners", and no unproven "quantum advantage" or "quantum superiority" is asserted.
          </span>
        </div>
      </div>

      {/* Side-by-side Metric Table */}
      <div className="glass-card p-5 border border-white/50 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-800">1. Empirical Performance Metrics Matrix</h3>
          <span className="text-xs text-slate-400">
            {benchmarkData ? `Benchmark ID: ${benchmarkData.benchmarkId}` : 'Loading...'}
          </span>
        </div>

        <div className="overflow-x-auto pb-1">
          <table className="min-w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-medium">
                <th className="pb-2 text-slate-700 font-semibold">Model Architecture</th>
                <th className="pb-2">Paradigm</th>
                <th className="pb-2 text-right">Accuracy (%)</th>
                <th className="pb-2 text-right">Precision</th>
                <th className="pb-2 text-right">Recall</th>
                <th className="pb-2 text-right">Weighted F1</th>
                <th className="pb-2 text-right">Train Time (s)</th>
                <th className="pb-2 text-right">Latency (ms)</th>
                <th className="pb-2 text-right">Features / Qubits</th>
                <th className="pb-2 text-right">Engine / Backend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {models.map((m) => (
                <tr
                  key={m.modelId}
                  onClick={() => setSelectedModelForDetails(m.modelId)}
                  className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                    selectedModelForDetails === m.modelId ? 'bg-indigo-50/50 font-medium' : ''
                  }`}
                >
                  <td className="py-3 font-semibold text-slate-800 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${m.modelType === 'quantum' ? 'bg-indigo-500' : 'bg-emerald-500'}`}></span>
                    {m.modelName}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      m.modelType === 'quantum' 
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {m.modelType === 'quantum' ? 'Quantum Statevector' : 'Classical Scikit'}
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono font-semibold text-slate-900">{m.accuracy.toFixed(1)}%</td>
                  <td className="py-3 text-right font-mono text-slate-600">{m.precision.toFixed(3)}</td>
                  <td className="py-3 text-right font-mono text-slate-600">{m.recall.toFixed(3)}</td>
                  <td className="py-3 text-right font-mono font-semibold text-indigo-600">{m.f1Score.toFixed(3)}</td>
                  <td className="py-3 text-right font-mono text-slate-600">{m.trainingTimeSec.toFixed(3)}s</td>
                  <td className="py-3 text-right font-mono text-slate-600">{m.inferenceTimeMs.toFixed(2)}ms</td>
                  <td className="py-3 text-right font-mono text-slate-600">
                    {m.qubits ? `${m.qubits} Qubits` : `${m.featuresCount} Features`}
                  </td>
                  <td className="py-3 text-right text-slate-500 truncate max-w-[140px]" title={m.backend}>
                    {m.backend}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comparative Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Metric Comparison Bar Chart */}
        <div className="glass-card p-5 border border-white/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h4 className="font-semibold text-slate-800 text-sm">Accuracy & F1-Score Comparison</h4>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px]">
              <span className="px-2 py-0.5 rounded bg-white text-slate-800 font-semibold shadow-xs">Classification Performance</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 20, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} angle={-15} textAnchor="end" />
                <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`]}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="accuracy" name="Accuracy (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="f1Score" name="F1 Score (%)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Execution Time & Latency Chart */}
        <div className="glass-card p-5 border border-white/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h4 className="font-semibold text-slate-800 text-sm">Computational Latency Comparison</h4>
            <span className="text-[11px] text-slate-500">Wall-Clock Seconds vs. Inference Latency</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 20, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="trainingTime" name="Training Duration (s)" fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="inferenceTime" name="Inference Latency (ms/sample)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Model Deep Dive: Confusion Matrix & Classification Report */}
      {selectedModel && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Deep Inspection</span>
              <h3 className="text-sm font-bold text-slate-800">{selectedModel.modelName}</h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500">Select Model:</span>
              {models.map(m => (
                <button
                  key={m.modelId}
                  onClick={() => setSelectedModelForDetails(m.modelId)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedModelForDetails === m.modelId
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white/70 text-slate-700 hover:bg-white border border-slate-200'
                  }`}
                >
                  {m.modelName.replace('Classifier', '').replace('(RBF Kernel)', '').trim()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ConfusionMatrixCard
              matrix={selectedModel.confusionMatrix}
              classes={selectedModel.classesPresent}
              modelName={selectedModel.modelName}
              isExecuted={true}
            />

            <ClassificationReportTable
              metrics={selectedModel.perClassMetrics}
              overallAccuracy={selectedModel.accuracy}
              modelName={selectedModel.modelName}
              isExecuted={true}
            />
          </div>
        </div>
      )}

      {/* Feature Importance / Explainability (Phase 5 Section 8) */}
      {benchmarkData?.featureImportances && benchmarkData.featureImportances.length > 0 && (
        <div className="glass-card p-5 border border-white/50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-semibold text-slate-800 text-sm">Classical Feature Importance (Random Forest Gini Impurity)</h4>
              <p className="text-xs text-slate-500">Spectral and textural contribution to land cover classification</p>
            </div>
            <span className="text-xs font-mono text-slate-400">Scikit-Learn Gini Index</span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={benchmarkData.featureImportances}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 'dataMax + 0.05']} />
                <YAxis dataKey="feature" type="category" tick={{ fontSize: 11, fill: '#334155' }} width={110} />
                <Tooltip
                  formatter={(val: any) => [val, 'Importance Weight']}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                />
                <Bar dataKey="importance" fill="#4f46e5" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
