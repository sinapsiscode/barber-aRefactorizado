// ===================================================================
// ✂️ CONSTANTES DE SERVICIOS - REFACTORIZADO
// ===================================================================
// Constantes específicas para módulo de servicios y precios
export const SERVICE_LABELS = {
  PRICING_MANAGER: {
    TITLE: 'Configuración de Precios',
    SUBTITLE: '- Personaliza los precios para tu sede',
    SERVICES_TABLE_TITLE: 'Precios por Servicio',
    UNSAVED_CHANGES: 'Cambios sin guardar',
    INFO_TITLE: 'Información Importante'
  },
  STATS: {
    AVERAGE_PRICE: 'Precio Promedio',
    MAX_PRICE: 'Precio Máximo',
    MIN_PRICE: 'Precio Mínimo',
    ACTIVE_SERVICES: 'Servicios Activos'
  },
  ACTIONS: {
    SAVE_CHANGES: 'Guardar Cambios',
    SAVING: 'Guardando...',
    RESET_PRICES: 'Resetear a Valores Base',
    BULK_UPDATE: 'Ajuste Masivo'
  },
  TABLE_HEADERS: {
    SERVICE: 'Servicio',
    CATEGORY: 'Categoría',
    BASE_PRICE: 'Precio Base',
    CURRENT_PRICE: 'Precio Actual',
    DURATION: 'Duración'
  },
  NOTIFICATIONS: {
    SUCCESS_TITLE: '¡Precios Actualizados!',
    SUCCESS_MESSAGE: 'han sido guardados exitosamente',
    ERROR_TITLE: 'Error al Guardar',
    ERROR_MESSAGE: 'No se pudieron actualizar los precios. Intenta nuevamente.',
    RESET_TITLE: '¿Resetear Precios?',
    RESET_MESSAGE: 'Esto restaurará los precios a sus valores base originales.',
    BULK_TITLE: 'Ajuste Masivo de Precios',
    BULK_MESSAGE: 'Ingresa el porcentaje de cambio (positivo para aumentar, negativo para reducir):',
    BULK_PLACEHOLDER: 'Ej: 10 para +10%, -5 para -5%',
    BULK_VALIDATION: 'Ingresa un porcentaje válido',
    BULK_RANGE: 'El porcentaje debe estar entre -50% y +100%',
    BULK_SUCCESS: 'Precios Actualizados',
    CONFIRM_TEXT: 'Sí, resetear',
    CANCEL_TEXT: 'Cancelar'
  },
  INFO_ITEMS: [
    'Los cambios de precios solo afectan a esta sede',
    'Los clientes verán estos precios al seleccionar servicios',
    'Los precios se aplicarán inmediatamente después de guardar',
    'Puedes resetear a precios base en cualquier momento'
  ]
};

export const SERVICE_STYLES = {
  STATS_CARDS: {
    AVERAGE: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      textColor: 'text-blue-600 dark:text-blue-400',
      valueColor: 'text-blue-700 dark:text-blue-300'
    },
    MAX: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
      textColor: 'text-green-600 dark:text-green-400',
      valueColor: 'text-green-700 dark:text-green-300'
    },
    MIN: {
      bg: 'bg-gray-50 dark:bg-gray-700',
      iconColor: 'text-gray-600 dark:text-gray-400',
      textColor: 'text-gray-600 dark:text-gray-400',
      valueColor: 'text-gray-700 dark:text-gray-300'
    },
    ACTIVE: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      valueColor: 'text-yellow-700 dark:text-yellow-300'
    }
  },
  BUTTONS: {
    SAVE_ENABLED: 'bg-green-600 hover:bg-green-700 text-white',
    SAVE_DISABLED: 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed',
    RESET: 'bg-gray-500 hover:bg-gray-600 text-white',
    BULK: 'bg-blue-500 hover:bg-blue-600 text-white'
  },
  PRICE_INPUT: {
    UNCHANGED: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
    INCREASED: 'border-green-300 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300',
    DECREASED: 'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
  },
  CHANGE_INDICATORS: {
    INCREASED: 'text-green-600 dark:text-green-400',
    DECREASED: 'text-red-600 dark:text-red-400'
  },
  INFO_BOX: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    iconColor: 'text-blue-600 dark:text-blue-400',
    titleColor: 'text-blue-800 dark:text-blue-200',
    textColor: 'text-blue-700 dark:text-blue-300'
  }
};

export const SERVICE_CONFIG = {
  VALIDATION: {
    MIN_PERCENTAGE: -50,
    MAX_PERCENTAGE: 100,
    DECIMAL_PLACES: 2,
    MIN_PRICE: 0,
    PRICE_STEP: 0.5
  },
  NOTIFICATIONS: {
    SUCCESS_TIMER: 2000,
    ERROR_TIMER: 3000
  },
  IMAGE: {
    FALLBACK_SIZE: 40,
    FALLBACK_SVG: (size) => `data:image/svg+xml;base64,${btoa(`<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><g transform="translate(${size/2},${size/2})"><circle cx="0" cy="-5" r="4" fill="#d1d5db"/><rect x="-3" y="-2" width="6" height="8" rx="1" fill="#d1d5db"/></g></svg>`)}`
  }
};

export default {
  SERVICE_LABELS,
  SERVICE_STYLES,
  SERVICE_CONFIG
};