/**
 * API Service Layer - Centraliza todas las llamadas HTTP al backend
 *
 * Configuración:
 * - Base URL: http://localhost:4341
 * - Backend con JSON Server + middlewares de autenticación
 * - Sistema de permisos por rol
 * - Headers de autenticación automáticos
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

/**
 * Clase de error personalizada para la API
 */
class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Obtiene los headers de autenticación desde localStorage
 */
function getAuthHeaders() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const headers = {};

  if (user.roleId) {
    headers['x-role-id'] = user.roleId.toString();
  }

  if (user.id) {
    headers['x-user-id'] = user.id.toString();
  }

  return headers;
}

/**
 * Wrapper para fetch con manejo de errores y configuración común
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    ...getAuthHeaders(), // Agregar headers de autenticación automáticamente
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // Si la respuesta no es OK, lanzar error
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP Error: ${response.status}`,
        response.status,
        errorData
      );
    }

    // Si es DELETE exitoso sin contenido, retornar null
    if (response.status === 204) {
      return null;
    }

    // Parsear JSON
    return await response.json();
  } catch (error) {
    // Si es ApiError, re-lanzar
    if (error instanceof ApiError) {
      throw error;
    }

    // Si es error de red u otro
    throw new ApiError(
      error.message || 'Error de conexión con el servidor',
      0,
      { originalError: error }
    );
  }
}

/**
 * CRUD genérico para cualquier recurso
 */
const createCrudApi = (resource) => ({
  /**
   * GET /resource - Obtener todos los registros
   * Soporta query params: _page, _limit, _sort, _order, etc.
   */
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/${resource}?${queryString}` : `/${resource}`;
    return apiRequest(endpoint);
  },

  /**
   * GET /resource/:id - Obtener un registro por ID
   */
  getById: (id) => {
    return apiRequest(`/${resource}/${id}`);
  },

  /**
   * POST /resource - Crear un nuevo registro
   */
  create: (data) => {
    return apiRequest(`/${resource}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * PUT /resource/:id - Actualizar un registro completo
   */
  update: (id, data) => {
    return apiRequest(`/${resource}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * PATCH /resource/:id - Actualizar parcialmente un registro
   */
  patch: (id, data) => {
    return apiRequest(`/${resource}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * DELETE /resource/:id - Eliminar un registro
   */
  delete: (id) => {
    return apiRequest(`/${resource}/${id}`, {
      method: 'DELETE',
    });
  },
});

/**
 * API para cada recurso (nombres en español según backend)
 */
// ✅ FIXED: Cambiado a inglés para coincidir con db.json
export const usuariosApi = createCrudApi('users');
export const clientesApi = createCrudApi('clients');
export const sucursalesApi = createCrudApi('branches');
export const barberosApi = createCrudApi('barbers');
export const serviciosApi = createCrudApi('services');
export const citasApi = createCrudApi('appointments');
export const recompensasApi = createCrudApi('loyaltyRewards');
export const transaccionesPuntosApi = createCrudApi('pointsTransactions');
export const recompensasClienteApi = createCrudApi('clientRewards');
export const portfolioApi = createCrudApi('portfolio');
export const transaccionesApi = createCrudApi('transactions');
export const asistenciasApi = createCrudApi('attendance');
export const reviewsApi = createCrudApi('reviews');
export const rolesApi = createCrudApi('roles');
export const modulosApi = createCrudApi('modules');

/**
 * API de autenticación (usa endpoint personalizado del backend)
 */
export const authApi = {
  /**
   * Login usando el endpoint /login del backend
   */
  login: async (email, password) => {
    try {
      const response = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.success) {
        // Guardar usuario en localStorage para headers automáticos
        const userData = {
          ...response.data.usuario,
          roleId: response.data.rol.id,
          roleName: response.data.rol.nombre,
          roleSlug: response.data.rol.slug,
          role: response.data.rol.slug, // Agregar 'role' para compatibilidad con Dashboard
          permissions: response.data.rol.permisos,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }

      throw new ApiError('Login fallido', 401, response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Registro usando el endpoint /register del backend
   */
  register: async (userData) => {
    try {
      const response = await apiRequest('/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (response.success) {
        return response.data;
      }

      throw new ApiError('Registro fallido', 400, response);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout (limpia localStorage)
   */
  logout: () => {
    localStorage.removeItem('user');
  },

  /**
   * Obtener usuario actual desde localStorage
   */
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

/**
 * API extendida para clientes con filtros comunes
 */
export const clientesApiExtended = {
  ...clientesApi,

  getByBranch: (branchId) => {
    return apiRequest(`/clients?preferredBranch=${branchId}`);
  },

  getActive: () => {
    return apiRequest(`/clients?status=active`);
  },

  search: (query) => {
    return apiRequest(`/clients?name_like=${query}`);
  },
};

/**
 * API extendida para barberos
 */
export const barberosApiExtended = {
  ...barberosApi,

  getByBranch: (branchId) => {
    return apiRequest(`/barbers?branchId=${branchId}`);
  },

  getActive: () => {
    return apiRequest(`/barbers?status=active`);
  },
};

/**
 * API extendida para citas con filtros avanzados
 */
export const citasApiExtended = {
  ...citasApi,

  getByDate: (date) => {
    return apiRequest(`/appointments?date=${date}`);
  },

  getByBarber: (barberId) => {
    return apiRequest(`/appointments?barberId=${barberId}`);
  },

  getByClient: (clientId) => {
    return apiRequest(`/appointments?clientId=${clientId}`);
  },

  getByBranch: (branchId) => {
    return apiRequest(`/appointments?branchId=${branchId}`);
  },

  getByStatus: (status) => {
    return apiRequest(`/appointments?status=${status}`);
  },
};

/**
 * API extendida para portfolio
 */
export const portfolioApiExtended = {
  ...portfolioApi,

  getByCategory: (category) => {
    return apiRequest(`/portfolio?category=${category}`);
  },

  getByBarber: (barberId) => {
    return apiRequest(`/portfolio?barberId=${barberId}`);
  },

  getByBranch: (branchId) => {
    return apiRequest(`/portfolio?branchId=${branchId}`);
  },
};

/**
 * API para roles y permisos
 */
export const rolesApiExtended = {
  ...rolesApi,

  getPermissions: (roleId) => {
    return apiRequest(`/roles/${roleId}/permisos`);
  },
};

/**
 * API para módulos
 */
export const modulosApiExtended = {
  ...modulosApi,

  getAccessibleModules: (roleId) => {
    return apiRequest(`/modulos/accesibles/${roleId}`);
  },
};

/**
 * API para estadísticas
 */
export const estadisticasApi = {
  getStats: () => {
    return apiRequest('/estadisticas');
  },
};

/**
 * APIs para DATOS MAESTROS (configuración)
 */

// Métodos de Pago
export const metodosPagoApi = createCrudApi('metodosPago');

// Categorías de Ingresos
export const categoriasIngresosApi = createCrudApi('categoriasIngresos');

// Categorías de Gastos
export const categoriasGastosApi = createCrudApi('categoriasGastos');

// Precios por Sucursal
export const preciosSucursalApi = createCrudApi('preciosSucursal');

// API extendida para precios por sucursal
export const preciosSucursalApiExtended = {
  ...preciosSucursalApi,

  // Obtener precio de un servicio en una sucursal
  getByServiceAndBranch: async (servicioId, sucursalId) => {
    const result = await apiRequest(`/preciosSucursal?servicioId=${servicioId}&sucursalId=${sucursalId}`);
    return result[0] || null; // Retornar el primer resultado o null
  },

  // Obtener todos los precios de una sucursal
  getByBranch: (sucursalId) => {
    return apiRequest(`/preciosSucursal?sucursalId=${sucursalId}`);
  },

  // Obtener todos los precios de un servicio
  getByService: (servicioId) => {
    return apiRequest(`/preciosSucursal?servicioId=${servicioId}`);
  },
};

/**
 * API para Configuración de Lealtad
 * (datos anidados en db.json bajo "configuracion")
 */

// Niveles de Lealtad
export const nivelesLealtadApi = {
  // Obtener todos los niveles
  getAll: () => {
    return apiRequest('/configuracion/nivelesLealtad');
  },

  // Obtener un nivel por ID
  getById: (id) => {
    return apiRequest(`/configuracion/nivelesLealtad/${id}`);
  },

  // Actualizar un nivel (PATCH al objeto completo de configuracion)
  // Nota: JSON Server no soporta PATCH en subarrays, necesitaríamos endpoint custom
  // Por ahora usaremos GET + modificación local + PUT completo
};

// Settings de Puntos
export const puntosSettingsApi = {
  // Obtener configuración de puntos
  get: () => {
    return apiRequest('/configuracion/puntosSettings');
  },

  // Actualizar configuración de puntos
  // Nota: Similar a niveles, necesitaría endpoint custom o PATCH del objeto configuracion completo
};

/**
 * Health check del servidor
 */
export const healthCheck = async () => {
  try {
    const response = await apiRequest('/health');
    return { status: 'ok', message: 'Backend conectado', data: response };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
};

/**
 * Exportar la función base por si se necesita customización
 */
export { apiRequest, ApiError };

/**
 * Default export con todas las APIs
 */
export default {
  // Recursos básicos
  usuarios: usuariosApi,
  clientes: clientesApiExtended,
  sucursales: sucursalesApi,
  barberos: barberosApiExtended,
  servicios: serviciosApi,
  citas: citasApiExtended,
  recompensas: recompensasApi,
  transaccionesPuntos: transaccionesPuntosApi,
  recompensasCliente: recompensasClienteApi,
  portfolio: portfolioApiExtended,
  transacciones: transaccionesApi,
  asistencias: asistenciasApi,
  reviews: reviewsApi,
  roles: rolesApiExtended,
  modulos: modulosApiExtended,
  estadisticas: estadisticasApi,

  // Datos Maestros
  metodosPago: metodosPagoApi,
  categoriasIngresos: categoriasIngresosApi,
  categoriasGastos: categoriasGastosApi,
  preciosSucursal: preciosSucursalApiExtended,
  nivelesLealtad: nivelesLealtadApi,
  puntosSettings: puntosSettingsApi,

  // Auth
  auth: authApi,

  // Utils
  healthCheck,
};
