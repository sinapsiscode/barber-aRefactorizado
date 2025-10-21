// Status enums
export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  PENDING_PAYMENT: 'pending_payment',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Status colors (líneas 62-69 del original)
export const STATUS_COLORS = {
  [APPOINTMENT_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [APPOINTMENT_STATUS.PENDING_PAYMENT]: 'bg-orange-100 text-orange-800',
  [APPOINTMENT_STATUS.CONFIRMED]: 'bg-blue-100 text-blue-800',
  [APPOINTMENT_STATUS.COMPLETED]: 'bg-green-100 text-green-800',
  [APPOINTMENT_STATUS.CANCELLED]: 'bg-red-100 text-red-800'
};

// Status texts in Spanish (líneas 72-80 del original)
export const STATUS_TEXTS = {
  [APPOINTMENT_STATUS.PENDING]: 'Pendiente',
  [APPOINTMENT_STATUS.PENDING_PAYMENT]: 'Pago por verificar',
  [APPOINTMENT_STATUS.CONFIRMED]: 'Confirmada',
  [APPOINTMENT_STATUS.COMPLETED]: 'Completada',
  [APPOINTMENT_STATUS.CANCELLED]: 'Cancelada'
};

// Calendar colors for appointment display (líneas 293-296 del original)
export const CALENDAR_COLORS = {
  [APPOINTMENT_STATUS.CONFIRMED]: 'bg-blue-500',
  [APPOINTMENT_STATUS.PENDING]: 'bg-yellow-500',
  [APPOINTMENT_STATUS.COMPLETED]: 'bg-green-500',
  [APPOINTMENT_STATUS.CANCELLED]: 'bg-red-500'
};

// Default values
export const DEFAULTS = {
  BRANCH_NAME: 'Sede Principal',
  DURATION: 30,
  SERVICE_NAME: 'Corte',
  RATING: 5.0,
  PREFERRED_BRANCH: 1,
  LOYALTY_POINTS_DIVISOR: 25,
  MAX_HISTORY_ITEMS: 5,
  MAX_CALENDAR_APPOINTMENTS_VISIBLE: 2
};

// Days of week in Spanish (línea 255 del original)
export const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// Locale for date formatting
export const DATE_LOCALE = 'es-ES';
