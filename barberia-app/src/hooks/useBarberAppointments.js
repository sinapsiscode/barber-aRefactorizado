import { useState, useEffect, useCallback } from 'react';
import { useAppointmentStore, useAuthStore } from '../stores';
import Swal from 'sweetalert2';
import { SWAL_CONFIG, SWAL_MESSAGES, VIEW_MODES } from '../constants/barberAppointments';
import { getAppointmentsForDate, getAppointmentMetrics } from '../utils/appointmentHelpers';

export const useBarberAppointments = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState(VIEW_MODES.LIST);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const { appointments, updateAppointment, getAppointmentsByBarber } = useAppointmentStore();
  const { user } = useAuthStore();

  // Obtener citas del barbero actual
  const barberAppointments = getAppointmentsByBarber(user?.id);

  // Filtrar citas por fecha seleccionada para vista lista
  const todayAppointments = getAppointmentsForDate(barberAppointments, currentDate);
  const metrics = getAppointmentMetrics(barberAppointments, currentDate);

  const handleMarkAttendance = useCallback(async (appointmentId, isPresent) => {
    const newStatus = isPresent ? 'confirmed' : 'cancelled';
    const message = isPresent ? SWAL_MESSAGES.CLIENT_CONFIRMED : SWAL_MESSAGES.CLIENT_NO_SHOW;

    try {
      await updateAppointment(appointmentId, {
        status: newStatus,
        attendanceMarked: true,
        attendanceTime: new Date().toISOString()
      });

      Swal.fire({
        ...message,
        confirmButtonColor: SWAL_CONFIG.CONFIRM_BUTTON_COLOR
      });
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  }, [updateAppointment]);

  const handleStartService = useCallback(async (appointmentId) => {
    try {
      await updateAppointment(appointmentId, {
        status: 'in_progress',
        serviceStartTime: new Date().toISOString()
      });

      Swal.fire({
        ...SWAL_MESSAGES.SERVICE_STARTED,
        confirmButtonColor: SWAL_CONFIG.SUCCESS_COLOR
      });
    } catch (error) {
      console.error('Error starting service:', error);
    }
  }, [updateAppointment]);

  const handleCompleteService = useCallback(async (appointmentId) => {
    const result = await Swal.fire({
      ...SWAL_MESSAGES.COMPLETE_SERVICE_QUESTION,
      confirmButtonColor: SWAL_CONFIG.CONFIRM_BUTTON_COLOR,
      denyButtonColor: SWAL_CONFIG.NEUTRAL_COLOR,
      cancelButtonColor: SWAL_CONFIG.DANGER_COLOR
    });

    if (result.isConfirmed) {
      setSelectedAppointmentId(appointmentId);
      setShowPhotoModal(true);
    } else if (result.isDenied) {
      try {
        await updateAppointment(appointmentId, {
          status: 'completed',
          serviceEndTime: new Date().toISOString()
        });

        Swal.fire({
          ...SWAL_MESSAGES.SERVICE_COMPLETED,
          confirmButtonColor: SWAL_CONFIG.SUCCESS_COLOR
        });
      } catch (error) {
        console.error('Error completing service:', error);
      }
    }
  }, [updateAppointment]);

  const handleSavePhotos = useCallback(async (beforePhoto, afterPhoto) => {
    try {
      // Simular guardado de fotos
      await updateAppointment(selectedAppointmentId, {
        status: 'completed',
        serviceEndTime: new Date().toISOString(),
        hasPhotos: true,
        beforePhoto: '/photos/before_' + selectedAppointmentId + '.jpg',
        afterPhoto: '/photos/after_' + selectedAppointmentId + '.jpg'
      });

      setShowPhotoModal(false);
      setSelectedAppointmentId(null);

      Swal.fire({
        ...SWAL_MESSAGES.PHOTOS_SAVED,
        confirmButtonColor: SWAL_CONFIG.SUCCESS_COLOR
      });
    } catch (error) {
      console.error('Error saving photos:', error);
    }
  }, [selectedAppointmentId, updateAppointment]);

  const handleClosePhotoModal = useCallback(() => {
    setShowPhotoModal(false);
    setSelectedAppointmentId(null);
  }, []);

  const navigateDate = useCallback((direction) => {
    const newDate = new Date(currentDate);

    switch (viewMode) {
      case VIEW_MODES.LIST:
        newDate.setDate(newDate.getDate() + direction);
        break;
      case VIEW_MODES.WEEKLY:
        newDate.setDate(newDate.getDate() + (direction * 7));
        break;
      case VIEW_MODES.MONTHLY:
        newDate.setMonth(newDate.getMonth() + direction);
        break;
      default:
        break;
    }

    setCurrentDate(newDate);
  }, [currentDate, viewMode]);

  return {
    // State
    currentDate,
    viewMode,
    showPhotoModal,
    selectedAppointmentId,
    appointments: barberAppointments,
    todayAppointments,
    metrics,

    // Actions
    setCurrentDate,
    setViewMode,
    navigateDate,
    handleMarkAttendance,
    handleStartService,
    handleCompleteService,
    handleSavePhotos,
    handleClosePhotoModal
  };
};