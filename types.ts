
export interface TrajectoryPoint {
  lat: number;
  lng: number;
  timestamp: string;
  speed: number;
}

export interface VehicleTrajectory {
  placa: string;
  points: TrajectoryPoint[];
  metadata: {
    origin: string;
    destination: string;
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
