
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { TrajectoryPoint } from '../types';

interface TrajectoryMapProps {
  points: TrajectoryPoint[];
  plannedPoints: TrajectoryPoint[];
  isValid?: boolean;
}

const TrajectoryMap: React.FC<TrajectoryMapProps> = ({ points, plannedPoints, isValid = true }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  
  // Refs para las capas
  const realPathRef = useRef<L.Polyline | null>(null);
  const plannedPathRef = useRef<L.Polyline | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current).setView([7.0, -74.5], 6);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(mapInstanceRef.current);
      
      markersGroupRef.current = L.layerGroup().addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current!;

    // Limpiar capas previas
    if (realPathRef.current) map.removeLayer(realPathRef.current);
    if (plannedPathRef.current) map.removeLayer(plannedPathRef.current);
    markersGroup.clearLayers();

    // 1. Dibujar Ruta Planeada (Gris punteada - RNDC)
    if (plannedPoints.length > 0) {
      const plannedLatLngs = plannedPoints.map(p => [p.lat, p.lng] as L.LatLngTuple);
      plannedPathRef.current = L.polyline(plannedLatLngs, {
        color: '#94a3b8',
        weight: 3,
        opacity: 0.4,
        dashArray: '8, 12'
      }).addTo(map);
    }

    // 2. Dibujar Ruta Real y sus puntos (SINITT)
    if (points.length > 0) {
      const realLatLngs = points.map(p => [p.lat, p.lng] as L.LatLngTuple);
      const pathColor = isValid ? '#2563eb' : '#ef4444';
      
      // La línea que une los puntos
      realPathRef.current = L.polyline(realLatLngs, { 
        color: pathColor, 
        weight: 4, 
        opacity: 0.7 
      }).addTo(map);
      
      // Dibujar TODOS los puntos de la trayectoria
      points.forEach((point, index) => {
        const isStart = index === 0;
        const isEnd = index === points.length - 1;
        
        // Estilo diferenciado para inicio, fin y puntos intermedios
        let radius = 4;
        let weight = 1;
        let fillColor = pathColor;
        let opacity = 0.8;

        if (isStart) {
          radius = 8;
          fillColor = '#10b981'; // Verde para el inicio
          opacity = 1;
          weight = 2;
        } else if (isEnd) {
          radius = 8;
          fillColor = isValid ? '#2563eb' : '#ef4444'; // Azul o Rojo para el final
          opacity = 1;
          weight = 2;
        }

        const marker = L.circleMarker([point.lat, point.lng], {
          radius: radius,
          color: '#ffffff',
          fillColor: fillColor,
          fillOpacity: opacity,
          weight: weight
        });

        // Popup con información técnica del punto
        marker.bindPopup(`
          <div class="text-[11px] font-sans">
            <div class="font-bold border-b border-gray-100 pb-1 mb-1">
              ${isStart ? '🚩 ORIGEN DE RUTA' : isEnd ? '🏁 ÚLTIMO REPORTE' : '📍 PUNTO DE CONTROL'}
            </div>
            <div class="flex flex-col gap-1">
              <span><strong>Hora:</strong> ${new Date(point.timestamp).toLocaleTimeString()}</span>
              <span><strong>Velocidad:</strong> ${point.speed.toFixed(1)} km/h</span>
              <span><strong>Coord:</strong> ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}</span>
            </div>
          </div>
        `);

        marker.addTo(markersGroup);
      });

      // Ajustar vista para contener ambas rutas
      const combinedBounds = L.latLngBounds([...plannedPoints, ...points].map(p => [p.lat, p.lng] as L.LatLngTuple));
      map.fitBounds(combinedBounds, { padding: [50, 50] });
    }

  }, [points, plannedPoints, isValid]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full rounded-xl" />
      
      {/* Leyenda del Mapa Refinada */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-xl border border-gray-100 z-[1000] text-[10px] space-y-2 min-w-[160px]">
        <div className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-1 border-b pb-1">Leyenda Técnica</div>
        
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 border-t-2 border-dashed border-slate-400"></div>
          <span className="font-medium text-slate-600">Plan RNDC (Teórico)</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-4 h-0.5 border-t-2 ${isValid ? 'border-blue-600' : 'border-red-600'}`}></div>
          <span className={`font-medium ${isValid ? 'text-blue-600' : 'text-red-600'}`}>Real SINITT (Traza)</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isValid ? 'bg-blue-600' : 'bg-red-600'}`}></div>
          <span className="font-medium text-gray-500 italic">Puntos de Telemetría</span>
        </div>

        <div className="flex items-center space-x-2 pt-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="font-medium text-gray-500">Punto de Despacho</span>
        </div>
      </div>
    </div>
  );
};

export default TrajectoryMap;
