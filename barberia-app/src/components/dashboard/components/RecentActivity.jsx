// ===================================================================
// 🕒 ACTIVIDAD RECIENTE - COMPONENTE REUTILIZABLE
// ===================================================================
// Panel de actividad reciente para dashboards
import React from 'react';
import { FiClock } from 'react-icons/fi';
import { DASHBOARD_SECTIONS } from '../../../constants';

const RecentActivity = ({
  activities = [],
  title = DASHBOARD_SECTIONS.RECENT_ACTIVITY,
  maxItems = 5,
  showTime = true
}) => {
  const displayActivities = activities.slice(0, maxItems);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <FiClock className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-3">
        {displayActivities.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            No hay actividad reciente
          </p>
        ) : (
          displayActivities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              {activity.icon && (
                <div className={`p-2 rounded-full ${activity.iconColor || 'bg-blue-500'}`}>
                  <activity.icon className="w-4 h-4 text-white" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {activity.description}
                </p>
                {showTime && activity.timestamp && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {formatTime(activity.timestamp)}
                  </p>
                )}
              </div>

              {activity.status && (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  activity.status === 'success' ? 'bg-green-100 text-green-800' :
                  activity.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  activity.status === 'error' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {activity.statusText}
                </span>
              )}
            </div>
          ))
        )}
      </div>

      {activities.length > maxItems && (
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Ver todas las actividades
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;