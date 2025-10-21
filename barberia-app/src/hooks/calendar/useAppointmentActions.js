import { useState, useCallback } from 'react';
import { useAppointmentStore } from '../../stores';
import { CONFIRMATION_MESSAGES } from '../../constants/calendar';
import Swal from 'sweetalert2';

/**
 * Hook para manejar las acciones de citas
 */
export const useAppointmentActions = () => {
  const { updateAppointment, deleteAppointment } = useAppointmentStore();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  const handleAppointmentClick = useCallback((appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentModal(true);
  }, []);

  const closeAppointmentModal = useCallback(() => {
    setShowAppointmentModal(false);
    setSelectedAppointment(null);
  }, []);

  const handleStatusUpdate = useCallback(async (appointmentId, newStatus) => {
    await updateAppointment(appointmentId, { status: newStatus });

    await Swal.fire({
      icon: 'success',
      title: 'Estado Actualizado',
      text: `La cita ha sido ${CONFIRMATION_MESSAGES[newStatus]} exitosamente`,
      confirmButtonColor: '#ffc000'
    });
  }, [updateAppointment]);

  const handleDeleteAppointment = useCallback(async (appointmentId) => {
    const result = await Swal.fire({
      title: '¿Eliminar Cita?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      await deleteAppointment(appointmentId);
      await Swal.fire({
        icon: 'success',
        title: 'Cita Eliminada',
        text: 'La cita ha sido eliminada exitosamente',
        confirmButtonColor: '#ffc000'
      });
    }
  }, [deleteAppointment]);

  return {
    selectedAppointment,
    showAppointmentModal,
    handleAppointmentClick,
    closeAppointmentModal,
    handleStatusUpdate,
    handleDeleteAppointment
  };
};
