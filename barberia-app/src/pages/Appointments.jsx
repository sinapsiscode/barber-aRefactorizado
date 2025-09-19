import { useState, useEffect } from 'react';
import { FiCalendar, FiPlus, FiClock, FiUser, FiScissors, FiDollarSign, FiCheck, FiX, FiAlertTriangle, FiImage } from 'react-icons/fi';
import { useAppointmentStore, useAuthStore, useBranchStore, useClientStore } from '../stores';
import { DataTable, MetricCard, EmptyState } from '../components/common';
import AppointmentCalendar from '../components/appointments/AppointmentCalendar';
import AppointmentForm from '../components/appointments/AppointmentForm';
import { getPaymentMethodName } from '../utils/paymentUtils';
import Swal from 'sweetalert2';

const Appointments = () => {
  const { appointments, getAppointmentStats, loadMockAppointments, updateAppointment } = useAppointmentStore();
  const { user } = useAuthStore();
  const { selectedBranch } = useBranchStore();
  const { clients, flagClientForFalseVoucher } = useClientStore();
  const [showCalendar, setShowCalendar] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showPaymentVerification, setShowPaymentVerification] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all'); // all, pending_payment

  useEffect(() => {
    if (appointments.length === 0) {
      loadMockAppointments();
    }
  }, []);

  // Filtrar citas según la sede seleccionada (solo para super admin)
  let filteredAppointments = user?.role === 'super_admin' && selectedBranch 
    ? appointments.filter(appointment => appointment.branchId === selectedBranch.id)
    : appointments;
    
  // Filtrar por tab seleccionado
  if (selectedTab === 'pending_payment') {
    filteredAppointments = filteredAppointments.filter(apt => apt.status === 'pending_payment');
  }
  
  // Contar citas pendientes de pago
  const pendingPaymentCount = appointments.filter(apt => apt.status === 'pending_payment').length;

  const stats = getAppointmentStats();

  const columns = [
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
      render: (value) => value.length > 1 ? `${value.length} servicios` : 'Corte'
    },
    {
      key: 'totalPrice',
      label: 'Precio',
      render: (value) => `S/${value.toLocaleString()}`
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value, appointment) => {
        const colors = {
          pending: 'bg-yellow-100 text-yellow-800',
          pending_payment: 'bg-orange-100 text-orange-800',
          confirmed: 'bg-blue-100 text-blue-800',
          completed: 'bg-green-100 text-green-800',
          cancelled: 'bg-red-100 text-red-800'
        };
        const labels = {
          pending: 'Pendiente',
          pending_payment: 'Pago por verificar',
          confirmed: 'Confirmada',
          completed: 'Completada',
          cancelled: 'Cancelada'
        };
        return (
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[value]}`}>
              {labels[value]}
            </span>
            {value === 'pending_payment' && (user?.role === 'super_admin' || user?.role === 'branch_admin') && (
              <button
                onClick={() => handlePaymentVerification(appointment)}
                className="text-xs px-2 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center space-x-1"
              >
                <FiDollarSign className="h-3 w-3" />
                <span>Verificar</span>
              </button>
            )}
          </div>
        );
      }
    }
  ];

  /**
   * FUNCIÓN CENTRAL DE VERIFICACIÓN DE PAGOS
   * 
   * Maneja todo el flujo de verificación de vouchers con:
   * - Detección de clientes con historial problemático
   * - Alertas visuales según el nivel de riesgo
   * - Opciones para aprobar o rechazar el pago
   * - Sistema automático de marcado si el voucher es falso
   * 
   * @param {Object} appointment - Cita con pago pendiente de verificación
   */
  const handlePaymentVerification = (appointment) => {
    // PASO 1: Buscar historial de seguridad del cliente
    const client = clients.find(c => c.id === appointment.clientId);
    const hasSecurityFlags = client?.securityFlags?.falseVouchersCount > 0;
    const isBlacklisted = client?.securityFlags?.blacklisted;
    
    Swal.fire({
      title: 'Verificar Pago',
      html: `
        <div class="text-left space-y-4">
          ${(hasSecurityFlags || isBlacklisted) ? `
            <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
              <div class="flex items-start space-x-2">
                <svg class="h-5 w-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div class="text-sm">
                  <p class="font-bold text-red-800 dark:text-red-200">⚠️ ALERTA DE SEGURIDAD</p>
                  ${isBlacklisted ? 
                    '<p class="text-red-700 dark:text-red-300">Cliente BLOQUEADO por múltiples vouchers falsos</p>' :
                    `<p class="text-red-700 dark:text-red-300">Este cliente tiene ${client.securityFlags.falseVouchersCount} voucher(es) falso(s) registrado(s)</p>`
                  }
                  ${client.securityFlags?.lastRejectionDate ? 
                    `<p class="text-xs text-red-600 dark:text-red-400 mt-1">Último rechazo: ${new Date(client.securityFlags.lastRejectionDate).toLocaleDateString()}</p>` : ''
                  }
                </div>
              </div>
            </div>
          ` : ''}
          <div>
            <strong>Cliente:</strong> ${appointment.clientName}<br>
            <strong>Fecha:</strong> ${new Date(appointment.date).toLocaleDateString()}<br>
            <strong>Hora:</strong> ${appointment.time}<br>
            <strong>Total:</strong> S/${appointment.totalPrice?.toLocaleString()}<br>
            <strong>Método:</strong> ${getPaymentMethodName(appointment.paymentMethod)}<br>
            <strong>N° Operación:</strong> ${appointment.voucherNumber || 'No especificado'}
          </div>
          ${appointment.voucherUrl ? `
            <div>
              <strong>Comprobante:</strong><br>
              <img src="${appointment.voucherUrl}" alt="Voucher" class="w-full max-w-xs mx-auto mt-2 rounded border" />
            </div>
          ` : '<p class="text-red-500">No se subió comprobante</p>'}
        </div>
      `,
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: '✓ Aprobar Pago',
      denyButtonText: '✗ Rechazar Pago',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#10b981',
      denyButtonColor: '#ef4444',
      width: '600px'
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Aprobar pago
        await updateAppointment(appointment.id, { 
          status: 'confirmed',
          paymentVerified: true,
          paymentVerifiedAt: new Date().toISOString(),
          paymentVerifiedBy: user.name
        });
        Swal.fire({
          icon: 'success',
          title: 'Pago Aprobado',
          text: 'La cita ha sido confirmada',
          confirmButtonColor: '#ffc000'
        });
      } else if (result.isDenied) {
        // Rechazar pago
        const { value: reason } = await Swal.fire({
          title: 'Razón del rechazo',
          input: 'textarea',
          inputPlaceholder: 'Ingrese el motivo del rechazo...',
          inputAttributes: {
            'aria-label': 'Razón del rechazo'
          },
          showCancelButton: true,
          confirmButtonText: 'Rechazar',
          confirmButtonColor: '#ef4444'
        });
        
        if (reason) {
          // Actualizar la cita
          await updateAppointment(appointment.id, { 
            status: 'cancelled',
            paymentVerified: false,
            paymentRejectedReason: reason,
            paymentVerifiedAt: new Date().toISOString(),
            paymentVerifiedBy: user.name
          });
          
          // SISTEMA AUTOMÁTICO DE DETECCIÓN DE FRAUDE
          // Si la razón contiene palabras clave de fraude, marca al cliente
          if (reason.toLowerCase().includes('falso') || 
              reason.toLowerCase().includes('fake') || 
              reason.toLowerCase().includes('editado') ||
              reason.toLowerCase().includes('no válido') ||
              reason.toLowerCase().includes('no existe')) {
            flagClientForFalseVoucher(appointment.clientId, reason, {
              voucherNumber: appointment.voucherNumber,
              amount: appointment.totalPrice,
              paymentMethod: appointment.paymentMethod,
              verifiedBy: user.name
            });
          }
          
          const updatedClient = clients.find(c => c.id === appointment.clientId);
          const isNowBlacklisted = updatedClient?.securityFlags?.blacklisted;
          
          Swal.fire({
            icon: 'error',
            title: 'Pago Rechazado',
            html: `
              <p>La cita ha sido cancelada</p>
              ${isNowBlacklisted ? 
                '<p class="mt-2 text-red-600 font-bold">⚠️ CLIENTE BLOQUEADO por múltiples intentos de fraude</p>' : 
                ''
              }
            `,
            confirmButtonColor: '#ffc000'
          });
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Citas
            {user?.role === 'super_admin' && selectedBranch && (
              <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-2">
                - {selectedBranch.name}
              </span>
            )}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {user?.role === 'super_admin' && selectedBranch 
              ? `Administra las citas y horarios de ${selectedBranch.city}`
              : 'Administra las citas y horarios'
            }
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
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            <FiPlus className="h-4 w-4 mr-2" />
            Nueva Cita
          </button>
        </div>
      </div>

      {/* TABS DE NAVEGACIÓN - Solo visibles para admins cuando hay pagos pendientes
          Permite filtrar entre todas las citas y las que requieren verificación */}
      {(user?.role === 'super_admin' || user?.role === 'branch_admin') && pendingPaymentCount > 0 && (
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setSelectedTab('all')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'all'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Todas las citas
            </button>
            <button
              onClick={() => setSelectedTab('pending_payment')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                selectedTab === 'pending_payment'
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span>Pagos pendientes</span>
              {pendingPaymentCount > 0 && (
                <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {pendingPaymentCount}
                </span>
              )}
            </button>
          </nav>
        </div>
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

      {/* Calendar or Table View */}
      {showCalendar ? (
        <AppointmentCalendar />
      ) : (
        <DataTable
          data={filteredAppointments}
          columns={columns}
          searchable
          emptyMessage="No hay citas programadas"
        />
      )}

      {/* Appointment Form Modal */}
      {showForm && (
        <AppointmentForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            Swal.fire({
              icon: 'success',
              title: 'Cita creada',
              text: 'La cita se ha programado correctamente'
            });
          }}
        />
      )}
    </div>
  );
};

export default Appointments;