import { FiClock, FiCalendar } from 'react-icons/fi';
import { DASHBOARD_TEXTS } from '../../../constants/clientDashboard';

/**
 * Card de historial reciente de citas
 */
const RecentHistoryCard = ({ recentHistory }) => {
  return (
    <div className="lg:col-span-2 card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Historial Reciente
        </h3>
        <FiClock className="h-5 w-5 text-gray-400" />
      </div>

      {recentHistory.length > 0 ? (
        <div className="space-y-4">
          {recentHistory.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <FiCalendar className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {appointment.services?.map(s => s).join(', ') || 'Servicio'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(appointment.date).toLocaleDateString()} • {appointment.barberName}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-green-600">
                  S/{appointment.totalPrice?.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  +{Math.floor(appointment.totalPrice / 25)} pts
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <FiClock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>{DASHBOARD_TEXTS.noHistory}</p>
        </div>
      )}
    </div>
  );
};

export default RecentHistoryCard;
