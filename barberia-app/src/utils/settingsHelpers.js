import { BASE_TABS, ROLE_SPECIFIC_TABS, THEME_MODES } from '../constants/settingsPage';

// Obtener pestañas según el rol del usuario
export const getTabsByRole = (userRole) => {
  const roleTabs = ROLE_SPECIFIC_TABS[userRole] || [];
  return [...BASE_TABS, ...roleTabs];
};

// Obtener datos iniciales del formulario
export const getInitialFormData = (user) => {
  return {
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || ''
  };
};

// Formatear el rol del usuario para mostrar
export const formatUserRole = (role) => {
  if (!role) return '';
  return role.replace('_', ' ');
};

// Obtener la inicial del nombre del usuario
export const getUserInitial = (name) => {
  return name ? name.charAt(0).toUpperCase() : '?';
};

// Obtener texto del modo de tema
export const getThemeModeText = (themeMode) => {
  switch (themeMode) {
    case THEME_MODES.LIGHT:
      return 'Claro';
    case THEME_MODES.DARK:
      return 'Oscuro';
    case THEME_MODES.AUTO:
      return 'Automático';
    default:
      return 'Desconocido';
  }
};

// Validar formulario de perfil
export const validateProfileForm = (formData) => {
  const errors = {};

  if (!formData.name.trim()) {
    errors.name = 'El nombre es requerido';
  }

  if (!formData.email.trim()) {
    errors.email = 'El email es requerido';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'El email no es válido';
  }

  if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
    errors.phone = 'El teléfono no es válido';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validar cambio de contraseña
export const validatePasswordChange = (passwords) => {
  const { currentPassword, newPassword, confirmPassword } = passwords;
  const errors = {};

  if (!currentPassword) {
    errors.currentPassword = 'La contraseña actual es requerida';
  }

  if (!newPassword) {
    errors.newPassword = 'La nueva contraseña es requerida';
  } else if (newPassword.length < 8) {
    errors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Confirma la nueva contraseña';
  } else if (newPassword !== confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Verificar si un día está activo por defecto
export const isDayActiveByDefault = (dayId) => {
  return dayId !== 'sunday';
};

// Formatear horario para mostrar
export const formatTime = (time) => {
  if (!time) return '';
  return time;
};

// Generar configuración de horario por defecto
export const generateDefaultSchedule = () => {
  return {
    startTime: '09:00',
    endTime: '18:00',
    isActive: true
  };
};

// Verificar si el usuario puede editar un campo específico
export const canEditField = (userRole, fieldName) => {
  // Lógica de permisos por campo
  switch (fieldName) {
    case 'email':
      return userRole !== 'client'; // Los clientes no pueden cambiar email
    case 'role':
      return userRole === 'super_admin'; // Solo super admin puede cambiar roles
    default:
      return true;
  }
};

// Obtener configuración de notificaciones por rol
export const getNotificationConfigByRole = (userRole) => {
  const baseConfig = {
    appointments: true,
    payments: false,
    newClients: false,
    reviews: false,
    promotions: false
  };

  switch (userRole) {
    case 'super_admin':
    case 'branch_admin':
      return {
        ...baseConfig,
        payments: true,
        newClients: true,
        reviews: true
      };
    case 'barber':
      return {
        ...baseConfig,
        reviews: true
      };
    case 'reception':
      return {
        ...baseConfig,
        newClients: true
      };
    default:
      return baseConfig;
  }
};

// Verificar si una notificación está disponible para el rol
export const isNotificationAvailableForRole = (notificationType, userRole) => {
  const availableNotifications = {
    super_admin: ['appointments', 'payments', 'newClients', 'reviews', 'promotions'],
    branch_admin: ['appointments', 'payments', 'newClients', 'reviews', 'promotions'],
    barber: ['appointments', 'reviews', 'promotions'],
    reception: ['appointments', 'newClients', 'promotions'],
    client: ['appointments', 'promotions']
  };

  return availableNotifications[userRole]?.includes(notificationType) || false;
};