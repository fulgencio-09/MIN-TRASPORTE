
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  ChevronDown, 
  ChevronRight, 
  Activity, 
  Truck, 
  Menu,
  X,
  Database,
  Search
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    'consulta-monitoreo': true
  });

  const toggleMenu = (key: string) => {
    setExpandedMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const menuItems = [
    {
      id: 'consulta-monitoreo',
      label: 'Consulta y Monitoreo',
      icon: <Search className="w-5 h-5" />,
      children: [
        { id: 'trayectorias', label: 'Trayectorias Vehiculares', path: '/consulta-monitoreo/trayectorias', icon: <Map className="w-4 h-4" /> },
        { id: 'estado-flota', label: 'Estado de Flota', path: '/consulta-monitoreo/flota', icon: <Truck className="w-4 h-4" /> },
        { id: 'rendimiento', label: 'Rendimiento Operativo', path: '/consulta-monitoreo/rendimiento', icon: <Activity className="w-4 h-4" /> },
      ]
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: <Database className="w-5 h-5" />,
      children: [
        { id: 'dispositivos', label: 'Gestión Dispositivos', path: '/config/devices' },
        { id: 'alertas', label: 'Reglas de Alerta', path: '/config/alerts' },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-md shadow-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      <aside 
        className={`${
          isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0'
        } fixed inset-y-0 left-0 z-40 transition-all duration-300 bg-slate-900 text-slate-300 border-r border-slate-800 md:relative md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">SINITT</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="md:hidden">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Navegación Principal
            </div>
            
            <ul className="space-y-1">
              <li>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                      isActive ? 'bg-blue-600/10 text-blue-400 border-r-4 border-blue-600' : 'hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <LayoutDashboard className="w-5 h-5 mr-3" />
                  Dashboard General
                </NavLink>
              </li>

              {menuItems.map(item => (
                <li key={item.id}>
                  <button 
                    onClick={() => toggleMenu(item.id)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </div>
                    {expandedMenus[item.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  
                  {expandedMenus[item.id] && (
                    <ul className="bg-slate-950/50 py-1">
                      {item.children.map(child => (
                        <li key={child.id}>
                          <NavLink 
                            to={child.path}
                            className={({ isActive }) => 
                              `flex items-center pl-12 pr-4 py-2 text-sm font-medium transition-colors ${
                                isActive ? 'text-blue-400 bg-blue-600/5' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                              }`
                            }
                          >
                            {child.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                AO
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Analista ORE</p>
                <p className="text-xs text-slate-500 truncate">Logística SINITT</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
