/**
 * Obtiene cantidad de días en un mes (línea 84-86 del original)
 * @param {Date} date - Fecha del mes a consultar
 * @returns {number} Cantidad de días en el mes
 */
export const getDaysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

/**
 * Obtiene el primer día de la semana del mes (0=Dom, 6=Sáb) (línea 88-90 del original)
 * @param {Date} date - Fecha del mes a consultar
 * @returns {number} Número de día de la semana (0-6)
 */
export const getFirstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

/**
 * Filtra citas para una fecha específica (línea 92-95 del original)
 * @param {Date} date - Fecha a consultar
 * @param {Array} appointments - Array de citas
 * @returns {Array} Citas que coinciden con la fecha
 */
export const getAppointmentsForDate = (date, appointments) => {
  const dateStr = date.toISOString().split('T')[0];
  return appointments.filter(apt => apt.date === dateStr);
};

/**
 * Genera array de días para renderizar calendario (línea 103-121 del original)
 * Retorna array con:
 * - null para días vacíos del mes anterior
 * - { date, appointments } para días del mes actual
 * @param {Date} currentDate - Fecha actual del calendario
 * @param {Array} appointments - Array de todas las citas
 * @returns {Array} Array de objetos día o null
 */
export const generateCalendarDays = (currentDate, appointments) => {
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Días vacíos del mes anterior
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Días del mes actual
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayAppointments = getAppointmentsForDate(date, appointments);
    days.push({ date, appointments: dayAppointments });
  }

  return days;
};

/**
 * Navega meses (línea 97-101 del original)
 * @param {Date} currentDate - Fecha actual
 * @param {number} direction - -1 para anterior, +1 para siguiente
 * @returns {Date} Nueva fecha
 */
export const navigateMonth = (currentDate, direction) => {
  const newDate = new Date(currentDate);
  newDate.setMonth(newDate.getMonth() + direction);
  return newDate;
};

/**
 * Verifica si una fecha es hoy
 * @param {Date} date - Fecha a verificar
 * @returns {boolean}
 */
export const isToday = (date) => {
  return date.toDateString() === new Date().toDateString();
};

/**
 * Verifica si una fecha es futura o hoy (línea 139 del original)
 * @param {Date} date - Fecha a verificar
 * @returns {boolean}
 */
export const isFutureOrToday = (date) => {
  const dateStr = date.toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];
  return dateStr >= today;
};

/**
 * Formatea fecha a YYYY-MM-DD (usado en líneas 93, 136, 137 del original)
 * @param {Date} date - Fecha a formatear
 * @returns {string} Fecha en formato ISO
 */
export const formatDateToISO = (date) => {
  return date.toISOString().split('T')[0];
};
