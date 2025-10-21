import { DASHBOARD_TEXTS } from '../../../constants/clientDashboard';

/**
 * Header del dashboard del cliente con saludo y tier de lealtad
 */
const ClientHeader = ({ currentClient, tier, currentPoints, onViewProfile }) => {
  return (
    <div className="bg-gradient-to-r from-primary-600/20 via-primary-500/25 to-primary-600/20 rounded-lg p-6 relative overflow-hidden shadow-lg border border-primary-400/20">
      {/* Premium golden overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-400/5 to-transparent" />

      <div className="relative flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            {DASHBOARD_TEXTS.greeting.replace('{name}', currentClient.name)}
          </h1>
          <p className="text-gray-700 dark:text-gray-300">{DASHBOARD_TEXTS.welcome}</p>
          <div className="flex items-center space-x-4 mt-3">
            <span className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-medium border border-primary-300 dark:border-primary-700">
              {DASHBOARD_TEXTS.category.replace('{tier}', tier)}
            </span>
            <span className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-medium border border-primary-300 dark:border-primary-700">
              {DASHBOARD_TEXTS.points.replace('{points}', currentPoints)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <button
            onClick={onViewProfile}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-all font-medium shadow-md hover:shadow-lg"
          >
            {DASHBOARD_TEXTS.viewProfile}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientHeader;
