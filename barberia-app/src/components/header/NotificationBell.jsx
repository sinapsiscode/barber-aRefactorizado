import { FiBell } from 'react-icons/fi';

/**
 * Campana de notificaciones con contador
 */
const NotificationBell = ({ notifications, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors ripple"
    >
      <FiBell className="h-5 w-5" />
      {notifications > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
          {notifications}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
