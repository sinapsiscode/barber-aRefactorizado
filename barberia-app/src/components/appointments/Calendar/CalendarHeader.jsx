import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { MONTH_NAMES } from '../../../constants/calendar';

/**
 * Header del calendario con navegación
 */
const CalendarHeader = ({ currentDate, onNavigateMonth }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
      </h3>
      <div className="flex space-x-2">
        <button
          onClick={() => onNavigateMonth(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg"
        >
          <FiChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => onNavigateMonth(1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg"
        >
          <FiChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
