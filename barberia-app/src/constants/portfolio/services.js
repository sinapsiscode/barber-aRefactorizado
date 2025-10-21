/**
 * Servicios disponibles para el portafolio
 */

export const SERVICES = [
  { id: 1, name: 'Corte Clásico' },
  { id: 2, name: 'Corte + Barba' },
  { id: 3, name: 'Barba' },
  { id: 4, name: 'Corte Premium' },
  { id: 5, name: 'Diseño de Barba' },
  { id: 6, name: 'Fade Moderno' },
  { id: 7, name: 'Tinte' },
  { id: 8, name: 'Tratamiento Capilar' }
];

/**
 * Obtener servicio por ID
 */
export const getServiceById = (serviceId) => {
  return SERVICES.find(s => s.id === parseInt(serviceId));
};

/**
 * Obtener nombre de servicio por ID
 */
export const getServiceName = (serviceId) => {
  return getServiceById(serviceId)?.name || 'Servicio Desconocido';
};
