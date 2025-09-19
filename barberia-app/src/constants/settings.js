// ===================================================================
// ⚙️ CONSTANTES DE CONFIGURACIÓN - REFACTORIZADO
// ===================================================================
// Constantes específicas para módulo de configuración y personalización
export const SETTINGS_LABELS = {
  BACKGROUND: {
    TITLE: 'Personalización de Fondo',
    SUBTITLE: 'Personaliza el fondo de la aplicación',
    CURRENT_BACKGROUND: 'Fondo Activo',
    NORMAL_VIEW: 'Vista Normal',
    PREVIEW_VIEW: 'Vista Previa',
    RESTORE: 'Restaurar',
    SELECT_IMAGE: 'Seleccionar Imagen',
    UPLOADING: 'Subiendo...',
    UPLOAD_AREA_TITLE: 'Subir Imagen Personalizada',
    UPLOAD_AREA_SUBTITLE: 'Arrastra una imagen aquí o haz clic para seleccionar',
    OPACITY_LABEL: 'Opacidad del Fondo',
    BLUR_LABEL: 'Desenfoque (Blur)',
    PREVIEW_TITLE: 'Vista Previa de Efectos',
    PREVIEW_CONTENT: 'Vista Previa',
    PREVIEW_SUBTITLE: 'Contenido de la aplicación'
  },
  TABS: {
    GALLERY: 'Galería',
    UPLOAD: 'Subir Imagen',
    EFFECTS: 'Efectos'
  },
  CATEGORIES: {
    DEFAULT: 'Por Defecto',
    GRADIENT: 'Degradados',
    TEXTURE: 'Texturas',
    PATTERN: 'Patrones',
    CUSTOM: 'Personalizados'
  },
  NOTIFICATIONS: {
    APPLY_BACKGROUND_TITLE: 'Aplicar Fondo',
    APPLY_BACKGROUND_TEXT: '¿Cómo quieres aplicar este fondo?',
    FOR_BRANCH: 'Para mi sede',
    FOR_APPLICATION: 'Para toda la aplicación',
    FOR_PROFILE: 'Solo para mí',
    CANCEL: 'Cancelar',
    SUCCESS_TITLE: '¡Éxito!',
    BRANCH_SUCCESS: 'Fondo aplicado para la sede',
    PROFILE_SUCCESS: 'Fondo aplicado a tu perfil',
    UPLOAD_SUCCESS_TITLE: '¡Imagen subida!',
    UPLOAD_SUCCESS_TEXT: 'Tu fondo personalizado ha sido creado exitosamente',
    UPLOAD_ERROR_TITLE: 'Error al subir imagen',
    RESET_TITLE: '¿Restaurar valores por defecto?',
    RESET_TEXT: 'Esto restaurará el fondo blanco original',
    RESET_CONFIRM: 'Sí, restaurar',
    RESET_SUCCESS: 'Configuración restaurada'
  },
  RECOMMENDATIONS: {
    TITLE: 'Recomendaciones:',
    MAX_SIZE: 'Tamaño máximo: 5MB',
    FORMATS: 'Formatos: JPG, PNG, WebP',
    RESOLUTION: 'Resolución mínima: 1920x1080px',
    COLORS: 'Usa imágenes con colores suaves'
  },
  PERMISSIONS: {
    TITLE: 'Permisos:',
    SUPER_ADMIN: 'Puedes subir fondos globales',
    BRANCH_ADMIN: 'Puedes subir fondos para tu sede',
    AUTO_APPLY: 'Los fondos serán aplicados automáticamente'
  },
  SLIDERS: {
    TRANSPARENT: 'Transparente',
    OPAQUE: 'Opaco',
    SHARP: 'Nítido',
    BLURRED: 'Difuso'
  }
};

export const SETTINGS_STYLES = {
  TABS: {
    ACTIVE: 'border-primary-500 text-primary-600 dark:text-primary-400',
    INACTIVE: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
  },
  BUTTONS: {
    PREVIEW_ACTIVE: 'bg-primary-500 text-white',
    PREVIEW_INACTIVE: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    RESTORE: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600',
    UPLOAD: 'bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed'
  },
  BACKGROUND_CARD: {
    ACTIVE: 'border-primary-500 shadow-lg',
    INACTIVE: 'border-gray-200 hover:border-primary-300'
  },
  INFO_BOX: {
    bg: 'bg-primary-50 dark:bg-primary-900/20',
    border: 'border-primary-200 dark:border-primary-800',
    iconColor: 'text-primary-600 dark:text-primary-400',
    titleColor: 'text-primary-900 dark:text-primary-100',
    textColor: 'text-primary-700 dark:text-primary-300'
  },
  UPLOAD_AREA: {
    border: 'border-gray-300 dark:border-gray-600 hover:border-primary-400',
    iconColor: 'text-gray-400'
  }
};

export const SETTINGS_CONFIG = {
  OPACITY: {
    MIN: 0.1,
    MAX: 1,
    STEP: 0.05,
    DEFAULT: 1
  },
  BLUR: {
    MIN: 0,
    MAX: 10,
    STEP: 0.5,
    DEFAULT: 0
  },
  UPLOAD: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    MIN_RESOLUTION: {
      width: 1920,
      height: 1080
    }
  },
  NOTIFICATION_TIMER: 2000
};

export const BACKGROUND_CATEGORIES = {
  DEFAULT: 'default',
  GRADIENT: 'gradient',
  TEXTURE: 'texture',
  PATTERN: 'pattern',
  CUSTOM: 'custom'
};

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  BRANCH_ADMIN: 'branch_admin',
  BARBER: 'barber',
  RECEPTION: 'reception',
  CLIENT: 'client'
};

export default {
  SETTINGS_LABELS,
  SETTINGS_STYLES,
  SETTINGS_CONFIG,
  BACKGROUND_CATEGORIES,
  USER_ROLES
};