// Configuración de páginas de la aplicación
export const APP_PAGES = {
  DASHBOARD: 'dashboard',
  APPOINTMENTS: 'appointments',
  FINANCIAL: 'financial',
  STAFF: 'staff',
  CLIENTS: 'clients',
  SERVICES: 'services',
  PORTFOLIO: 'portfolio',
  SETTINGS: 'settings'
};

// Configuración de roles
export const USER_ROLES = {
  CLIENT: 'client',
  BARBER: 'barber',
  RECEPTION: 'reception',
  BRANCH_ADMIN: 'branch_admin',
  SUPER_ADMIN: 'super_admin'
};

// Mapeo de páginas por rol para appointments
export const APPOINTMENTS_PAGE_BY_ROLE = {
  [USER_ROLES.CLIENT]: 'ClientAppointments',
  [USER_ROLES.BARBER]: 'BarberAppointments',
  [USER_ROLES.RECEPTION]: 'ReceptionCalendar'
};

// Configuración de inicialización de datos
export const DATA_LOADING_CONFIG = {
  TIMEOUT: 5000, // 5 segundos
  RETRY_ATTEMPTS: 3,
  LOG_SUCCESS: '✅ Datos cargados desde JSON exitosamente',
  LOG_ERROR: '❌ Error inicializando datos:'
};

// Mensajes de TODO para futuras refactorizaciones
export const REFACTOR_TODOS = {
  ROUTING: {
    PRIORITY: 'ALTA después del release',
    PROBLEMS: [
      '🚫 SIN REACT ROUTER: Routing manual con useState',
      '📍 SIN URLs: No hay rutas reales, no funciona botón atrás',
      '🔗 SIN DEEP LINKING: No se pueden compartir URLs específicas',
      '📱 SIN NAVEGACIÓN: Historial de navegador no funciona',
      '🎯 LÓGICA COMPLEJA: Switch gigante difícil de mantener'
    ],
    PLAN: [
      'npm install react-router-dom',
      'Crear src/router/index.js',
      'Implementar rutas: /dashboard, /appointments, /clients, etc.',
      'Mover lógica de roles a route guards',
      'Agregar breadcrumbs y navegación proper'
    ]
  }
};