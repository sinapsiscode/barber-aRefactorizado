import { useState, useEffect } from 'react';
import { useAuthStore, useBranchStore, useClientStore, useStaffStore, useFinancialStore, useAppointmentStore } from './stores';
import { useReminders } from './hooks/useReminders';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import ClientAppointments from './pages/ClientAppointments';
import BarberAppointments from './pages/BarberAppointments';
import ReceptionCalendar from './pages/ReceptionCalendar';
import Portfolio from './pages/Portfolio';
import Financial from './pages/Financial';
import Staff from './pages/Staff';
import Clients from './pages/Clients';
import Services from './pages/Services';
import Settings from './pages/Settings';

/**
 * TODO REFACTOR - ROUTING CRÍTICO (Prioridad: ALTA después del release)
 * 
 * PROBLEMAS IDENTIFICADOS:
 * 1. 🚫 SIN REACT ROUTER: Routing manual con useState (línea ~19)
 * 2. 📍 SIN URLs: No hay rutas reales, no funciona botón atrás
 * 3. 🔗 SIN DEEP LINKING: No se pueden compartir URLs específicas
 * 4. 📱 SIN NAVEGACIÓN: Historial de navegador no funciona
 * 5. 🎯 LÓGICA COMPLEJA: Switch gigante difícil de mantener (línea ~22)
 * 
 * PLAN DE REFACTOR:
 * - npm install react-router-dom
 * - Crear src/router/index.js
 * - Implementar rutas: /dashboard, /appointments, /clients, etc.
 * - Mover lógica de roles a route guards
 * - Agregar breadcrumbs y navegación proper
 */

function App() {
  const { isAuthenticated, user } = useAuthStore();
  const { loadMockBranches } = useBranchStore();
  const { loadMockClients } = useClientStore();
  const { loadMockStaff } = useStaffStore();
  const { loadMockData: loadFinancialData } = useFinancialStore();
  const { loadMockData: loadAppointmentData } = useAppointmentStore();
  // TODO REFACTOR: Reemplazar con React Router
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // Sistema de recordatorios automático
  useReminders();

  // Cargar datos mock al inicializar la app - REFACTORED: desde JSON
  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([
          loadMockBranches(),
          loadMockClients(),
          loadMockStaff(),
          loadFinancialData(),
          loadAppointmentData()
        ]);
        console.log('✅ Datos cargados desde JSON exitosamente');
      } catch (error) {
        console.error('❌ Error inicializando datos:', error);
      }
    };
    
    initializeData();
  }, [loadMockBranches, loadMockClients, loadMockStaff, loadFinancialData, loadAppointmentData]);

  // TODO REFACTOR: Reemplazar con <Routes><Route></Routes>
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'appointments':
        // TODO REFACTOR: Mover lógica de roles a route guards
        // Ejemplo: /appointments/client, /appointments/barber, etc.
        if (user?.role === 'client') return <ClientAppointments />;
        if (user?.role === 'barber') return <BarberAppointments />;
        if (user?.role === 'reception') return <ReceptionCalendar />;
        return <Appointments />;
      case 'financial':
        return <Financial />;
      case 'staff':
        return <Staff />;
      case 'clients':
        return <Clients />;
      case 'services':
        return <Services />;
      case 'portfolio':
        return <Portfolio />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ProtectedRoute>
      {isAuthenticated ? (
        <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
          {renderPage()}
        </Layout>
      ) : null}
    </ProtectedRoute>
  );
}

export default App;