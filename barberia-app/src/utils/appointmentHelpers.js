import { STATUS_COLORS, STATUS_TEXTS, TIME_SLOTS } from '../constants/barberAppointments';

export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || '';
};

export const getStatusText = (status) => {
  return STATUS_TEXTS[status] || status;
};

export const getTimeSlot = (time) => {
  const hour = parseInt(time.split(':')[0]);

  if (hour >= 6 && hour < 12) {
    return TIME_SLOTS.MORNING;
  } else if (hour >= 12 && hour < 18) {
    return TIME_SLOTS.AFTERNOON;
  } else {
    return TIME_SLOTS.EVENING;
  }
};

export const formatAppointmentDate = (date) => {
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

export const getAppointmentsForDate = (appointments, date) => {
  const targetDate = new Date(date).toDateString();
  return appointments.filter(appointment =>
    new Date(appointment.date).toDateString() === targetDate
  );
};

export const getWeekDates = (date) => {
  const week = [];
  const startDate = new Date(date);
  const day = startDate.getDay();
  const diff = startDate.getDate() - day;

  for (let i = 0; i < 7; i++) {
    const weekDate = new Date(startDate.setDate(diff + i));
    week.push(new Date(weekDate));
  }

  return week;
};

export const getMonthDates = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  const endDate = new Date(lastDay);

  startDate.setDate(startDate.getDate() - firstDay.getDay());
  endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

  const dates = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

export const getAppointmentMetrics = (appointments, date) => {
  const todayAppointments = getAppointmentsForDate(appointments, date);

  return {
    total: todayAppointments.length,
    pending: todayAppointments.filter(apt => apt.status === 'pending').length,
    confirmed: todayAppointments.filter(apt => apt.status === 'confirmed').length,
    completed: todayAppointments.filter(apt => apt.status === 'completed').length
  };
};