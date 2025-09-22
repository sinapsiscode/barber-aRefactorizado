// Servicios disponibles con configuración
export const SERVICES = [
  { id: 1, name: 'Corte Clásico', duration: 30, price: 25 },
  { id: 2, name: 'Corte + Barba', duration: 45, price: 35 },
  { id: 3, name: 'Barba', duration: 20, price: 15 },
  { id: 4, name: 'Corte Premium', duration: 60, price: 50 },
  { id: 5, name: 'Diseño de Barba', duration: 40, price: 40 }
];

// Estados de las citas
export const APPOINTMENT_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Textos de la interfaz
export const CALENDAR_TEXTS = {
  // Títulos
  TITLE: 'Calendario - Recepción',
  SUBTITLE: 'Gestiona las citas y horarios de todos los barberos',
  CALENDAR_TITLE: 'Calendario de Citas',

  // Botones
  FILTERS: 'Filtros',
  NEW_APPOINTMENT: 'Nueva Cita',
  CLEAR_FILTERS: 'Limpiar filtros',
  CONFIRM: 'Confirmar',
  PRESENT: 'Presente',

  // Labels de filtros
  SEARCH_CLIENT: 'Buscar Cliente',
  BARBER_FILTER: 'Barbero',
  SERVICE_FILTER: 'Servicio',
  STATUS_FILTER: 'Estado',
  TIME_FILTER: 'Horario',

  // Placeholders
  CLIENT_NAME_PLACEHOLDER: 'Nombre del cliente...',

  // Opciones de filtros
  ALL_BARBERS: 'Todos los barberos',
  ALL_SERVICES: 'Todos los servicios',
  ALL_STATUSES: 'Todos los estados',
  ALL_DAY: 'Todo el día',

  // Estados en español
  STATUS_PENDING: 'Pendiente',
  STATUS_CONFIRMED: 'Confirmada',
  STATUS_IN_PROGRESS: 'En Proceso',
  STATUS_COMPLETED: 'Completada',
  STATUS_CANCELLED: 'Cancelada',

  // Horarios
  MORNING: 'Mañana (9:00 - 12:00)',
  AFTERNOON: 'Tarde (12:00 - 17:00)',
  EVENING: 'Noche (17:00 - 20:00)',

  // Días de la semana
  DAYS_OF_WEEK: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],

  // Mensajes
  MORE_APPOINTMENTS: '+{count} más',
  ATTENDANCE_SUCCESS: 'Asistencia Registrada',
  ATTENDANCE_SUCCESS_TEXT: 'El cliente {clientName} ha sido marcado como "En proceso" y el pago ha sido registrado automáticamente.',
  STATUS_UPDATE_SUCCESS: 'Estado Actualizado',
  STATUS_UPDATE_SUCCESS_TEXT: 'La cita ha sido {status} exitosamente',
  ERROR_TITLE: 'Error',
  ATTENDANCE_ERROR: 'Hubo un problema al registrar la asistencia. Por favor intenta nuevamente.',

  // Tooltips
  ATTENDANCE_TOOLTIP: 'Marcar asistencia y registrar pago'
};

// Configuración de colores por estado
export const STATUS_COLORS = {
  [APPOINTMENT_STATUSES.PENDING]: {
    bg: 'bg-yellow-100 dark:bg-yellow-900',
    text: 'text-yellow-800 dark:text-yellow-200',
    legend: 'bg-yellow-500'
  },
  [APPOINTMENT_STATUSES.CONFIRMED]: {
    bg: 'bg-blue-100 dark:bg-blue-900',
    text: 'text-blue-800 dark:text-blue-200',
    legend: 'bg-blue-500'
  },
  [APPOINTMENT_STATUSES.IN_PROGRESS]: {
    bg: 'bg-green-100 dark:bg-green-900',
    text: 'text-green-800 dark:text-green-200',
    legend: 'bg-green-500'
  },
  [APPOINTMENT_STATUSES.COMPLETED]: {
    bg: 'bg-purple-100 dark:bg-purple-900',
    text: 'text-purple-800 dark:text-purple-200',
    legend: 'bg-purple-500'
  },
  [APPOINTMENT_STATUSES.CANCELLED]: {
    bg: 'bg-red-100 dark:bg-red-900',
    text: 'text-red-800 dark:text-red-200',
    legend: 'bg-red-500'
  }
};

// Configuración de filtros de tiempo
export const TIME_FILTERS = {
  MORNING: 'morning',
  AFTERNOON: 'afternoon',
  EVENING: 'evening'
};

// Configuración de horarios
export const TIME_RANGES = {
  [TIME_FILTERS.MORNING]: { start: 9, end: 12 },
  [TIME_FILTERS.AFTERNOON]: { start: 12, end: 17 },
  [TIME_FILTERS.EVENING]: { start: 17, end: 20 }
};

// Configuración inicial de filtros
export const INITIAL_FILTERS = {
  barber: '',
  service: '',
  status: '',
  time: ''
};

// Configuración de transacción por defecto para pagos
export const DEFAULT_TRANSACTION_CONFIG = {
  type: 'income',
  category: 'services',
  paymentMethod: 'cash'
};

// Configuración de notificaciones
export const NOTIFICATION_CONFIG = {
  confirmButtonColor: '#ffc000'
};

// Límite de citas mostradas por día en el calendario
export const MAX_APPOINTMENTS_PER_DAY = 3;