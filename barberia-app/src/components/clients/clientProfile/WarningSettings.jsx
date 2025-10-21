import { FiBell, FiSettings } from 'react-icons/fi';
import { WARNING_INTERVALS, CLIENT_PROFILE_TEXTS } from '../../../constants/clientProfile';

/**
 * Card de configuración de avisos/recordatorios del cliente
 */
const WarningSettings = ({ client, warningSettings, onSettingsChange, daysSinceLastVisit, getDaysUntilNextWarning }) => {
  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <FiBell className="h-5 w-5 text-yellow-500" />
        <h4 className="text-md font-semibold text-gray-900 dark:text-white">
          {CLIENT_PROFILE_TEXTS.warningConfigTitle}
        </h4>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {CLIENT_PROFILE_TEXTS.notificationsEnabledLabel}
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={warningSettings.enabled}
              onChange={(e) => onSettingsChange('enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500"></div>
          </label>
        </div>

        {warningSettings.enabled ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {CLIENT_PROFILE_TEXTS.warningIntervalLabel}
              </label>
              <select
                value={warningSettings.interval}
                onChange={(e) => onSettingsChange('interval', parseInt(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-dark-700 dark:border-dark-600 dark:text-white"
              >
                {WARNING_INTERVALS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900 p-3 rounded-lg">
              <div className="flex items-start space-x-2">
                <FiSettings className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-medium mb-1">{CLIENT_PROFILE_TEXTS.currentStatusLabel}</p>
                  <p>{CLIENT_PROFILE_TEXTS.daysSinceLastVisitLabel} <strong>{daysSinceLastVisit}</strong></p>
                  <p>{CLIENT_PROFILE_TEXTS.nextWarningLabel} <strong>
                    {getDaysUntilNextWarning(warningSettings.interval)} {CLIENT_PROFILE_TEXTS.daysLabel}
                  </strong></p>
                  {client.lastWarningDate && (
                    <p>{CLIENT_PROFILE_TEXTS.lastWarningLabel} <strong>{new Date(client.lastWarningDate).toLocaleDateString()}</strong></p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {CLIENT_PROFILE_TEXTS.notificationsDisabledText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WarningSettings;
