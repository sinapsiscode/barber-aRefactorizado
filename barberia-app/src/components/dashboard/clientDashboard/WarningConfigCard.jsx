import { FiBell, FiSettings } from 'react-icons/fi';
import { WARNING_INTERVAL_OPTIONS, DASHBOARD_TEXTS } from '../../../constants/clientDashboard';

/**
 * Card de configuración de avisos
 */
const WarningConfigCard = ({
  currentClient,
  warningSettings,
  onWarningSettingsChange,
  getDaysSinceLastVisit,
  getDaysUntilNextWarning
}) => {
  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <FiBell className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Configuración de Avisos
        </h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Recibir notificaciones
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={warningSettings.enabled}
              onChange={(e) => onWarningSettingsChange('enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500"></div>
          </label>
        </div>

        {warningSettings.enabled && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Frecuencia de Avisos
              </label>
              <select
                value={warningSettings.interval}
                onChange={(e) => onWarningSettingsChange('interval', parseInt(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-dark-700 dark:border-dark-600 dark:text-white"
              >
                {WARNING_INTERVAL_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900 p-3 rounded-lg">
              <div className="flex items-start space-x-2">
                <FiSettings className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-medium mb-1">Estado:</p>
                  <p>Última visita: <strong>{getDaysSinceLastVisit()}</strong></p>
                  <p>Próximo aviso en: <strong>{getDaysUntilNextWarning()} días</strong></p>
                  {currentClient.lastWarningDate && (
                    <p>Último aviso: <strong>{new Date(currentClient.lastWarningDate).toLocaleDateString()}</strong></p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {!warningSettings.enabled && (
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {DASHBOARD_TEXTS.noNotifications}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WarningConfigCard;
