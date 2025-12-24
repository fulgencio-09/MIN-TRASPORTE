
import { VehicleTrajectory, QueryParams } from '../types';

/**
 * Mocking the "Conector de Telemetría" service.
 * In a real scenario, this would call an API connected to the Data Lake (Capa Gold).
 */
export const fetchVehicleTrajectory = async (params: QueryParams): Promise<VehicleTrajectory> => {
  // Simulate network delay (Step 4, 5 and 6 of the HU flow)
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Business Rule RN-02: Validate Placa
  if (!params.placa || params.placa.length < 6) {
    throw new Error('FA-02: Placa de vehículo inválida.');
  }

  // Business Rule RN-02: Date Range Check
  const start = new Date(params.startDate);
  const end = new Date(params.endDate);
  if (start > end) {
    throw new Error('FA-02: Rango de fechas inválido.');
  }

  // Simulate FA-01: Vehicle without data
  if (params.placa.toUpperCase() === 'VACIO01') {
    throw new Error('FA-01: No existen registros para el vehículo solicitado en este rango.');
  }

  // Generate mock points based on a route from Bogota to Medellin roughly
  const points = [];
  const baseLat = 4.7110;
  const baseLng = -74.0721;
  const numPoints = 25;

  for (let i = 0; i < numPoints; i++) {
    points.push({
      lat: baseLat + (i * 0.05) + (Math.random() * 0.02 - 0.01),
      lng: baseLng - (i * 0.08) + (Math.random() * 0.02 - 0.01),
      timestamp: new Date(start.getTime() + i * 3600000).toISOString(),
      speed: 40 + Math.random() * 60
    });
  }

  return {
    placa: params.placa.toUpperCase(),
    points: points,
    metadata: {
      origin: 'BOGOTÁ, DC',
      destination: 'MEDELLÍN, ANT',
      totalDistance: 415.5,
      lastUpdate: new Date().toISOString()
    }
  };
};
