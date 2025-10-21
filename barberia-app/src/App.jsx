import { useState, useEffect } from 'react';
import { useAuthStore, useBranchStore, useClientStore, useStaffStore, useFinancialStore, useAppointmentStore, useLoyaltyStore } from './stores';
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
import LandingPage from './pages/LandingPage';
import PublicBooking from './pages/PublicBooking';

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
  const { isAuthenticated, user, logout } = useAuthStore();
  const { loadBranches } = useBranchStore();
  const { loadClients } = useClientStore();
  const { loadStaff } = useStaffStore();
  const { loadMockData: loadFinancialData } = useFinancialStore();
  const { loadMockData: loadAppointmentData } = useAppointmentStore();
  const { loadLoyaltyLevels, loadLoyaltySettings } = useLoyaltyStore();
  // TODO REFACTOR: Reemplazar con React Router
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showLoginFromLanding, setShowLoginFromLanding] = useState(false);
  const [showPublicBooking, setShowPublicBooking] = useState(false);

  // 🔧 FIX: Validar y limpiar datos antiguos de localStorage incompatibles con backend
  useEffect(() => {
    if (isAuthenticated && user) {
      // Si el usuario no tiene el campo 'role' o 'roleSlug', es un dato antiguo
      if (!user.role && !user.roleSlug) {
        console.warn('⚠️ Datos de usuario antiguos detectados. Limpiando localStorage...');
        logout();
        // Limpiar todos los stores persistidos
        const keysToRemove = Object.keys(localStorage).filter(key =>
          key.includes('-storage') || key === 'user'
        );
        keysToRemove.forEach(key => localStorage.removeItem(key));
        window.location.reload();
      }
    }
  }, [isAuthenticated, user]);

  // Sistema de recordatorios automático
  useReminders();

  // Función para navegar desde landing page al login
  const handleNavigateToLogin = () => {
    setShowLoginFromLanding(true);
  };

  // Función para navegar desde landing page a reservas públicas
  const handleNavigateToBooking = () => {
    setShowPublicBooking(true);
  };

  // Función para volver desde reservas públicas a landing
  const handleBackToLanding = () => {
    setShowPublicBooking(false);
    setShowLoginFromLanding(false);
  };

  // Cargar datos SOLO si el usuario está autenticado
  useEffect(() => {
    // ✅ FIX: Solo cargar datos si hay usuario autenticado
    if (!isAuthenticated || !user) {
      console.log('⏭️ Esperando login para cargar datos...');
      return;
    }

    const initializeData = async () => {
      try {
        console.log('📡 Cargando datos desde API...');

        // Datos que TODOS los roles necesitan
        const commonDataPromises = [
          loadBranches(),
          loadAppointmentData(),
          loadLoyaltyLevels(),
          loadLoyaltySettings()
        ];

        // Datos adicionales según rol
        const roleSpecificPromises = [];

        // Solo admins y recepción cargan lista completa de clientes y staff
        if (['super_admin', 'branch_admin', 'reception'].includes(user.roleSlug || user.role)) {
          roleSpecificPromises.push(loadClients());
          roleSpecificPromises.push(loadStaff());
        }

        // Solo admins cargan datos financieros
        if (['super_admin', 'branch_admin'].includes(user.roleSlug || user.role)) {
          roleSpecificPromises.push(loadFinancialData());
        }

        // Barberos cargan solo su información de staff y datos de clientes (filtrados por backend)
        if ((user.roleSlug || user.role) === 'barber') {
          roleSpecificPromises.push(loadStaff());
          roleSpecificPromises.push(loadClients()); // Necesario para ver info de clientes en citas
        }

        // Clientes cargan su propia información y barberos disponibles
        if ((user.roleSlug || user.role) === 'client') {
          roleSpecificPromises.push(loadClients()); // Backend filtrará solo su info
          roleSpecificPromises.push(loadStaff()); // Para ver barberos disponibles
        }

        await Promise.all([...commonDataPromises, ...roleSpecificPromises]);
        console.log('✅ Datos cargados desde JSON Server exitosamente');
      } catch (error) {
        console.error('❌ Error inicializando datos:', error);
      }
    };

    initializeData();
  }, [isAuthenticated, user, loadBranches, loadClients, loadStaff, loadFinancialData, loadAppointmentData, loadLoyaltyLevels, loadLoyaltySettings]);

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
        if (user?.role === 'reception') return <Appointments />; // Usar la misma página con lógica especial para recepción
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

  // Si se solicita mostrar la página de reservas públicas
  if (showPublicBooking) {
    return <PublicBooking onBackToLanding={handleBackToLanding} />;
  }

  return (
    <ProtectedRoute
      showLandingFirst={!showLoginFromLanding}
      onNavigateToLogin={handleNavigateToLogin}
      onNavigateToBooking={handleNavigateToBooking}
    >
      {isAuthenticated ? (
        <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
          {renderPage()}
        </Layout>
      ) : null}
    </ProtectedRoute>
  );
}

export default App;