/**
 * Utilidades para el calendario
 */

/**
 * Obtiene los días de un mes
 */
export const getDaysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }

  return days;
};

/**
 * Verifica si una fecha es hoy
 */
export const isToday = (date) => {
  if (!date) return false;
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

/**
 * Navega al mes siguiente o anterior
 */
export const navigateMonth = (currentDate, direction) => {
  const newDate = new Date(currentDate);
  newDate.setMonth(currentDate.getMonth() + direction);
  return newDate;
};

/**
 * Filtra citas por criterios
 */
export const filterAppointments = (appointments, filters) => {
  let filtered = [...appointments];

  if (filters.branchId) {
    filtered = filtered.filter(apt => apt.branchId === parseInt(filters.branchId));
  }

  if (filters.barberId) {
    filtered = filtered.filter(apt => apt.barberId === parseInt(filters.barberId));
  }

  if (filters.serviceType) {
    filtered = filtered.filter(apt =>
      apt.services?.includes(parseInt(filters.serviceType))
    );
  }

  return filtered;
};

/**
 * Cuenta filtros activos
 */
export const getActiveFiltersCount = (filters, selectedBranchId) => {
  let count = 0;
  if (filters.branchId && filters.branchId !== selectedBranchId) count++;
  if (filters.barberId) count++;
  if (filters.serviceType) count++;
  return count;
};

/**
 * Filtra barberos según sucursal seleccionada
 */
export const filterBarbersByBranch = (barbers, branchId) => {
  if (!barbers) return [];

  if (branchId) {
    return barbers.filter(barber => barber.branchId === parseInt(branchId));
  }

  return barbers;
};
