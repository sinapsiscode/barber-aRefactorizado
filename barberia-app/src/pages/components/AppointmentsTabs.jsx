// ===================================================================
// 📑 PESTAÑAS DE CITAS - COMPONENTE ESPECIALIZADO
// ===================================================================
// Pestañas para filtrar entre todas las citas y pagos pendientes

import React from 'react';
import { APPOINTMENTS_TABS, APPOINTMENTS_STYLES } from '../../constants/appointments';

const AppointmentsTabs = ({
  selectedTab,
  pendingPaymentCount,
  onTabChange
}) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => onTabChange(APPOINTMENTS_TABS.ALL)}
          className={`${APPOINTMENTS_STYLES.TAB.BASE} ${
            selectedTab === APPOINTMENTS_TABS.ALL
              ? APPOINTMENTS_STYLES.TAB.ACTIVE
              : APPOINTMENTS_STYLES.TAB.INACTIVE
          }`}
        >
          {APPOINTMENTS_TABS.LABELS.ALL_APPOINTMENTS}
        </button>
        <button
          onClick={() => onTabChange(APPOINTMENTS_TABS.PENDING_PAYMENT)}
          className={`${APPOINTMENTS_STYLES.TAB.BASE} flex items-center space-x-2 ${
            selectedTab === APPOINTMENTS_TABS.PENDING_PAYMENT
              ? APPOINTMENTS_STYLES.TAB.PENDING_ACTIVE
              : APPOINTMENTS_STYLES.TAB.INACTIVE
          }`}
        >
          <span>{APPOINTMENTS_TABS.LABELS.PENDING_PAYMENTS}</span>
          {pendingPaymentCount > 0 && (
            <span className={APPOINTMENTS_STYLES.BADGE.COUNT}>
              {pendingPaymentCount}
            </span>
          )}
        </button>
      </nav>
    </div>
  );
};

export default AppointmentsTabs;