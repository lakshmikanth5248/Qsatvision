import React from 'react';
import { 
  AlertTriangle, 
  CloudRain, 
  Calendar, 
  Cpu, 
  Maximize2, 
  Tag, 
  Shuffle, 
  Sliders, 
  ShieldAlert 
} from 'lucide-react';

export const Limitations: React.FC = () => {
  const limitations = [
    {
      icon: Calendar,
      title: "Historical Sensor Availability & Timeline Horizons",
      category: "Orbital Constellation",
      description:
        "Optical Sentinel-2 imagery began acquisition in mid-2015. Any historical queries for Andhra Pradesh prior to 2015 must be routed through Landsat 8 (operational from 2013) or older Landsat 5/7 archives. Sentinel-1 SAR C-band radar data is available starting from 2014.",
      mitigation: "Strict timeline availability validation prevents invalid pre-launch sensor requests."
    },
    {
      icon: CloudRain,
      title: "Cloud Coverage & Monsoon Obstruction (Kharif Cycle)",
      category: "Atmospheric Interference",
      description:
        "During the southwest monsoon season (June to October), persistent cloud cover over Coastal Andhra (Godavari, Krishna, and Visakhapatnam delta regions) obscures optical satellite sensors, yielding high missing pixel ratios in Level-1C/2A products.",
      mitigation: "Integration of all-weather Sentinel-1 SAR C-band dual-polarization (VV/VH) radar backscatter to penetrate thick cloud cover."
    },
    {
      icon: Maximize2,
      title: "Spatial Resolution & Ground Sample Distance (GSD)",
      category: "Spatial Constraints",
      description:
        "Sentinel-2 provides 10m to 20m spatial resolution, while Landsat provides 30m multispectral resolution. Small-scale agricultural field parcel boundaries, narrow irrigation canals, and informal peri-urban structures smaller than 100m² suffer from mixed pixel spectral blurring.",
      mitigation: "Sub-pixel unmixing and optical-SAR composite fusion."
    },
    {
      icon: Tag,
      title: "Ground Truth Label Sparsity & Verification",
      category: "Ground Reference",
      description:
        "High-density, field-verified ground truth cadastral maps across all 26 districts of Andhra Pradesh are sparsely published. Classifications without synchronized field validation must be treated as indicative spectral pattern recognitions rather than legal land registries.",
      mitigation: "Clearly labeled 'Unlabelled analysis — accuracy metrics unavailable' badge when ground reference is absent."
    },
    {
      icon: Cpu,
      title: "QML Classical Statevector Simulation Limits (2ⁿ)",
      category: "Quantum Computational",
      description:
        "Simulating quantum circuits on classical von Neumann CPUs requires tracking 2ⁿ complex state amplitudes. A 4-qubit register requires 16 amplitudes, while 30 qubits requires >16 GB of RAM, rendering whole-scene satellite raster simulation computationally infeasible without dimensionality reduction.",
      mitigation: "Principal Component Analysis (PCA) feature compression to 2–6 principal components."
    },
    {
      icon: ShieldAlert,
      title: "NISQ Decoherence & Hardware Quantum Noise",
      category: "Quantum Hardware",
      description:
        "Simulated statevectors currently assume fault-tolerant unitary operations. Real Noisy Intermediate-Scale Quantum (NISQ) hardware introduces thermal relaxation (T1), dephasing (T2), and CNOT gate infidelity (0.5%–2%), leading to circuit barren plateaus and degraded accuracy on deep circuits.",
      mitigation: "Shallow parameterized ansatzes (depth ≤ 4) and rigorous empirical benchmarking against classical baselines."
    },
    {
      icon: Shuffle,
      title: "Sensor Discrepancies & Cross-Calibration Domain Shift",
      category: "Radiometric Harmonization",
      description:
        "Spectral response functions (SRFs) differ significantly between Landsat 8 OLI and Sentinel-2 MSI. Direct subtraction of raw digital numbers across differing sensors introduces false pseudo-change artifacts.",
      mitigation: "Atmospheric BOA surface reflectance normalization (L2A) prior to index differencing."
    },
    {
      icon: Sliders,
      title: "Threshold Sensitivity in Change Detection",
      category: "Methodology",
      description:
        "Spectral index differencing (ΔNDVI, ΔNDWI, ΔNDBI) relies on empirical change thresholds. Natural inter-annual phenological rainfall fluctuations can cause transient vegetation stress that does not represent permanent land-use conversion.",
      mitigation: "Multi-year temporal trend regression (2010–2026) to decouple seasonal variation from structural land change."
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Scientific Limitations & Operational Boundaries
          </h1>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
          Comprehensive documentation of physical satellite constraints, radiometric sensor properties, ground truth uncertainty, 
          and NISQ quantum statevector simulation boundaries for QuantumSat-AP.
        </p>
      </div>

      {/* Grid of limitations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {limitations.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="glass-card p-5 border border-white/50 shadow-xs hover:border-indigo-200 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm leading-snug">{item.title}</h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.category}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {item.description}
              </p>

              <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-200/60 text-[11px] text-slate-700">
                <span className="font-semibold text-indigo-700 block mb-0.5">Platform Mitigation Protocol:</span>
                <span>{item.mitigation}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Statement on Scientific Integrity */}
      <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 text-xs text-indigo-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-sm block">Scientific Integrity Commitment</span>
          <p className="text-[11px] leading-relaxed text-indigo-800">
            QuantumSat-AP adheres strictly to reproducible research practices. Claims of "quantum advantage", "quantum speedup", 
            or "superior accuracy" are not asserted without empirical proof on physical hardware. All presented benchmark statistics 
            reflect actual measured wall-clock execution durations and test-split classifications.
          </p>
        </div>
      </div>
    </div>
  );
};
