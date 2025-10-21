/**
 * Servicio para manejar acciones sobre citas (aprobar, rechazar, verificar pagos)
 * Separa la lógica de negocio compleja de los componentes UI
 */

import Swal from 'sweetalert2';
import { getPaymentMethodName } from '../utils/paymentUtils';
import { containsFraudKeywords, formatPrice } from '../utils/appointmentUtils';
import { REJECTION_REASONS } from '../constants/appointmentConstants';

/**
 * Maneja el flujo completo de verificación de pagos
 * Incluye detección de fraude y alertas de seguridad
 */
export const handlePaymentVerification = async ({
  appointment,
  client,
  onApprove,
  onReject,
  userName
}) => {
  const hasSecurityFlags = client?.securityFlags?.falseVouchersCount > 0;
  const isBlacklisted = client?.securityFlags?.blacklisted;

  const result = await Swal.fire({
    title: 'Verificar Pago',
    html: buildPaymentVerificationHTML(appointment, client, hasSecurityFlags, isBlacklisted),
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: '✓ Aprobar Pago',
    denyButtonText: '✗ Rechazar Pago',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#10b981',
    denyButtonColor: '#ef4444',
    width: '600px'
  });

  if (result.isConfirmed) {
    return await approvePayment(appointment, userName, onApprove);
  } else if (result.isDenied) {
    return await rejectPayment(appointment, client, userName, onReject);
  }

  return { success: false, cancelled: true };
};

/**
 * Construye el HTML para el modal de verificación de pago
 */
const buildPaymentVerificationHTML = (appointment, client, hasSecurityFlags, isBlacklisted) => {
  const securityAlert = (hasSecurityFlags || isBlacklisted) ? `
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
  ` : '';

  const voucherSection = appointment.voucherUrl ? `
    <div>
      <strong>Comprobante:</strong><br>
      <img src="${appointment.voucherUrl}" alt="Voucher" class="w-full max-w-xs mx-auto mt-2 rounded border" />
    </div>
  ` : '<p class="text-red-500">No se subió comprobante</p>';

  return `
    <div class="text-left space-y-4">
      ${securityAlert}
      <div>
        <strong>Cliente:</strong> ${appointment.clientName}<br>
        <strong>Fecha:</strong> ${new Date(appointment.date).toLocaleDateString()}<br>
        <strong>Hora:</strong> ${appointment.time}<br>
        <strong>Total:</strong> ${formatPrice(appointment.totalPrice)}<br>
        <strong>Método:</strong> ${getPaymentMethodName(appointment.paymentMethod)}<br>
        <strong>N° Operación:</strong> ${appointment.voucherNumber || 'No especificado'}
      </div>
      ${voucherSection}
    </div>
  `;
};

/**
 * Aprueba el pago de una cita
 */
const approvePayment = async (appointment, userName, onApprove) => {
  await onApprove(appointment.id, {
    status: 'confirmed',
    paymentVerified: true,
    paymentVerifiedAt: new Date().toISOString(),
    paymentVerifiedBy: userName
  });

  await Swal.fire({
    icon: 'success',
    title: 'Pago Aprobado',
    text: 'La cita ha sido confirmada',
    confirmButtonColor: '#ffc000'
  });

  return { success: true };
};

/**
 * Rechaza el pago de una cita
 */
const rejectPayment = async (appointment, client, userName, onReject) => {
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

  if (!reason) {
    return { success: false, cancelled: true };
  }

  await onReject(appointment.id, {
    status: 'cancelled',
    paymentVerified: false,
    paymentRejectedReason: reason,
    paymentVerifiedAt: new Date().toISOString(),
    paymentVerifiedBy: userName
  });

  // Detectar fraude automáticamente
  const isFraud = containsFraudKeywords(reason);
  const isNowBlacklisted = client?.securityFlags?.blacklisted;

  await Swal.fire({
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

  return { success: true, isFraud };
};

/**
 * Maneja la aprobación de una cita
 */
export const handleAppointmentApproval = async ({
  appointment,
  userName,
  hasPermission,
  onApprove
}) => {
  if (!hasPermission) {
    await Swal.fire({
      title: 'Acceso Denegado',
      text: 'Solo el Administrador de Sede puede aprobar reservas',
      icon: 'error',
      confirmButtonColor: '#ffc000'
    });
    return { success: false };
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

  if (notes === undefined) {
    return { success: false, cancelled: true };
  }

  const result = await onApprove(appointment.id, {
    approvedBy: userName,
    notes: notes || ''
  });

  if (result.success) {
    await Swal.fire({
      title: 'Cita Aprobada',
      text: `La cita de ${appointment.clientName} ha sido confirmada`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  }

  return result;
};

/**
 * Maneja el rechazo de una cita
 */
export const handleAppointmentRejection = async ({
  appointment,
  userName,
  hasPermission,
  onReject
}) => {
  if (!hasPermission) {
    await Swal.fire({
      title: 'Acceso Denegado',
      text: 'Solo el Administrador de Sede puede rechazar reservas',
      icon: 'error',
      confirmButtonColor: '#ffc000'
    });
    return { success: false };
  }

  const { value: formValues } = await Swal.fire({
    title: 'Rechazar Cita',
    html: buildRejectionFormHTML(appointment),
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

  if (!formValues) {
    return { success: false, cancelled: true };
  }

  const result = await onReject(appointment.id, {
    rejectedBy: userName,
    reason: formValues.reason,
    notes: formValues.notes
  });

  if (result.success) {
    await Swal.fire({
      title: 'Cita Rechazada',
      text: `La cita de ${appointment.clientName} ha sido rechazada`,
      icon: 'warning',
      timer: 2000,
      showConfirmButton: false
    });
  }

  return result;
};

/**
 * Construye el HTML del formulario de rechazo
 */
const buildRejectionFormHTML = (appointment) => {
  const reasonOptions = REJECTION_REASONS.map(({ value, label }) =>
    `<option value="${value}">${label}</option>`
  ).join('');

  return `
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
          ${reasonOptions}
        </select>
      </div>
      <div>
        <label for="swal-notes" class="block text-sm font-medium mb-2">Comentarios adicionales</label>
        <textarea id="swal-notes" class="swal2-textarea w-full" placeholder="Explicar el motivo detalladamente..."></textarea>
      </div>
    </div>
  `;
};
