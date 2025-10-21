import { STATUS_COLORS, STATUS_TEXTS, CALENDAR_COLORS, DEFAULTS, DATE_LOCALE } from '../../constants/appointments';

/**
 * Obtiene clases CSS según status (línea 61-70 del original)
 * @param {string} status - Estado de la cita
 * @returns {string} Clases CSS de Tailwind
 */
export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || STATUS_COLORS.pending;
};

/**
 * Obtiene texto traducido según status (línea 72-81 del original)
 * @param {string} status - Estado de la cita
 * @returns {string} Texto en español
 */
export const getStatusText = (status) => {
  return STATUS_TEXTS[status] || status;
};

/**
 * Obtiene color de calendario según status (líneas 293-296 del original)
 * @param {string} status - Estado de la cita
 * @returns {string} Clase CSS de color para calendario
 */
export const getCalendarColor = (status) => {
  return CALENDAR_COLORS[status] || CALENDAR_COLORS.cancelled;
};

/**
 * Formatea lista de servicios (líneas 395, 590 del original)
 * @param {Array} services - Array de IDs de servicios
 * @returns {string} String formateado de servicios
 */
export const formatServices = (services) => {
  return services?.map(s => `Servicio ${s}`).join(', ') || DEFAULTS.SERVICE_NAME;
};

/**
 * Formatea fecha larga en español (líneas 368-373, 540-545 del original)
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} Fecha formateada: "lunes, 15 de enero de 2024"
 */
export const formatLongDate = (dateString) => {
  return new Date(dateString).toLocaleDateString(DATE_LOCALE, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formatea fecha corta (línea 466 del original)
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} Fecha formateada: "15/01/2024"
 */
export const formatShortDate = (dateString) => {
  return new Date(dateString).toLocaleDateString(DATE_LOCALE);
};

/**
 * Formatea mes y año para header (línea 241 del original)
 * @param {Date} date - Fecha
 * @returns {string} Mes y año formateado: "enero 2024"
 */
export const formatMonthYear = (date) => {
  return date.toLocaleDateString(DATE_LOCALE, { month: 'long', year: 'numeric' });
};
