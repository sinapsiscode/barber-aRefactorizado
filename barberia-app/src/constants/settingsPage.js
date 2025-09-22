import {
  FiUser,
  FiBell,
  FiLock,
  FiGlobe,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiSettings,
  FiImage
} from 'react-icons/fi';

// Pestañas base para todos los usuarios
export const BASE_TABS = [
  { id: 'profile', name: 'Perfil', icon: FiUser },
  { id: 'notifications', name: 'Notificaciones', icon: FiBell },
  { id: 'security', name: 'Seguridad', icon: FiLock },
  { id: 'background', name: 'Personalización', icon: FiImage },
  { id: 'preferences', name: 'Preferencias', icon: FiSettings }
];

// Pestañas adicionales por rol
export const ROLE_SPECIFIC_TABS = {
  super_admin: [
    { id: 'system', name: 'Sistema', icon: FiGlobe },
    { id: 'branches', name: 'Sedes', icon: FiMapPin }
  ],
  branch_admin: [
    { id: 'branch', name: 'Mi Sede', icon: FiMapPin },
    { id: 'business', name: 'Negocio', icon: FiDollarSign }
  ],
  barber: [
    { id: 'schedule', name: 'Horarios', icon: FiClock },
    { id: 'services', name: 'Servicios', icon: FiSettings }
  ]
};

// Configuración inicial de notificaciones
export const INITIAL_NOTIFICATIONS = {
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

// Días de la semana para horarios
export const WEEK_DAYS = [
  { id: 'monday', name: 'Lunes', defaultActive: true },
  { id: 'tuesday', name: 'Martes', defaultActive: true },
  { id: 'wednesday', name: 'Miércoles', defaultActive: true },
  { id: 'thursday', name: 'Jueves', defaultActive: true },
  { id: 'friday', name: 'Viernes', defaultActive: true },
  { id: 'saturday', name: 'Sábado', defaultActive: true },
  { id: 'sunday', name: 'Domingo', defaultActive: false }
];

// Textos de la interfaz
export const SETTINGS_TEXTS = {
  // Títulos principales
  MAIN_TITLE: 'Configuración',
  MAIN_SUBTITLE: 'Gestiona tu cuenta y preferencias de la aplicación',

  // Secciones
  PERSONAL_INFO: 'Información Personal',
  NOTIFICATIONS_CONFIG: 'Configuración de Notificaciones',
  ACCOUNT_SECURITY: 'Seguridad de la Cuenta',
  APP_PREFERENCES: 'Preferencias de la Aplicación',
  SCHEDULE_CONFIG: 'Configuración de Horarios',

  // Campos de perfil
  FULL_NAME: 'Nombre Completo',
  EMAIL: 'Email',
  PHONE: 'Teléfono',
  SPECIALTY: 'Especialidad',

  // Placeholders
  PHONE_PLACEHOLDER: '+51 999 999 999',
  SPECIALTY_PLACEHOLDER: 'Corte clásico, Diseños, Barba...',

  // Seguridad
  CHANGE_PASSWORD: 'Cambiar Contraseña',
  CURRENT_PASSWORD: 'Contraseña actual',
  NEW_PASSWORD: 'Nueva contraseña',
  CONFIRM_PASSWORD: 'Confirmar nueva contraseña',
  UPDATE_PASSWORD: 'Actualizar Contraseña',
  TWO_FACTOR_AUTH: 'Autenticación en Dos Pasos',
  TWO_FACTOR_DESCRIPTION: 'Agrega una capa adicional de seguridad a tu cuenta',
  SETUP_2FA: 'Configurar 2FA',

  // Preferencias
  APPEARANCE: 'Apariencia',
  APPEARANCE_DESCRIPTION: 'Configura el tema de la aplicación',
  LANGUAGE: 'Idioma',
  TIMEZONE: 'Zona Horaria',

  // Temas
  LIGHT_THEME: 'Claro',
  DARK_THEME: 'Oscuro',
  AUTO_THEME: 'Auto',
  AUTO_MODE_ACTIVE: 'Modo Automático Activado',
  AUTO_MODE_DESCRIPTION: 'La aplicación cambiará automáticamente entre claro y oscuro según la configuración de tu sistema operativo.',
  CURRENT_THEME: 'Actual:',

  // Botones
  SAVE_CHANGES: 'Guardar Cambios',

  // Opciones de idioma
  SPANISH: 'Español',
  ENGLISH: 'English',

  // Zonas horarias
  LIMA_TIMEZONE: 'Lima, Perú (GMT-5)',
  BOGOTA_TIMEZONE: 'Bogotá, Colombia (GMT-5)'
};

// Configuración de horarios por defecto
export const DEFAULT_SCHEDULE = {
  startTime: '09:00',
  endTime: '18:00'
};

// Configuración de tema
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

// Configuración de idiomas
export const LANGUAGES = {
  ES: 'es',
  EN: 'en'
};

// Configuración de zonas horarias
export const TIMEZONES = {
  LIMA: 'America/Lima',
  BOGOTA: 'America/Bogota'
};

// IDs de pestañas
export const TAB_IDS = {
  PROFILE: 'profile',
  NOTIFICATIONS: 'notifications',
  SECURITY: 'security',
  BACKGROUND: 'background',
  PREFERENCES: 'preferences',
  SCHEDULE: 'schedule',
  SYSTEM: 'system',
  BRANCHES: 'branches',
  BRANCH: 'branch',
  BUSINESS: 'business',
  SERVICES: 'services'
};