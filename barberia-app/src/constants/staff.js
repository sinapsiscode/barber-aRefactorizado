// ===================================================================
// 👥 CONSTANTES DE PERSONAL - REFACTORIZADO
// ===================================================================
// Constantes específicas para módulo de gestión de personal

export const STAFF_LABELS = {
  FORM: {
    TITLE_NEW: 'Nuevo Barbero',
    TITLE_EDIT: 'Editar Barbero',
    FULL_NAME: 'Nombre Completo',
    EMAIL: 'Email',
    PHONE: 'Teléfono',
    BRANCH: 'Sede',
    COUNTRY: 'País de Origen',
    EXPERIENCE: 'Experiencia',
    COMMISSION: 'Comisión (%)',
    SPECIALTIES: 'Especialidades',
    SPECIALTIES_HELP: 'Selecciona las especialidades del barbero',
    COMMISSION_HELP: 'Porcentaje de comisión por servicio (0.70 = 70%)',
    SCHEDULE_TITLE: 'Horario por Defecto',
    SCHEDULE_HELP: 'El horario puede ser personalizado después de crear el perfil',
    BUTTON_CANCEL: 'Cancelar',
    BUTTON_CREATE: 'Crear Barbero',
    BUTTON_UPDATE: 'Actualizar',
    BUTTON_SAVING: 'Guardando...'
  },
  PLACEHOLDERS: {
    NAME: 'Juan Pérez',
    EMAIL: 'juan@barberia.com',
    PHONE: '+57 300 123 4567',
    EXPERIENCE: '5 años',
    COMMISSION: '0.70'
  },
  SCHEDULE: {
    WEEKDAYS: 'Lun - Vie:',
    SATURDAY: 'Sábado:',
    SUNDAY: 'Domingo:',
    WEEKDAYS_HOURS: '08:00 - 18:00',
    SATURDAY_HOURS: '08:00 - 16:00',
    SUNDAY_HOURS: 'Descanso'
  }
};

export const STAFF_SPECIALTIES = [
  'Corte Clásico',
  'Fade Moderno',
  'Barba',
  'Diseño Especial',
  'Tinte',
  'Cejas',
  'Afeitado Tradicional',
  'Tratamientos Capilares'
];

export const STAFF_COUNTRIES = [
  { code: 'PE', name: 'Perú' },
  { code: 'CO', name: 'Colombia' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'BR', name: 'Brasil' },
  { code: 'MX', name: 'México' }
];

export const STAFF_STYLES = {
  MODAL: {
    OVERLAY: 'fixed inset-0 z-50 overflow-y-auto',
    CONTAINER: 'flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0',
    BACKDROP: 'fixed inset-0 transition-opacity',
    BACKDROP_BG: 'absolute inset-0 bg-gray-500 opacity-75',
    CONTENT: 'inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full'
  },
  HEADER: {
    CONTAINER: 'bg-white dark:bg-dark-800 px-6 py-4 border-b border-gray-200 dark:border-dark-700',
    TITLE: 'text-lg leading-6 font-medium text-gray-900 dark:text-white',
    CLOSE_BUTTON: 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
  },
  FORM: {
    CONTAINER: 'p-6 space-y-6',
    GRID_2: 'grid grid-cols-1 md:grid-cols-2 gap-4',
    GRID_3: 'grid grid-cols-2 md:grid-cols-3 gap-3'
  },
  SPECIALTY: {
    ACTIVE: 'border-primary-500 bg-primary-50 dark:bg-primary-900',
    INACTIVE: 'border-gray-300 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700',
    LABEL: 'flex items-center p-3 border rounded-lg cursor-pointer transition-colors',
    TEXT: 'text-sm font-medium text-gray-900 dark:text-white'
  },
  SCHEDULE: {
    CONTAINER: 'bg-gray-50 dark:bg-dark-700 p-4 rounded-lg',
    TITLE: 'font-medium text-gray-900 dark:text-white mb-3',
    GRID: 'grid grid-cols-2 md:grid-cols-3 gap-2 text-sm',
    ROW: 'flex justify-between',
    LABEL: 'text-gray-600 dark:text-gray-400'
  },
  ACTIONS: {
    CONTAINER: 'flex justify-end space-x-3 pt-4'
  }
};

export const STAFF_CONFIG = {
  VALIDATION: {
    MIN_COMMISSION: 0,
    MAX_COMMISSION: 1,
    COMMISSION_STEP: 0.01,
    DEFAULT_COMMISSION: 0.7,
    DEFAULT_COUNTRY: 'PE',
    DEFAULT_BRANCH_ID: 1
  },
  SCHEDULE: {
    DEFAULT: {
      WEEKDAYS: { start: '08:00', end: '18:00' },
      SATURDAY: { start: '08:00', end: '16:00' },
      SUNDAY: { start: null, end: null }
    }
  }
};

export default {
  STAFF_LABELS,
  STAFF_SPECIALTIES,
  STAFF_COUNTRIES,
  STAFF_STYLES,
  STAFF_CONFIG
};