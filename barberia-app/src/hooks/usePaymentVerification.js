import { useCallback } from 'react';
import Swal from 'sweetalert2';
import { useAppointmentStore } from '../stores/appointmentStore';
import { useAuthStore } from '../stores/authStore';
import { useClientStore } from '../stores/clientStore';
import {
  PAYMENT_VERIFICATION_LABELS,
  PAYMENT_VERIFICATION_COLORS,
  FRAUD_DETECTION_KEYWORDS,
  APPOINTMENT_STATUS
} from '../constants/appointments';
import { getPaymentMethodName } from '../utils/paymentUtils';

export const usePaymentVerification = () => {
  const { updateAppointment } = useAppointmentStore();
  const { user } = useAuthStore();
  const { clients, flagClientForFalseVoucher } = useClientStore();

  const checkFraudKeywords = (reason) => {
    return FRAUD_DETECTION_KEYWORDS.some(keyword =>
      reason.toLowerCase().includes(keyword)
    );
  };

  const buildSecurityAlert = (hasSecurityFlags, isBlacklisted, client) => {
    if (!hasSecurityFlags && !isBlacklisted) return '';

    return `
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
        <div class="flex items-start space-x-2">
          <svg class="h-5 w-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div class="text-sm">
            <p class="font-bold text-red-800 dark:text-red-200">${PAYMENT_VERIFICATION_LABELS.SECURITY_ALERT}</p>
            ${isBlacklisted
              ? `<p class="text-red-700 dark:text-red-300">${PAYMENT_VERIFICATION_LABELS.CLIENT_BLOCKED}</p>`
              : `<p class="text-red-700 dark:text-red-300">${PAYMENT_VERIFICATION_LABELS.FALSE_VOUCHERS_COUNT.replace('{count}', client.securityFlags.falseVouchersCount)}</p>`
            }
            ${client.securityFlags?.lastRejectionDate
              ? `<p class="text-xs text-red-600 dark:text-red-400 mt-1">${PAYMENT_VERIFICATION_LABELS.LAST_REJECTION.replace('{date}', new Date(client.securityFlags.lastRejectionDate).toLocaleDateString())}</p>`
              : ''
            }
          </div>
        </div>
      </div>
    `;
  };

  const buildAppointmentDetails = (appointment) => {
    return `
      <div>
        <strong>${PAYMENT_VERIFICATION_LABELS.CLIENT_LABEL}</strong> ${appointment.clientName}<br>
        <strong>${PAYMENT_VERIFICATION_LABELS.DATE_LABEL}</strong> ${new Date(appointment.date).toLocaleDateString()}<br>
        <strong>${PAYMENT_VERIFICATION_LABELS.TIME_LABEL}</strong> ${appointment.time}<br>
        <strong>${PAYMENT_VERIFICATION_LABELS.TOTAL_LABEL}</strong> S/${appointment.totalPrice?.toLocaleString()}<br>
        <strong>${PAYMENT_VERIFICATION_LABELS.METHOD_LABEL}</strong> ${getPaymentMethodName(appointment.paymentMethod)}<br>
        <strong>${PAYMENT_VERIFICATION_LABELS.OPERATION_LABEL}</strong> ${appointment.voucherNumber || PAYMENT_VERIFICATION_LABELS.NO_OPERATION}
      </div>
    `;
  };

  const buildVoucherDisplay = (appointment) => {
    if (!appointment.voucherUrl) {
      return `<p class="text-red-500">${PAYMENT_VERIFICATION_LABELS.NO_VOUCHER}</p>`;
    }
    return `
      <div>
        <strong>${PAYMENT_VERIFICATION_LABELS.VOUCHER_LABEL}</strong><br>
        <img src="${appointment.voucherUrl}" alt="Voucher" class="w-full max-w-xs mx-auto mt-2 rounded border" />
      </div>
    `;
  };

  const handleApproval = async (appointment) => {
    await updateAppointment(appointment.id, {
      status: APPOINTMENT_STATUS.CONFIRMED,
      paymentVerified: true,
      paymentVerifiedAt: new Date().toISOString(),
      paymentVerifiedBy: user.name
    });

    Swal.fire({
      icon: 'success',
      title: PAYMENT_VERIFICATION_LABELS.APPROVED_TITLE,
      text: PAYMENT_VERIFICATION_LABELS.APPROVED_MESSAGE,
      confirmButtonColor: PAYMENT_VERIFICATION_COLORS.SUCCESS
    });
  };

  const handleRejection = async (appointment, reason) => {
    await updateAppointment(appointment.id, {
      status: APPOINTMENT_STATUS.CANCELLED,
      paymentVerified: false,
      paymentRejectedReason: reason,
      paymentVerifiedAt: new Date().toISOString(),
      paymentVerifiedBy: user.name
    });

    if (checkFraudKeywords(reason)) {
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
      title: PAYMENT_VERIFICATION_LABELS.REJECTED_TITLE,
      html: `
        <p>${PAYMENT_VERIFICATION_LABELS.REJECTED_MESSAGE}</p>
        ${isNowBlacklisted
          ? `<p class="mt-2 text-red-600 font-bold">${PAYMENT_VERIFICATION_LABELS.CLIENT_BLACKLISTED}</p>`
          : ''
        }
      `,
      confirmButtonColor: PAYMENT_VERIFICATION_COLORS.SUCCESS
    });
  };

  const handlePaymentVerification = useCallback(async (appointment) => {
    const client = clients.find(c => c.id === appointment.clientId);
    const hasSecurityFlags = client?.securityFlags?.falseVouchersCount > 0;
    const isBlacklisted = client?.securityFlags?.blacklisted;

    const result = await Swal.fire({
      title: PAYMENT_VERIFICATION_LABELS.TITLE,
      html: `
        <div class="text-left space-y-4">
          ${buildSecurityAlert(hasSecurityFlags, isBlacklisted, client)}
          ${buildAppointmentDetails(appointment)}
          ${buildVoucherDisplay(appointment)}
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
      await handleApproval(appointment);
    } else if (result.isDenied) {
      const { value: reason } = await Swal.fire({
        title: PAYMENT_VERIFICATION_LABELS.REJECTION_REASON_TITLE,
        input: 'textarea',
        inputPlaceholder: PAYMENT_VERIFICATION_LABELS.REJECTION_REASON_PLACEHOLDER,
        inputAttributes: {
          'aria-label': PAYMENT_VERIFICATION_LABELS.REJECTION_REASON_LABEL
        },
        showCancelButton: true,
        confirmButtonText: PAYMENT_VERIFICATION_LABELS.REJECT.replace('✗ ', ''),
        confirmButtonColor: PAYMENT_VERIFICATION_COLORS.REJECT
      });

      if (reason) {
        await handleRejection(appointment, reason);
      }
    }
  }, [clients, user, updateAppointment, flagClientForFalseVoucher]);

  return { handlePaymentVerification };
};