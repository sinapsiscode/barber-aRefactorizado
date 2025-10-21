/**
 * Modos de visualización del portafolio
 */

export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list'
};

/**
 * Etiquetas de calificación
 */
export const RATING_LABELS = {
  1: 'Muy malo',
  2: 'Malo',
  3: 'Regular',
  4: 'Bueno',
  5: 'Excelente'
};

/**
 * Obtener etiqueta de calificación
 */
export const getRatingLabel = (rating) => {
  return RATING_LABELS[rating] || 'Sin calificar';
};
