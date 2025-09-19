// ===================================================================
// 🔐 CONSTANTES DE AUTENTICACIÓN - REFACTORIZADO
// ===================================================================
// Constantes específicas para el módulo de autenticación

export const AUTH_MESSAGES = {
  LOGIN: {
    WELCOME: '¡Bienvenido!',
    HELLO: 'Hola {name}',
    REQUIRED_FIELDS: 'Campos requeridos',
    REQUIRED_TEXT: 'Por favor ingresa tu email y contraseña',
    AUTH_ERROR: 'Error de autenticación',
    INVALID_CREDENTIALS: 'Email o contraseña incorrectos'
  },
  REGISTER: {
    SUCCESS: '¡Registro Exitoso!',
    WELCOME_NEW: 'Bienvenido {name}. Tu cuenta ha sido creada correctamente.',
    ERROR: 'Error en el registro',
    ERROR_TEXT: 'Ocurrió un error al crear tu cuenta. Por favor intenta nuevamente.',
    EMAIL_EXISTS: 'El email ya está registrado',
    FIELDS_REQUIRED: 'Campos requeridos',
    FIELDS_REQUIRED_TEXT: 'Por favor completa todos los campos',
    PASSWORDS_NO_MATCH: 'Contraseñas no coinciden',
    PASSWORDS_NO_MATCH_TEXT: 'Las contraseñas ingresadas no son iguales',
    PASSWORD_TOO_SHORT: 'Contraseña muy corta',
    PASSWORD_TOO_SHORT_TEXT: 'La contraseña debe tener al menos 6 caracteres',
    TERMS_REQUIRED: 'Términos y Condiciones',
    TERMS_REQUIRED_TEXT: 'Debes aceptar los términos y condiciones para registrarte',
    TERMS_ACCEPTED: 'Términos Aceptados',
    TERMS_ACCEPTED_TEXT: 'Has aceptado los términos y condiciones correctamente',
    CREATING_ACCOUNT: 'Creando cuenta...'
  },
  VALIDATION: {
    EMAIL_REQUIRED: 'El email es requerido',
    EMAIL_INVALID: 'Formato de email inválido',
    PASSWORD_REQUIRED: 'La contraseña es requerida',
    PASSWORD_MIN: 'La contraseña debe tener al menos 6 caracteres',
    CONFIRM_PASSWORD: 'Confirma tu contraseña',
    PASSWORDS_MATCH: 'Las contraseñas no coinciden'
  }
};

export const AUTH_LABELS = {
  LOGIN: {
    TITLE: 'BARBERÍA PREMIUM',
    SUBTITLE: 'Sistema de Gestión Exclusivo',
    EMAIL: 'Correo Electrónico',
    PASSWORD: 'Contraseña',
    SUBMIT: 'Iniciar Sesión',
    LOADING: 'Iniciando...',
    DEMO_TITLE: 'Accesos Rápidos de Demostración',
    NO_ACCOUNT: '¿No tienes cuenta?',
    REGISTER_LINK: 'Regístrate aquí'
  },
  REGISTER: {
    TITLE: 'Crear Cuenta',
    SUBTITLE: 'Únete a nuestra barbería',
    NAME: 'Nombre Completo',
    EMAIL: 'Correo Electrónico',
    PASSWORD: 'Contraseña',
    CONFIRM_PASSWORD: 'Confirmar Contraseña',
    PHONE: 'Teléfono',
    SUBMIT: 'Crear Cuenta',
    LOADING: 'Creando cuenta...',
    HAVE_ACCOUNT: '¿Ya tienes cuenta?',
    LOGIN_LINK: 'Inicia sesión aquí'
  }
};

export const AUTH_PLACEHOLDERS = {
  EMAIL: 'tu@email.com',
  PASSWORD: '••••••••',
  NAME: 'Tu nombre completo',
  PHONE: '+51 999 999 999',
  CONFIRM_PASSWORD: 'Repite tu contraseña'
};

export const DEMO_CREDENTIALS = [
  {
    role: 'Super Admin',
    email: 'admin@barberia.com',
    password: 'admin123',
    icon: '👑',
    description: 'Acceso completo al sistema'
  },
  {
    role: 'Admin Sede',
    email: 'admin.sede@barberia.com',
    password: 'admin123',
    icon: '🏢',
    description: 'Gestión de sede específica'
  },
  {
    role: 'Recepción',
    email: 'recepcion@barberia.com',
    password: 'recepcion123',
    icon: '📋',
    description: 'Gestión de citas y clientes'
  },
  {
    role: 'Barbero',
    email: 'barbero@barberia.com',
    password: 'barbero123',
    icon: '✂️',
    description: 'Gestión personal de citas'
  },
  {
    role: 'Cliente',
    email: 'cliente@barberia.com',
    password: 'cliente123',
    icon: '👤',
    description: 'Reservar y gestionar citas'
  }
];

export const AUTH_VALIDATION_RULES = {
  EMAIL: {
    REQUIRED: true,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MIN_LENGTH: 5,
    MAX_LENGTH: 100
  },
  PASSWORD: {
    REQUIRED: true,
    MIN_LENGTH: 6,
    MAX_LENGTH: 50,
    REQUIRE_UPPERCASE: false,
    REQUIRE_LOWERCASE: false,
    REQUIRE_NUMBERS: false,
    REQUIRE_SPECIAL: false
  },
  NAME: {
    REQUIRED: true,
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/
  },
  PHONE: {
    REQUIRED: false,
    MIN_LENGTH: 9,
    MAX_LENGTH: 15,
    PATTERN: /^[+]?[\d\s-()]+$/
  }
};

export const AUTH_STYLES = {
  COLORS: {
    PRIMARY: '#FFB800',
    PRIMARY_DARK: '#CC9200',
    SECONDARY: '#FFA500',
    BACKGROUND: '#0A0A0A',
    SURFACE: '#1A1A1A',
    BLACK: '#000000',
    WHITE: '#FFFFFF',
    GRAY: {
      100: '#B8B8B8',
      200: '#808080',
      300: '#404040'
    }
  },
  SHADOWS: {
    GLOW: 'rgba(255, 184, 0, 0.3)',
    DARK: 'rgba(0, 0, 0, 0.5)',
    PRIMARY: 'rgba(255, 184, 0, 0.1)'
  },
  GRADIENTS: {
    PRIMARY: 'from-[#FFB800] to-[#CC9200]',
    SECONDARY: 'from-[#FFB800] to-[#FFA500]',
    BACKGROUND: 'from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]',
    SURFACE: 'from-[#1A1A1A] to-[#0A0A0A]'
  }
};

export const PROTECTED_ROUTE_MESSAGES = {
  ACCESS_DENIED: {
    TITLE: 'Acceso Denegado',
    DESCRIPTION: 'No tienes permisos para acceder a esta sección.',
    ROLE_REQUIRED: 'Rol requerido:'
  },
  PERMISSION_REQUIRED: {
    TITLE: 'Permiso Requerido',
    DESCRIPTION: 'No tienes el permiso necesario para realizar esta acción.',
    PERMISSION_REQUIRED: 'Permiso requerido:'
  }
};

export const SWEETALERT_CONFIG = {
  THEME: {
    confirmButtonColor: AUTH_STYLES.COLORS.PRIMARY,
    background: AUTH_STYLES.COLORS.SURFACE,
    color: AUTH_STYLES.COLORS.WHITE
  },
  SUCCESS: {
    timer: 2000,
    showConfirmButton: false
  },
  ERROR: {
    showConfirmButton: true
  },
  WARNING: {
    showConfirmButton: true
  }
};

export const TERMS_AND_CONDITIONS = {
  TITLE: 'Términos y Condiciones',
  SUBTITLE: 'Política de uso del sistema de barbería',
  SECTIONS: {
    WELCOME: {
      TITLE: 'Bienvenido a Barbería Premium',
      CONTENT: 'Al registrarte y utilizar nuestro sistema de gestión de citas, aceptas cumplir con los siguientes términos y condiciones. Estos términos establecen los derechos y responsabilidades tanto del cliente como de nuestra barbería.'
    },
    SERVICES: {
      TITLE: '1. Servicios Ofrecidos',
      ITEMS: [
        'Cortes de cabello profesionales y diseños personalizados',
        'Afeitado y arreglo de barba con técnicas tradicionales',
        'Tratamientos capilares y cuidado del cuero cabelludo',
        'Servicios premium con productos de alta calidad',
        'Sistema de citas online con confirmación automática'
      ]
    },
    APPOINTMENTS: {
      TITLE: '2. Política de Reservas y Citas',
      IMPORTANT_TITLE: 'Importante:',
      IMPORTANT_ITEMS: [
        'Las citas deben confirmarse al menos 2 horas antes',
        'Cancelaciones gratuitas hasta 4 horas antes de la cita',
        'No-show sin aviso previo puede resultar en penalización',
        'Llegadas con más de 15 minutos de retraso pueden ser reprogramadas'
      ],
      DETAILS: {
        BOOKING: 'Puedes agendar citas a través de nuestra plataforma online las 24 horas',
        CONFIRMATION: 'Recibirás notificaciones por SMS/email para confirmar tu cita',
        MODIFICATION: 'Puedes reprogramar tus citas hasta 4 horas antes del servicio',
        WAITLIST: 'Disponible para fechas ocupadas con notificación automática'
      }
    },
    PAYMENTS: {
      TITLE: '3. Política de Pagos',
      ITEMS: [
        'Métodos de pago: Efectivo, tarjetas de crédito/débito, transferencias digitales',
        'Precios: Pueden variar por sede, consulta precios actualizados en la app',
        'Promociones: Sujetas a términos específicos y disponibilidad',
        'Reembolsos: Solo en casos de cancelación de servicio por parte de la barbería'
      ]
    },
    PRIVACY: {
      TITLE: '4. Privacidad y Datos Personales',
      PROTECTION_TITLE: 'Protección de Datos:',
      PROTECTION_ITEMS: [
        'Tus datos se utilizan únicamente para gestionar tus citas y mejorar nuestros servicios',
        'No compartimos información personal con terceros sin tu consentimiento',
        'Puedes solicitar la eliminación de tus datos en cualquier momento',
        'Implementamos medidas de seguridad para proteger tu información'
      ],
      DETAILS: {
        COLLECTED: 'Nombre, teléfono, email, historial de servicios',
        USAGE: 'Gestión de citas, comunicaciones, mejora del servicio',
        RETENTION: 'Mantenemos tus datos mientras uses nuestros servicios',
        RIGHTS: 'Acceso, rectificación, eliminación y portabilidad de tus datos'
      }
    },
    RESPONSIBILITIES: {
      TITLE: '5. Responsabilidades del Cliente',
      ITEMS: [
        'Proporcionar información de contacto exacta y actualizada',
        'Llegar puntual a las citas programadas',
        'Informar sobre alergias o condiciones médicas relevantes',
        'Tratar al personal con respeto y cortesía',
        'Seguir las recomendaciones de cuidado post-servicio'
      ]
    },
    LIABILITY: {
      TITLE: '6. Limitación de Responsabilidad',
      ITEMS: [
        'Los servicios se realizan por profesionales calificados',
        'No nos hacemos responsables por reacciones alérgicas no informadas previamente',
        'Las imágenes de antes/después pueden usarse para promoción (con consentimiento)',
        'Cualquier reclamo debe reportarse dentro de 24 horas del servicio'
      ]
    },
    MODIFICATIONS: {
      TITLE: '7. Modificaciones de Términos',
      CONTENT: 'Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigencia inmediatamente después de su publicación en la plataforma.',
      NOTIFICATION: 'Te notificaremos sobre cambios significativos a través de email o notificaciones en la aplicación.'
    }
  },
  ACTIONS: {
    CANCEL: 'Cancelar',
    ACCEPT: 'Aceptar y Continuar',
    CHECKBOX_LABEL: 'He leído y acepto los términos y condiciones de uso del sistema de Barbería Premium. Entiendo las políticas de reservas, pagos y privacidad establecidas.'
  }
};