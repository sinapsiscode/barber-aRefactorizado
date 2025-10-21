import { useState, useMemo } from 'react';
import { useAppointmentStore, useAuthStore, useClientStore } from '../../stores';
import { filterUpcomingAppointments, filterPastAppointments } from '../../utils/clients/appointmentFilters';
import { generateCalendarDays, navigateMonth as navigateMonthUtil, getAppointmentsForDate, formatDateToISO } from '../../utils/clients/calendarHelpers';
import { DEFAULTS } from '../../constants/appointments';
import Swal from 'sweetalert2';

/**
 * Custom hook para gestionar todas las citas del cliente
 * Extrae toda la lógica de negocio de ClientAppointments.jsx (líneas 8-157)
 */
export const useClientAppointments = () => {
  // ===== STORES (líneas 9-11 del original) =====
  const { appointments, getAppointmentsByClient, updateAppointment } = useAppointmentStore();
  const { user } = useAuthStore();
  const { clients } = useClientStore();

  // ===== ESTADOS (líneas 13-18 del original) =====
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedDateForBooking, setSelectedDateForBooking] = useState(null);

  // ===== CLIENTE ACTUAL (líneas 21-26 del original) =====
  const currentClient = useMemo(() => {
    return clients.find(c => c.email === user.email) || {
      id: user.id,
      name: user.name,
      email: user.email,
      preferredBranch: DEFAULTS.PREFERRED_BRANCH
    };
  }, [clients, user]);

  // ===== CITAS DEL CLIENTE (línea 28 del original) =====
  const clientAppointments = useMemo(() => {
    return getAppointmentsByClient(currentClient.id);
  }, [getAppointmentsByClient, currentClient.id]);

  // ===== FILTROS DE CITAS (líneas 30-36 del original) =====
  const upcomingAppointments = useMemo(() => {
    return filterUpcomingAppointments(clientAppointments);
  }, [clientAppointments]);

  const pastAppointments = useMemo(() => {
    return filterPastAppointments(clientAppointments);
  }, [clientAppointments]);

  // ===== HANDLER: CANCELAR CITA (líneas 38-59 del original) =====
  const handleCancelAppointment = async (appointmentId) => {
    const result = await Swal.fire({
      title: '¿Cancelar Cita?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener'
    });

    if (result.isConfirmed) {
      await updateAppointment(appointmentId, { status: 'cancelled' });
      Swal.fire({
        icon: 'success',
        title: 'Cita Cancelada',
        text: 'Tu cita ha sido cancelada exitosamente',
        confirmButtonColor: '#ffc000'
      });
    }
  };

  // ===== HANDLER: CLICK EN DÍA DEL CALENDARIO (líneas 123-152 del original) =====
  const handleDayClick = (dayData) => {
    if (!dayData) return;

    if (dayData.appointments.length > 0) {
      // Una sola cita: mostrar modal
      if (dayData.appointments.length === 1) {
        setSelectedAppointment(dayData.appointments[0]);
        setShowAppointmentModal(true);
      } else {
        // Múltiples citas: cambiar a lista
        setViewMode('list');
      }
    } else {
      // Sin citas: permitir agendar si es fecha válida
      const clickedDate = formatDateToISO(dayData.date);
      const today = formatDateToISO(new Date());

      if (clickedDate >= today) {
        setSelectedDateForBooking(clickedDate);
        setShowForm(true);
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Fecha no válida',
          text: 'No puedes agendar citas en fechas pasadas',
          confirmButtonColor: '#ffc000'
        });
      }
    }
  };

  // ===== HANDLER: CLICK EN CITA (líneas 154-157 del original) =====
  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentModal(true);
  };

  // ===== HANDLER: NAVEGAR MESES (líneas 97-101 del original) =====
  const handleNavigateMonth = (direction) => {
    const newDate = navigateMonthUtil(currentDate, direction);
    setCurrentDate(newDate);
  };

  // ===== HELPERS DE CALENDARIO =====
  const calendarDays = useMemo(() => {
    return generateCalendarDays(currentDate, clientAppointments);
  }, [currentDate, clientAppointments]);

  const getAppointmentsForDay = (date) => {
    return getAppointmentsForDate(date, clientAppointments);
  };

  // ===== HANDLERS DE MODALES =====
  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedDateForBooking(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedDateForBooking(null);
  };

  const handleCloseAppointmentModal = () => {
    setShowAppointmentModal(false);
    setSelectedAppointment(null);
  };

  // ===== RETURN =====
  return {
    // Data
    currentClient,
    clientAppointments,
    upcomingAppointments,
    pastAppointments,

    // UI States
    showForm,
    setShowForm,
    viewMode,
    setViewMode,
    currentDate,
    setCurrentDate,
    selectedAppointment,
    setSelectedAppointment,
    showAppointmentModal,
    setShowAppointmentModal,
    selectedDateForBooking,
    setSelectedDateForBooking,

    // Calendar
    calendarDays,
    getAppointmentsForDay,

    // Handlers
    handleCancelAppointment,
    handleDayClick,
    handleAppointmentClick,
    handleNavigateMonth,
    handleCloseForm,
    handleFormSuccess,
    handleCloseAppointmentModal
  };
};
