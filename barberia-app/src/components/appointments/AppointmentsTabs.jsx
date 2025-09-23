import React from 'react';
import { APPOINTMENTS_TABS, APPOINTMENTS_STYLES } from '../../constants/appointments';

const AppointmentsTabs = ({ selectedTab, onTabChange, pendingPaymentCount }) => {
  const getTabClassName = (tab) => {
    const baseClass = APPOINTMENTS_STYLES.TAB.BASE;
    if (tab === APPOINTMENTS_TABS.ALL) {
      return `${baseClass} ${selectedTab === tab ? APPOINTMENTS_STYLES.TAB.ACTIVE : APPOINTMENTS_STYLES.TAB.INACTIVE}`;
    }
    if (tab === APPOINTMENTS_TABS.PENDING_PAYMENT) {
      return `${baseClass} flex items-center space-x-2 ${
        selectedTab === tab ? APPOINTMENTS_STYLES.TAB.PENDING_ACTIVE : APPOINTMENTS_STYLES.TAB.INACTIVE
      }`;
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => onTabChange(APPOINTMENTS_TABS.ALL)}
          className={getTabClassName(APPOINTMENTS_TABS.ALL)}
        >
          {APPOINTMENTS_TABS.LABELS.ALL_APPOINTMENTS}
        </button>
        <button
          onClick={() => onTabChange(APPOINTMENTS_TABS.PENDING_PAYMENT)}
          className={getTabClassName(APPOINTMENTS_TABS.PENDING_PAYMENT)}
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