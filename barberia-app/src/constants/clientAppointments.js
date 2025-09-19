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