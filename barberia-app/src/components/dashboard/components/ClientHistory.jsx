// ===================================================================
// 📅 HISTORIAL DE CLIENTE - COMPONENTE ESPECIALIZADO
// ===================================================================
// Historial de citas del cliente con información detallada
import React from 'react';
import { FiCalendar, FiClock } from 'react-icons/fi';

const ClientHistory = ({
  recentHistory = [],
  title = "Historial Reciente",
  maxItems = 5
}) => {
  const displayHistory = recentHistory.slice(0, maxItems);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <FiClock className="h-5 w-5 text-gray-400" />
      </div>

      {displayHistory.length > 0 ? (
        <div className="space-y-4">
          {displayHistory.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                  <FiCalendar className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {appointment.services?.map(s => s).join(', ') || 'Servicio'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                    <span>{new Date(appointment.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{appointment.barberName}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-semibold text-green-600 dark:text-green-400">
                  S/{appointment.totalPrice?.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  +{Math.floor(appointment.totalPrice / 25)} pts
                </div>
              </div>
            </div>
          ))}

          {recentHistory.length > maxItems && (
            <div className="text-center">
              <button className="text-primary-600 dark:text-primary-400 text-sm hover:underline">
                Ver más historial ({recentHistory.length - maxItems} más)
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <FiClock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No hay historial de citas</p>
          <p className="text-sm mt-1">Tus citas completadas aparecerán aquí</p>
        </div>
      )}
    </div>
  );
};

export default ClientHistory;