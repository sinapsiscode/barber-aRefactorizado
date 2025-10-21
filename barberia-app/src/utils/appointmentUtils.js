/**
 * Utilidades para manejo de citas
 */

import { FRAUD_KEYWORDS } from '../constants/appointmentConstants';

/**
 * Formatea una fecha a formato legible
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatAppointmentDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formatea el precio en formato peruano
 * @param {number} price - Precio a formatear
 * @returns {string} Precio formateado
 */
export const formatPrice = (price) => {
  return `S/${price?.toLocaleString() || 0}`;
};

/**
 * Detecta si un texto contiene palabras clave de fraude
 * @param {string} text - Texto a analizar
 * @returns {boolean} True si contiene palabras de fraude
 */
export const containsFraudKeywords = (text) => {
  if (!text) return false;

  const lowerText = text.toLowerCase();
  return FRAUD_KEYWORDS.some(keyword => lowerText.includes(keyword));
};

/**
 * Calcula la duración total de servicios
 * @param {Array} services - Array de servicios
 * @returns {number} Duración total en minutos
 */
export const calculateTotalDuration = (services) => {
  if (!services || !Array.isArray(services)) return 0;

  return services.reduce((total, service) => {
    return total + (service.duration || 0);
  }, 0);
};

/**
 * Calcula el precio promedio por servicio
 * @param {number} totalPrice - Precio total
 * @param {number} serviceCount - Cantidad de servicios
 * @returns {number} Precio promedio
 */
export const calculateAverageServicePrice = (totalPrice, serviceCount) => {
  if (!serviceCount || serviceCount === 0) return 0;
  return Math.round(totalPrice / serviceCount);
};

/**
 * Genera el texto de servicios para mostrar
 * @param {Array} services - Array de servicios
 * @returns {string} Texto descriptivo
 */
export const getServicesDisplayText = (services) => {
  if (!services || !Array.isArray(services)) return 'Sin servicios';

  return services.length > 1
    ? `${services.length} servicios`
    : 'Corte';
};
