
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TelemetryConsultation from './pages/TelemetryConsultation';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <HashRouter>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 overflow-hidden transition-all duration-300">
          <Header />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Routes>
              <Route path="/consulta-monitoreo/trayectorias" element={<TelemetryConsultation />} />
              {/* Default redirect to our main feature */}
              <Route path="*" element={<Navigate to="/consulta-monitoreo/trayectorias" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
