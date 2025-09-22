import { FiFilter, FiPlus } from 'react-icons/fi';
import { CALENDAR_TEXTS } from '../../constants/receptionCalendar';

const CalendarHeader = ({
  showFilters,
  activeFiltersCount,
  onToggleFilters
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {CALENDAR_TEXTS.TITLE}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {CALENDAR_TEXTS.SUBTITLE}
        </p>
      </div>
      <div className="flex items-center space-x-3">
        <FilterToggleButton
          showFilters={showFilters}
          activeFiltersCount={activeFiltersCount}
          onToggle={onToggleFilters}
        />
        <button className="btn-primary">
          <FiPlus className="h-4 w-4 mr-2" />
          {CALENDAR_TEXTS.NEW_APPOINTMENT}
        </button>
      </div>
    </div>
  );
};

const FilterToggleButton = ({ showFilters, activeFiltersCount, onToggle }) => (
  <button
    onClick={onToggle}
    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors relative ${
      showFilters
        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-dark-700 dark:text-gray-300 dark:hover:bg-dark-600'
    }`}
  >
    <FiFilter className="h-4 w-4 mr-2" />
    {CALENDAR_TEXTS.FILTERS}
    {activeFiltersCount > 0 && (
      <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {activeFiltersCount}
      </span>
    )}
  </button>
);

export default CalendarHeader;