// ===================================================================
// ⚠️ CONFIGURACIÓN DE AVISOS - COMPONENTE
// ===================================================================
// Sección de configuración de avisos del cliente
import React from 'react';
import { FiBell, FiBellOff } from 'react-icons/fi';
import { CLIENT_PROFILE_LABELS, CLIENT_WARNING_INTERVALS } from '../../../constants';
import { Card, Select } from '../../common';

const WarningConfig = ({
  client,
  warningSettings,
  onWarningSettingsChange,
  getDaysSinceLastVisit,
  calculateNextWarningDays
}) => {
  return (
    <Card>
      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
        {CLIENT_PROFILE_LABELS.SECTIONS.WARNING_CONFIG}
      </h4>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {warningSettings.enabled ? (
              <FiBell className="h-4 w-4 text-green-500" />
            ) : (
              <FiBellOff className="h-4 w-4 text-gray-400" />
            )}
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {CLIENT_PROFILE_LABELS.WARNINGS.NOTIFICATIONS_ENABLED}
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={warningSettings.enabled}
              onChange={(e) => onWarningSettingsChange('enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {warningSettings.enabled ? (
          <>
            <Select
              label={CLIENT_PROFILE_LABELS.WARNINGS.WARNING_INTERVAL}
              value={warningSettings.interval}
              onChange={(value) => onWarningSettingsChange('interval', parseInt(value))}
              options={CLIENT_WARNING_INTERVALS}
            />

            <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg space-y-2">
              <div className="text-sm">
                <span className="font-medium text-blue-900 dark:text-blue-100">
                  {CLIENT_PROFILE_LABELS.WARNINGS.CURRENT_STATUS}
                </span>
              </div>
              <div className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                <div>
                  {CLIENT_PROFILE_LABELS.WARNINGS.DAYS_SINCE_VISIT} {getDaysSinceLastVisit()}
                </div>
                <div>
                  {CLIENT_PROFILE_LABELS.WARNINGS.NEXT_WARNING_IN} {calculateNextWarningDays()} días
                </div>
                {client.lastWarning && (
                  <div>
                    {CLIENT_PROFILE_LABELS.WARNINGS.LAST_WARNING} {new Date(client.lastWarning).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400 italic">
            {CLIENT_PROFILE_LABELS.WARNINGS.DISABLED_MESSAGE}
          </div>
        )}
      </div>
    </Card>
  );
};

export default WarningConfig;