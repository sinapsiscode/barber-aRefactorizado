/**
 * Configuración centralizada de rutas del frontend
 *
 * Este archivo define todas las rutas de la API
 * para evitar hardcodear strings en múltiples lugares
 */

/**
 * Rutas de autenticación
 */
export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout'
};

/**
 * Rutas de recursos REST
 */
export const RESOURCE_ROUTES = {
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
export const SPECIAL_ROUTES = {
  HEALTH: '/health',
  ESTADISTICAS: '/estadisticas',
  NIVELES_LEALTAD: '/configuracion/nivelesLealtad',
  PUNTOS_SETTINGS: '/configuracion/puntosSettings',
  MODULOS_ACCESIBLES: '/modulos/accesibles'
};

/**
 * Construye una URL completa del recurso
 * @param {string} resource - Ruta del recurso
 * @param {string|number} id - ID opcional del recurso
 * @param {object} params - Query params opcionales
 * @returns {string}
 */
export function buildResourceUrl(resource, id = null, params = {}) {
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

/**
 * Objeto con todos los endpoints disponibles
 */
export const API_ENDPOINTS = {
  ...AUTH_ROUTES,
  ...RESOURCE_ROUTES,
  ...SPECIAL_ROUTES
};

export default {
  AUTH_ROUTES,
  RESOURCE_ROUTES,
  SPECIAL_ROUTES,
  API_ENDPOINTS,
  buildResourceUrl
};
