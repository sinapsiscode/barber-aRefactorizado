// ===================================================================
// 🔔 CONFIGURACIÓN DE AVISOS - COMPONENTE ESPECIALIZADO
// ===================================================================
// Panel de configuración de notificaciones para el cliente
import React from 'react';
import { FiBell, FiSettings } from 'react-icons/fi';

const ClientWarningSettings = ({
  warningSettings = { enabled: true, interval: 15 },
  onSettingsChange,
  getDaysSinceLastVisit,
  getNextWarningDays,
  lastWarningDate,
  title = "Configuración de Avisos"
}) => {
  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <FiBell className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>

      <div className="space-y-4">
        {/* Toggle de notificaciones */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Recibir notificaciones
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={warningSettings.enabled}
              onChange={(e) => onSettingsChange?.('enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500"></div>
          </label>
        </div>

        {/* Configuración cuando está habilitado */}
        {warningSettings.enabled && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Frecuencia de Avisos
              </label>
              <select
                value={warningSettings.interval}
                onChange={(e) => onSettingsChange?.('interval', parseInt(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value={7}>Cada 7 días</option>
                <option value={10}>Cada 10 días</option>
                <option value={15}>Cada 15 días</option>
                <option value={20}>Cada 20 días</option>
                <option value={30}>Cada 30 días</option>
              </select>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
              <div className="flex items-start space-x-2">
                <FiSettings className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-medium mb-1">Estado:</p>
                  <p>Última visita: <strong>{getDaysSinceLastVisit?.()}</strong></p>
                  <p>Próximo aviso en: <strong>{getNextWarningDays?.()} días</strong></p>
                  {lastWarningDate && (
                    <p>Último aviso: <strong>{new Date(lastWarningDate).toLocaleDateString()}</strong></p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Estado cuando está deshabilitado */}
        {!warningSettings.enabled && (
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No recibirás recordatorios automáticos
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientWarningSettings;