# Implementation Plan - QuantumSat-AP 🛰️

"Explore Andhra Pradesh Through Time" — A hybrid Classical–Quantum Satellite Intelligence Platform for environmental, agricultural, water body, urban, and disaster monitoring across all districts of Andhra Pradesh (2010–Present).

## User Review Required

> [!IMPORTANT]
> **Data & Scientific Disclaimer**: The application operates in **DEMO DATA** mode by default with clear badges on all synthetic metrics. QML is framed strictly as an experimental research feature compared against classical ML (Random Forest, SVM, XGBoost) using empirical metrics without claiming unproven "quantum advantage".

> [!NOTE]
> We will generate accurate GeoJSON boundaries for all 26 districts of Andhra Pradesh (including newly formed districts like Tirupati, Alluri Sitharama Raju, Anakapalli, NTR, etc.) to give a map experience of AP.

---

## Proposed Project Structure

```
c:/LAKSHMIKANTH/QUANTUM PROJECT/PROTOTYPE/
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── types/
│   │   │   └── index.ts                 # Types for Districts, Datasets, QML Models, Analysis, Results
│   │   ├── context/
│   │   │   └── AnalysisContext.tsx      # Global State (Selected District, Time, App, Pipeline, Results)
│   │   ├── data/
│   │   │   ├── apDistrictsGeoJSON.ts    # GeoJSON polygons & metadata for all AP districts
│   │   │   ├── mockSatelliteData.ts     # Timelines 2010-2026, NDVI, NDWI, NDBI time-series data
│   │   │   └── qmlCircuitsData.ts       # Gates, qubit layouts, and benchmark data
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── DemoBadge.tsx
│   │   │   │   └── MetricCard.tsx
│   │   │   ├── maps/
│   │   │   │   ├── APMapView.tsx        # Interactive Leaflet Map for AP District Selection & Layers
│   │   │   │   ├── ResultsMapView.tsx   # Classification & Change Detection Overlay Map
│   │   │   │   └── DualCompareMap.tsx   # Side-by-side synchronized temporal map view
│   │   │   ├── timeline/
│   │   │   │   └── TimelineSlider.tsx   # 2010-2026 timeline player (Annual / Monthly / Custom)
│   │   │   ├── wizard/
│   │   │   │   └── AnalysisWizard.tsx   # 7-Step Step-by-Step Analysis Setup
│   │   │   ├── processing/
│   │   │   │   └── PipelineStatus.tsx   # Live visual pipeline animated execution step view
│   │   │   ├── quantum/
│   │   │   │   ├── QuantumCircuit.tsx   # Interactive SVG Quantum Circuit visualization
│   │   │   │   └── BlochSphereView.tsx  # Interactive 3D qubit state visualizer
│   │   │   └── charts/
│   │   │       ├── TrendChart.tsx       # Recharts time-series (NDVI/NDWI/NDBI)
│   │   │       ├── BenchmarkTable.tsx   # Classical vs QML metrics table
│   │   │       └── DistrictCompChart.tsx# Multi-district radar/bar comparison
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx            # Hero, stats, domain cards, pipeline summary
│   │   │   ├── ExploreAP.tsx            # Main AP Map Explorer & District Inspector
│   │   │   ├── Analyze.tsx              # Wizard page & Pipeline executor
│   │   │   ├── Results.tsx              # Full geospatial results dashboard
│   │   │   ├── Compare.tsx              # Before/After & Multi-District comparison
│   │   │   ├── QuantumML.tsx            # QML research depth, circuit builder, ansatz options
│   │   │   ├── Reports.tsx              # PDF & CSV generation engine with print layout
│   │   │   └── Methodology.tsx          # Educational architecture & pipeline breakdown
│   │   └── utils/
│   │       ├── geoUtils.ts              # GeoJSON helper calculations & centroid extractors
│   │       └── pdfExport.ts             # Client-side report export utility
└── backend/
    ├── main.py                          # FastAPI Entry point
    ├── requirements.txt                 # FastAPI, Uvicorn, Qiskit, PennyLane, NumPy, scikit-learn
    └── app/
        ├── api/                         # REST Endpoints (/api/districts, /api/analysis, /api/qml/run)
        ├── services/                    # Geospatial & ML services
        └── qml/                         # Qiskit/PennyLane VQC & Quantum Kernel runners
```

---

## Proposed Changes

### Frontend Implementation

#### [NEW] [`package.json`](file:///c:/LAKSHMIKANTH/QUANTUM%20PROJECT/PROTOTYPE/frontend/package.json)
- Configure React 18+, TypeScript, Vite, Tailwind CSS v3, Leaflet, React-Leaflet, Lucide-React, Recharts, Framer Motion, HTML2Canvas / jsPDF.

#### [NEW] [`src/types/index.ts`](file:///c:/LAKSHMIKANTH/QUANTUM%20PROJECT/PROTOTYPE/frontend/src/types/index.ts)
- Comprehensive TypeScript interfaces for Districts, Timeline, Satellite Layers (Landsat, Sentinel-2, Sentinel-1), Analysis Config, QML Parameters (Qubits, Ansatz, Optimizer, Shots), Execution Results, and Benchmarks.

#### [NEW] [`src/data/apDistrictsGeoJSON.ts`](file:///c:/LAKSHMIKANTH/QUANTUM%20PROJECT/PROTOTYPE/frontend/src/data/apDistrictsGeoJSON.ts)
- Detailed GeoJSON feature collection covering all 26 districts of Andhra Pradesh with boundary coordinates, headquarters, area (sq km), historical baseline stats, and agricultural/water/urban coverage metadata.

#### [NEW] [`src/context/AnalysisContext.tsx`](file:///c:/LAKSHMIKANTH/QUANTUM%20PROJECT/PROTOTYPE/frontend/src/context/AnalysisContext.tsx)
- Global React Context storing current user selections, active data mode (`DEMO`), running analysis state, execution logs, historical trends, and analysis results.

#### [NEW] [`src/components/maps/APMapView.tsx`](file:///c:/LAKSHMIKANTH/QUANTUM%20PROJECT/PROTOTYPE/frontend/src/components/maps/APMapView.tsx)
- High-performance Leaflet map component with district hover effects, click-to-select, district boundary styling, tile layer switching (Satellite, Topographic, Dark Mode), legend, and search dropdown.

#### [NEW] [`src/components/timeline/TimelineSlider.tsx`](file:///c:/LAKSHMIKANTH/QUANTUM%20PROJECT/PROTOTYPE/frontend/src/components/timeline/TimelineSlider.tsx)
- Interactive timeline spanning 2010 to 2026 with play/pause slider animation, annual/monthly range controls, and availability indicator per satellite source.

#### [NEW] [`src/pages/Dashboard.tsx`](file:///c:/LAKSHMIKANTH/QUANTUM%20PROJECT/PROTOTYPE/frontend/src/pages/Dashboard.tsx)
- Command center UI with hero section, AP quick metrics, 4 domain modules (Agriculture 🌾, Water 💧, Urban 🏙️, Disaster 🚨), and visual workflow overview.

#### [NEW] [`src/pages/Analyze.tsx`](file:///c:/LAKSHMIKANTH/QUANTUM%20PROJECT/PROTOTYPE/frontend/src/pages/Analyze.tsx)
- 7-step analysis wizard with clear validation, configuration summary, and execution transition to the animated processing screen.

#### [NEW] [`src/pages/Results.tsx`](file:///c:/LAKSHMIKANTH/QUANTUM%20PROJECT/PROTOTYPE/frontend/src/pages/Results.tsx)
- Full-screen split interface: Leaflet thematic overlay map (NDVI heatmap, change detection mask), quantitative stats, and time-series line charts.

#### [NEW] [`src/pages/Compare.tsx`](file:///c:/LAKSHMIKANTH/QUANTUM%20PROJECT/PROTOTYPE/frontend/src/pages/Compare.tsx)
- Dual synchronized map slider for temporal comparison (e.g. 2010 vs 2026) and multi-district metric radar comparison.

#### [NEW] [`src/pages/QuantumML.tsx`](file:///c:/LAKSHMIKANTH/QUANTUM%20PROJECT/PROTOTYPE/frontend/src/pages/QuantumML.tsx)
- Interactive quantum circuit visualizer (Hadamard, Ry, CNOT gates), qubit state vector simulator, VQC hyperparameter tuner, and Classical vs Quantum benchmark dashboard.

#### [NEW] [`src/pages/Reports.tsx`](file:///c:/LAKSHMIKANTH/QUANTUM%20PROJECT/PROTOTYPE/frontend/src/pages/Reports.tsx)
- Professional research report generator with PDF download, CSV export, map snapshots, and full methodology appendix.

#### [NEW] [`src/pages/Methodology.tsx`](file:///c:/LAKSHMIKANTH/QUANTUM%20PROJECT/PROTOTYPE/frontend/src/pages/Methodology.tsx)
- Scientific breakdown of data ingestion, feature extraction (NDVI/NDWI/NDBI), PCA dimensionality reduction, Quantum Feature Map encoding (Angle/ZZ Feature Map), VQC, and spatial change detection.

---

### Backend Implementation

#### [NEW] [`backend/main.py`](file:///c:/LAKSHMIKANTH/QUANTUM%20PROJECT/PROTOTYPE/backend/main.py)
- FastAPI application serving endpoints for `/api/districts`, `/api/satellite-data`, `/api/analysis/run`, `/api/qml/benchmark`, and `/api/reports/generate`.

---

## Verification Plan

### Automated Verification
1. **Frontend Build & Lint**:
   - Run `npm run build` in `frontend/` to confirm zero TypeScript compilation errors and bundle optimization.
2. **Backend API Verification**:
   - Test FastAPI endpoints via `pytest` or `curl` on local port 8000.

### Manual Verification
1. **Interactive Map Test**:
   - Click each of the 26 Andhra Pradesh districts on the Leaflet map and verify metadata drawer updates.
2. **Analysis Pipeline Test**:
   - Complete the 7-step wizard for Tirupati district (Agriculture domain, 2010-2026 range, VQC Quantum ML model). Run analysis and observe animated pipeline steps.
3. **Compare & Split View Test**:
   - Synchronize 2010 vs 2026 maps in Compare mode and inspect change detection legend.
4. **Quantum ML Circuit & Benchmarks**:
   - Switch between Variational Quantum Classifier (VQC) and Quantum Kernel estimators; observe real-time circuit update and benchmark comparison table.
5. **PDF Report Export**:
   - Click "Generate & Download PDF Report" and verify print-ready formatted output.
