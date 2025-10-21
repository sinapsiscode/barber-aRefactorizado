import { CLIENT_PROFILE_TEXTS } from '../../../constants/clientProfile';

/**
 * Card de estadísticas del cliente
 */
const ClientStats = ({ client }) => {
  return (
    <div className="card">
      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
        {CLIENT_PROFILE_TEXTS.statsTitle}
      </h4>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">{CLIENT_PROFILE_TEXTS.totalVisitsLabel}</span>
          <span className="font-semibold text-blue-600">{client.totalVisits}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">{CLIENT_PROFILE_TEXTS.totalSpentLabel}</span>
          <span className="font-semibold text-green-600">
            S/{client.totalSpent?.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">{CLIENT_PROFILE_TEXTS.pointsAvailableLabel}</span>
          <span className="font-semibold text-yellow-600">{client.loyaltyPoints}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">{CLIENT_PROFILE_TEXTS.lastVisitLabel}</span>
          <span className="font-semibold">
            {client.lastVisit
              ? new Date(client.lastVisit).toLocaleDateString()
              : CLIENT_PROFILE_TEXTS.neverLabel
            }
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">{CLIENT_PROFILE_TEXTS.clientSinceLabel}</span>
          <span className="font-semibold">
            {new Date(client.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClientStats;
