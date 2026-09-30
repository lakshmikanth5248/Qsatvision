export interface QuantumGate {
  id: string;
  type: 'H' | 'Ry' | 'Rz' | 'CNOT' | 'Measure' | 'ZZ';
  qubit: number;
  targetQubit?: number;
  param?: string;
  label?: string;
}

export interface CircuitStage {
  stageName: 'Hadamard Init' | 'Feature Map Encoding' | 'Variational Layer' | 'Entanglement Layer' | 'Measurement';
  gates: QuantumGate[];
}

export const VQC_CIRCUIT_STAGES: CircuitStage[] = [
  {
    stageName: 'Hadamard Init',
    gates: [
      { id: 'g0', type: 'H', qubit: 0 },
      { id: 'g1', type: 'H', qubit: 1 },
      { id: 'g2', type: 'H', qubit: 2 },
      { id: 'g3', type: 'H', qubit: 3 },
    ]
  },
  {
    stageName: 'Feature Map Encoding',
    gates: [
      { id: 'g4', type: 'Ry', qubit: 0, param: 'x[0] (NDVI)' },
      { id: 'g5', type: 'Ry', qubit: 1, param: 'x[1] (NDWI)' },
      { id: 'g6', type: 'Ry', qubit: 2, param: 'x[2] (NDBI)' },
      { id: 'g7', type: 'Ry', qubit: 3, param: 'x[3] (PCA-1)' },
    ]
  },
  {
    stageName: 'Entanglement Layer',
    gates: [
      { id: 'g8', type: 'CNOT', qubit: 0, targetQubit: 1 },
      { id: 'g9', type: 'CNOT', qubit: 1, targetQubit: 2 },
      { id: 'g10', type: 'CNOT', qubit: 2, targetQubit: 3 },
    ]
  },
  {
    stageName: 'Variational Layer',
    gates: [
      { id: 'g11', type: 'Ry', qubit: 0, param: 'θ[0]' },
      { id: 'g12', type: 'Ry', qubit: 1, param: 'θ[1]' },
      { id: 'g13', type: 'Ry', qubit: 2, param: 'θ[2]' },
      { id: 'g14', type: 'Ry', qubit: 3, param: 'θ[3]' },
    ]
  },
  {
    stageName: 'Measurement',
    gates: [
      { id: 'm0', type: 'Measure', qubit: 0 },
      { id: 'm1', type: 'Measure', qubit: 1 },
      { id: 'm2', type: 'Measure', qubit: 2 },
      { id: 'm3', type: 'Measure', qubit: 3 },
    ]
  }
];
