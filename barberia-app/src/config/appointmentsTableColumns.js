import React from 'react';
import { FiDollarSign } from 'react-icons/fi';
import {
  APPOINTMENTS_TABLE_COLUMNS,
  APPOINTMENT_STATUS_COLORS,
  APPOINTMENT_STATUS_LABELS,
  PAYMENT_STATUS,
  PAYMENT_VERIFICATION_LABELS,
  APPOINTMENTS_STYLES
} from '../constants/appointments';

const AppointmentsTableColumns = (handlePaymentVerification, user) => [
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
    render: (value, appointment) => {
      const statusColors = {
        ...APPOINTMENT_STATUS_COLORS,
        [PAYMENT_STATUS.PENDING_PAYMENT]: 'bg-orange-100 text-orange-800'
      };

      const statusLabels = {
        ...APPOINTMENT_STATUS_LABELS,
        [PAYMENT_STATUS.PENDING_PAYMENT]: 'Pago por verificar'
      };

      return (
        <div className="flex items-center space-x-2">
          <span className={`${APPOINTMENTS_STYLES.BADGE.STATUS} ${statusColors[value]}`}>
            {statusLabels[value]}
          </span>
          {value === PAYMENT_STATUS.PENDING_PAYMENT &&
           (user?.role === 'super_admin' || user?.role === 'branch_admin') && (
            <button
              onClick={() => handlePaymentVerification(appointment)}
              className={APPOINTMENTS_STYLES.BUTTON.VERIFY}
            >
              <FiDollarSign className="h-3 w-3" />
              <span>{PAYMENT_VERIFICATION_LABELS.VERIFY_BUTTON}</span>
            </button>
          )}
        </div>
      );
    }
  }
];

export default AppointmentsTableColumns;