import {
  FiUser,
  FiBell,
  FiLock,
  FiGlobe,
  FiMapPin,
  FiSettings,
  FiImage,
  FiShield,
  FiGift,
  FiClock,
  FiDollarSign
} from 'react-icons/fi';

/**
 * Constantes para la página de configuraciones
 */

// Tabs base disponibles para todos los usuarios
export const BASE_TABS = [
  { id: 'profile', name: 'Perfil', icon: FiUser },
  { id: 'notifications', name: 'Notificaciones', icon: FiBell },
  { id: 'security', name: 'Seguridad', icon: FiLock },
  { id: 'background', name: 'Personalización', icon: FiImage },
  { id: 'preferences', name: 'Preferencias', icon: FiSettings }
];

// Tabs adicionales por rol
export const ROLE_SPECIFIC_TABS = {
  super_admin: [
    { id: 'system', name: 'Sistema', icon: FiGlobe },
    { id: 'admins', name: 'Administradores', icon: FiShield },
    { id: 'loyalty', name: 'Fidelización', icon: FiGift }
  ],
  branch_admin: [
    { id: 'branch', name: 'Mi Sede', icon: FiMapPin },
    { id: 'business', name: 'Negocio', icon: FiDollarSign }
  ],
  barber: [
    { id: 'schedule', name: 'Horarios', icon: FiClock },
    { id: 'commissions', name: 'Mis Comisiones', icon: FiDollarSign }
  ],
  reception: [],
  client: []
};

// Configuración de notificaciones por defecto
export const DEFAULT_NOTIFICATIONS = {
  appointments: true,
  payments: true,
  newClients: false,
  reviews: true,
  promotions: false
};

// Etiquetas de notificaciones
export const NOTIFICATION_LABELS = {
  appointments: {
    title: 'Recordatorios de Citas',
    description: 'Recibe recordatorios 30 min antes de cada cita'
  },
  payments: {
    title: 'Notificaciones de Pagos',
    description: 'Notificaciones de pagos recibidos y pendientes'
  },
  newClients: {
    title: 'Nuevos Clientes',
    description: 'Alerta cuando se registre un nuevo cliente'
  },
  reviews: {
    title: 'Reseñas y Calificaciones',
    description: 'Notificaciones de nuevas reseñas'
  },
  promotions: {
    title: 'Promociones y Ofertas',
    description: 'Recibe ofertas y promociones especiales'
  }
};

// Horario por defecto para barberos
export const DEFAULT_BARBER_SCHEDULE = {
  lunes: { isWorking: true, start: '09:00', end: '18:00' },
  martes: { isWorking: true, start: '09:00', end: '18:00' },
  miercoles: { isWorking: true, start: '09:00', end: '18:00' },
  jueves: { isWorking: true, start: '09:00', end: '18:00' },
  viernes: { isWorking: true, start: '09:00', end: '18:00' },
  sabado: { isWorking: true, start: '09:00', end: '17:00' },
  domingo: { isWorking: false, start: '', end: '' }
};

// Nombres de días en español
export const DAY_NAMES = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
  domingo: 'Domingo'
};

// Períodos de tiempo para filtros
export const TIME_PERIODS = [
  { value: 'thisWeek', label: 'Esta semana' },
  { value: 'thisMonth', label: 'Este mes' },
  { value: 'lastMonth', label: 'Mes pasado' },
  { value: 'last3Months', label: 'Últimos 3 meses' }
];

// Validaciones de archivo
export const AVATAR_VALIDATION = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_SIZE_TEXT: '5MB',
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp']
};

// Mensajes de error
export const ERROR_MESSAGES = {
  INVALID_FILE_TYPE: 'Por favor selecciona un archivo de imagen válido',
  FILE_TOO_LARGE: 'El archivo es demasiado grande. Máximo 5MB',
  UPLOAD_FAILED: 'Error al subir la imagen. Intenta nuevamente'
};
