/**
 * Componente de Tabs para filtrar clientes
 * Todos / Sospechosos / No Gratos
 */

import { FiAlertTriangle, FiUserX } from 'react-icons/fi';
import { shouldShowTabs } from '../../../utils/clients/clientFilters';
import { CLIENT_TABS } from '../../../constants/clients/clientStatus';

const ClientTabs = ({
  selectedTab,
  onTabChange,
  flaggedCount,
  unwelcomeCount,
  user
}) => {
  // Solo mostrar tabs si el usuario es admin y hay clientes especiales
  if (!shouldShowTabs(user, flaggedCount, unwelcomeCount)) {
    return null;
  }

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-8">
        {/* Tab: Todos los clientes */}
        <button
          onClick={() => onTabChange(CLIENT_TABS.ALL)}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            selectedTab === CLIENT_TABS.ALL
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Todos los clientes
        </button>

        {/* Tab: Clientes sospechosos (solo si hay) */}
        {flaggedCount > 0 && (
          <button
            onClick={() => onTabChange(CLIENT_TABS.FLAGGED)}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              selectedTab === CLIENT_TABS.FLAGGED
                ? 'border-red-500 text-red-600 dark:text-red-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <FiAlertTriangle className="h-4 w-4" />
            <span>Clientes sospechosos</span>
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
              {flaggedCount}
            </span>
          </button>
        )}

        {/* Tab: Clientes No Gratos (solo si hay) */}
        {unwelcomeCount > 0 && (
          <button
            onClick={() => onTabChange(CLIENT_TABS.UNWELCOME)}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              selectedTab === CLIENT_TABS.UNWELCOME
                ? 'border-red-500 text-red-600 dark:text-red-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <FiUserX className="h-4 w-4" />
            <span>Clientes No Gratos</span>
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
              {unwelcomeCount}
            </span>
          </button>
        )}
      </nav>
    </div>
  );
};

export default ClientTabs;
