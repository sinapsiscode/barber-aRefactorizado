import { useState, useEffect } from 'react';
import { FiCalendar, FiPlus, FiClock, FiUser, FiScissors } from 'react-icons/fi';
import Swal from 'sweetalert2';

// Stores
import { useAppointmentStore, useAuthStore, useBranchStore, useClientStore } from '../stores';

// Components
import { DataTable, MetricCard } from '../components/common';
import AppointmentCalendar from '../components/appointments/AppointmentCalendar';
import AppointmentForm from '../components/appointments/AppointmentForm';
import AppointmentCard from '../components/appointments/AppointmentCard';
import AppointmentDetailModal from '../components/appointments/AppointmentDetailModal';
import AppointmentTabs from '../components/appointments/AppointmentTabs';
import AppointmentStatusBadge from '../components/appointments/AppointmentStatusBadge';
import AppointmentActionButtons from '../components/appointments/AppointmentActionButtons';
import EmptyAppointmentsState from '../components/appointments/EmptyAppointmentsState';

// Hooks
import { useAppointmentFilters } from '../hooks/useAppointmentFilters';
import { useAppointmentPermissions } from '../hooks/useAppointmentPermissions';

// Services
import {
  handlePaymentVerification,
  handleAppointmentApproval,
  handleAppointmentRejection
} from '../services/appointmentActionsService';

// Utils
import { formatPrice, getServicesDisplayText } from '../utils/appointmentUtils';

// Constants
import { TAB_TYPES } from '../constants/appointmentConstants';

/**
 * Componente principal de gestión de citas
 * Responsabilidades:
 * - Mostrar lista/calendario de citas
 * - Filtrar por estado y sede
 * - Aprobar/rechazar citas
 * - Verificar pagos
 */
const Appointments = () => {
  // Stores
  const {
    appointments,
    getAppointmentStats,
    loadMockData,
    updateAppointment,
    approveAppointment,
    rejectAppointment
  } = useAppointmentStore();

  const { user } = useAuthStore();
  const { selectedBranch } = useBranchStore();
  const { clients, flagClientForFalseVoucher } = useClientStore();

  // UI State
  const [showCalendar, setShowCalendar] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTab, setSelectedTab] = useState(TAB_TYPES.ALL);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentDetail, setShowAppointmentDetail] = useState(false);

  // Custom Hooks
  const { filteredAppointments, pendingPayment, pendingApproval } = useAppointmentFilters(
    appointments,
    user,
    selectedBranch,
    selectedTab
  );

  const permissions = useAppointmentPermissions(user);

  // Effects
  useEffect(() => {
    if (appointments.length === 0) {
      loadMockData();
    }
  }, []);

  useEffect(() => {
    if (permissions.isReception) {
      setSelectedTab(TAB_TYPES.PENDING_APPROVAL);
      setShowCalendar(false);
    }
  }, [permissions.isReception]);

  // Data
  const stats = getAppointmentStats();

  // Handlers
  const handleVerifyPayment = async (appointment) => {
    const client = clients.find(c => c.id === appointment.clientId);

    const result = await handlePaymentVerification({
      appointment,
      client,
      onApprove: updateAppointment,
      onReject: async (id, data) => {
        await updateAppointment(id, data);

        // Marcar cliente si es fraude
        if (data.paymentRejectedReason) {
          const { isFraud } = result;
          if (isFraud) {
            flagClientForFalseVoucher(appointment.clientId, data.paymentRejectedReason, {
              voucherNumber: appointment.voucherNumber,
              amount: appointment.totalPrice,
              paymentMethod: appointment.paymentMethod,
              verifiedBy: user.name
            });
          }
        }
      },
      userName: user.name
    });

    return result;
  };

  const handleApprove = async (appointment) => {
    await handleAppointmentApproval({
      appointment,
      userName: user.name,
      hasPermission: permissions.canApprove,
      onApprove: approveAppointment
    });
  };

  const handleReject = async (appointment) => {
    await handleAppointmentRejection({
      appointment,
      userName: user.name,
      hasPermission: permissions.canReject,
      onReject: rejectAppointment
    });
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetail(true);
  };

  const handleCloseDetail = () => {
    setShowAppointmentDetail(false);
    setSelectedAppointment(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    Swal.fire({
      icon: 'success',
      title: 'Cita creada',
      text: 'La cita se ha programado correctamente'
    });
  };

  // Table Columns Configuration
  const tableColumns = [
    {
      key: 'date',
      label: 'Fecha',
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'time',
      label: 'Hora'
    },
    {
      key: 'clientName',
      label: 'Cliente'
    },
    {
      key: 'barberName',
      label: 'Barbero'
    },
    {
      key: 'services',
      label: 'Servicios',
      render: (value) => getServicesDisplayText(value)
    },
    {
      key: 'totalPrice',
      label: 'Precio',
      render: (value) => formatPrice(value)
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value, appointment) => (
        <div className="flex items-center space-x-2">
          <AppointmentStatusBadge status={value} />
          <AppointmentActionButtons
            appointment={appointment}
            permissions={permissions}
            onVerifyPayment={handleVerifyPayment}
            onViewDetails={handleViewDetails}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      )
    }
  ];

  // Render Helper
  const getPageTitle = () => {
    if (permissions.isReception) {
      return 'Reservas Pendientes de Aprobación';
    }

    if (user?.role === 'super_admin' && selectedBranch) {
      return `Gestión de Citas - ${selectedBranch.name}`;
    }

    return 'Gestión de Citas';
  };

  const getPageSubtitle = () => {
    if (permissions.isReception) {
      return `Revisa y gestiona las ${pendingApproval} reservas que esperan tu aprobación`;
    }

    if (user?.role === 'super_admin' && selectedBranch) {
      return `Administra las citas y horarios de ${selectedBranch.city}`;
    }

    return 'Administra las citas y horarios';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {getPageTitle()}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {getPageSubtitle()}
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className={`btn-secondary ${showCalendar ? 'bg-primary-100' : ''}`}
          >
            <FiCalendar className="h-4 w-4 mr-2" />
            {showCalendar ? 'Lista' : 'Calendario'}
          </button>

          {permissions.canCreateAppointment && (
            <button onClick={() => setShowForm(true)} className="btn-primary">
              <FiPlus className="h-4 w-4 mr-2" />
              Nueva Cita
            </button>
          )}
        </div>
      </div>

      {/* Tabs - Solo para admins con citas pendientes */}
      {!permissions.isReception && (permissions.isAdmin && (pendingPayment > 0 || pendingApproval > 0)) && (
        <AppointmentTabs
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          pendingPaymentCount={pendingPayment}
          pendingApprovalCount={pendingApproval}
          showPaymentTab={permissions.canVerifyPayment}
          showApprovalTab={permissions.canApprove}
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Citas"
          value={stats.total}
          icon={FiCalendar}
          color="bg-blue-500"
        />
        <MetricCard
          title="Citas Hoy"
          value={stats.today}
          icon={FiClock}
          color="bg-green-500"
        />
        <MetricCard
          title="Confirmadas"
          value={stats.confirmed}
          icon={FiUser}
          color="bg-purple-500"
        />
        <MetricCard
          title="Completadas"
          value={stats.completed}
          icon={FiScissors}
          color="bg-emerald-500"
        />
      </div>

      {/* Content - Vista según rol */}
      {permissions.isReception ? (
        showCalendar ? (
          <AppointmentCalendar />
        ) : pendingApproval === 0 ? (
          <EmptyAppointmentsState />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {pendingApproval} Reservas Esperando Aprobación
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Revisa cada detalle antes de aprobar
              </div>
            </div>

            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                permissions={permissions}
                onViewDetails={handleViewDetails}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        )
      ) : (
        showCalendar ? (
          <AppointmentCalendar />
        ) : (
          <DataTable
            data={filteredAppointments}
            columns={tableColumns}
            searchable
            emptyMessage="No hay citas programadas"
          />
        )
      )}

      {/* Modals */}
      {showForm && (
        <AppointmentForm
          onClose={() => setShowForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {showAppointmentDetail && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          permissions={permissions}
          onClose={handleCloseDetail}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default Appointments;
