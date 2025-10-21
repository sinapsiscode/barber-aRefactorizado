import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { formatMonthYear } from '../../../../utils/clients/appointmentUI';

/**
 * Header del calendario con navegación de meses
 * Líneas 229-250 del original
 */
const CalendarHeader = ({ currentDate, onNavigate }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Calendario de Citas
      </h2>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => onNavigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-600 dark:text-gray-400"
        >
          <FiChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-lg font-medium text-gray-900 dark:text-white min-w-[200px] text-center">
          {formatMonthYear(currentDate)}
        </span>
        <button
          onClick={() => onNavigate(1)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-600 dark:text-gray-400"
        >
          <FiChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
