import {
  CLIENT_STATUS_COLORS,
  CLIENT_STATUS_TEXTS,
  CLIENT_DEFAULT_CONFIG
} from '../constants/clientAppointments';

export const getClientStatusColor = (status) => {
  return CLIENT_STATUS_COLORS[status] || CLIENT_STATUS_COLORS.pending;
};

export const getClientStatusText = (status) => {
  return CLIENT_STATUS_TEXTS[status] || status;
};

export const formatClientAppointmentDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getAppointmentsForDate = (appointments, date) => {
  const targetDate = new Date(date).toISOString().split('T')[0];
  return appointments.filter(appointment =>
    appointment.date === targetDate
  );
};

export const filterUpcomingAppointments = (appointments) => {
  return appointments.filter(apt =>
    new Date(apt.date) >= new Date() && apt.status !== 'cancelled'
  ).sort((a, b) => new Date(a.date) - new Date(b.date));
};

export const filterPastAppointments = (appointments) => {
  return appointments.filter(apt =>
    new Date(apt.date) < new Date() || apt.status === 'completed'
  ).sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const getDaysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const getFirstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

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
    const dayAppointments = getAppointmentsForDate(appointments, date);
    days.push({ date, appointments: dayAppointments });
  }

  return days;
};

export const calculatePoints = (price) => {
  return Math.floor((price || 0) / CLIENT_DEFAULT_CONFIG.POINTS_PER_SOL);
};

export const getCurrentClient = (clients, user) => {
  return clients.find(c => c.email === user.email) || {
    id: user.id,
    name: user.name,
    email: user.email,
    preferredBranch: 1
  };
};

export const getAppointmentMetrics = (appointments) => {
  const upcoming = filterUpcomingAppointments(appointments);
  const past = filterPastAppointments(appointments);
  const completed = past.filter(a => a.status === 'completed');

  return {
    upcoming: upcoming.length,
    completed: completed.length,
    total: appointments.length
  };
};

export const canCancelAppointment = (appointment) => {
  return appointment.status === 'pending' && new Date(appointment.date) > new Date();
};

export const isDateInPast = (date) => {
  const today = new Date().toISOString().split('T')[0];
  return date < today;
};

export const formatAppointmentServices = (services) => {
  return services?.map(s => `Servicio ${s}`).join(', ') || CLIENT_DEFAULT_CONFIG.DEFAULT_SERVICE;
};