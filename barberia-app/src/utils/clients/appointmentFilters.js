/**
 * Filtra citas próximas (línea 30-32 del original)
 * - Fecha >= hoy
 * - Status !== cancelled
 * - Ordenadas ASC (más cercana primero)
 * @param {Array} appointments - Array de citas
 * @returns {Array} Citas próximas ordenadas
 */
export const filterUpcomingAppointments = (appointments) => {
  return appointments.filter(apt =>
    new Date(apt.date) >= new Date() && apt.status !== 'cancelled'
  ).sort((a, b) => new Date(a.date) - new Date(b.date));
};

/**
 * Filtra citas pasadas (línea 34-36 del original)
 * - Fecha < hoy O status === completed
 * - Ordenadas DESC (más reciente primero)
 * @param {Array} appointments - Array de citas
 * @returns {Array} Citas pasadas ordenadas
 */
export const filterPastAppointments = (appointments) => {
  return appointments.filter(apt =>
    new Date(apt.date) < new Date() || apt.status === 'completed'
  ).sort((a, b) => new Date(b.date) - new Date(a.date));
};

/**
 * Filtra solo citas completadas
 * @param {Array} appointments - Array de citas
 * @returns {Array} Solo citas completadas
 */
export const filterCompletedAppointments = (appointments) => {
  return appointments.filter(a => a.status === 'completed');
};

/**
 * Calcula puntos de lealtad (línea 479 del original)
 * @param {number} totalPrice - Precio total de la cita
 * @param {number} divisor - Divisor para calcular puntos (default 25)
 * @returns {number} Puntos de lealtad ganados
 */
export const calculateLoyaltyPoints = (totalPrice, divisor = 25) => {
  return Math.floor((totalPrice || 0) / divisor);
};
