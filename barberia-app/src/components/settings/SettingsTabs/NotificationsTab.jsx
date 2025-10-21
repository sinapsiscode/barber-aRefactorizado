import { NOTIFICATION_LABELS } from '../../../constants/settings';

/**
 * Tab de configuración de notificaciones
 */
const NotificationsTab = ({ notifications, onToggleNotification }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Configuración de Notificaciones
        </h3>

        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => {
            const config = NOTIFICATION_LABELS[key];
            return (
              <div key={key} className="flex items-center justify-between py-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {config.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {config.description}
                  </p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => onToggleNotification(key)}
                    className="sr-only"
                  />
                  <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </div>
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NotificationsTab;
