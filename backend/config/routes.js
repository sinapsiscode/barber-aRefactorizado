/**
 * Configuración centralizada de rutas del backend
 *
 * Este archivo define todas las rutas disponibles en el sistema
 * para evitar hardcodear strings en múltiples lugares
 */

/**
 * Rutas de autenticación
 */
const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout'
};

/**
 * Rutas de recursos REST
 */
const RESOURCE_ROUTES = {
  // Gestión de usuarios y roles
  USUARIOS: '/usuarios',
  ROLES: '/roles',
  MODULOS: '/modulos',

  // Recursos principales
  CLIENTES: '/clientes',
  BARBEROS: '/barberos',
  CITAS: '/citas',
  SUCURSALES: '/sucursales',

  // Servicios y portfolio
  SERVICIOS: '/servicios',
  PORTFOLIO: '/portfolio',

  // Sistema de lealtad
  RECOMPENSAS: '/recompensas',
  TRANSACCIONES_PUNTOS: '/transaccionesPuntos',
  RECOMPENSAS_CLIENTE: '/recompensasCliente',

  // Financiero
  TRANSACCIONES: '/transacciones',
  CATEGORIAS_INGRESOS: '/categoriasIngresos',
  CATEGORIAS_GASTOS: '/categoriasGastos',
  METODOS_PAGO: '/metodosPago',

  // Personal
  ASISTENCIAS: '/asistencias',
  REVIEWS: '/reviews',

  // Configuración
  CONFIGURACION: '/configuracion',
  PRECIOS_SUCURSAL: '/preciosSucursal'
};

/**
 * Rutas especiales/custom
 */
const SPECIAL_ROUTES = {
  HEALTH: '/health',
  ESTADISTICAS: '/estadisticas',
  NIVELES_LEALTAD: '/configuracion/nivelesLealtad',
  PUNTOS_SETTINGS: '/configuracion/puntosSettings',
  MODULOS_ACCESIBLES: '/modulos/accesibles'
};

/**
 * Rutas públicas (no requieren autenticación)
 */
const PUBLIC_ROUTES = [
  AUTH_ROUTES.LOGIN,
  AUTH_ROUTES.REGISTER,
  SPECIAL_ROUTES.HEALTH,
  RESOURCE_ROUTES.BARBEROS,
  RESOURCE_ROUTES.SUCURSALES,
  RESOURCE_ROUTES.SERVICIOS,
  RESOURCE_ROUTES.PORTFOLIO,
  RESOURCE_ROUTES.REVIEWS
];

/**
 * Obtiene el nombre del recurso desde una ruta
 * @param {string} path - Ruta completa (ej: '/barberos/1')
 * @returns {string|null} - Nombre del recurso (ej: 'barberos') o null
 */
function getResourceNameFromPath(path) {
  // Eliminar query params
  const cleanPath = path.split('?')[0];

  // Eliminar slash inicial
  const parts = cleanPath.substring(1).split('/');

  // El recurso es el primer segmento
  return parts[0] || null;
}

/**
 * Verifica si una ruta es pública
 * @param {string} path - Path de la request
 * @param {string} method - Método HTTP
 * @returns {boolean}
 */
function isPublicRoute(path, method) {
  // Eliminar query params
  const cleanPath = path.split('?')[0];

  // Login, register y health siempre públicos
  if (cleanPath === AUTH_ROUTES.LOGIN ||
      cleanPath === AUTH_ROUTES.REGISTER ||
      cleanPath === SPECIAL_ROUTES.HEALTH) {
    return true;
  }

  // Solo permitir GET en rutas públicas
  if (method !== 'GET') {
    return false;
  }

  // Verificar si la ruta empieza con alguna de las rutas públicas
  // Esto permite /barberos, /barberos/1, /barberos?sucursalId=1, etc.
  for (const publicRoute of PUBLIC_ROUTES) {
    if (cleanPath === publicRoute || cleanPath.startsWith(publicRoute + '/')) {
      return true;
    }
  }

  return false;
}

/**
 * Construye una URL completa del recurso
 * @param {string} resource - Nombre del recurso
 * @param {string|number} id - ID opcional del recurso
 * @param {object} params - Query params opcionales
 * @returns {string}
 */
function buildResourceUrl(resource, id = null, params = {}) {
  let url = resource;

  if (id) {
    url += `/${id}`;
  }

  const queryString = new URLSearchParams(params).toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  return url;
}

module.exports = {
  AUTH_ROUTES,
  RESOURCE_ROUTES,
  SPECIAL_ROUTES,
  PUBLIC_ROUTES,
  getResourceNameFromPath,
  isPublicRoute,
  buildResourceUrl
};
