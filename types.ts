
export interface TrajectoryPoint {
  lat: number;
  lng: number;
  timestamp: string;
  speed: number;
}

export interface ManifiestoRNDC {
  numeroManifiesto: string;
  fechaEmision: string;
  origenDeclarado: string;
  destinoDeclarado: string;
  conductor: string;
  empresa: string;
}

export interface VehicleTrajectory {
  placa: string;
  points: TrajectoryPoint[];
  plannedPoints: TrajectoryPoint[]; // Ruta ideal declarada en RNDC
  manifiesto: ManifiestoRNDC | null;
  validation: {
    isValid: boolean;
    observaciones: string;
  };
  metadata: {
    originDetected: string;
    destinationDetected: string;
    totalDistance: number;
    lastUpdate: string;
  };
}

export enum QueryStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  EMPTY = 'EMPTY'
}

export interface QueryParams {
  placa: string;
  startDate: string;
  endDate: string;
}
