import { useMemo } from 'react';
import { USER_ROLES } from '../constants/appointmentConstants';

/**
 * Hook para gestionar permisos de acciones en citas
 * @param {Object} user - Usuario actual
 * @returns {Object} Objeto con flags de permisos
 */
export const useAppointmentPermissions = (user) => {
  return useMemo(() => {
    const role = user?.role;

    return {
      canApprove: role === USER_ROLES.SUPER_ADMIN || role === USER_ROLES.BRANCH_ADMIN,
      canReject: role === USER_ROLES.SUPER_ADMIN || role === USER_ROLES.BRANCH_ADMIN,
      canVerifyPayment: role === USER_ROLES.SUPER_ADMIN || role === USER_ROLES.BRANCH_ADMIN,
      canCreateAppointment: role !== USER_ROLES.RECEPTION,
      canViewDetails: true,
      isReception: role === USER_ROLES.RECEPTION,
      isAdmin: role === USER_ROLES.SUPER_ADMIN || role === USER_ROLES.BRANCH_ADMIN
    };
  }, [user?.role]);
};
