import { APPOINTMENTS_TABS, PAYMENT_STATUS } from '../constants/appointments';

export const getFilteredAppointments = (appointments, user, selectedBranch, selectedTab) => {
  let filtered = appointments;

  // Filtrar por sede si es super admin con sede seleccionada
  if (user?.role === 'super_admin' && selectedBranch) {
    filtered = filtered.filter(appointment => appointment.branchId === selectedBranch.id);
  }

  // Filtrar por tab seleccionado
  if (selectedTab === APPOINTMENTS_TABS.PENDING_PAYMENT) {
    filtered = filtered.filter(apt => apt.status === PAYMENT_STATUS.PENDING_PAYMENT);
  }

  return filtered;
};