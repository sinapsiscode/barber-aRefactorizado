import { BASE_TABS, ROLE_SPECIFIC_TABS } from '../../constants/settings';

/**
 * Obtiene los tabs disponibles según el rol del usuario
 */
export const getTabsByRole = (userRole) => {
  const baseTabs = [...BASE_TABS];
  const roleTabs = ROLE_SPECIFIC_TABS[userRole] || [];
  return [...baseTabs, ...roleTabs];
};

/**
 * Valida un archivo de imagen
 */
export const validateImageFile = (file, maxSize) => {
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'INVALID_FILE_TYPE' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'FILE_TOO_LARGE' };
  }

  return { valid: true };
};

/**
 * Convierte archivo a base64
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
