// ===================================================================
// ⚙️ PREFERENCIAS DE CLIENTE - COMPONENTE ESPECIALIZADO
// ===================================================================
// Configuración de barbero y sucursal preferidos del cliente
import React from 'react';
import { FiUser, FiMapPin } from 'react-icons/fi';

const ClientPreferences = ({
  preferredBarber,
  preferredBranch,
  title = "Mis Preferencias"
}) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
        <FiUser className="h-5 w-5 text-green-500 mr-2" />
        {title}
      </h3>

      <div className="space-y-4">
        {/* Barbero Preferido */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <FiUser className="h-5 w-5 text-green-600 dark:text-green-400" />
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

        {/* Sucursal Preferida */}
        {preferredBranch && (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <FiMapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
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

        {!preferredBarber && !preferredBranch && (
          <div className="text-center py-6 text-gray-500">
            <p className="text-sm">Configura tus preferencias en tu perfil</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientPreferences;