import { DISPLAY_LIMITS } from '../../../constants/staff';

/**
 * Current Status Card - muestra el estado actual de los barberos
 * Líneas 985-1022 del original
 */
const CurrentStatusCard = ({ barbers }) => {
  const displayBarbers = barbers.slice(0, DISPLAY_LIMITS.TOP_PERFORMERS);

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Estado Actual
      </h3>
      <div className="space-y-4">
        {displayBarbers.map(barber => (
          <div
            key={barber.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {barber.name.charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {barber.name}
                </div>
                <div className="text-sm text-gray-500">
                  {barber.specialties[0]}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                barber.isPresent
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {barber.isPresent ? 'Activo' : 'Inactivo'}
              </span>
              {barber.isPresent && (
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentStatusCard;
