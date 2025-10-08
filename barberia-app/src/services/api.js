/**
 * API Service Layer - Centraliza todas las llamadas HTTP al backend
 *
 * Configuración:
 * - Base URL: http://localhost:3001
 * - Backend con JSON Server + middlewares de autenticación
 * - Sistema de permisos por rol
 * - Headers de autenticación automáticos
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
export const usuariosApi = createCrudApi('usuarios');
export const clientesApi = createCrudApi('clientes');
export const sucursalesApi = createCrudApi('sucursales');
export const barberosApi = createCrudApi('barberos');
export const serviciosApi = createCrudApi('servicios');
export const citasApi = createCrudApi('citas');
export const recompensasApi = createCrudApi('recompensas');
export const transaccionesPuntosApi = createCrudApi('transaccionesPuntos');
export const recompensasClienteApi = createCrudApi('recompensasCliente');
export const portfolioApi = createCrudApi('portfolio');
export const transaccionesApi = createCrudApi('transacciones');
export const asistenciasApi = createCrudApi('asistencias');
export const reviewsApi = createCrudApi('reviews');
export const rolesApi = createCrudApi('roles');
export const modulosApi = createCrudApi('modulos');

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
    return apiRequest(`/clientes?sucursalPreferida=${branchId}`);
  },

  getActive: () => {
    return apiRequest(`/clientes?estado=active`);
  },

  search: (query) => {
    return apiRequest(`/clientes?nombre_like=${query}`);
  },
};

/**
 * API extendida para barberos
 */
export const barberosApiExtended = {
  ...barberosApi,

  getByBranch: (branchId) => {
    return apiRequest(`/barberos?sucursalId=${branchId}`);
  },

  getActive: () => {
    return apiRequest(`/barberos?estado=active`);
  },
};

/**
 * API extendida para citas con filtros avanzados
 */
export const citasApiExtended = {
  ...citasApi,

  getByDate: (date) => {
    return apiRequest(`/citas?fecha=${date}`);
  },

  getByBarber: (barberId) => {
    return apiRequest(`/citas?barberoId=${barberId}`);
  },

  getByClient: (clientId) => {
    return apiRequest(`/citas?clienteId=${clientId}`);
  },

  getByBranch: (branchId) => {
    return apiRequest(`/citas?sucursalId=${branchId}`);
  },

  getByStatus: (status) => {
    return apiRequest(`/citas?estado=${status}`);
  },
};

/**
 * API extendida para portfolio
 */
export const portfolioApiExtended = {
  ...portfolioApi,

  getByCategory: (category) => {
    return apiRequest(`/portfolio?categoria=${category}`);
  },

  getByBarber: (barberId) => {
    return apiRequest(`/portfolio?barberoId=${barberId}`);
  },

  getByBranch: (branchId) => {
    return apiRequest(`/portfolio?sucursalId=${branchId}`);
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

  // Auth
  auth: authApi,

  // Utils
  healthCheck,
};
