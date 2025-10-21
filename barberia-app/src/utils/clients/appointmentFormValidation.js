import { PAYMENT_METHODS } from '../../constants/appointmentForm';

/**
 * Validación por paso del formulario
 */
export const validateStep = (stepNumber, formData) => {
  switch (stepNumber) {
    case 1:
      return formData.branchId !== '';
    case 2:
      return formData.services.length > 0;
    case 3:
      return true; // Portafolio es opcional
    case 4:
      return formData.barberId !== '';
    case 5:
      return formData.date !== '' && formData.time !== '';
    case 6:
      if (formData.paymentMethod === PAYMENT_METHODS.CASH) return true;
      return formData.voucherImage && formData.voucherNumber;
    case 7:
      return true;
    default:
      return false;
  }
};

/**
 * Validación de archivo de imagen
 */
export const validateImageFile = (file, maxSize, allowedTypes) => {
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'INVALID_FILE_TYPE' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'FILE_TOO_LARGE' };
  }

  return { valid: true };
};
