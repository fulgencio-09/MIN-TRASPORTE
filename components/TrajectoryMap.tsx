
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { TrajectoryPoint } from '../types';

interface TrajectoryMapProps {
  points: TrajectoryPoint[];
}

const TrajectoryMap: React.FC<TrajectoryMapProps> = ({ points }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not already done
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current).setView([4.711, -74.0721], 6);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
      
      markersGroupRef.current = L.layerGroup().addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current!;

    // Clear previous layers
    if (polylineRef.current) map.removeLayer(polylineRef.current);
    markersGroup.clearLayers();

    if (points.length > 0) {
      const latLngs = points.map(p => [p.lat, p.lng] as L.LatLngTuple);
      
      // Draw path (The connecting line)
      polylineRef.current = L.polyline(latLngs, { 
        color: '#2563eb', 
        weight: 3, 
        opacity: 0.6,
        dashArray: '5, 10' // Estilo línea punteada para resaltar los puntos
      }).addTo(map);
      
      // Draw markers for EVERY point (RN: Los 25 puntos deben reflejarse)
      points.forEach((point, index) => {
        const isStart = index === 0;
        const isEnd = index === points.length - 1;
        
        let markerOptions: L.CircleMarkerOptions = {
          radius: 4,
          color: '#3b82f6',
          fillColor: '#ffffff',
          fillOpacity: 1,
          weight: 2
        };

        let popupContent = `
          <div class="text-xs">
            <p><strong>Punto #${index + 1}</strong></p>
            <p>Hora: ${new Date(point.timestamp).toLocaleTimeString()}</p>
            <p>Velocidad: ${point.speed.toFixed(1)} km/h</p>
          </div>
        `;

        if (isStart) {
          markerOptions = { 
            radius: 7, 
            color: '#10b981', 
            fillColor: '#10b981', 
            fillOpacity: 1,
            weight: 2
          };
          popupContent = `<strong>Punto de Partida</strong><br/>${popupContent}`;
        } else if (isEnd) {
          markerOptions = { 
            radius: 8, 
            color: '#ef4444', 
            fillColor: '#ef4444', 
            fillOpacity: 1,
            weight: 3
          };
          popupContent = `<strong>Ubicación Final</strong><br/>${popupContent}`;
        }

        L.circleMarker([point.lat, point.lng], markerOptions)
          .bindPopup(popupContent)
          .addTo(markersGroup);
      });

      // Fit bounds to show all points
      map.fitBounds(polylineRef.current.getBounds(), { padding: [40, 40] });
    }

    return () => {
      // Cleanup if necessary
    };
  }, [points]);

  return <div ref={mapContainerRef} className="h-full w-full rounded-xl overflow-hidden shadow-inner border border-gray-200" />;
};

export default TrajectoryMap;
