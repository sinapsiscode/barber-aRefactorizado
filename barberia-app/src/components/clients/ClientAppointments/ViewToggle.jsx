import { FiList, FiCalendar } from 'react-icons/fi';

/**
 * Componente toggle para cambiar entre vista lista y calendario
 * Líneas 168-191 del original
 */
const ViewToggle = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="flex items-center bg-gray-100 dark:bg-dark-700 rounded-lg p-1">
      <button
        onClick={() => onViewModeChange('list')}
        className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          viewMode === 'list'
            ? 'bg-white dark:bg-dark-600 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
      >
        <FiList className="h-4 w-4 mr-1" />
        Lista
      </button>
      <button
        onClick={() => onViewModeChange('calendar')}
        className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          viewMode === 'calendar'
            ? 'bg-white dark:bg-dark-600 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
      >
        <FiCalendar className="h-4 w-4 mr-1" />
        Calendario
      </button>
    </div>
  );
};

export default ViewToggle;
