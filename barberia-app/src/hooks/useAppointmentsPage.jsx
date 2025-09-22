// ===================================================================
// 📅 HOOK DE PÁGINA DE CITAS - REFACTORIZADO
// ===================================================================
// Hook especializado para la gestión de la página de citas

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppointmentStore, useAuthStore, useBranchStore, useClientStore } from '../stores';
import {
  APPOINTMENTS_TABS,
  PAYMENT_STATUS,
  FRAUD_DETECTION_KEYWORDS,
  PAYMENT_VERIFICATION_LABELS,
  PAYMENT_VERIFICATION_COLORS,
  APPOINTMENTS_TABLE_COLUMNS,
  APPOINTMENT_STATUS,
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_COLORS
} from '../constants/appointments';
import { getPaymentMethodName } from '../utils/paymentUtils';
import Swal from 'sweetalert2';

export const useAppointmentsPage = () => {
  // Estados locales
  const [showCalendar, setShowCalendar] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTab, setSelectedTab] = useState(APPOINTMENTS_TABS.ALL);

  // Stores
  const { appointments, getAppointmentStats, loadMockAppointments, updateAppointment } = useAppointmentStore();
  const { user } = useAuthStore();
  const { selectedBranch } = useBranchStore();
  const { clients, flagClientForFalseVoucher } = useClientStore();

  // Cargar datos iniciales
  useEffect(() => {
    if (appointments.length === 0) {
      loadMockAppointments();
    }
  }, [appointments.length, loadMockAppointments]);

  // Datos computados
  const filteredAppointments = useMemo(() => {
    let filtered = user?.role === 'super_admin' && selectedBranch
      ? appointments.filter(appointment => appointment.branchId === selectedBranch.id)
      : appointments;

    if (selectedTab === APPOINTMENTS_TABS.PENDING_PAYMENT) {
      filtered = filtered.filter(apt => apt.status === PAYMENT_STATUS.PENDING_PAYMENT);
    }

    return filtered;
  }, [appointments, user?.role, selectedBranch, selectedTab]);

  const pendingPaymentCount = useMemo(() =>
    appointments.filter(apt => apt.status === PAYMENT_STATUS.PENDING_PAYMENT).length,
    [appointments]
  );

  const stats = useMemo(() => getAppointmentStats(), [getAppointmentStats]);

  const shouldShowTabs = useMemo(() =>
    (user?.role === 'super_admin' || user?.role === 'branch_admin') && pendingPaymentCount > 0,
    [user?.role, pendingPaymentCount]
  );

  const pageTitle = useMemo(() => {
    if (user?.role === 'super_admin' && selectedBranch) {
      return `${PAYMENT_VERIFICATION_LABELS.TITLE} - ${selectedBranch.name}`;
    }
    return PAYMENT_VERIFICATION_LABELS.TITLE;
  }, [user?.role, selectedBranch]);

  const pageSubtitle = useMemo(() => {
    if (user?.role === 'super_admin' && selectedBranch) {
      return `Administra las citas y horarios de ${selectedBranch.city}`;
    }
    return 'Administra las citas y horarios';
  }, [user?.role, selectedBranch]);

  /**
   * Generar columnas de la tabla
   */
  const tableColumns = useMemo(() => [
    {
      key: 'date',
      label: APPOINTMENTS_TABLE_COLUMNS.DATE,
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'time',
      label: APPOINTMENTS_TABLE_COLUMNS.TIME
    },
    {
      key: 'clientName',
      label: APPOINTMENTS_TABLE_COLUMNS.CLIENT
    },
    {
      key: 'barberName',
      label: APPOINTMENTS_TABLE_COLUMNS.BARBER
    },
    {
      key: 'services',
      label: APPOINTMENTS_TABLE_COLUMNS.SERVICES,
      render: (value) => value.length > 1
        ? APPOINTMENTS_TABLE_COLUMNS.MULTIPLE_SERVICES.replace('{count}', value.length)
        : APPOINTMENTS_TABLE_COLUMNS.SINGLE_SERVICE
    },
    {
      key: 'totalPrice',
      label: APPOINTMENTS_TABLE_COLUMNS.PRICE,
      render: (value) => `S/${value.toLocaleString()}`
    },
    {
      key: 'status',
      label: APPOINTMENTS_TABLE_COLUMNS.STATUS,
      render: (value, appointment) => renderStatusColumn(value, appointment)
    }
  ], []);

  /**
   * Renderizar columna de estado con botón de verificación
   */
  const renderStatusColumn = useCallback((status, appointment) => {
    const statusConfig = {
      [APPOINTMENT_STATUS.PENDING]: { color: APPOINTMENT_STATUS_COLORS[APPOINTMENT_STATUS.PENDING], label: APPOINTMENT_STATUS_LABELS[APPOINTMENT_STATUS.PENDING] },
      [PAYMENT_STATUS.PENDING_PAYMENT]: { color: 'bg-orange-100 text-orange-800', label: APPOINTMENT_STATUS_LABELS[PAYMENT_STATUS.PENDING_PAYMENT] || 'Pago por verificar' },
      [APPOINTMENT_STATUS.CONFIRMED]: { color: APPOINTMENT_STATUS_COLORS[APPOINTMENT_STATUS.CONFIRMED], label: APPOINTMENT_STATUS_LABELS[APPOINTMENT_STATUS.CONFIRMED] },
      [APPOINTMENT_STATUS.COMPLETED]: { color: APPOINTMENT_STATUS_COLORS[APPOINTMENT_STATUS.COMPLETED], label: APPOINTMENT_STATUS_LABELS[APPOINTMENT_STATUS.COMPLETED] },
      [APPOINTMENT_STATUS.CANCELLED]: { color: APPOINTMENT_STATUS_COLORS[APPOINTMENT_STATUS.CANCELLED], label: APPOINTMENT_STATUS_LABELS[APPOINTMENT_STATUS.CANCELLED] }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };

    return (
      <div className="flex items-center space-x-2">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
          {config.label}
        </span>
        {status === PAYMENT_STATUS.PENDING_PAYMENT && (user?.role === 'super_admin' || user?.role === 'branch_admin') && (
          <button
            onClick={() => handlePaymentVerification(appointment)}
            className="text-xs px-2 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center space-x-1"
          >
            <span>💰</span>
            <span>{PAYMENT_VERIFICATION_LABELS.VERIFY_BUTTON}</span>
          </button>
        )}
      </div>
    );
  }, [user?.role]);

  /**
   * Generar HTML de alerta de seguridad
   */
  const generateSecurityAlert = useCallback((client) => {
    const hasSecurityFlags = client?.securityFlags?.falseVouchersCount > 0;
    const isBlacklisted = client?.securityFlags?.blacklisted;

    if (!hasSecurityFlags && !isBlacklisted) return '';

    return `
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
        <div class="flex items-start space-x-2">
          <svg class="h-5 w-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div class="text-sm">
            <p class="font-bold text-red-800 dark:text-red-200">${PAYMENT_VERIFICATION_LABELS.SECURITY_ALERT}</p>
            ${isBlacklisted ?
              `<p class="text-red-700 dark:text-red-300">${PAYMENT_VERIFICATION_LABELS.CLIENT_BLOCKED}</p>` :
              `<p class="text-red-700 dark:text-red-300">${PAYMENT_VERIFICATION_LABELS.FALSE_VOUCHERS_COUNT.replace('{count}', client.securityFlags.falseVouchersCount)}</p>`
            }
            ${client.securityFlags?.lastRejectionDate ?
              `<p class="text-xs text-red-600 dark:text-red-400 mt-1">${PAYMENT_VERIFICATION_LABELS.LAST_REJECTION.replace('{date}', new Date(client.securityFlags.lastRejectionDate).toLocaleDateString())}</p>` : ''
            }
          </div>
        </div>
      </div>
    `;
  }, []);

  /**
   * Detectar si la razón indica fraude
   */
  const isFraudSuspected = useCallback((reason) => {
    return FRAUD_DETECTION_KEYWORDS.some(keyword =>
      reason.toLowerCase().includes(keyword)
    );
  }, []);

  /**
   * Manejar verificación de pagos
   */
  const handlePaymentVerification = useCallback(async (appointment) => {
    const client = clients.find(c => c.id === appointment.clientId);
    const securityAlertHtml = generateSecurityAlert(client);

    const result = await Swal.fire({
      title: PAYMENT_VERIFICATION_LABELS.TITLE,
      html: `
        <div class="text-left space-y-4">
          ${securityAlertHtml}
          <div>
            <strong>${PAYMENT_VERIFICATION_LABELS.CLIENT_LABEL}</strong> ${appointment.clientName}<br>
            <strong>${PAYMENT_VERIFICATION_LABELS.DATE_LABEL}</strong> ${new Date(appointment.date).toLocaleDateString()}<br>
            <strong>${PAYMENT_VERIFICATION_LABELS.TIME_LABEL}</strong> ${appointment.time}<br>
            <strong>${PAYMENT_VERIFICATION_LABELS.TOTAL_LABEL}</strong> S/${appointment.totalPrice?.toLocaleString()}<br>
            <strong>${PAYMENT_VERIFICATION_LABELS.METHOD_LABEL}</strong> ${getPaymentMethodName(appointment.paymentMethod)}<br>
            <strong>${PAYMENT_VERIFICATION_LABELS.OPERATION_LABEL}</strong> ${appointment.voucherNumber || PAYMENT_VERIFICATION_LABELS.NO_OPERATION}
          </div>
          ${appointment.voucherUrl ? `
            <div>
              <strong>${PAYMENT_VERIFICATION_LABELS.VOUCHER_LABEL}</strong><br>
              <img src="${appointment.voucherUrl}" alt="Voucher" class="w-full max-w-xs mx-auto mt-2 rounded border" />
            </div>
          ` : `<p class="text-red-500">${PAYMENT_VERIFICATION_LABELS.NO_VOUCHER}</p>`}
        </div>
      `,
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: PAYMENT_VERIFICATION_LABELS.APPROVE,
      denyButtonText: PAYMENT_VERIFICATION_LABELS.REJECT,
      cancelButtonText: PAYMENT_VERIFICATION_LABELS.CANCEL,
      confirmButtonColor: PAYMENT_VERIFICATION_COLORS.APPROVE,
      denyButtonColor: PAYMENT_VERIFICATION_COLORS.REJECT,
      width: '600px'
    });

    if (result.isConfirmed) {
      await handleApprovePayment(appointment);
    } else if (result.isDenied) {
      await handleRejectPayment(appointment);
    }
  }, [clients, generateSecurityAlert]);

  /**
   * Aprobar pago
   */
  const handleApprovePayment = useCallback(async (appointment) => {
    await updateAppointment(appointment.id, {
      status: APPOINTMENT_STATUS.CONFIRMED,
      paymentVerified: true,
      paymentVerifiedAt: new Date().toISOString(),
      paymentVerifiedBy: user.name
    });

    await Swal.fire({
      icon: 'success',
      title: PAYMENT_VERIFICATION_LABELS.APPROVED_TITLE,
      text: PAYMENT_VERIFICATION_LABELS.APPROVED_MESSAGE,
      confirmButtonColor: PAYMENT_VERIFICATION_COLORS.SUCCESS
    });
  }, [updateAppointment, user.name]);

  /**
   * Rechazar pago
   */
  const handleRejectPayment = useCallback(async (appointment) => {
    const { value: reason } = await Swal.fire({
      title: PAYMENT_VERIFICATION_LABELS.REJECTION_REASON_TITLE,
      input: 'textarea',
      inputPlaceholder: PAYMENT_VERIFICATION_LABELS.REJECTION_REASON_PLACEHOLDER,
      inputAttributes: {
        'aria-label': PAYMENT_VERIFICATION_LABELS.REJECTION_REASON_LABEL
      },
      showCancelButton: true,
      confirmButtonText: PAYMENT_VERIFICATION_LABELS.REJECT,
      confirmButtonColor: PAYMENT_VERIFICATION_COLORS.REJECT
    });

    if (reason) {
      await updateAppointment(appointment.id, {
        status: APPOINTMENT_STATUS.CANCELLED,
        paymentVerified: false,
        paymentRejectedReason: reason,
        paymentVerifiedAt: new Date().toISOString(),
        paymentVerifiedBy: user.name
      });

      // Detectar fraude automáticamente
      if (isFraudSuspected(reason)) {
        flagClientForFalseVoucher(appointment.clientId, reason, {
          voucherNumber: appointment.voucherNumber,
          amount: appointment.totalPrice,
          paymentMethod: appointment.paymentMethod,
          verifiedBy: user.name
        });
      }

      const updatedClient = clients.find(c => c.id === appointment.clientId);
      const isNowBlacklisted = updatedClient?.securityFlags?.blacklisted;

      await Swal.fire({
        icon: 'error',
        title: PAYMENT_VERIFICATION_LABELS.REJECTED_TITLE,
        html: `
          <p>${PAYMENT_VERIFICATION_LABELS.REJECTED_MESSAGE}</p>
          ${isNowBlacklisted ?
            `<p class="mt-2 text-red-600 font-bold">${PAYMENT_VERIFICATION_LABELS.CLIENT_BLACKLISTED}</p>` :
            ''
          }
        `,
        confirmButtonColor: PAYMENT_VERIFICATION_COLORS.SUCCESS
      });
    }
  }, [updateAppointment, user.name, isFraudSuspected, flagClientForFalseVoucher, clients]);

  /**
   * Alternar vista de calendario
   */
  const toggleCalendarView = useCallback(() => {
    setShowCalendar(prev => !prev);
  }, []);

  /**
   * Manejar éxito de creación de cita
   */
  const handleAppointmentSuccess = useCallback(() => {
    setShowForm(false);
    Swal.fire({
      icon: 'success',
      title: 'Cita creada',
      text: 'La cita se ha programado correctamente'
    });
  }, []);

  return {
    // Estados
    showCalendar,
    showForm,
    selectedTab,
    setShowForm,
    setSelectedTab,

    // Datos
    filteredAppointments,
    pendingPaymentCount,
    stats,
    shouldShowTabs,
    pageTitle,
    pageSubtitle,
    tableColumns,

    // Funciones
    handlePaymentVerification,
    toggleCalendarView,
    handleAppointmentSuccess
  };
};

export default useAppointmentsPage;