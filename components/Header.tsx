
import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold text-gray-800">ENTIDAD - Documentación y Consulta</h2>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-4 h-4 text-gray-400" />
          </span>
          <input 
            type="text" 
            placeholder="Buscar en sistema..." 
            className="bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>

        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-gray-200 mx-2"></div>

        <button className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 p-1.5 rounded-full transition-colors">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
