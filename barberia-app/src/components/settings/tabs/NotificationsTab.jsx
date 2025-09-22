import { SETTINGS_TEXTS, NOTIFICATION_LABELS } from '../../../constants/settingsPage';
import { isNotificationAvailableForRole } from '../../../utils/settingsHelpers';

const NotificationsTab = ({
  user,
  notifications,
  onNotificationChange
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {SETTINGS_TEXTS.NOTIFICATIONS_CONFIG}
        </h3>

        <div className="space-y-4">
          {Object.entries(NOTIFICATION_LABELS).map(([key, config]) => (
            isNotificationAvailableForRole(key, user?.role) && (
              <NotificationItem
                key={key}
                id={key}
                config={config}
                checked={notifications[key]}
                onChange={onNotificationChange}
              />
            )
          ))}
        </div>
      </div>
    </div>
  );
};

const NotificationItem = ({ id, config, checked, onChange }) => (
  <div className="flex items-start space-x-3">
    <div className="flex items-center h-5">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(id, e.target.checked)}
        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
      />
    </div>
    <div className="min-w-0 flex-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {config.title}
      </label>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {config.description}
      </p>
    </div>
  </div>
);

export default NotificationsTab;