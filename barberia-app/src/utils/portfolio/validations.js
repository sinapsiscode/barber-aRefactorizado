/**
 * Validaciones para el portafolio
 */

/**
 * Valida formulario de nuevo trabajo
 */
export const validateWorkForm = (workData) => {
  const errors = [];

  if (!workData.clientName || workData.clientName.trim() === '') {
    errors.push('El nombre del cliente es obligatorio');
  }

  if (!workData.serviceId) {
    errors.push('Debes seleccionar un servicio');
  }

  if (!workData.date) {
    errors.push('La fecha es obligatoria');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valida rating
 */
export const validateRating = (rating) => {
  if (rating < 1 || rating > 5) {
    return {
      isValid: false,
      error: 'La calificación debe estar entre 1 y 5 estrellas'
    };
  }

  return { isValid: true };
};

/**
 * Valida archivo de imagen
 */
export const validateImageFile = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

  if (!file) {
    return { isValid: false, error: 'No se seleccionó ningún archivo' };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Solo se permiten imágenes (JPG, PNG, WEBP)'
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'La imagen no puede superar los 5MB'
    };
  }

  return { isValid: true };
};
