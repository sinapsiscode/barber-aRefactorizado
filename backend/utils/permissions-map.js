/**
 * Mapeo de permisos requeridos por endpoint y método HTTP
 *
 * Estructura:
 * {
 *   'recurso': {
 *     'GET': 'permiso_requerido',
 *     'POST': 'permiso_requerido',
 *     'PUT': 'permiso_requerido',
 *     'PATCH': 'permiso_requerido',
 *     'DELETE': 'permiso_requerido'
 *   }
 * }
 */

const permissionsMap = {
  // USUARIOS
  'usuarios': {
    'GET': 'ver_usuarios',
    'POST': 'crear_usuario',
    'PUT': 'editar_usuario',
    'PATCH': 'editar_usuario',
    'DELETE': 'eliminar_usuario'
  },

  // CLIENTES
  'clientes': {
    'GET': 'ver_clientes',
    'POST': 'crear_cliente',
    'PUT': 'editar_cliente',
    'PATCH': 'editar_cliente',
    'DELETE': 'eliminar_cliente'
  },

  // BARBEROS / PERSONAL
  'barberos': {
    'GET': 'ver_barberos',
    'POST': 'crear_barbero',
    'PUT': 'editar_barbero',
    'PATCH': 'editar_barbero',
    'DELETE': 'eliminar_barbero'
  },

  // CITAS
  'citas': {
    'GET': 'ver_citas',
    'POST': 'crear_cita',
    'PUT': 'editar_cita',
    'PATCH': 'editar_cita',
    'DELETE': 'eliminar_cita'
  },

  // SUCURSALES
  'sucursales': {
    'GET': 'ver_sucursales',
    'POST': 'crear_sucursal',
    'PUT': 'editar_sucursal',
    'PATCH': 'editar_sucursal',
    'DELETE': 'eliminar_sucursal'
  },

  // TRANSACCIONES FINANCIERAS
  'transacciones': {
    'GET': 'ver_transacciones',
    'POST': 'crear_transaccion',
    'PUT': 'editar_transaccion',
    'PATCH': 'editar_transaccion',
    'DELETE': 'eliminar_transaccion'
  },

  // SERVICIOS
  'servicios': {
    'GET': 'ver_portfolio', // Todos pueden ver
    'POST': 'crear_portfolio',
    'PUT': 'editar_portfolio',
    'PATCH': 'editar_portfolio',
    'DELETE': 'eliminar_portfolio'
  },

  // PORTFOLIO
  'portfolio': {
    'GET': 'ver_portfolio',
    'POST': 'crear_portfolio',
    'PUT': 'editar_portfolio',
    'PATCH': 'editar_portfolio',
    'DELETE': 'eliminar_portfolio'
  },

  // RECOMPENSAS
  'recompensas': {
    'GET': 'ver_recompensas',
    'POST': 'crear_recompensa',
    'PUT': 'editar_recompensa',
    'PATCH': 'editar_recompensa',
    'DELETE': 'eliminar_recompensa'
  },

  // TRANSACCIONES DE PUNTOS
  'transaccionesPuntos': {
    'GET': 'ver_recompensas',
    'POST': 'crear_recompensa',
    'PUT': 'editar_recompensa',
    'PATCH': 'editar_recompensa',
    'DELETE': 'eliminar_recompensa'
  },

  // RECOMPENSAS DE CLIENTE
  'recompensasCliente': {
    'GET': 'ver_recompensas',
    'POST': 'canjear_recompensa',
    'PUT': 'editar_recompensa',
    'PATCH': 'editar_recompensa',
    'DELETE': 'eliminar_recompensa'
  },

  // REVIEWS
  'reviews': {
    'GET': 'ver_reviews',
    'POST': 'crear_review',
    'PUT': 'responder_review',
    'PATCH': 'responder_review',
    'DELETE': 'eliminar_review'
  },

  // ASISTENCIAS
  'asistencias': {
    'GET': 'ver_barberos',
    'POST': 'crear_barbero',
    'PUT': 'editar_barbero',
    'PATCH': 'editar_barbero',
    'DELETE': 'eliminar_barbero'
  },

  // ROLES (solo lectura para algunos, gestión para admin)
  'roles': {
    'GET': 'ver_usuarios', // Cualquiera que vea usuarios puede ver roles
    'POST': 'gestionar_roles',
    'PUT': 'gestionar_roles',
    'PATCH': 'gestionar_roles',
    'DELETE': 'gestionar_roles'
  },

  // MÓDULOS (solo lectura)
  'modulos': {
    'GET': 'ver_usuarios', // Cualquier usuario puede ver módulos disponibles
    'POST': 'gestionar_permisos',
    'PUT': 'gestionar_permisos',
    'PATCH': 'gestionar_permisos',
    'DELETE': 'gestionar_permisos'
  },

  // CONFIGURACIÓN
  'configuracion': {
    'GET': 'ver_recompensas', // Clientes pueden ver configuración de lealtad
    'PUT': 'gestionar_permisos',
    'PATCH': 'gestionar_permisos'
  }
};

/**
 * Obtiene el permiso requerido para un recurso y método
 * @param {string} resource - Nombre del recurso
 * @param {string} method - Método HTTP
 * @returns {string|null} - Permiso requerido o null si no requiere
 */
function getRequiredPermission(resource, method) {
  const resourceMap = permissionsMap[resource];

  if (!resourceMap) {
    return null; // Recurso no mapeado, permitir por defecto
  }

  return resourceMap[method] || null;
}

/**
 * Rutas públicas que no requieren autenticación ni permisos
 */
const publicRoutes = [
  '/login',
  '/register',
  '/portfolio', // Portfolio público (solo GET)
  '/servicios', // Servicios públicos (solo GET)
  '/sucursales' // Sucursales públicas para vista landing (solo GET)
];

/**
 * Verifica si una ruta es pública
 * @param {string} path - Path de la request
 * @param {string} method - Método HTTP
 * @returns {boolean}
 */
function isPublicRoute(path, method) {
  // Eliminar query params
  const cleanPath = path.split('?')[0];

  // Rutas completamente públicas
  if (publicRoutes.includes(cleanPath) && method === 'GET') {
    return true;
  }

  // Login y register siempre públicos
  if (cleanPath === '/login' || cleanPath === '/register') {
    return true;
  }

  return false;
}

module.exports = {
  permissionsMap,
  getRequiredPermission,
  publicRoutes,
  isPublicRoute
};
