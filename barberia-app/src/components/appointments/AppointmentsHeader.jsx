import React from 'react';
import { FiCalendar, FiPlus } from 'react-icons/fi';
import { APPOINTMENTS_PAGE_LABELS, APPOINTMENTS_STYLES } from '../../constants/appointments';

const AppointmentsHeader = ({
  user,
  selectedBranch,
  showCalendar,
  onToggleView,
  onNewAppointment
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {APPOINTMENTS_PAGE_LABELS.TITLE}
          {user?.role === 'super_admin' && selectedBranch && (
            <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-2">
              - {selectedBranch.name}
            </span>
          )}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {user?.role === 'super_admin' && selectedBranch
            ? APPOINTMENTS_PAGE_LABELS.SUBTITLE_WITH_BRANCH.replace('{branch}', selectedBranch.city)
            : APPOINTMENTS_PAGE_LABELS.SUBTITLE
          }
        </p>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={onToggleView}
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