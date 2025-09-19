// ===================================================================
// 📅 AGENDA DEL DÍA - COMPONENTE ESPECIALIZADO
// ===================================================================
// Panel de agenda diaria para recepción
import React from 'react';

const TodaySchedule = ({
  schedule = [],
  title = "Agenda de Hoy",
  onViewFullCalendar,
  onConfirmAppointment,
  getStatusStyle,
  getStatusText
}) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
        {onViewFullCalendar && (
          <button
            onClick={onViewFullCalendar}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Ver Calendario Completo
          </button>
        )}
      </div>

      <div className="space-y-3">
        {schedule.length > 0 ? (
          schedule.map((appointment, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white min-w-[60px]">
                  {appointment.time}
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {appointment.client}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {appointment.barber} • {appointment.service}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle?.(appointment.status) || 'bg-gray-100 text-gray-800'}`}
                >
                  {getStatusText?.(appointment.status) || appointment.status}
                </span>
                {appointment.status === 'pending' && onConfirmAppointment && (
                  <button
                    onClick={() => onConfirmAppointment(appointment)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Confirmar
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No hay citas programadas para hoy</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaySchedule;