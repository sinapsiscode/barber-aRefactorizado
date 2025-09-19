// ===================================================================
// 📋 CABECERA DE CITAS - COMPONENTE ESPECIALIZADO
// ===================================================================
// Cabecera principal de la página de gestión de citas

import React from 'react';
import { FiCalendar, FiPlus } from 'react-icons/fi';
import { APPOINTMENTS_PAGE_LABELS, APPOINTMENTS_STYLES } from '../../constants/appointments';

const AppointmentsHeader = ({
  pageTitle,
  pageSubtitle,
  showCalendar,
  onToggleCalendar,
  onNewAppointment
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {pageTitle}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {pageSubtitle}
        </p>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={onToggleCalendar}
          className={showCalendar ? APPOINTMENTS_STYLES.BUTTON.CALENDAR_ACTIVE : APPOINTMENTS_STYLES.BUTTON.CALENDAR_INACTIVE}
        >
          <FiCalendar className="h-4 w-4 mr-2" />
          {showCalendar ? APPOINTMENTS_PAGE_LABELS.LIST : APPOINTMENTS_PAGE_LABELS.CALENDAR}
        </button>
        <button
          onClick={onNewAppointment}
          className={APPOINTMENTS_STYLES.BUTTON.PRIMARY}
        >
          <FiPlus className="h-4 w-4 mr-2" />
          {APPOINTMENTS_PAGE_LABELS.NEW_APPOINTMENT}
        </button>
      </div>
    </div>
  );
};

export default AppointmentsHeader;