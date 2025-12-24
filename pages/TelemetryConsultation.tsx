
import React, { useState } from 'react';
import { 
  Search, 
  Map as MapIcon, 
  Calendar, 
  Truck, 
  AlertCircle, 
  ChevronRight, 
  FileText, 
  Download,
  Filter,
  ArrowRight,
  ArrowUp,
  Info
} from 'lucide-react';
import { QueryParams, QueryStatus, VehicleTrajectory } from '../types';
import { fetchVehicleTrajectory } from '../services/telemetryService';
import TrajectoryMap from '../components/TrajectoryMap';

const TelemetryConsultation: React.FC = () => {
  const [params, setParams] = useState<QueryParams>({
    placa: '',
    startDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    endDate: new Date().toISOString().split('T')[0] // Today
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
      setErrorMsg(err.message || 'Error inesperado al consultar telemetría.');
      setStatus(QueryStatus.ERROR);
      setResult(null);
    }
  };

  const displayedPoints = result 
    ? (showAllPoints ? result.points : result.points.slice(0, 5)) 
    : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consulta de Trayectorias</h1>
          <p className="text-gray-500 text-sm">Validación de recorridos reales mediante conector de telemetría (Capa Gold)</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar reporte
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
            <Filter className="w-4 h-4 mr-2" />
            Filtros avanzados
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Search Panel */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center">
              <Search className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-800">Parámetros de Búsqueda</h3>
            </div>
            
            <form onSubmit={handleSearch} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Truck className="w-4 h-4 mr-1 text-gray-400" />
                  Placa del vehículo <span className="text-red-500 ml-1">*</span>
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                    Fecha Inicial
                  </label>
                  <input 
                    type="date"
                    name="startDate"
                    value={params.startDate}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                    Fecha Final
                  </label>
                  <input 
                    type="date"
                    name="endDate"
                    value={params.endDate}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={status === QueryStatus.LOADING}
                className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all flex items-center justify-center disabled:opacity-50"
              >
                {status === QueryStatus.LOADING ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando conector...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Ejecutar Consulta
                  </>
                )}
              </button>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-700 flex">
                  <Info className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Esta consulta consume datos bajo demanda del conector de telemetría (RN-01).</span>
                </p>
              </div>
            </form>
          </div>

          {/* Business Context Side Card */}
          <div className="mt-6 bg-slate-800 rounded-xl p-5 text-slate-100 shadow-lg">
            <h4 className="font-bold flex items-center mb-3">
              <FileText className="w-5 h-5 mr-2 text-blue-400" />
              Contexto Operativo
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start">
                <ChevronRight className="w-4 h-4 mr-1 text-slate-500 mt-0.5" />
                Validación contra Manifiestos (RNDC).
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-4 h-4 mr-1 text-slate-500 mt-0.5" />
                Correlación de peajes electrónicos (SIGT).
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-4 h-4 mr-1 text-slate-500 mt-0.5" />
                Verificación de tiempos de descanso.
              </li>
            </ul>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          {status === QueryStatus.IDLE && (
            <div className="flex-1 flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-200 rounded-2xl min-h-[500px] p-12 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <MapIcon className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Listo para la consulta</h3>
              <p className="text-gray-500 max-w-sm">Ingrese los datos del vehículo y el rango de fechas para visualizar la trayectoria en el mapa.</p>
            </div>
          )}

          {status === QueryStatus.ERROR && (
            <div className="flex-1 flex flex-col items-center justify-center bg-red-50 border border-red-100 rounded-2xl min-h-[500px] p-12 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-red-900 mb-2">No se pudo obtener información</h3>
              <p className="text-red-700 bg-white px-4 py-2 rounded-lg border border-red-200 shadow-sm">{errorMsg}</p>
              <button 
                onClick={() => setStatus(QueryStatus.IDLE)}
                className="mt-6 text-sm text-red-600 font-semibold hover:underline"
              >
                Intentar con otros parámetros
              </button>
            </div>
          )}

          {status === QueryStatus.SUCCESS && result && (
            <>
              {/* Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Puntos Capturados', value: result.points.length, color: 'text-blue-600' },
                  { label: 'Distancia Est. (km)', value: result.metadata.totalDistance, color: 'text-green-600' },
                  { label: 'Origen', value: result.metadata.origin, color: 'text-gray-900' },
                  { label: 'Destino', value: result.metadata.destination, color: 'text-gray-900' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{stat.label}</p>
                    <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Map Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-[500px] flex flex-col">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                    <h3 className="font-semibold text-gray-800">Visualización de Trayectoria: {result.placa}</h3>
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                    <span>Última señal: {new Date(result.points[result.points.length-1].timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex-1 p-2">
                  <TrajectoryMap points={result.points} />
                </div>
              </div>

              {/* Data Table Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                  <h3 className="font-semibold text-gray-800">Detalle de Geoposicionamiento</h3>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-gray-400">Interoperable JSON (RN-04)</span>
                    <div className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                      Capa Gold
                    </div>
                  </div>
                </div>
                <div className={`overflow-x-auto ${showAllPoints ? 'max-h-96' : ''} transition-all duration-500`}>
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b border-gray-100 font-medium sticky top-0 z-10">
                      <tr>
                        <th className="px-6 py-3">Timestamp</th>
                        <th className="px-6 py-3">Latitud</th>
                        <th className="px-6 py-3">Longitud</th>
                        <th className="px-6 py-3">Velocidad (km/h)</th>
                        <th className="px-6 py-3">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {displayedPoints.map((point, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs">{point.timestamp}</td>
                          <td className="px-6 py-4">{point.lat.toFixed(6)}</td>
                          <td className="px-6 py-4">{point.lng.toFixed(6)}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${point.speed > 80 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                              {point.speed.toFixed(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-green-600 font-medium flex items-center">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                              Válido
                            </span>
                          </td>
                        </tr>
                      ))}
                      {!showAllPoints && result.points.length > 5 && (
                        <tr className="bg-gray-50/50">
                          <td colSpan={5} className="px-6 py-3 text-center text-gray-400 italic">
                            ... mostrando 5 de {result.points.length} puntos capturados ...
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-gray-100 text-center">
                  <button 
                    onClick={() => setShowAllPoints(!showAllPoints)}
                    className="text-blue-600 text-xs font-bold uppercase tracking-wider hover:text-blue-800 flex items-center mx-auto transition-all"
                  >
                    {showAllPoints ? (
                      <>
                        Contraer registro
                        <ArrowUp className="w-3 h-3 ml-2" />
                      </>
                    ) : (
                      <>
                        Ver registro completo ({result.points.length} puntos)
                        <ArrowRight className="w-3 h-3 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TelemetryConsultation;
