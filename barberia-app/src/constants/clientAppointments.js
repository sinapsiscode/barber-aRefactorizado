// ===================================================================
// 📅 CONSTANTES DE FORMULARIO DE CITAS PARA CLIENTES - REFACTORIZADO
// ===================================================================
// Constantes específicas para el formulario de reserva de citas de clientes

export const CLIENT_APPOINTMENT_LABELS = {
  FORM: {
    TITLE: 'Reservar Cita',
    STEPS: {
      BRANCH: 'Sede',
      SERVICES: 'Servicios',
      PORTFOLIO: 'Portafolio',
      BARBER: 'Barbero',
      SCHEDULE: 'Horario',
      PAYMENT: 'Pago',
      CONFIRM: 'Confirmar'
    },
    STEP_TITLES: {
      BRANCH: 'Selecciona tu sede preferida',
      SERVICES: '¿Qué servicios necesitas?',
      PORTFOLIO: 'Explora nuestros trabajos',
      BARBER: 'Elige tu barbero',
      SCHEDULE: 'Selecciona fecha y hora',
      PAYMENT: 'Método de pago',
      CONFIRM: 'Resumen de tu reserva'
    },
    NAVIGATION: {
      PREVIOUS: 'Anterior',
      NEXT: 'Siguiente',
      SKIP_STEP: 'Saltar este paso',
      CONFIRM_RESERVATION: 'Confirmar Reserva',
      PROCESSING: 'Procesando...',
      STEP_COUNTER: 'Paso {current} de {total}'
    },
    FIELDS: {
      DATE: 'Fecha',
      TIME: 'Hora disponible',
      VOUCHER_NUMBER: 'Número de operación',
      VOUCHER_UPLOAD: 'Subir voucher de pago',
      SELECT_IMAGE: 'Seleccionar imagen',
      ADDITIONAL_NOTES: 'Notas adicionales (opcional)',
      PAYMENT_INFO: 'Información del pago'
    }
  }
};

export const CLIENT_APPOINTMENT_PLACEHOLDERS = {
  VOUCHER_NUMBER: 'Ej: 123456789',
  ADDITIONAL_NOTES: 'Alguna preferencia o indicación especial...'
};

export const CLIENT_APPOINTMENT_MESSAGES = {
  SUCCESS: {
    TITLE: '¡Cita Reservada!',
    CONFIRMED: 'Tu cita ha sido confirmada.',
    PENDING_PAYMENT: 'Tu cita ha sido registrada y está pendiente de verificación de pago.',
    WHATSAPP_BUTTON: 'Enviar por WhatsApp'
  },
  ERROR: {
    TITLE: 'Error',
    GENERAL: 'No se pudo crear la cita. Por favor intenta nuevamente.',
    INVALID_FILE: 'Por favor selecciona una imagen',
    FILE_TOO_LARGE: 'La imagen no debe superar los 5MB',
    INCOMPLETE_INFO: 'Por favor completa todos los campos requeridos'
  },
  WARNING: {
    TITLE: 'Información incompleta',
    INCOMPLETE_FIELDS: 'Por favor completa todos los campos requeridos'
  },
  INFO: {
    CASH_PAYMENT: 'Tu cita quedará confirmada automáticamente. Recuerda llegar 10 minutos antes.',
    OTHER_PAYMENT: 'Tu cita quedará pendiente hasta que verifiquemos tu pago. Te notificaremos cuando esté confirmada.',
    NO_SLOTS_AVAILABLE: 'No hay horarios disponibles para esta fecha'
  },
  PORTFOLIO: {
    DESCRIPTION: 'Mira algunos ejemplos de los estilos que realizamos'
  },
  SUMMARY: {
    TOTAL_LABEL: 'Total a pagar',
    DURATION_LABEL: 'Duración estimada: {duration} min',
    PAYMENT_METHOD: 'Método de pago',
    CASH_DISPLAY: 'Efectivo (pagar en tienda)',
    VOUCHER_DISPLAY: 'Voucher: #{number}',
    ADDITIONAL_NOTES: 'Notas adicionales'
  }
};

export const CLIENT_APPOINTMENT_VALIDATION = {
  FILE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/']
  },
  STEPS: {
    BRANCH: (formData) => formData.branchId !== '',
    SERVICES: (formData) => formData.services.length > 0,
    PORTFOLIO: () => true, // Opcional
    BARBER: (formData) => formData.barberId !== '',
    SCHEDULE: (formData) => formData.date !== '' && formData.time !== '',
    PAYMENT: (formData) => {
      if (formData.paymentMethod === 'efectivo') return true;
      return formData.voucherImage && formData.voucherNumber;
    },
    CONFIRM: () => true
  }
};

export const CLIENT_APPOINTMENT_STEPS = [
  { number: 1, key: 'BRANCH', icon: 'MapPin' },
  { number: 2, key: 'SERVICES', icon: 'Scissors' },
  { number: 3, key: 'PORTFOLIO', icon: 'Camera' },
  { number: 4, key: 'BARBER', icon: 'User' },
  { number: 5, key: 'SCHEDULE', icon: 'Clock' },
  { number: 6, key: 'PAYMENT', icon: 'DollarSign' },
  { number: 7, key: 'CONFIRM', icon: 'CheckCircle' }
];

export const WHATSAPP_CONFIG = {
  PHONE: '51999999999',
  BASE_URL: 'https://wa.me/',
  MESSAGE_TEMPLATE: `🗓️ *NUEVA RESERVA DE CITA*

👤 *Cliente:* {clientName}
📅 *Fecha:* {date}
⏰ *Hora:* {time}
✂️ *Barbero:* {barberName}
🏢 *Sede:* {branchName}
📍 *Dirección:* {branchAddress}

🎯 *Servicios:*
{services}

💰 *Total:* S/{totalPrice}
⏱️ *Duración:* {duration} min

{paymentInfo}

{notes}

_Mensaje generado automáticamente por el sistema de reservas_`
};

export const PORTFOLIO_CONFIG = {
  MIN_IMAGES: 6,
  MAX_IMAGES: 12,
  PLACEHOLDER_URL: 'https://via.placeholder.com/400x500/f3f4f6/9ca3af?text=',
  DISPLAY_TAGS: 2
};

export const CLIENT_APPOINTMENT_STYLES = {
  STEP_INDICATOR: {
    ACTIVE: 'bg-primary-600 text-white',
    INACTIVE: 'bg-gray-200 text-gray-600',
    ACTIVE_TEXT: 'text-primary-600 font-medium',
    INACTIVE_TEXT: 'text-gray-500',
    CONNECTOR_ACTIVE: 'bg-primary-600',
    CONNECTOR_INACTIVE: 'bg-gray-300'
  },
  SELECTION_CARD: {
    SELECTED: 'border-primary-600 bg-primary-50',
    UNSELECTED: 'border-gray-200 hover:border-gray-300'
  },
  BUTTONS: {
    PRIMARY: 'bg-primary-600 text-white hover:bg-primary-700',
    SECONDARY: 'bg-gray-300 text-gray-700 hover:bg-gray-400',
    DISABLED: 'bg-gray-200 text-gray-400 cursor-not-allowed'
  }
};

// ===================================================================
// 📅 CONSTANTES PARA VISTA DE CITAS DEL CLIENTE - REFACTORIZADO
// ===================================================================

// Estados de las citas del cliente
export const CLIENT_APPOINTMENT_STATUS = {
  PENDING: 'pending',
  PENDING_PAYMENT: 'pending_payment',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Textos de estado para cliente
export const CLIENT_STATUS_TEXTS = {
  [CLIENT_APPOINTMENT_STATUS.PENDING]: 'Pendiente',
  [CLIENT_APPOINTMENT_STATUS.PENDING_PAYMENT]: 'Pago por verificar',
  [CLIENT_APPOINTMENT_STATUS.CONFIRMED]: 'Confirmada',
  [CLIENT_APPOINTMENT_STATUS.COMPLETED]: 'Completada',
  [CLIENT_APPOINTMENT_STATUS.CANCELLED]: 'Cancelada'
};

// Colores de estado para cliente
export const CLIENT_STATUS_COLORS = {
  [CLIENT_APPOINTMENT_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [CLIENT_APPOINTMENT_STATUS.PENDING_PAYMENT]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  [CLIENT_APPOINTMENT_STATUS.CONFIRMED]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [CLIENT_APPOINTMENT_STATUS.COMPLETED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [CLIENT_APPOINTMENT_STATUS.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

// Colores de fondo para calendario de cliente
export const CLIENT_CALENDAR_COLORS = {
  [CLIENT_APPOINTMENT_STATUS.PENDING]: 'bg-yellow-500',
  [CLIENT_APPOINTMENT_STATUS.PENDING_PAYMENT]: 'bg-orange-500',
  [CLIENT_APPOINTMENT_STATUS.CONFIRMED]: 'bg-blue-500',
  [CLIENT_APPOINTMENT_STATUS.COMPLETED]: 'bg-green-500',
  [CLIENT_APPOINTMENT_STATUS.CANCELLED]: 'bg-red-500'
};

// Días de la semana
export const WEEK_DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// Modos de vista para cliente
export const CLIENT_VIEW_MODES = {
  LIST: 'list',
  CALENDAR: 'calendar'
};

// Textos de la interfaz de cliente
export const CLIENT_UI_TEXTS = {
  TITLE: 'Mis Citas',
  SUBTITLE: 'Gestiona tus reservas y historial',
  CALENDAR_TITLE: 'Calendario de Citas',
  UPCOMING_APPOINTMENTS: 'Próximas Citas',
  APPOINTMENT_HISTORY: 'Historial de Citas',
  APPOINTMENT_DETAILS: 'Detalles de la Cita',
  NO_UPCOMING_APPOINTMENTS: 'No tienes citas programadas',
  NO_UPCOMING_SUBTITLE: 'Reserva tu próxima cita para mantener tu estilo impecable',
  ADD_APPOINTMENT: '+ Agregar cita',
  COMPLETED_APPOINTMENTS: 'citas completadas',
  NEW_BOOKING: 'Nueva Reserva',
  BOOK_NOW: 'Reservar Ahora',
  LIST_VIEW: 'Lista',
  CALENDAR_VIEW: 'Calendario'
};

// Textos de métricas para cliente
export const CLIENT_METRICS_TEXTS = {
  UPCOMING: 'Próximas Citas',
  COMPLETED: 'Citas Completadas',
  TOTAL: 'Total de Citas'
};

// Textos de botones para cliente
export const CLIENT_BUTTON_TEXTS = {
  CANCEL: 'Cancelar',
  CLOSE: 'Cerrar',
  CANCEL_APPOINTMENT: 'Cancelar Cita',
  CONFIRMED: '✓ Confirmada'
};

// Configuración de SweetAlert para cliente
export const CLIENT_SWAL_CONFIG = {
  CONFIRM_BUTTON_COLOR: '#ffc000',
  CANCEL_BUTTON_COLOR: '#6b7280',
  DANGER_BUTTON_COLOR: '#ef4444'
};

// Mensajes de SweetAlert para cliente
export const CLIENT_SWAL_MESSAGES = {
  CANCEL_APPOINTMENT: {
    title: '¿Cancelar Cita?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, cancelar',
    cancelButtonText: 'No, mantener'
  },
  APPOINTMENT_CANCELLED: {
    icon: 'success',
    title: 'Cita Cancelada',
    text: 'Tu cita ha sido cancelada exitosamente'
  },
  INVALID_DATE: {
    icon: 'warning',
    title: 'Fecha no válida',
    text: 'No puedes agendar citas en fechas pasadas'
  }
};

// Textos para detalles de cita
export const APPOINTMENT_DETAIL_TEXTS = {
  SERVICES: 'Servicios',
  DURATION: 'Duración',
  PRICE: 'Precio',
  LOCATION: 'Ubicación',
  BARBER: 'Barbero',
  NOTES: 'Notas',
  MAIN_BRANCH: 'Sede Principal',
  MINUTES: 'min',
  POINTS: 'pts'
};

// Configuración por defecto para cliente
export const CLIENT_DEFAULT_CONFIG = {
  APPOINTMENT_DURATION: 30,
  DEFAULT_SERVICE: 'Corte',
  POINTS_PER_SOL: 25,
  DEFAULT_RATING: 5.0,
  MAX_APPOINTMENTS_TO_SHOW: 5,
  MAX_CALENDAR_APPOINTMENTS: 2
};