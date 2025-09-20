import { FiPlus, FiList, FiCalendar } from 'react-icons/fi';
import { CLIENT_UI_TEXTS, CLIENT_VIEW_MODES } from '../../constants/clientAppointments';

const ClientAppointmentHeader = ({ viewMode, onViewModeChange, onNewAppointment }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {CLIENT_UI_TEXTS.TITLE}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {CLIENT_UI_TEXTS.SUBTITLE}
        </p>
      </div>
      <div className="flex items-center space-x-3">
        {/* Toggle Vista */}
        <div className="flex items-center bg-gray-100 dark:bg-dark-700 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange(CLIENT_VIEW_MODES.LIST)}
            className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === CLIENT_VIEW_MODES.LIST
                ? 'bg-white dark:bg-dark-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <FiList className="h-4 w-4 mr-1" />
            {CLIENT_UI_TEXTS.LIST_VIEW}
          </button>
          <button
            onClick={() => onViewModeChange(CLIENT_VIEW_MODES.CALENDAR)}
            className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === CLIENT_VIEW_MODES.CALENDAR
                ? 'bg-white dark:bg-dark-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <FiCalendar className="h-4 w-4 mr-1" />
            {CLIENT_UI_TEXTS.CALENDAR_VIEW}
          </button>
        </div>

        <button
          onClick={onNewAppointment}
          className="btn-primary"
        >
          <FiPlus className="h-4 w-4 mr-2" />
          {CLIENT_UI_TEXTS.NEW_BOOKING}
        </button>
      </div>
    </div>
  );
};

export default ClientAppointmentHeader;