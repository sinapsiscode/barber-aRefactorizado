import { useState, useEffect } from 'react';
import { useAppointmentStore, useStaffStore, useFinancialStore } from '../stores';
import Swal from 'sweetalert2';
import {
  INITIAL_FILTERS,
  SERVICES,
  CALENDAR_TEXTS,
  NOTIFICATION_CONFIG,
  APPOINTMENT_STATUSES
} from '../constants/receptionCalendar';
import {
  getAppointmentsForDate,
  getActiveFiltersCount,
  navigateMonth,
  generateCalendarDays,
  calculateTotalPrice,
  createTransactionData,
  getStatusUpdateText
} from '../utils/receptionCalendarHelpers';

export const useReceptionCalendar = () => {
  const { appointments, updateAppointment, loadMockAppointments } = useAppointmentStore();
  const { barbers, loadMockStaff } = useStaffStore();
  const { addTransaction } = useFinancialStore();

  // Estado del calendario
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedFilters, setSelectedFilters] = useState(INITIAL_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar datos mock si no hay barberos o citas
  useEffect(() => {
    if (!barbers || barbers.length === 0) {
      loadMockStaff();
    }
    if (!appointments || appointments.length === 0) {
      loadMockAppointments();
    }
  }, [barbers, appointments, loadMockStaff, loadMockAppointments]);

  // Datos computados
  const availableBarbers = barbers || [];
  const services = SERVICES;

  // Función wrapper para obtener citas de una fecha
  const getDateAppointments = (date) => {
    return getAppointmentsForDate(appointments, date, selectedFilters, searchTerm);
  };

  // Generar días del calendario
  const calendarDays = generateCalendarDays(currentDate, getDateAppointments);

  // Handlers para navegación del calendario
  const handleNavigateMonth = (direction) => {
    const newDate = navigateMonth(currentDate, direction);
    setCurrentDate(newDate);
  };

  // Handlers para filtros
  const handleFilterChange = (filterType, value) => {
    setSelectedFilters({
      ...selectedFilters,
      [filterType]: value
    });
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleClearFilters = () => {
    setSelectedFilters(INITIAL_FILTERS);
    setSearchTerm('');
  };

  // Contar filtros activos
  const activeFiltersCount = getActiveFiltersCount(selectedFilters, searchTerm);

  // Handler para actualizar estado de cita
  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await updateAppointment(appointmentId, { status: newStatus });

      const statusText = getStatusUpdateText(newStatus);

      Swal.fire({
        icon: 'success',
        title: CALENDAR_TEXTS.STATUS_UPDATE_SUCCESS,
        text: CALENDAR_TEXTS.STATUS_UPDATE_SUCCESS_TEXT.replace('{status}', statusText),
        confirmButtonColor: NOTIFICATION_CONFIG.confirmButtonColor
      });
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      Swal.fire({
        icon: 'error',
        title: CALENDAR_TEXTS.ERROR_TITLE,
        text: 'Error al actualizar el estado de la cita.',
        confirmButtonColor: NOTIFICATION_CONFIG.confirmButtonColor
      });
    }
  };

  // Handler para marcar asistencia
  const handleMarkAttendance = async (appointment) => {
    try {
      // Cambiar estado de la cita a "En proceso"
      await updateAppointment(appointment.id, {
        status: APPOINTMENT_STATUSES.IN_PROGRESS
      });

      // Calcular precio total de los servicios
      const totalPrice = calculateTotalPrice(
        appointment.services,
        appointment.totalPrice
      );

      // Registrar pago automáticamente en finanzas
      const transactionData = createTransactionData(appointment, totalPrice);
      await addTransaction(transactionData);

      Swal.fire({
        icon: 'success',
        title: CALENDAR_TEXTS.ATTENDANCE_SUCCESS,
        text: CALENDAR_TEXTS.ATTENDANCE_SUCCESS_TEXT.replace('{clientName}', appointment.clientName),
        confirmButtonColor: NOTIFICATION_CONFIG.confirmButtonColor
      });

    } catch (error) {
      console.error('Error al marcar asistencia:', error);
      Swal.fire({
        icon: 'error',
        title: CALENDAR_TEXTS.ERROR_TITLE,
        text: CALENDAR_TEXTS.ATTENDANCE_ERROR,
        confirmButtonColor: NOTIFICATION_CONFIG.confirmButtonColor
      });
    }
  };

  return {
    // Estado
    currentDate,
    selectedFilters,
    showFilters,
    searchTerm,

    // Datos
    appointments,
    availableBarbers,
    services,
    calendarDays,
    activeFiltersCount,

    // Handlers
    handleNavigateMonth,
    handleFilterChange,
    handleSearchChange,
    handleClearSearch,
    handleToggleFilters,
    handleClearFilters,
    handleStatusUpdate,
    handleMarkAttendance
  };
};