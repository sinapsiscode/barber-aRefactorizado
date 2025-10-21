import { FiUser, FiMapPin } from 'react-icons/fi';

/**
 * Card de preferencias del cliente (barbero y sucursal)
 */
const PreferencesCard = ({ preferredBarber, preferredBranch }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
        <FiUser className="h-5 w-5 text-green-500 mr-2" />
        Mis Preferencias
      </h3>

      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
          <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <FiUser className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900 dark:text-white">
              {preferredBarber?.name || 'Sin barbero preferido'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {preferredBarber?.specialties?.[0] || 'Selecciona tu barbero favorito'}
            </div>
          </div>
        </div>

        {preferredBranch && (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <FiMapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white">
                {preferredBranch.name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {preferredBranch.city}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreferencesCard;
