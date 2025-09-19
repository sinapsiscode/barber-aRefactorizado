// ===================================================================
// 🏢 CONSTANTES DE SEDES - REFACTORIZADO
// ===================================================================
// Constantes específicas para el módulo de sedes

export const BRANCH_LABELS = {
  FORM: {
    NEW_TITLE: 'Nueva Sede',
    EDIT_TITLE: 'Editar Sede',
    BASIC_INFO: 'Información Básica',
    CONTACT_INFO: 'Información de Contacto',
    SERVICES_AMENITIES: 'Servicios y Amenidades',
    NAME: 'Nombre de la Sede',
    CITY: 'Ciudad',
    COUNTRY: 'País',
    ADDRESS: 'Dirección',
    PHONE: 'Teléfono',
    EMAIL: 'Email',
    MANAGER: 'Nombre del Gerente',
    MANAGER_PHONE: 'Teléfono del Gerente',
    SERVICES: 'Servicios (separados por coma)',
    AMENITIES: 'Amenidades (separadas por coma)',
    CANCEL: 'Cancelar',
    CREATE: 'Crear',
    UPDATE: 'Actualizar',
    PROCESSING: 'Procesando...'
  }
};

export const BRANCH_PLACEHOLDERS = {
  NAME: 'Barbería Premium Centro',
  CITY: 'Lima',
  ADDRESS: 'Av. Pardo 123, Miraflores',
  PHONE: '+51 1 234 5678',
  EMAIL: 'sede@barberia.com',
  MANAGER: 'Ana García',
  MANAGER_PHONE: '+51 900 123 456',
  SERVICES: 'Corte Clásico, Fade, Barba, Diseño, Tinte, Cejas',
  AMENITIES: 'WiFi, Aire Acondicionado, TV, Música, Bebidas',
  COUNTRY_SELECT: 'Seleccionar país'
};

export const BRANCH_MESSAGES = {
  SUCCESS: {
    CREATED: 'Sede creada correctamente',
    UPDATED: 'Sede actualizada correctamente',
    TITLE: '¡Éxito!'
  },
  ERROR: {
    GENERAL: 'Error al procesar la sede',
    TITLE: 'Error'
  }
};

export const AVAILABLE_COUNTRIES = {
  CODES: ['PE', 'CO', 'CL', 'AR', 'EC', 'BO', 'VE', 'UY', 'PY', 'BR', 'MX', 'US', 'ES'],
  LABELS: {
    PE: 'Perú',
    CO: 'Colombia',
    CL: 'Chile',
    AR: 'Argentina',
    EC: 'Ecuador',
    BO: 'Bolivia',
    VE: 'Venezuela',
    UY: 'Uruguay',
    PY: 'Paraguay',
    BR: 'Brasil',
    MX: 'México',
    US: 'Estados Unidos',
    ES: 'España'
  }
};

export const DEFAULT_WORKING_HOURS = {
  monday: { open: '08:00', close: '22:00' },
  tuesday: { open: '08:00', close: '22:00' },
  wednesday: { open: '08:00', close: '22:00' },
  thursday: { open: '08:00', close: '22:00' },
  friday: { open: '08:00', close: '22:00' },
  saturday: { open: '08:00', close: '22:00' },
  sunday: { open: '08:00', close: '22:00' }
};

export const BRANCH_VALIDATION_RULES = {
  NAME: {
    REQUIRED: true,
    MIN_LENGTH: 3,
    MAX_LENGTH: 100
  },
  CITY: {
    REQUIRED: true,
    MIN_LENGTH: 2,
    MAX_LENGTH: 50
  },
  ADDRESS: {
    REQUIRED: true,
    MIN_LENGTH: 10,
    MAX_LENGTH: 200
  },
  PHONE: {
    REQUIRED: true,
    PATTERN: /^[+]?[\d\s-()]+$/,
    MIN_LENGTH: 9,
    MAX_LENGTH: 20
  },
  EMAIL: {
    REQUIRED: true,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  MANAGER: {
    REQUIRED: true,
    MIN_LENGTH: 3,
    MAX_LENGTH: 50
  },
  MANAGER_PHONE: {
    REQUIRED: true,
    PATTERN: /^[+]?[\d\s-()]+$/,
    MIN_LENGTH: 9,
    MAX_LENGTH: 20
  }
};

export const BRANCH_DEFAULT_COORDINATES = {
  lat: 0,
  lng: 0
};