/**
 * Constantes para el calendario de citas
 */

export const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Estados de las citas
export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Colores por estado (Tailwind classes)
export const STATUS_COLORS = {
  [APPOINTMENT_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [APPOINTMENT_STATUS.CONFIRMED]: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
  [APPOINTMENT_STATUS.IN_PROGRESS]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  [APPOINTMENT_STATUS.COMPLETED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [APPOINTMENT_STATUS.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

// Textos por estado
export const STATUS_TEXTS = {
  [APPOINTMENT_STATUS.PENDING]: 'Pendiente',
  [APPOINTMENT_STATUS.CONFIRMED]: 'Confirmada',
  [APPOINTMENT_STATUS.IN_PROGRESS]: 'En Proceso',
  [APPOINTMENT_STATUS.COMPLETED]: 'Completada',
  [APPOINTMENT_STATUS.CANCELLED]: 'Cancelada'
};

// Leyenda del calendario
export const CALENDAR_LEGEND = [
  { color: 'bg-yellow-200', label: 'Pendiente', status: APPOINTMENT_STATUS.PENDING },
  { color: 'bg-blue-200', label: 'Confirmada', status: APPOINTMENT_STATUS.CONFIRMED },
  { color: 'bg-purple-200', label: 'En Proceso', status: APPOINTMENT_STATUS.IN_PROGRESS },
  { color: 'bg-green-200', label: 'Completada', status: APPOINTMENT_STATUS.COMPLETED }
];

// Mensajes de confirmación
export const CONFIRMATION_MESSAGES = {
  [APPOINTMENT_STATUS.CONFIRMED]: 'confirmada',
  [APPOINTMENT_STATUS.CANCELLED]: 'cancelada',
  [APPOINTMENT_STATUS.COMPLETED]: 'completada'
};

// Límite de citas a mostrar en el día del calendario
export const MAX_APPOINTMENTS_PER_DAY_PREVIEW = 2;
