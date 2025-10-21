import { FiSun, FiMoon, FiMonitor, FiCheck } from 'react-icons/fi';
import useTheme from '../../../hooks/useTheme';

/**
 * Tab de preferencias de la aplicación
 */
const PreferencesTab = () => {
  const { themeMode, isDark, setLightMode, setDarkMode, setAutoMode } = useTheme();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Preferencias de la Aplicación
        </h3>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Apariencia
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Configura el tema de la aplicación
                </p>
              </div>
              <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                {themeMode === 'auto' ? 'Automático' : themeMode === 'dark' ? 'Oscuro' : 'Claro'}
              </span>
            </div>

            {/* Opciones de tema */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={setLightMode}
                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                  themeMode === 'light'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <FiSun className={`h-6 w-6 mb-2 ${
                  themeMode === 'light' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
                }`} />
                <span className={`text-sm font-medium ${
                  themeMode === 'light' ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Claro
                </span>
                {themeMode === 'light' && (
                  <FiCheck className="h-4 w-4 text-primary-600 dark:text-primary-400 mt-1" />
                )}
              </button>

              <button
                onClick={setDarkMode}
                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                  themeMode === 'dark'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <FiMoon className={`h-6 w-6 mb-2 ${
                  themeMode === 'dark' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
                }`} />
                <span className={`text-sm font-medium ${
                  themeMode === 'dark' ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Oscuro
                </span>
                {themeMode === 'dark' && (
                  <FiCheck className="h-4 w-4 text-primary-600 dark:text-primary-400 mt-1" />
                )}
              </button>

              <button
                onClick={setAutoMode}
                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                  themeMode === 'auto'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <FiMonitor className={`h-6 w-6 mb-2 ${
                  themeMode === 'auto' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
                }`} />
                <span className={`text-sm font-medium ${
                  themeMode === 'auto' ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Auto
                </span>
                {themeMode === 'auto' && (
                  <FiCheck className="h-4 w-4 text-primary-600 dark:text-primary-400 mt-1" />
                )}
              </button>
            </div>

            {themeMode === 'auto' && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-2">
                  <FiMonitor className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    <p className="font-medium mb-1">Modo Automático Activado</p>
                    <p>La aplicación cambiará automáticamente entre claro y oscuro según la configuración de tu sistema operativo.</p>
                    <p className="mt-1">
                      <strong>Actual:</strong> {isDark ? 'Oscuro' : 'Claro'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Idioma
            </label>
            <select className="input-field">
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Zona Horaria
            </label>
            <select className="input-field">
              <option value="America/Lima">Lima, Perú (GMT-5)</option>
              <option value="America/Bogota">Bogotá, Colombia (GMT-5)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesTab;
