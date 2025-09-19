import { useState, useCallback } from 'react';
import { useAppointmentStore, useStaffStore, useClientStore } from '../stores';
import { APPOINTMENT_MESSAGES, APPOINTMENT_VALIDATION } from '../constants/appointments';
import { useCurrency } from './useCurrency';
import Swal from 'sweetalert2';

/**
 * Hook personalizado para gestión de citas
 * Centraliza la lógica de negocio de appointments
 */
export const useAppointments = () => {
  const {
    services,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    generateTimeSlots,
    getAppointmentsByDate
  } = useAppointmentStore();

  const { getActiveBarbers } = useStaffStore();
  const { clients } = useClientStore();
  const { formatCurrency } = useCurrency();

  const [loading, setLoading] = useState(false);

  // Obtener barberos activos
  const getBarbers = useCallback(() => {
    return getActiveBarbers();
  }, [getActiveBarbers]);

  // Calcular resumen de servicios
  const calculateServicesSummary = useCallback((selectedServiceIds) => {
    const selectedServices = services.filter(s => selectedServiceIds.includes(s.id));
    const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);
    const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);

    return {
      selectedServices,
      totalDuration,
      totalPrice,
      formattedPrice: formatCurrency(totalPrice)
    };
  }, [services, formatCurrency]);

  // Obtener slots de tiempo disponibles
  const getAvailableTimeSlots = useCallback((date, barberId) => {
    if (!date || !barberId) return [];

    const slots = generateTimeSlots(new Date(date), parseInt(barberId));
    return slots.filter(slot => slot.available);
  }, [generateTimeSlots]);

  // Validar formulario de cita
  const validateAppointmentForm = useCallback((formData) => {
    const errors = {};

    // Validar campos requeridos
    APPOINTMENT_VALIDATION.REQUIRED_FIELDS.forEach(field => {
      if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
        errors[field] = `${field} es requerido`;
      }
    });

    // Validar servicios mínimos
    if (formData.services && formData.services.length < APPOINTMENT_VALIDATION.MIN_SERVICES) {
      errors.services = `Debe seleccionar al menos ${APPOINTMENT_VALIDATION.MIN_SERVICES} servicio`;
    }

    // Validar fecha no sea en el pasado
    if (formData.date) {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        errors.date = 'No se pueden crear citas en fechas pasadas';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, []);

  // Preparar datos de cita para guardar
  const prepareAppointmentData = useCallback((formData) => {
    const { selectedServices, totalDuration, totalPrice } = calculateServicesSummary(formData.services);

    const client = clients.find(c => c.id == formData.clientId);
    const barber = getBarbers().find(b => b.id == formData.barberId);

    return {
      ...formData,
      clientName: client?.name || 'Cliente',
      barberName: barber?.name || 'Barbero',
      duration: totalDuration,
      totalPrice,
      branchId: 1 // TODO: Obtener de contexto de sucursal
    };
  }, [calculateServicesSummary, clients, getBarbers]);

  // Guardar cita (crear o actualizar)
  const saveAppointment = useCallback(async (formData, existingAppointment = null) => {
    const validation = validateAppointmentForm(formData);

    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    setLoading(true);

    try {
      const appointmentData = prepareAppointmentData(formData);

      if (existingAppointment) {
        await updateAppointment(existingAppointment.id, appointmentData);
      } else {
        await createAppointment(appointmentData);
      }

      await Swal.fire({
        icon: 'success',
        title: existingAppointment ? APPOINTMENT_MESSAGES.SUCCESS.UPDATED : APPOINTMENT_MESSAGES.SUCCESS.CREATED,
        showConfirmButton: false,
        timer: 2000
      });

      return { success: true };
    } catch (error) {
      console.error('Error saving appointment:', error);

      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: APPOINTMENT_MESSAGES.ERRORS.SAVE
      });

      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [validateAppointmentForm, prepareAppointmentData, updateAppointment, createAppointment]);

  // Actualizar estado de cita
  const updateAppointmentStatus = useCallback(async (appointmentId, newStatus) => {
    try {
      await updateAppointment(appointmentId, { status: newStatus });

      const statusMessages = {
        confirmed: APPOINTMENT_MESSAGES.SUCCESS.CONFIRMED,
        cancelled: APPOINTMENT_MESSAGES.SUCCESS.CANCELLED,
        completed: APPOINTMENT_MESSAGES.SUCCESS.COMPLETED
      };

      await Swal.fire({
        icon: 'success',
        title: 'Estado Actualizado',
        text: statusMessages[newStatus],
        showConfirmButton: false,
        timer: 2000
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating appointment status:', error);

      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: APPOINTMENT_MESSAGES.ERRORS.UPDATE_STATUS
      });

      return { success: false, error: error.message };
    }
  }, [updateAppointment]);

  // Eliminar cita con confirmación
  const removeAppointment = useCallback(async (appointmentId) => {
    const result = await Swal.fire({
      title: APPOINTMENT_MESSAGES.CONFIRM.DELETE.TITLE,
      text: APPOINTMENT_MESSAGES.CONFIRM.DELETE.TEXT,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deleteAppointment(appointmentId);

        await Swal.fire({
          icon: 'success',
          title: 'Cita Eliminada',
          text: APPOINTMENT_MESSAGES.SUCCESS.DELETED,
          showConfirmButton: false,
          timer: 2000
        });

        return { success: true };
      } catch (error) {
        console.error('Error deleting appointment:', error);

        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: APPOINTMENT_MESSAGES.ERRORS.DELETE
        });

        return { success: false, error: error.message };
      }
    }

    return { success: false, cancelled: true };
  }, [deleteAppointment]);

  // Filtrar citas
  const filterAppointments = useCallback((appointments, filters) => {
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
  }, []);

  // Obtener citas de un día específico con filtros
  const getFilteredAppointmentsForDay = useCallback((date, filters = {}) => {
    if (!date) return [];

    const dayAppointments = getAppointmentsByDate(date);
    return filterAppointments(dayAppointments, filters);
  }, [getAppointmentsByDate, filterAppointments]);

  return {
    // Estado
    loading,
    clients,
    services,

    // Funciones de datos
    getBarbers,
    calculateServicesSummary,
    getAvailableTimeSlots,
    getFilteredAppointmentsForDay,

    // Funciones de operaciones
    saveAppointment,
    updateAppointmentStatus,
    removeAppointment,

    // Validación
    validateAppointmentForm,

    // Filtros
    filterAppointments
  };
};