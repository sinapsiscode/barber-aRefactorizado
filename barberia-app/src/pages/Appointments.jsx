// ===================================================================
// 📅 PÁGINA DE GESTIÓN DE CITAS - REFACTORIZADO
// ===================================================================
// Página principal para la administración de citas y verificación de pagos

import React, { useState, useEffect } from 'react';
import {
  APPOINTMENTS_PAGE_LABELS,
  APPOINTMENTS_TABS,
  PAYMENT_STATUS,
  PAYMENT_VERIFICATION_COLORS
} from '../constants/appointments';
import { usePaymentVerification } from '../hooks/usePaymentVerification';
import { useAppointmentStore } from '../stores/appointmentStore';
import { useAuthStore } from '../stores/authStore';
import { useBranchStore } from '../stores/branchStore';
import AppointmentsHeader from '../components/appointments/AppointmentsHeader';
import AppointmentsTabs from '../components/appointments/AppointmentsTabs';
import AppointmentsStats from '../components/appointments/AppointmentsStats';
import AppointmentsContent from '../components/appointments/AppointmentsContent';
import AppointmentForm from '../components/appointments/AppointmentForm';
import AppointmentsTableColumns from '../config/appointmentsTableColumns';
import { getFilteredAppointments } from '../utils/appointmentFilters';
import Swal from 'sweetalert2';

const Appointments = () => {
  const { appointments, getAppointmentStats, loadMockAppointments } = useAppointmentStore();
  const { user } = useAuthStore();
  const { selectedBranch } = useBranchStore();
  const { handlePaymentVerification } = usePaymentVerification();

  const [showCalendar, setShowCalendar] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTab, setSelectedTab] = useState(APPOINTMENTS_TABS.ALL);

  useEffect(() => {
    if (appointments.length === 0) {
      loadMockAppointments();
    }
  }, []);

  const filteredAppointments = getFilteredAppointments(appointments, user, selectedBranch, selectedTab);
  const pendingPaymentCount = appointments.filter(apt => apt.status === PAYMENT_STATUS.PENDING_PAYMENT).length;

  const stats = getAppointmentStats();
  const columns = AppointmentsTableColumns(handlePaymentVerification, user);

  const handleCreateAppointmentSuccess = () => {
    setShowForm(false);
    Swal.fire({
      icon: 'success',
      title: APPOINTMENTS_PAGE_LABELS.SUCCESS_TITLE,
      text: APPOINTMENTS_PAGE_LABELS.SUCCESS_MESSAGE,
      confirmButtonColor: PAYMENT_VERIFICATION_COLORS.SUCCESS
    });
  };

  return (
    <div className="space-y-6">
      <AppointmentsHeader
        user={user}
        selectedBranch={selectedBranch}
        showCalendar={showCalendar}
        onToggleView={() => setShowCalendar(!showCalendar)}
        onNewAppointment={() => setShowForm(true)}
      />

      {(user?.role === 'super_admin' || user?.role === 'branch_admin') && pendingPaymentCount > 0 && (
        <AppointmentsTabs
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          pendingPaymentCount={pendingPaymentCount}
        />
      )}

      <AppointmentsStats stats={stats} />

      <AppointmentsContent
        showCalendar={showCalendar}
        filteredAppointments={filteredAppointments}
        columns={columns}
      />

      {showForm && (
        <AppointmentForm
          onClose={() => setShowForm(false)}
          onSuccess={handleCreateAppointmentSuccess}
        />
      )}
    </div>
  );
};

export default Appointments;