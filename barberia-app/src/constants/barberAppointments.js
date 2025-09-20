// Constantes para el componente BarberAppointments

// Estados de las citas
export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Textos de estado
export const STATUS_TEXTS = {
  [APPOINTMENT_STATUS.PENDING]: 'Pendiente',
  [APPOINTMENT_STATUS.CONFIRMED]: 'Cliente Presente',
  [APPOINTMENT_STATUS.IN_PROGRESS]: 'En Proceso',
  [APPOINTMENT_STATUS.COMPLETED]: 'Completada',
  [APPOINTMENT_STATUS.CANCELLED]: 'No Asistió'
};

// Colores de estado
export const STATUS_COLORS = {
  [APPOINTMENT_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [APPOINTMENT_STATUS.CONFIRMED]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [APPOINTMENT_STATUS.IN_PROGRESS]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [APPOINTMENT_STATUS.COMPLETED]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  [APPOINTMENT_STATUS.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

// Colores de fondo para calendario
export const CALENDAR_STATUS_COLORS = {
  [APPOINTMENT_STATUS.PENDING]: 'bg-yellow-500',
  [APPOINTMENT_STATUS.CONFIRMED]: 'bg-blue-500',
  [APPOINTMENT_STATUS.IN_PROGRESS]: 'bg-green-500',
  [APPOINTMENT_STATUS.COMPLETED]: 'bg-purple-500',
  [APPOINTMENT_STATUS.CANCELLED]: 'bg-red-500'
};

// Días de la semana
export const WEEK_DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// Modos de vista
export const VIEW_MODES = {
  LIST: 'list',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
};

// Textos de la interfaz
export const UI_TEXTS = {
  TITLE: 'Mis Citas',
  SUBTITLE: 'Gestiona tu agenda y marca la asistencia de clientes',
  APPOINTMENTS_FOR_DATE: 'Citas para',
  NO_APPOINTMENTS: 'No hay citas para esta fecha',
  NO_APPOINTMENTS_SUBTITLE: 'Selecciona otra fecha para ver las citas programadas',
  MONTHLY_CALENDAR: 'Calendario Mensual',
  WEEKLY_CALENDAR: 'Calendario Semanal',
  WEEK_OF: 'Semana del',
  SCHEDULED_APPOINTMENTS: 'citas programadas'
};

// Textos de métricas
export const METRICS_TEXTS = {
  TODAY: 'Citas Hoy',
  PENDING: 'Pendientes',
  CONFIRMED: 'Confirmadas',
  COMPLETED: 'Completadas'
};

// Textos de botones
export const BUTTON_TEXTS = {
  PRESENT: 'Presente',
  NO_SHOW: 'No Asistió',
  START_SERVICE: 'Iniciar Servicio',
  COMPLETE: 'Completar',
  CAPTURE: 'Capturar',
  SAVE_AND_COMPLETE: 'Guardar y Completar',
  CANCEL: 'Cancelar',
  LIST: 'Lista',
  WEEKLY: 'Semanal',
  MONTHLY: 'Mensual'
};

// Configuración de SweetAlert
export const SWAL_CONFIG = {
  CONFIRM_BUTTON_COLOR: '#ffc000',
  SUCCESS_COLOR: '#10b981',
  NEUTRAL_COLOR: '#6b7280',
  DANGER_COLOR: '#ef4444'
};

// Mensajes de SweetAlert
export const SWAL_MESSAGES = {
  CLIENT_CONFIRMED: {
    icon: 'success',
    title: 'Cliente Confirmado',
    text: 'El cliente ha sido marcado como presente'
  },
  CLIENT_NO_SHOW: {
    icon: 'info',
    title: 'Cliente No Asistió',
    text: 'Se ha registrado la inasistencia del cliente'
  },
  SERVICE_STARTED: {
    icon: 'success',
    title: 'Servicio Iniciado',
    text: 'El servicio ha comenzado'
  },
  SERVICE_COMPLETED: {
    icon: 'success',
    title: 'Servicio Completado',
    text: 'El servicio se ha marcado como completado'
  },
  PHOTOS_SAVED: {
    icon: 'success',
    title: 'Fotos Guardadas',
    text: 'Las fotos del antes y después han sido guardadas exitosamente'
  },
  COMPLETE_SERVICE_QUESTION: {
    title: '¿Completar Servicio?',
    text: '¿Deseas tomar fotos del antes y después?',
    icon: 'question',
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: 'Sí, tomar fotos',
    denyButtonText: 'Completar sin fotos',
    cancelButtonText: 'Cancelar'
  }
};

// Configuración por defecto
export const DEFAULT_CONFIG = {
  APPOINTMENT_DURATION: 30,
  PHOTO_PATH_PREFIX: '/photos/',
  DEFAULT_SERVICE: 'Corte'
};

// Textos del modal de fotos
export const PHOTO_MODAL_TEXTS = {
  TITLE: 'Capturar Fotos',
  SUBTITLE: 'Toma fotos del antes y después para el portafolio',
  BEFORE_PHOTO: 'Foto Antes',
  AFTER_PHOTO: 'Foto Después',
  WITH_PHOTOS: 'Con fotos'
};

// Franjas horarias
export const TIME_SLOTS = {
  MORNING: 'Mañana',
  AFTERNOON: 'Tarde',
  EVENING: 'Noche'
};