/**
 * Formateadores para el portafolio
 */

/**
 * Formatea fecha para mostrar
 */
export const formatPortfolioDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });
};

/**
 * Formatea fecha larga para modal de rating
 */
export const formatLongDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formatea rating para mostrar
 */
export const formatRating = (rating) => {
  if (rating === 0 || !rating) {
    return 'Sin calificar';
  }
  return `${rating.toFixed(1)}/5`;
};

/**
 * Genera nombre de archivo único para foto
 */
export const generatePhotoFilename = (type = 'before') => {
  const timestamp = Date.now();
  return `/images/portfolio/${type}_${timestamp}.jpg`;
};
