import { FiClock } from 'react-icons/fi';
import { DEFAULT_BARBER_SCHEDULE, DAY_NAMES } from '../../../constants/settings';

/**
 * Tab de horarios del barbero
 */
const BarberScheduleTab = ({ user }) => {
  const barberSchedule = user?.schedule || DEFAULT_BARBER_SCHEDULE;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Mi Horario de Trabajo
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Solo lectura
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(barberSchedule).map(([day, schedule]) => (
            <div key={day} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-4 h-4 rounded-full ${schedule.isWorking ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {DAY_NAMES[day]}
                </span>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  schedule.isWorking
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {schedule.isWorking ? 'Trabajando' : 'Descanso'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {schedule.isWorking ? (
                  <>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {schedule.start}
                    </span>
                    <span className="text-gray-500">-</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {schedule.end}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400 italic">
                    Día libre
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <FiClock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200">
                Información sobre horarios
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Tu horario de trabajo es configurado por la administración. Para solicitar cambios,
                contacta con tu administrador de sede.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberScheduleTab;
