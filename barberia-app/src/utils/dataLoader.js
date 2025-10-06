/**
 * Data Loader Utility
 * Handles loading data from JSON file with error handling
 * Uses native fetch API - no external libraries required
 */

// Cache para evitar múltiples cargas del mismo archivo
let dataCache = null;
let loadingPromise = null;

/**
 * Carga los datos desde el archivo JSON local
 * @returns {Promise<Object>} Los datos parseados del JSON
 * @throws {Error} Si el archivo no existe o está mal formado
 */
export const loadData = async () => {
  // Si ya tenemos datos en cache, los retornamos
  if (dataCache) {
    return dataCache;
  }

  // Si ya hay una carga en progreso, esperamos a que termine
  if (loadingPromise) {
    return loadingPromise;
  }

  // Iniciamos la carga
  loadingPromise = fetchAndParseData();
  
  try {
    dataCache = await loadingPromise;
    return dataCache;
  } catch (error) {
    // Si hay error, limpiamos el promise para poder reintentar
    loadingPromise = null;
    throw error;
  }
};

/**
 * Función interna que hace el fetch y parseo del JSON
 */
const fetchAndParseData = async () => {
  try {
    // Importar el archivo JSON directamente desde src/data/
    const response = await import('../data/data.json');
    
    // El import devuelve un módulo con default export
    const data = response.default || response;
    
    // Validar que tenemos datos
    if (!data) {
      throw new Error('No se pudieron cargar los datos desde data.json');
    }
    
    return data;
  } catch (error) {
    console.error('Error al cargar data.json:', error);
    if (error.message.includes('Cannot find module')) {
      throw new Error('Archivo data.json no encontrado en src/data/data.json');
    } else if (error.name === 'SyntaxError') {
      throw new Error('El archivo data.json contiene JSON mal formado: ' + error.message);
    } else {
      throw error;
    }
  }
};

/**
 * Obtiene una sección específica de los datos
 * @param {string} section - Nombre de la sección (ej: 'users', 'branches')
 * @returns {Promise<any>} La sección solicitada
 * @throws {Error} Si la sección no existe
 */
export const getDataSection = async (section) => {
  try {
    const data = await loadData();
    
    if (!(section in data)) {
      throw new Error(`Sección '${section}' no encontrada en data.json. Secciones disponibles: ${Object.keys(data).join(', ')}`);
    }

    return data[section];
  } catch (error) {
    console.error(`Error cargando sección '${section}':`, error);
    throw error;
  }
};

/**
 * Obtiene múltiples secciones de los datos
 * @param {string[]} sections - Array de nombres de secciones
 * @returns {Promise<Object>} Objeto con las secciones solicitadas
 */
export const getDataSections = async (sections) => {
  try {
    const data = await loadData();
    const result = {};

    for (const section of sections) {
      if (section in data) {
        result[section] = data[section];
      } else {
        console.warn(`Sección '${section}' no encontrada en data.json`);
        result[section] = [];
      }
    }

    return result;
  } catch (error) {
    console.error('Error cargando múltiples secciones:', error);
    throw error;
  }
};

/**
 * Limpia el cache de datos (útil para testing o recarga manual)
 */
export const clearDataCache = () => {
  dataCache = null;
  loadingPromise = null;
};

/**
 * Función de fallback que retorna datos por defecto en caso de error
 * Solo para desarrollo - en producción debería fallar correctamente
 */
export const getFallbackData = (section) => {
  const fallbackData = {
    users: [],
    branches: [],
    countries: [],
    staff: [],
    clients: [],
    services: [],
    paymentMethods: [
      { id: 'cash', name: 'Efectivo', icon: 'cash' }
    ],
    categories: {
      income: [
        { id: 'services', name: 'Servicios', icon: 'scissors' }
      ],
      expense: [
        { id: 'other_expense', name: 'Otros Gastos', icon: 'minus' }
      ]
    }
  };

  return fallbackData[section] || [];
};

/**
 * Obtiene datos con fallback automático en caso de error
 * @param {string} section - Nombre de la sección
 * @param {boolean} useFallback - Si usar datos de fallback en caso de error
 * @returns {Promise<any>} Los datos solicitados
 */
export const getDataWithFallback = async (section, useFallback = false) => {
  try {
    return await getDataSection(section);
  } catch (error) {
    console.error(`Error cargando ${section}, ${useFallback ? 'usando fallback' : 'propagando error'}:`, error);
    
    if (useFallback) {
      return getFallbackData(section);
    } else {
      throw error;
    }
  }
};