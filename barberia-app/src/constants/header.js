/**
 * Constantes para el Header
 */

/**
 * Títulos de notificaciones por rol
 */
export const NOTIFICATION_TITLES = {
  super_admin: 'Avisos de Corte',
  branch_admin: 'Notificaciones del Día',
  reception: 'Tareas Pendientes',
  barber: 'Mi Agenda',
  client: 'Mis Citas',
  default: 'Notificaciones'
};

/**
 * Tipos de notificaciones
 */
export const NOTIFICATION_TYPES = {
  CLIENT_WARNING: 'client_warning',
  DAILY_APPOINTMENTS: 'daily_appointments',
  STAFF_ABSENCE: 'staff_absence',
  PENDING_REPORT: 'pending_report',
  PENDING_CONFIRMATIONS: 'pending_confirmations',
  BARBER_SCHEDULE: 'barber_schedule',
  CLIENT_APPOINTMENTS: 'client_appointments'
};

/**
 * Colores de badges por tipo
 */
export const BADGE_COLORS = {
  yellow: 'bg-yellow-100 text-yellow-800',
  primary: 'bg-primary-100 text-primary-800',
  red: 'bg-red-100 text-red-800',
  purple: 'bg-purple-100 text-purple-800',
  orange: 'bg-orange-100 text-orange-800',
  green: 'bg-green-100 text-green-800'
};

/**
 * Mensajes de advertencia para clientes
 */
export const CLIENT_WARNING_MESSAGE = (clientName) =>
  `Hola ${clientName}! Hemos notado que no nos has visitado en un tiempo. ¿Te gustaría agendar una cita? Estamos aquí para ayudarte con tu corte ideal. ¡Te esperamos! 💈`;

/**
 * Tooltips de tema
 */
export const THEME_TOOLTIPS = {
  light: 'Modo claro',
  dark: 'Modo oscuro',
  auto: 'Automático (sistema)'
};

/**
 * Intervalo de actualización de notificaciones (en milisegundos)
 */
export const NOTIFICATION_UPDATE_INTERVAL = 60000; // 1 minuto
