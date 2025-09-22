import { USER_ROLES, APPOINTMENTS_PAGE_BY_ROLE } from '../constants/appConfig';

// Función para determinar la página de appointments según el rol del usuario
export const getAppointmentsPageByRole = (userRole) => {
  return APPOINTMENTS_PAGE_BY_ROLE[userRole] || 'Appointments';
};

// Función para validar si un rol es válido
export const isValidUserRole = (role) => {
  return Object.values(USER_ROLES).includes(role);
};

// Función para inicializar datos con manejo de errores
export const initializeAppData = async (loadingFunctions) => {
  try {
    await Promise.all(loadingFunctions);
    return { success: true, error: null };
  } catch (error) {
    console.error('❌ Error inicializando datos:', error);
    return { success: false, error };
  }
};

// Función para obtener configuración de loading
export const getLoadingConfig = () => {
  return {
    timeout: 5000,
    retryAttempts: 3
  };
};

// Función para validar si el usuario está autenticado y tiene datos válidos
export const validateUserSession = (user, isAuthenticated) => {
  return isAuthenticated && user && isValidUserRole(user.role);
};

// Función para determinar la página por defecto según el rol
export const getDefaultPageByRole = (userRole) => {
  // Todos los roles van al dashboard por defecto
  return 'dashboard';
};

// Función para obtener las dependencias de carga de datos
export const getDataLoadingDependencies = (stores) => {
  const {
    loadMockBranches,
    loadMockClients,
    loadMockStaff,
    loadFinancialData,
    loadAppointmentData
  } = stores;

  return [
    loadMockBranches,
    loadMockClients,
    loadMockStaff,
    loadFinancialData,
    loadAppointmentData
  ];
};