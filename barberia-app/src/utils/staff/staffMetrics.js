import { DAYS_PER_MONTH } from '../../constants/staff';

/**
 * Calcula el promedio de servicios por barbero
 * @param {number} totalServices - Total de servicios
 * @param {number} totalBarbers - Total de barberos
 * @returns {number} Promedio de servicios
 */
export const calculateAvgServicesPerBarber = (totalServices, totalBarbers) => {
  if (totalBarbers === 0) return 0;
  return Math.round(totalServices / totalBarbers);
};

/**
 * Calcula servicios por día (asumiendo 30 días)
 * @param {number} totalServices - Total de servicios
 * @returns {number} Servicios por día
 */
export const calculateServicesPerDay = (totalServices) => {
  return Math.round(totalServices / DAYS_PER_MONTH);
};

/**
 * Calcula eficiencia (servicios/día/barbero)
 * @param {number} totalServices - Total de servicios
 * @param {number} totalBarbers - Total de barberos
 * @returns {number} Eficiencia
 */
export const calculateEfficiency = (totalServices, totalBarbers) => {
  if (totalBarbers === 0) return 0;
  return Math.round((totalServices / totalBarbers) / DAYS_PER_MONTH);
};

/**
 * Formatea ingresos en formato K (miles)
 * @param {number} value - Valor a formatear
 * @returns {string} Valor formateado (ej: "5.2K")
 */
export const formatEarningsK = (value) => {
  return `S/${(value / 1000).toFixed(1)}K`;
};

/**
 * Obtiene el barbero con más servicios
 * @param {Array} barbers - Array de barberos
 * @returns {number} Total de servicios del mejor barbero
 */
export const getBestBarberServices = (barbers) => {
  if (barbers.length === 0) return 0;
  const sorted = [...barbers].sort((a, b) => b.totalServices - a.totalServices);
  return sorted[0]?.totalServices || 0;
};

/**
 * Filtra barberos activos
 * @param {Array} barbers - Array de barberos
 * @returns {Array} Barberos con status 'active'
 */
export const getActiveBarbers = (barbers) => {
  return barbers.filter(b => b.status === 'active');
};

/**
 * Cuenta barberos presentes
 * @param {Array} barbers - Array de barberos
 * @returns {number} Cantidad de barberos presentes
 */
export const getPresentBarbers = (barbers) => {
  return barbers.filter(b => b.isPresent).length;
};
