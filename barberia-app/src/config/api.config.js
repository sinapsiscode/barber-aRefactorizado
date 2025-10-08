/**
 * Configuración centralizada del API
 */

export const API_CONFIG = {
  // URL base del backend
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',

  // Timeout para las requests (10 segundos)
  timeout: 10000,

  // Headers por defecto
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Endpoints del API
 */
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',

  // Usuarios
  USERS: '/usuarios',
  USER_BY_ID: (id) => `/usuarios/${id}`,

  // Clientes
  CLIENTS: '/clientes',
  CLIENT_BY_ID: (id) => `/clientes/${id}`,

  // Barberos
  BARBERS: '/barberos',
  BARBER_BY_ID: (id) => `/barberos/${id}`,

  // Citas
  APPOINTMENTS: '/citas',
  APPOINTMENT_BY_ID: (id) => `/citas/${id}`,

  // Sucursales
  BRANCHES: '/sucursales',
  BRANCH_BY_ID: (id) => `/sucursales/${id}`,

  // Servicios
  SERVICES: '/servicios',
  SERVICE_BY_ID: (id) => `/servicios/${id}`,

  // Portfolio
  PORTFOLIO: '/portfolio',
  PORTFOLIO_BY_ID: (id) => `/portfolio/${id}`,

  // Transacciones
  TRANSACTIONS: '/transacciones',
  TRANSACTION_BY_ID: (id) => `/transacciones/${id}`,

  // Recompensas
  REWARDS: '/recompensas',
  REWARD_BY_ID: (id) => `/recompensas/${id}`,

  // Reviews
  REVIEWS: '/reviews',
  REVIEW_BY_ID: (id) => `/reviews/${id}`,

  // Roles
  ROLES: '/roles',
  ROLE_BY_ID: (id) => `/roles/${id}`,
  ROLE_PERMISSIONS: (id) => `/roles/${id}/permisos`,

  // Módulos
  MODULES: '/modulos',
  ACCESSIBLE_MODULES: (roleId) => `/modulos/accesibles/${roleId}`,

  // Estadísticas
  STATS: '/estadisticas',

  // Health
  HEALTH: '/health',
};

/**
 * Códigos de estado HTTP
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

export default API_CONFIG;
