/**
 * Constantes para ClientProfile
 */

/**
 * Colores por tier de lealtad
 */
export const TIER_COLORS = {
  Platinum: 'bg-purple-100 text-purple-800 border-purple-300',
  Gold: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  Silver: 'bg-gray-100 text-gray-800 border-gray-300',
  Bronze: 'bg-orange-100 text-orange-800 border-orange-300'
};

/**
 * Intervalos disponibles para avisos de corte
 */
export const WARNING_INTERVALS = [
  { value: 7, label: 'Cada 7 días' },
  { value: 10, label: 'Cada 10 días' },
  { value: 15, label: 'Cada 15 días' },
  { value: 20, label: 'Cada 20 días' },
  { value: 30, label: 'Cada 30 días' }
];

/**
 * Colores por tipo de recomendación
 */
export const RECOMMENDATION_COLORS = {
  service: 'border-blue-400 bg-blue-50 dark:bg-blue-900',
  loyalty: 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900',
  default: 'border-green-400 bg-green-50 dark:bg-green-900'
};

/**
 * Textos del perfil de cliente
 */
export const CLIENT_PROFILE_TEXTS = {
  // Header
  editButton: 'Editar',
  unwelcomeLabel: 'NO GRATO',
  blockedLabel: 'BLOQUEADO',
  pointsLabel: 'puntos',

  // Tabs/Sections
  contactInfoTitle: 'Información de Contacto',
  statsTitle: 'Estadísticas',
  warningConfigTitle: 'Configuración de Avisos',
  securityAlertsTitle: 'Alertas de Seguridad',
  recommendationsTitle: 'Recomendaciones Personalizadas',
  appointmentHistoryTitle: 'Historial de Citas',
  notesTitle: 'Notas',
  preferredServicesTitle: 'Servicios Preferidos',
  unwelcomeClientTitle: 'Cliente No Grato',

  // Stats
  totalVisitsLabel: 'Total Visitas',
  totalSpentLabel: 'Total Gastado',
  pointsAvailableLabel: 'Puntos Disponibles',
  lastVisitLabel: 'Última Visita',
  clientSinceLabel: 'Cliente desde',
  neverLabel: 'Nunca',

  // Warning Settings
  notificationsEnabledLabel: 'Notificaciones habilitadas',
  warningIntervalLabel: 'Intervalo de Aviso',
  currentStatusLabel: 'Estado Actual:',
  daysSinceLastVisitLabel: 'Días desde última visita:',
  nextWarningLabel: 'Próximo aviso en:',
  lastWarningLabel: 'Último aviso:',
  daysLabel: 'días',
  notificationsDisabledText: 'Las notificaciones están deshabilitadas para este cliente',

  // Security
  securityStatusLabel: 'Estado de Seguridad',
  falseVouchersLabel: 'Vouchers falsos:',
  rejectedPaymentsLabel: 'Pagos rechazados:',
  rejectionHistoryTitle: 'Historial de Rechazos',
  verifiedByLabel: 'por',
  clearFlagsButton: 'Limpiar banderas de seguridad',
  clearFlagsConfirmTitle: '¿Limpiar banderas de seguridad?',
  clearFlagsConfirmText: 'Esto eliminará todas las marcas de seguridad y reactivará al cliente',
  clearFlagsSuccessTitle: 'Banderas limpiadas',
  clearFlagsSuccessText: 'El cliente ha sido reactivado',

  // Unwelcome
  reasonLabel: 'Motivo:',
  dateLabel: 'Fecha:',

  // Footer
  newAppointmentButton: 'Nueva Cita',
  redeemPointsButton: 'Canjear Puntos',
  closeButton: 'Cerrar',
  appointmentCreatedTitle: 'Cita Creada',
  appointmentCreatedText: 'Tu cita ha sido programada exitosamente',

  // Alerts
  confirmYes: 'Sí, limpiar',
  confirmNo: 'Cancelar'
};
