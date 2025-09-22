import { TIME_RANGES, SERVICES, CALENDAR_TEXTS, DEFAULT_TRANSACTION_CONFIG } from '../constants/receptionCalendar';

// Utilidades para el manejo del calendario
export const getDaysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const getFirstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

// Navegar entre meses
export const navigateMonth = (currentDate, direction) => {
  const newDate = new Date(currentDate);
  newDate.setMonth(newDate.getMonth() + direction);
  return newDate;
};

// Generar días del calendario
export const generateCalendarDays = (currentDate, getAppointmentsForDate) => {
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
    const appointments = getAppointmentsForDate(date);
    days.push({ date, appointments });
  }

  return days;
};

// Filtrar citas por fecha
export const getAppointmentsForDate = (appointments, date, filters, searchTerm) => {
  const dateStr = date.toISOString().split('T')[0];
  let filteredAppointments = appointments.filter(apt => apt.date === dateStr);

  // Aplicar filtros
  if (filters.barber) {
    filteredAppointments = filteredAppointments.filter(apt =>
      apt.barberId?.toString() === filters.barber
    );
  }

  if (filters.service) {
    filteredAppointments = filteredAppointments.filter(apt =>
      apt.services?.includes(parseInt(filters.service))
    );
  }

  if (filters.status) {
    filteredAppointments = filteredAppointments.filter(apt =>
      apt.status === filters.status
    );
  }

  if (filters.time) {
    const timeSlot = filters.time;
    filteredAppointments = filteredAppointments.filter(apt => {
      const hour = parseInt(apt.time.split(':')[0]);
      const range = TIME_RANGES[timeSlot];
      if (range) {
        return hour >= range.start && hour < range.end;
      }
      return true;
    });
  }

  // Búsqueda por nombre del cliente
  if (searchTerm) {
    filteredAppointments = filteredAppointments.filter(apt =>
      apt.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return filteredAppointments;
};

// Contar filtros activos
export const getActiveFiltersCount = (filters, searchTerm) => {
  return Object.values(filters).filter(value => value !== '').length + (searchTerm ? 1 : 0);
};

// Calcular precio total de servicios
export const calculateTotalPrice = (serviceIds, fallbackPrice = 0) => {
  if (!serviceIds || serviceIds.length === 0) return fallbackPrice;

  return serviceIds.reduce((total, serviceId) => {
    const service = SERVICES.find(s => s.id === serviceId);
    return total + (service?.price || 0);
  }, 0);
};

// Crear datos de transacción para el pago
export const createTransactionData = (appointment, totalPrice) => {
  return {
    ...DEFAULT_TRANSACTION_CONFIG,
    amount: totalPrice,
    description: `Pago por servicios - ${appointment.clientName}`,
    date: new Date().toISOString().split('T')[0],
    branchId: appointment.branchId || 1,
    barberId: appointment.barberId,
    clientId: appointment.clientId,
    appointmentId: appointment.id
  };
};

// Formatear fecha para mostrar
export const formatMonthYear = (date) => {
  return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
};

// Verificar si es el día actual
export const isToday = (date) => {
  return date.toDateString() === new Date().toDateString();
};

// Obtener texto del estado actualizado
export const getStatusUpdateText = (status) => {
  const statusTexts = {
    confirmed: 'confirmada',
    pending: 'pendiente',
    in_progress: 'en proceso',
    completed: 'completada',
    cancelled: 'cancelada'
  };
  return statusTexts[status] || 'actualizada';
};

// Obtener tooltip de la cita
export const getAppointmentTooltip = (appointment) => {
  return `${appointment.time} - ${appointment.clientName} - ${appointment.barberName}`;
};

// Verificar si se debe mostrar botón de confirmar
export const shouldShowConfirmButton = (status) => {
  return status === 'pending';
};

// Verificar si se debe mostrar botón de asistencia
export const shouldShowAttendanceButton = (status) => {
  return status === 'confirmed';
};