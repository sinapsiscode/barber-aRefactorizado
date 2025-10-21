import { useState, useEffect } from 'react';
import { FiCalendar, FiPlus, FiClock, FiUser, FiScissors, FiDollarSign, FiCheck, FiX, FiAlertTriangle, FiImage, FiEye, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useAppointmentStore, useAuthStore, useBranchStore, useClientStore } from '../stores';
import { DataTable, MetricCard, EmptyState } from '../components/common';
import AppointmentCalendar from '../components/appointments/AppointmentCalendar';
import AppointmentForm from '../components/appointments/AppointmentForm';
import { getPaymentMethodName } from '../utils/paymentUtils';
import Swal from 'sweetalert2';

const Appointments = () => {
  const {
    appointments,
    getAppointmentStats,
    loadMockData,
    updateAppointment,
    reviewAppointment,
    approveAppointment,
    rejectAppointment,
    getPendingAppointments,
    getAppointmentsByStatus,
    getReceptionStats
  } = useAppointmentStore();
  const { user } = useAuthStore();
  const { selectedBranch } = useBranchStore();
  const { clients, flagClientForFalseVoucher } = useClientStore();
  const [showCalendar, setShowCalendar] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showPaymentVerification, setShowPaymentVerification] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentDetail, setShowAppointmentDetail] = useState(false);

  useEffect(() => {
    // Cargar citas desde API
    if (appointments.length === 0) {
      loadMockData();
    }
  }, []);

  // Para recepción, siempre mostrar las citas pendientes de aprobación por defecto
  useEffect(() => {
    console.log('👤 USUARIO ACTUAL:', user);
    if (user?.role === 'reception') {
      console.log('👩‍💼 ES RECEPCIÓN - Configurando vista');
      setSelectedTab('pending_approval');
      setShowCalendar(false); // FORZAR vista de lista para recepción por defecto
    }
  }, [user?.role]);

  // Filtrar citas según la sede seleccionada (solo para super admin)
  let filteredAppointments = user?.role === 'super_admin' && selectedBranch 
    ? appointments.filter(appointment => appointment.branchId === selectedBranch.id)
    : appointments;
    
  // Filtrar por tab seleccionado
  if (selectedTab === 'pending_payment') {
    filteredAppointments = filteredAppointments.filter(apt => apt.status === 'pending_payment');
  } else if (selectedTab === 'pending_approval') {
    filteredAppointments = filteredAppointments.filter(apt => apt.status === 'pending' || apt.status === 'under_review');
  }

  // Contar citas pendientes de pago y aprobación
  const pendingPaymentCount = appointments.filter(apt => apt.status === 'pending_payment').length;
  const pendingApprovalCount = appointments.filter(apt => apt.status === 'pending' || apt.status === 'under_review').length;

  const stats = getAppointmentStats();
  const receptionStats = getReceptionStats();

  // Debug: Ver qué está pasando con las citas
  console.log('📋 CITAS DEBUG:', {
    totalAppointments: appointments.length,
    pendingCount: appointments.filter(apt => apt.status === 'pending').length,
    underReviewCount: appointments.filter(apt => apt.status === 'under_review').length,
    pendingApprovalCount,
    selectedTab,
    filteredCount: filteredAppointments.length,
    userRole: user?.role,
    showCalendar,
    appointments: appointments.map(apt => ({ id: apt.id, status: apt.status, clientName: apt.clientName })),
    filteredAppointments: filteredAppointments.map(apt => ({ id: apt.id, status: apt.status, clientName: apt.clientName }))
  });

  // Debug especial para renderizado
  console.log('🎯 RENDERIZADO DEBUG:', {
    isReception: user?.role === 'reception',
    showCalendar,
    pendingApprovalCount,
    shouldShowCards: user?.role === 'reception' && !showCalendar && pendingApprovalCount > 0
  });

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
          under_review: 'bg-purple-100 text-purple-800',
          pending_payment: 'bg-orange-100 text-orange-800',
          confirmed: 'bg-blue-100 text-blue-800',
          completed: 'bg-green-100 text-green-800',
          cancelled: 'bg-red-100 text-red-800',
          rejected: 'bg-red-100 text-red-800'
        };
        const labels = {
          pending: 'Pendiente Aprobación',
          under_review: 'En Revisión',
          pending_payment: 'Pago por verificar',
          confirmed: 'Confirmada',
          completed: 'Completada',
          cancelled: 'Cancelada',
          rejected: 'Rechazada'
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
            {(value === 'pending' || value === 'under_review') && (user?.role === 'super_admin' || user?.role === 'branch_admin') && (
              <div className="flex space-x-1">
                <button
                  onClick={() => handleViewAppointmentDetail(appointment)}
                  className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center space-x-1"
                >
                  <FiEye className="h-3 w-3" />
                  <span>Ver</span>
                </button>
                <button
                  onClick={() => handleApproveAppointment(appointment)}
                  className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center space-x-1"
                >
                  <FiCheckCircle className="h-3 w-3" />
                  <span>Aprobar</span>
                </button>
                <button
                  onClick={() => handleRejectAppointment(appointment)}
                  className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center space-x-1"
                >
                  <FiXCircle className="h-3 w-3" />
                  <span>Rechazar</span>
                </button>
              </div>
            )}
            {/* Botón solo de ver para recepción */}
            {(value === 'pending' || value === 'under_review') && user?.role === 'reception' && (
              <button
                onClick={() => handleViewAppointmentDetail(appointment)}
                className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center space-x-1"
              >
                <FiEye className="h-3 w-3" />
                <span>Ver Detalles</span>
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

  // Funciones para el sistema de aprobación de citas
  const handleViewAppointmentDetail = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetail(true);
  };

  const handleApproveAppointment = async (appointment) => {
    // Validar permisos - Solo branch_admin y super_admin
    if (user?.role !== 'branch_admin' && user?.role !== 'super_admin') {
      Swal.fire({
        title: 'Acceso Denegado',
        text: 'Solo el Administrador de Sede puede aprobar reservas',
        icon: 'error',
        confirmButtonColor: '#ffc000'
      });
      return;
    }

    const { value: notes } = await Swal.fire({
      title: 'Aprobar Cita',
      text: `¿Confirmar la cita de ${appointment.clientName}?`,
      input: 'textarea',
      inputLabel: 'Notas adicionales (opcional)',
      inputPlaceholder: 'Agregar comentarios sobre la aprobación...',
      showCancelButton: true,
      confirmButtonText: 'Aprobar Cita',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#059669',
      icon: 'question'
    });

    if (notes !== undefined) {
      const result = await approveAppointment(appointment.id, {
        approvedBy: user.name,
        notes: notes || ''
      });

      if (result.success) {
        Swal.fire({
          title: 'Cita Aprobada',
          text: `La cita de ${appointment.clientName} ha sido confirmada`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    }
  };

  const handleRejectAppointment = async (appointment) => {
    // Validar permisos - Solo branch_admin y super_admin
    if (user?.role !== 'branch_admin' && user?.role !== 'super_admin') {
      Swal.fire({
        title: 'Acceso Denegado',
        text: 'Solo el Administrador de Sede puede rechazar reservas',
        icon: 'error',
        confirmButtonColor: '#ffc000'
      });
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: 'Rechazar Cita',
      html: `
        <div class="text-left space-y-4">
          <div>
            <strong>Cliente:</strong> ${appointment.clientName}<br>
            <strong>Fecha:</strong> ${new Date(appointment.date).toLocaleDateString()}<br>
            <strong>Hora:</strong> ${appointment.time}
          </div>
          <div>
            <label for="swal-reason" class="block text-sm font-medium mb-2">Motivo del rechazo *</label>
            <select id="swal-reason" class="swal2-select w-full">
              <option value="">Seleccionar motivo...</option>
              <option value="horario_no_disponible">Horario no disponible</option>
              <option value="barbero_no_disponible">Barbero no disponible</option>
              <option value="información_incompleta">Información incompleta</option>
              <option value="conflicto_horario">Conflicto de horarios</option>
              <option value="mantenimiento">Mantenimiento programado</option>
              <option value="otro">Otro motivo</option>
            </select>
          </div>
          <div>
            <label for="swal-notes" class="block text-sm font-medium mb-2">Comentarios adicionales</label>
            <textarea id="swal-notes" class="swal2-textarea w-full" placeholder="Explicar el motivo detalladamente..."></textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Rechazar Cita',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      preConfirm: () => {
        const reason = document.getElementById('swal-reason').value;
        const notes = document.getElementById('swal-notes').value;

        if (!reason) {
          Swal.showValidationMessage('Debe seleccionar un motivo');
          return false;
        }

        return { reason, notes };
      }
    });

    if (formValues) {
      const result = await rejectAppointment(appointment.id, {
        rejectedBy: user.name,
        reason: formValues.reason,
        notes: formValues.notes
      });

      if (result.success) {
        Swal.fire({
          title: 'Cita Rechazada',
          text: `La cita de ${appointment.clientName} ha sido rechazada`,
          icon: 'warning',
          timer: 2000,
          showConfirmButton: false
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {user?.role === 'reception' ? 'Reservas Pendientes de Aprobación' : 'Gestión de Citas'}
            {user?.role === 'super_admin' && selectedBranch && (
              <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-2">
                - {selectedBranch.name}
              </span>
            )}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {user?.role === 'reception'
              ? `Revisa y gestiona las ${pendingApprovalCount} reservas que esperan tu aprobación`
              : user?.role === 'super_admin' && selectedBranch
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
          {user?.role !== 'reception' && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              <FiPlus className="h-4 w-4 mr-2" />
              Nueva Cita
            </button>
          )}
        </div>
      </div>

      {/* TABS DE NAVEGACIÓN - Solo para admins, recepción ve directo las pendientes */}
      {user?.role !== 'reception' && (((user?.role === 'super_admin' || user?.role === 'branch_admin') && pendingPaymentCount > 0) ||
        ((user?.role === 'super_admin' || user?.role === 'branch_admin') && pendingApprovalCount > 0)) && (
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
            {(user?.role === 'super_admin' || user?.role === 'branch_admin') && pendingPaymentCount > 0 && (
              <button
                onClick={() => setSelectedTab('pending_payment')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  selectedTab === 'pending_payment'
                    ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span>Pagos pendientes</span>
                <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {pendingPaymentCount}
                </span>
              </button>
            )}
            {(user?.role === 'super_admin' || user?.role === 'branch_admin') && pendingApprovalCount > 0 && (
              <button
                onClick={() => setSelectedTab('pending_approval')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  selectedTab === 'pending_approval'
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <FiClock className="h-4 w-4" />
                <span>Pendientes Aprobación</span>
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {pendingApprovalCount}
                </span>
              </button>
            )}
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

      {/* Vista para Recepción: Calendario o Lista de pendientes */}
      {(() => {
        console.log('🔍 EVALUANDO RENDERIZADO RECEPCIÓN:', {
          userRole: user?.role,
          isReception: user?.role === 'reception',
          showCalendar,
          pendingApprovalCount,
          filteredAppointmentsLength: filteredAppointments.length
        });
        return null;
      })()}

      {user?.role === 'reception' ? (
        showCalendar ? (
          <AppointmentCalendar />
        ) : (
          <div className="space-y-4">
            {/* Mensaje si no hay citas pendientes */}
            {pendingApprovalCount === 0 ? (
              <div className="text-center py-12">
                <FiCheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  ¡Todo al día!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No hay reservas pendientes de aprobación en este momento.
                </p>
              </div>
            ) : (
              /* Vista de tarjetas expandidas para recepción */
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {pendingApprovalCount} Reservas Esperando Aprobación
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Revisa cada detalle antes de aprobar
                  </div>
                </div>

                {filteredAppointments.map((appointment) => {
                  console.log('🎯 RENDERIZANDO CITA:', appointment);
                  return (
                  <div key={appointment.id} className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
                    {/* Header con cliente y estado */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <FiUser className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {appointment.clientName}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {appointment.clientPhone || 'Sin teléfono'} • {appointment.clientEmail || 'Sin email'}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        appointment.status === 'under_review' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100'
                      }`}>
                        {appointment.status === 'pending' ? 'Pendiente Aprobación' :
                         appointment.status === 'under_review' ? 'En Revisión' : appointment.status}
                      </span>
                    </div>

                    {/* Detalles de la cita */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-900 dark:text-white flex items-center">
                          <FiCalendar className="h-4 w-4 mr-2" />
                          Fecha y Hora
                        </h5>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {new Date(appointment.date).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-lg font-semibold text-blue-600">
                          {appointment.time}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-900 dark:text-white flex items-center">
                          <FiScissors className="h-4 w-4 mr-2" />
                          Servicio y Barbero
                        </h5>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {appointment.barberName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Duración: {appointment.duration} min
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-900 dark:text-white flex items-center">
                          <FiDollarSign className="h-4 w-4 mr-2" />
                          Precio Total
                        </h5>
                        <p className="text-2xl font-bold text-green-600">
                          S/{appointment.totalPrice}
                        </p>
                      </div>
                    </div>

                    {/* Notas especiales */}
                    {appointment.notes && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                        <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                          Notas Especiales:
                        </h5>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          {appointment.notes}
                        </p>
                      </div>
                    )}

                    {/* Botones de acción */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => handleViewAppointmentDetail(appointment)}
                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 flex items-center space-x-2"
                      >
                        <FiEye className="h-4 w-4" />
                        <span>Ver Detalles</span>
                      </button>
                      {/* Solo administradores pueden aprobar/rechazar */}
                      {(user?.role === 'super_admin' || user?.role === 'branch_admin') && (
                        <>
                          <button
                            onClick={() => handleRejectAppointment(appointment)}
                            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 flex items-center space-x-2"
                          >
                            <FiXCircle className="h-4 w-4" />
                            <span>Rechazar</span>
                          </button>
                          <button
                            onClick={() => handleApproveAppointment(appointment)}
                            className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 flex items-center space-x-2"
                          >
                            <FiCheckCircle className="h-4 w-4" />
                            <span>Aprobar Reserva</span>
                          </button>
                        </>
                      )}
                      {/* Mensaje informativo para recepción */}
                      {user?.role === 'reception' && (
                        <div className="px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded-md italic">
                          Solo el Administrador de Sede puede aprobar/rechazar reservas
                        </div>
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        )
      ) : (
        /* Vista original para admins */
        showCalendar ? (
          <AppointmentCalendar />
        ) : (
          <DataTable
            data={filteredAppointments}
            columns={columns}
            searchable
            emptyMessage="No hay citas programadas"
          />
        )
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

      {/* Appointment Detail Modal */}
      {showAppointmentDetail && selectedAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowAppointmentDetail(false)}></div>
            </div>

            <div className="inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white dark:bg-dark-800 px-6 py-4 border-b border-gray-200 dark:border-dark-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Detalle de Cita
                  </h3>
                  <button
                    onClick={() => setShowAppointmentDetail(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Información del Cliente */}
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <FiUser className="h-4 w-4 mr-2" />
                    Información del Cliente
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Nombre:</strong> {selectedAppointment.clientName}</p>
                    <p><strong>Teléfono:</strong> {selectedAppointment.clientPhone || 'No especificado'}</p>
                    <p><strong>Email:</strong> {selectedAppointment.clientEmail || 'No especificado'}</p>
                  </div>
                </div>

                {/* Información de la Cita */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <FiCalendar className="h-4 w-4 mr-2" />
                    Detalles de la Cita
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Fecha:</strong> {new Date(selectedAppointment.date).toLocaleDateString()}</p>
                      <p><strong>Hora:</strong> {selectedAppointment.time}</p>
                      <p><strong>Duración:</strong> {selectedAppointment.duration} min</p>
                    </div>
                    <div>
                      <p><strong>Barbero:</strong> {selectedAppointment.barberName}</p>
                      <p><strong>Precio Total:</strong> S/{selectedAppointment.totalPrice}</p>
                      <p><strong>Estado:</strong>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          selectedAppointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          selectedAppointment.status === 'under_review' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100'
                        }`}>
                          {selectedAppointment.status === 'pending' ? 'Pendiente' :
                           selectedAppointment.status === 'under_review' ? 'En Revisión' : selectedAppointment.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Servicios Solicitados */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <FiScissors className="h-4 w-4 mr-2" />
                    Servicios Solicitados
                  </h4>
                  <div className="space-y-2">
                    {selectedAppointment.services?.map((serviceId, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>Servicio {serviceId}</span>
                        <span>S/{(selectedAppointment.totalPrice / selectedAppointment.services.length).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notas */}
                {selectedAppointment.notes && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Notas Especiales</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{selectedAppointment.notes}</p>
                  </div>
                )}

                {/* Información de Revisión/Aprobación */}
                {selectedAppointment.reviewData && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Información de Revisión</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Revisado por:</strong> {selectedAppointment.reviewData.reviewedBy}</p>
                      <p><strong>Fecha:</strong> {new Date(selectedAppointment.reviewData.reviewedAt).toLocaleString()}</p>
                      {selectedAppointment.reviewData.notes && (
                        <p><strong>Notas:</strong> {selectedAppointment.reviewData.notes}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowAppointmentDetail(false)}
                    className="btn-secondary"
                  >
                    Cerrar
                  </button>
                  {/* Solo branch_admin y super_admin pueden aprobar/rechazar */}
                  {(selectedAppointment.status === 'pending' || selectedAppointment.status === 'under_review') &&
                   (user?.role === 'super_admin' || user?.role === 'branch_admin') && (
                    <>
                      <button
                        onClick={() => {
                          setShowAppointmentDetail(false);
                          handleApproveAppointment(selectedAppointment);
                        }}
                        className="btn-primary bg-green-600 hover:bg-green-700"
                      >
                        <FiCheckCircle className="h-4 w-4 mr-2" />
                        Aprobar
                      </button>
                      <button
                        onClick={() => {
                          setShowAppointmentDetail(false);
                          handleRejectAppointment(selectedAppointment);
                        }}
                        className="btn-primary bg-red-600 hover:bg-red-700"
                      >
                        <FiXCircle className="h-4 w-4 mr-2" />
                        Rechazar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;