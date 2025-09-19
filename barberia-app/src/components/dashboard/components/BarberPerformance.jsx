// ===================================================================
// 👥 RENDIMIENTO DE BARBEROS - COMPONENTE ESPECIALIZADO
// ===================================================================
// Panel de rendimiento individual de barberos para admin de sede
import React from 'react';
import CountryFlag from '../../common/CountryFlag';

const BarberPerformance = ({
  barberStats = [],
  title = "Citas Atendidas por Barbero - Hoy"
}) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>

      <div className="space-y-4">
        {barberStats.map((barber) => (
          <div
            key={barber.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <CountryFlag countryCode={barber.country || 'PE'} size={20} />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {barber.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {barber.completedToday} de {barber.appointmentsToday} citas completadas
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {barber.completionRate}%
                </p>
                <p className="text-xs text-gray-500">Completado</p>
              </div>

              <div className="w-20">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${barber.completionRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {barberStats.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay datos de rendimiento disponibles
          </div>
        )}
      </div>
    </div>
  );
};

export default BarberPerformance;