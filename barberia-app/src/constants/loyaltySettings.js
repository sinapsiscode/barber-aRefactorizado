/**
 * Constantes para LoyaltySettings
 */

/**
 * Secciones disponibles en el panel de configuración
 */
export const LOYALTY_SECTIONS = {
  BASIC: 'basic',
  LEVELS: 'levels'
};

/**
 * Configuración por defecto del sistema de puntos
 */
export const DEFAULT_LOYALTY_SETTINGS = {
  pointsPerSol: 1,
  enabled: true,
  minimumPointsToRedeem: 50,
  pointsExpiryDays: 365,
  welcomeBonusPoints: 50,
  birthdayBonusPoints: 100,
  referralBonusPoints: 150
};

/**
 * Validaciones de campos
 */
export const VALIDATION_RULES = {
  pointsPerSol: {
    min: 0.1,
    step: 0.1,
    errorMessage: 'Los puntos por sol deben ser mayor a 0'
  },
  minimumPointsToRedeem: {
    min: 1,
    errorMessage: 'Los puntos mínimos no pueden ser negativos'
  },
  pointsExpiryDays: {
    min: 30,
    max: 1095,
    errorMessage: 'Los días de expiración deben ser mayor a 0'
  },
  bonusPoints: {
    min: 0
  }
};

/**
 * Textos del panel de configuración
 */
export const LOYALTY_TEXTS = {
  title: 'Sistema de Fidelización',
  subtitle: 'Configura cómo los clientes ganan y usan puntos de fidelidad',
  saveButton: 'Guardar Cambios',
  savingButton: 'Guardando...',
  undoButton: 'Deshacer',
  newLevelButton: 'Nuevo Nivel',

  // Secciones
  basicConfigTab: 'Configuración Básica',
  levelsTab: 'Niveles de Fidelidad',

  // Estado del sistema
  systemStatusTitle: 'Estado del Sistema',
  systemStatusLabel: 'Sistema de Puntos',
  systemEnabledText: 'Los clientes pueden ganar y canjear puntos',
  systemDisabledText: 'Sistema desactivado, no se otorgan puntos',

  // Estadísticas
  pointsEarnedLabel: 'Puntos Otorgados',
  pointsRedeemedLabel: 'Puntos Canjeados',
  pointsActiveLabel: 'Puntos Activos',

  // Configuración de puntos
  pointsConfigTitle: 'Configuración de Puntos',
  solesPerPointLabel: 'Soles por Punto',
  solesPerPointHelper: 'Por cada S/{value} gastados = 1 punto',
  minimumPointsLabel: 'Puntos Mínimos para Canje',
  minimumPointsHelper: 'Mínimo de puntos requeridos para canjear recompensas',
  expiryLabel: 'Expiración de Puntos',
  expiryHelper: 'Los puntos expirarán después de {value} días',

  // Bonificaciones
  bonusesTitle: 'Bonificaciones Especiales',
  welcomeBonusLabel: 'Bono de Bienvenida',
  welcomeBonusHelper: 'Puntos otorgados a nuevos clientes',
  birthdayBonusLabel: 'Bono de Cumpleaños',
  birthdayBonusHelper: 'Puntos de regalo en cumpleaños',
  referralBonusLabel: 'Bono por Referido',
  referralBonusHelper: 'Puntos por traer un amigo',

  // Ejemplo de cálculo
  calculationExampleTitle: '📊 Ejemplo de Cálculo',
  clientSpendsLabel: 'Cliente gasta S/{value}:',
  earnsLabel: 'Gana: {value} puntos',
  newClientBonusLabel: 'Cliente nuevo: +{value} puntos adicionales',
  toRedeemLabel: 'Para canjear necesita:',
  minimumLabel: 'Mínimo: {value} puntos',
  equivalentLabel: 'Equivale a: S/{value} en compras',

  // Niveles
  levelsManagementTitle: 'Gestión de Niveles',
  clientsLabel: '{count} clientes',
  pointsRangeLabel: '{min} - {max} puntos',
  pointsRangeInfiniteLabel: '{min} - ∞ puntos',
  discountLabel: '{value}% descuento',
  multiplierLabel: '{value}x puntos',
  freeServicesLabel: '{value} gratis/mes',
  priorityBookingLabel: 'Reservas prioritarias',

  // Alertas
  saveSuccessTitle: '¡Configuración Guardada!',
  saveSuccessText: 'Los cambios se han aplicado exitosamente',
  saveErrorTitle: 'Error',
  saveErrorText: 'No se pudo guardar la configuración',
  deleteLevelTitle: '¿Eliminar Nivel?',
  deleteLevelText: 'Esta acción no se puede deshacer',
  deleteLevelConfirm: 'Eliminar',
  deleteLevelCancel: 'Cancelar',
  deleteSuccessTitle: '¡Eliminado!',
  deleteSuccessText: 'El nivel ha sido eliminado',
  deleteErrorText: 'No se pudo eliminar el nivel'
};

/**
 * Colores para los botones de alerta
 */
export const ALERT_COLORS = {
  confirm: '#ffc000',
  danger: '#dc2626',
  cancel: '#6b7280'
};
