
import React, { useState } from 'react';
import { 
  Search, 
  Map as MapIcon, 
  Calendar, 
  Truck, 
  AlertCircle, 
  ArrowRight,
  ArrowUp,
  Info,
  CheckCircle2,
  AlertTriangle,
  ClipboardList,
  ShieldCheck,
  FileText,
  Navigation,
  Activity
} from 'lucide-react';
import { QueryParams, QueryStatus, VehicleTrajectory } from '../types';
import { fetchVehicleTrajectory } from '../services/telemetryService';
import TrajectoryMap from '../components/TrajectoryMap';

const TelemetryConsultation: React.FC = () => {
  const [params, setParams] = useState<QueryParams>({
    placa: '',
    startDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const [status, setStatus] = useState<QueryStatus>(QueryStatus.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<VehicleTrajectory | null>(null);
  const [showAllPoints, setShowAllPoints] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(QueryStatus.LOADING);
    setErrorMsg(null);
    setShowAllPoints(false);

    try {
      const data = await fetchVehicleTrajectory(params);
      setResult(data);
      setStatus(QueryStatus.SUCCESS);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error técnico en la consulta.');
      setStatus(QueryStatus.ERROR);
      setResult(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Validación de Recorridos RNDC</h1>
          <p className="text-gray-500 text-sm">Auditoría de trayectorias mediante telemetría Capa Gold (HU001)</p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">RN-04 Validación de Cruce</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Panel de Búsqueda */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center">
              <Search className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-800">Criterios de Búsqueda</h3>
            </div>
            
            <form onSubmit={handleSearch} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Truck className="w-4 h-4 mr-1 text-gray-400" />
                  Placa <span className="text-red-500 ml-1">*</span>
                </label>
                <input 
                  type="text"
                  name="placa"
                  value={params.placa}
                  onChange={handleInputChange}
                  placeholder="Ej: ABC123"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-2.5 uppercase font-mono tracking-widest text-lg"
                  required
                />
                <div className="mt-2 p-2 bg-slate-50 rounded border border-slate-100">
                  <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Casos de Prueba:</p>
                  <ul className="text-[9px] text-slate-500 space-y-1">
                    <li>• <span className="font-mono text-blue-600">DESVIO01</span>: Trayectoria con desvío.</li>
                    <li>• <span className="font-mono text-blue-600">INCOMPLETO01</span>: Trayectoria incompleta.</li>
                    <li>• <span className="font-mono text-blue-600">ABC123</span>: Validación exitosa.</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                    Desde
                  </label>
                  <input type="date" name="startDate" value={params.startDate} onChange={handleInputChange} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-sm" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                    Hasta
                  </label>
                  <input type="date" name="endDate" value={params.endDate} onChange={handleInputChange} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-sm" required />
                </div>
              </div>

              <button 
                type="submit"
                disabled={status === QueryStatus.LOADING}
                className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center disabled:opacity-50"
              >
                {status === QueryStatus.LOADING ? 'Consultando...' : 'Realizar Auditoría'}
              </button>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-start">
                <Info className="w-4 h-4 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-blue-700 leading-tight">Compara la ruta declarada en el RNDC vs. los puntos capturados en el SINITT (RN-04).</p>
              </div>
            </form>
          </div>
        </div>

        {/* Panel de Resultados */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          {status === QueryStatus.IDLE && (
            <div className="flex-1 flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-200 rounded-2xl min-h-[500px] p-12 text-center">
              <Navigation className="w-12 h-12 text-gray-200 mb-4" />
              <h3 className="text-lg font-medium text-gray-400">Esperando parámetros de consulta</h3>
            </div>
          )}

          {status === QueryStatus.SUCCESS && result && (
            <>
              {/* Banner de Validación */}
              <div className={`p-5 rounded-2xl border-2 flex items-start space-x-4 shadow-sm animate-in zoom-in-95 duration-300 ${
                result.validation.isValid 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                <div className={`p-2 rounded-full ${result.validation.isValid ? 'bg-green-100' : 'bg-amber-100'}`}>
                  {result.validation.isValid ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-1">
                    {result.validation.isValid ? 'Cumplimiento de Ruta' : 'Inconsistencia Detectada'}
                  </h4>
                  <p className="text-sm font-medium leading-relaxed">{result.validation.observaciones}</p>
                </div>
              </div>

              {/* Comparativa */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center text-blue-700 mb-4 font-bold uppercase text-[10px] tracking-widest">
                    <FileText className="w-4 h-4 mr-2" />
                    Manifiesto Oficial
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs text-gray-400">Ruta: <span className="text-gray-900 font-bold">{result.manifiesto?.origenDeclarado} → {result.manifiesto?.destinoDeclarado}</span></p>
                    <p className="text-[10px] text-gray-400 italic">ID Manifiesto: {result.manifiesto?.numeroManifiesto}</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center text-indigo-700 mb-4 font-bold uppercase text-[10px] tracking-widest">
                    <Activity className="w-4 h-4 mr-2" />
                    Telemetría Real
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs text-gray-400">Distancia: <span className="text-gray-900 font-bold">{result.metadata.totalDistance.toFixed(1)} km</span></p>
                    <p className="text-xs text-gray-400">Última Señal: <span className={`font-bold ${!result.validation.isValid && result.placa === 'INCOMPLETO01' ? 'text-red-600' : 'text-gray-900'}`}>{result.metadata.destinationDetected}</span></p>
                  </div>
                </div>
              </div>

              {/* Mapa Comparativo */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-[500px] flex flex-col overflow-hidden relative">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-700 text-sm">Visualización Comparativa de Ruta (HU001)</h3>
                </div>
                <div className="flex-1">
                  <TrajectoryMap 
                    points={result.points} 
                    plannedPoints={result.plannedPoints}
                    isValid={result.validation.isValid}
                  />
                </div>
              </div>

              {/* Log Tabla */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-700 text-sm uppercase">Detalle Técnico de Puntos GPS</h3>
                </div>
                <div className={`overflow-x-auto ${showAllPoints ? 'max-h-96' : ''}`}>
                  <table className="w-full text-left text-[11px] font-mono">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold">
                      <tr>
                        <th className="px-6 py-3">Timestamp</th>
                        <th className="px-6 py-3">Lat/Lng</th>
                        <th className="px-6 py-3 text-right">Vel. (km/h)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {(showAllPoints ? result.points : result.points.slice(0, 5)).map((p, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 text-gray-500">{new Date(p.timestamp).toLocaleString()}</td>
                          <td className="px-6 py-4 text-gray-700">{p.lat.toFixed(4)}, {p.lng.toFixed(4)}</td>
                          <td className={`px-6 py-4 text-right font-bold ${p.speed > 80 ? 'text-red-500' : 'text-green-600'}`}>
                            {p.speed.toFixed(0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button 
                  onClick={() => setShowAllPoints(!showAllPoints)}
                  className="w-full py-3 bg-gray-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors"
                >
                  {showAllPoints ? 'Ver menos' : `Mostrar todos los puntos (${result.points.length})`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TelemetryConsultation;
