// ===================================================================
// 🎯 CONSTANTES CENTRALIZADAS - REFACTORIZADO
// ===================================================================
// Archivo centralizado para todos los valores hardcodeados del proyecto
// Sigue las reglas del REFACTORING_GUIDE.md: "Centraliza estilos y constantes"

// ===================================================================
// 📞 CONTACTO Y COMUNICACIÓN
// ===================================================================
export const CONTACT = {
  WHATSAPP: {
    PHONE: '51999999999',
    BASE_URL: 'https://wa.me/',
    MESSAGES: {
      APPOINTMENT_CONFIRMATION: 'Tu cita ha sido confirmada',
      REMINDER: 'Hola {name}! Hemos notado que no nos has visitado en un tiempo. ¿Te gustaría agendar una cita? Estamos aquí para ayudarte con tu corte ideal. ¡Te esperamos! 💈',
      WELCOME: 'Bienvenido a nuestra barbería'
    }
  }
};

// ===================================================================
// 🎨 TEMA Y COLORES
// ===================================================================
export const THEME = {
  COLORS: {
    PRIMARY: {
      50: '#fef7ee',
      100: '#fdedd3',
      200: '#fbd7a5',
      300: '#f8bb6d',
      400: '#f59532',
      500: '#f3780a',
      600: '#e45e05',
      700: '#bd4708',
      800: '#963710',
      900: '#792e10'
    },
    PAYMENT_METHODS: {
      VISA: 'green',
      MASTERCARD: 'purple',
      PAYPAL: 'teal',
      BANK_TRANSFER: 'blue'
    },
    STATUS: {
      SUCCESS: '#10b981',
      ERROR: '#ef4444',
      WARNING: '#f59e0b',
      INFO: '#3b82f6'
    }
  },
  DARK_MODE: {
    BACKGROUND: '#1a1a1a',
    SURFACE: '#2d2d2d',
    TEXT: '#ffffff'
  }
};

// ===================================================================
// 🏢 INFORMACIÓN DE EMPRESA
// ===================================================================
export const COMPANY = {
  NAME: 'Barbería Premium',
  LOGO_URL: '/logo.png',
  ADDRESS: 'Av. Principal 123, Lima, Perú',
  PHONE: '+51 999 999 999',
  EMAIL: 'info@barberiapremium.com',
  WEBSITE: 'www.barberiapremium.com'
};

// ===================================================================
// 📅 CONFIGURACIÓN DE CALENDARIO Y HORARIOS
// ===================================================================
export const CALENDAR = {
  DAYS_OF_WEEK: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  MONTHS: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ],
  WORKING_HOURS: {
    START: '08:00',
    END: '20:00',
    LUNCH_START: '13:00',
    LUNCH_END: '14:00'
  },
  APPOINTMENT_DURATION: {
    DEFAULT: 30, // minutos
    HAIRCUT: 45,
    BEARD: 30,
    COMBO: 60
  }
};

// ===================================================================
// 💰 CONFIGURACIÓN FINANCIERA
// ===================================================================
export const FINANCIAL = {
  CURRENCY: {
    SYMBOL: 'S/.',
    CODE: 'PEN',
    DECIMAL_PLACES: 2
  },
  TAX_RATE: 0.18, // 18% IGV en Perú
  PAYMENT_METHODS: [
    { id: 'cash', name: 'Efectivo', icon: '💵' },
    { id: 'card', name: 'Tarjeta', icon: '💳' },
    { id: 'transfer', name: 'Transferencia', icon: '🏦' },
    { id: 'digital', name: 'Billetera Digital', icon: '📱' }
  ]
};

// ===================================================================
// 👤 ROLES Y PERMISOS
// ===================================================================
export const ROLES = {
  ADMIN: 'admin',
  BARBER: 'barber',
  RECEPTION: 'reception',
  CLIENT: 'client'
};

export const PERMISSIONS = {
  [ROLES.ADMIN]: ['*'], // Todos los permisos
  [ROLES.BARBER]: ['appointments.view', 'appointments.edit', 'clients.view'],
  [ROLES.RECEPTION]: ['appointments.manage', 'clients.manage', 'financial.view'],
  [ROLES.CLIENT]: ['appointments.own', 'profile.edit']
};

// ===================================================================
// 📊 CONFIGURACIÓN DE DASHBOARD
// ===================================================================
export const DASHBOARD = {
  REFRESH_INTERVAL: 30000, // 30 segundos
  CHART_COLORS: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  KPI_CARDS: {
    APPOINTMENTS: { icon: '📅', color: 'blue' },
    REVENUE: { icon: '💰', color: 'green' },
    CLIENTS: { icon: '👥', color: 'purple' },
    SERVICES: { icon: '✂️', color: 'orange' }
  }
};

// ===================================================================
// 🔔 NOTIFICACIONES
// ===================================================================
export const NOTIFICATIONS = {
  TYPES: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
  },
  DURATION: {
    SHORT: 3000,
    MEDIUM: 5000,
    LONG: 8000
  },
  REMINDERS: {
    INACTIVE_CLIENT_DAYS: 90,
    APPOINTMENT_HOURS_BEFORE: 24
  }
};

// ===================================================================
// 🌐 URLs Y ENDPOINTS
// ===================================================================
export const URLS = {
  FLAG_API: 'https://flagcdn.com/w20/',
  GOOGLE_MAPS: 'https://maps.google.com',
  SOCIAL_MEDIA: {
    FACEBOOK: 'https://facebook.com/barberiapremium',
    INSTAGRAM: 'https://instagram.com/barberiapremium',
    WHATSAPP: 'https://wa.me/51999999999'
  }
};

// ===================================================================
// 📱 CONFIGURACIÓN RESPONSIVE
// ===================================================================
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px'
};

// ===================================================================
// ⚙️ CONFIGURACIÓN GENERAL
// ===================================================================
export const CONFIG = {
  APP_NAME: 'Sistema de Gestión de Barbería',
  VERSION: '2.0.0',
  DEMO_MODE: true,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_FORMATS: ['jpg', 'jpeg', 'png', 'webp'],
  AUTO_SAVE_INTERVAL: 10000, // 10 segundos
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000 // 24 horas
};

// ===================================================================
// 📋 VALIDACIONES
// ===================================================================
export const VALIDATION = {
  PHONE: {
    MIN_LENGTH: 9,
    MAX_LENGTH: 15,
    PATTERN: /^[+]?[\d\s-()]+$/
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL: false
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/
  }
};

// Exportar constantes específicas de módulos
export * from './appointments';
export * from './auth';
export * from './branches';
export * from './clientAppointments';
export * from './clients';
export * from './dashboards';

export default {
  CONTACT,
  THEME,
  COMPANY,
  CALENDAR,
  FINANCIAL,
  ROLES,
  PERMISSIONS,
  DASHBOARD,
  NOTIFICATIONS,
  URLS,
  BREAKPOINTS,
  CONFIG,
  VALIDATION
};