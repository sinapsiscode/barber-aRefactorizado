import { FiBell, FiX } from 'react-icons/fi';
import { NOTIFICATION_TITLES, NOTIFICATION_TYPES } from '../../constants/header';

/**
 * Dropdown de notificaciones con lista detallada
 */
const NotificationDropdown = ({
  user,
  notificationList,
  sending,
  onNotificationAction,
  onClose
}) => {
  const getNotificationTitle = () => {
    return NOTIFICATION_TITLES[user?.role] || NOTIFICATION_TITLES.default;
  };

  return (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-96 bg-white dark:bg-gray-950 rounded-lg elevation-8 z-50 max-h-96 overflow-visible">
      {/* Header del dropdown */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FiBell className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              {getNotificationTitle()}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ripple p-1 rounded"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {notificationList.length} notificación{notificationList.length !== 1 ? 'es' : ''} pendiente{notificationList.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Lista de notificaciones */}
      <div className="max-h-80 overflow-y-auto overflow-x-visible">
        {notificationList.length === 0 ? (
          <div className="px-8 py-6 text-center">
            <FiBell className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">
              No hay notificaciones pendientes
            </p>
          </div>
        ) : (
          notificationList.map((notification) => {
            const IconComponent = notification.icon;

            return (
              <div
                key={notification.id}
                className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded">
                      <IconComponent className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {notification.subtitle}
                      </p>
                      {notification.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {notification.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${notification.badgeColor}`}>
                    {notification.badge}
                  </span>
                </div>

                {/* Acciones para super_admin client warnings */}
                {notification.type === NOTIFICATION_TYPES.CLIENT_WARNING && (
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={() => onNotificationAction(notification, 'send')}
                      disabled={sending}
                      className="px-3 py-1 text-xs rounded bg-primary-600 hover:bg-primary-700 text-white transition-colors disabled:opacity-50 ripple"
                    >
                      Enviar
                    </button>
                    <button
                      onClick={() => onNotificationAction(notification, 'snooze')}
                      className="px-3 py-1 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors ripple"
                    >
                      +7d
                    </button>
                    <button
                      onClick={() => onNotificationAction(notification, 'disable')}
                      className="px-3 py-1 text-xs rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ripple"
                    >
                      Desactivar
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
