import { useMemo } from 'react';
import { APPOINTMENT_STATUS, TAB_TYPES, USER_ROLES } from '../constants/appointmentConstants';

/**
 * Hook personalizado para filtrar citas según diversos criterios
 * @param {Array} appointments - Lista de citas
 * @param {Object} user - Usuario actual
 * @param {Object} selectedBranch - Sede seleccionada
 * @param {string} selectedTab - Tab seleccionado
 * @returns {Object} Objeto con citas filtradas y contadores
 */
export const useAppointmentFilters = (appointments, user, selectedBranch, selectedTab) => {
  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];

    let filtered = appointments;

    // Filtrar por sede si es super admin
    if (user?.role === USER_ROLES.SUPER_ADMIN && selectedBranch) {
      filtered = filtered.filter(apt => apt.branchId === selectedBranch.id);
    }

    // Filtrar por tab seleccionado
    switch (selectedTab) {
      case TAB_TYPES.PENDING_PAYMENT:
        return filtered.filter(apt => (apt.status || apt.estado) === APPOINTMENT_STATUS.PENDING_PAYMENT);

      case TAB_TYPES.PENDING_APPROVAL:
        return filtered.filter(apt => {
          const appointmentStatus = apt.status || apt.estado;
          return appointmentStatus === APPOINTMENT_STATUS.PENDING ||
            appointmentStatus === APPOINTMENT_STATUS.UNDER_REVIEW;
        });

      default:
        return filtered;
    }
  }, [appointments, user?.role, selectedBranch, selectedTab]);

  const counters = useMemo(() => ({
    pendingPayment: appointments?.filter(apt =>
      (apt.status || apt.estado) === APPOINTMENT_STATUS.PENDING_PAYMENT
    ).length || 0,

    pendingApproval: appointments?.filter(apt => {
      const appointmentStatus = apt.status || apt.estado;
      return appointmentStatus === APPOINTMENT_STATUS.PENDING ||
        appointmentStatus === APPOINTMENT_STATUS.UNDER_REVIEW;
    }).length || 0
  }), [appointments]);

  return {
    filteredAppointments,
    ...counters
  };
};
