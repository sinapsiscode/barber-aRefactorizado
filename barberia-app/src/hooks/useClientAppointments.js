import { useState, useCallback } from 'react';
import { useAppointmentStore, useAuthStore, useClientStore } from '../stores';
import Swal from 'sweetalert2';
import {
  CLIENT_VIEW_MODES,
  CLIENT_SWAL_CONFIG,
  CLIENT_SWAL_MESSAGES
} from '../constants/clientAppointments';
import {
  getCurrentClient,
  filterUpcomingAppointments,
  filterPastAppointments,
  getAppointmentMetrics,
  generateCalendarDays,
  getAppointmentsForDate,
  isDateInPast
} from '../utils/clientAppointmentHelpers';

export const useClientAppointments = () => {
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState(CLIENT_VIEW_MODES.LIST);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedDateForBooking, setSelectedDateForBooking] = useState(null);

  const { appointments, getAppointmentsByClient, updateAppointment } = useAppointmentStore();
  const { user } = useAuthStore();
  const { clients } = useClientStore();

  // Encontrar el cliente actual
  const currentClient = getCurrentClient(clients, user);

  // Obtener citas del cliente
  const clientAppointments = getAppointmentsByClient(currentClient.id);

  // Filtrar citas
  const upcomingAppointments = filterUpcomingAppointments(clientAppointments);
  const pastAppointments = filterPastAppointments(clientAppointments);

  // Métricas
  const metrics = getAppointmentMetrics(clientAppointments);

  const handleCancelAppointment = useCallback(async (appointmentId) => {
    const result = await Swal.fire({
      ...CLIENT_SWAL_MESSAGES.CANCEL_APPOINTMENT,
      confirmButtonColor: CLIENT_SWAL_CONFIG.DANGER_BUTTON_COLOR,
      cancelButtonColor: CLIENT_SWAL_CONFIG.CANCEL_BUTTON_COLOR
    });

    if (result.isConfirmed) {
      await updateAppointment(appointmentId, { status: 'cancelled' });
      Swal.fire({
        ...CLIENT_SWAL_MESSAGES.APPOINTMENT_CANCELLED,
        confirmButtonColor: CLIENT_SWAL_CONFIG.CONFIRM_BUTTON_COLOR
      });
    }
  }, [updateAppointment]);

  const navigateMonth = useCallback((direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  }, [currentDate]);

  const calendarDays = generateCalendarDays(currentDate, clientAppointments);

  const handleDayClick = useCallback((dayData) => {
    if (dayData) {
      if (dayData.appointments.length > 0) {
        if (dayData.appointments.length === 1) {
          // Solo una cita, mostrar directamente
          setSelectedAppointment(dayData.appointments[0]);
          setShowAppointmentModal(true);
        } else {
          // Multiple citas, cambiar a vista lista filtrada por ese día
          setViewMode(CLIENT_VIEW_MODES.LIST);
        }
      } else {
        // No hay citas en este día, permitir crear nueva cita
        const clickedDate = dayData.date.toISOString().split('T')[0];

        if (!isDateInPast(clickedDate)) {
          setSelectedDateForBooking(clickedDate);
          setShowForm(true);
        } else {
          Swal.fire({
            ...CLIENT_SWAL_MESSAGES.INVALID_DATE,
            confirmButtonColor: CLIENT_SWAL_CONFIG.CONFIRM_BUTTON_COLOR
          });
        }
      }
    }
  }, []);

  const handleAppointmentClick = useCallback((appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentModal(true);
  }, []);

  const handleFormSuccess = useCallback(() => {
    setShowForm(false);
    setSelectedDateForBooking(null);
  }, []);

  const handleFormClose = useCallback(() => {
    setShowForm(false);
    setSelectedDateForBooking(null);
  }, []);

  const handleModalClose = useCallback(() => {
    setShowAppointmentModal(false);
    setSelectedAppointment(null);
  }, []);

  const openNewAppointmentForm = useCallback(() => {
    setShowForm(true);
  }, []);

  return {
    // Estado
    showForm,
    viewMode,
    currentDate,
    selectedAppointment,
    showAppointmentModal,
    selectedDateForBooking,
    currentClient,
    clientAppointments,
    upcomingAppointments,
    pastAppointments,
    metrics,
    calendarDays,

    // Acciones
    setViewMode,
    navigateMonth,
    handleCancelAppointment,
    handleDayClick,
    handleAppointmentClick,
    handleFormSuccess,
    handleFormClose,
    handleModalClose,
    openNewAppointmentForm
  };
};