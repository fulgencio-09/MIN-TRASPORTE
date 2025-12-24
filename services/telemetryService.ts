
import { VehicleTrajectory, QueryParams, ManifiestoRNDC, TrajectoryPoint } from '../types';

/**
 * Servicio técnico que consume el conector de telemetría (Capa Gold)
 * Simula escenarios de validación para la HU001 comparando ruta planeada vs real.
 */
export const fetchVehicleTrajectory = async (params: QueryParams): Promise<VehicleTrajectory> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const placaUpper = params.placa.toUpperCase();

  if (placaUpper === 'NODATA') {
    throw new Error('FA-01: El conector no reporta registros de telemetría para el vehículo solicitado.');
  }

  if (placaUpper === 'NOMANIF') {
    throw new Error('FA-02: No se encontró un manifiesto de carga RNDC asociado.');
  }

  // Coordenadas base
  const startLat = 4.7110; // Bogotá
  const startLng = -74.0721;
  const endLat = 10.9685; // Barranquilla
  const endLng = -74.7813;

  // 1. Generar Ruta Planeada (Ideal RNDC - Siempre la misma línea base)
  const plannedPoints: TrajectoryPoint[] = [];
  for (let i = 0; i < 10; i++) {
    const t = i / 9;
    plannedPoints.push({
      lat: startLat + t * (endLat - startLat),
      lng: startLng + t * (endLng - startLng),
      timestamp: params.startDate,
      speed: 60
    });
  }

  // 2. Generar Ruta Real (SINITT)
  const realPoints: TrajectoryPoint[] = [];
  const isDesvio = placaUpper === 'DESVIO01';
  const isIncompleto = placaUpper === 'INCOMPLETO01';
  const numPoints = isIncompleto ? 8 : 25;

  for (let i = 0; i < numPoints; i++) {
    const t = i / 24;
    let lat, lng;

    if (isDesvio) {
      // Curva pronunciada hacia el oeste (Desvío por Medellín/Antioquia)
      const midLat = 7.0; 
      const midLng = -76.5; 
      lat = (1 - t) * (1 - t) * startLat + 2 * (1 - t) * t * midLat + t * t * endLat;
      lng = (1 - t) * (1 - t) * startLng + 2 * (1 - t) * t * midLng + t * t * endLng;
    } else {
      // Ruta normal con pequeñas variaciones de GPS
      lat = startLat + t * (endLat - startLat);
      lng = startLng + t * (endLng - startLng);
    }

    realPoints.push({
      lat: lat + (Math.random() * 0.02 - 0.01),
      lng: lng + (Math.random() * 0.02 - 0.01),
      timestamp: new Date(new Date(params.startDate).getTime() + i * 2700000).toISOString(),
      speed: i === numPoints - 1 && isIncompleto ? 0 : 55 + Math.random() * 35
    });
  }

  // Lógica de validación
  let isValid = true;
  let destinationDetected = 'BARRANQUILLA, ATL';
  let observaciones = 'Validación exitosa: El recorrido real coincide con el plan de ruta declarado.';

  if (isDesvio) {
    isValid = false;
    observaciones = 'ALERTA TÉCNICA: Se detectó un desvío significativo del corredor logístico declarado. Se recomienda revisar paradas no autorizadas.';
  } else if (isIncompleto) {
    isValid = false;
    destinationDetected = 'VILLETA, CUN (Última señal)';
    observaciones = 'FALLO DE VALIDACIÓN: Recorrido incompleto. El vehículo no alcanzó el destino final en Barranquilla.';
  }

  const manifiesto: ManifiestoRNDC = {
    numeroManifiesto: `RNDC-99${Math.floor(Math.random() * 9000) + 1000}`,
    fechaEmision: params.startDate,
    origenDeclarado: 'BOGOTÁ, DC',
    destinoDeclarado: 'BARRANQUILLA, ATL',
    conductor: 'RICARDO MORENO',
    empresa: 'TRANSPORTES DEL CARIBE S.A.'
  };

  return {
    placa: placaUpper,
    points: realPoints,
    plannedPoints: plannedPoints,
    manifiesto,
    validation: { isValid, observaciones },
    metadata: {
      originDetected: 'BOGOTÁ, DC',
      destinationDetected,
      totalDistance: isIncompleto ? 85.4 : (isDesvio ? 1240.8 : 980.5),
      lastUpdate: new Date().toISOString()
    }
  };
};
