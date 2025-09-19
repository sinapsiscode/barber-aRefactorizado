// ===================================================================
// 🏢 INFORMACIÓN DE SUCURSAL - COMPONENTE ESPECIALIZADO
// ===================================================================
// Panel informativo de la sucursal preferida del cliente
import React from 'react';
import { FiMapPin } from 'react-icons/fi';

const ClientBranchInfo = ({
  preferredBranch,
  title = "Mi Sede Preferida"
}) => {
  if (!preferredBranch) return null;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>

      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <FiMapPin className="h-5 w-5 text-primary-500" />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {preferredBranch.name}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {preferredBranch.address}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <div className="font-medium text-gray-900 dark:text-white mb-2">Horarios:</div>
          <div className="space-y-1">
            <div>Lun-Vie: 8:00 AM - 8:00 PM</div>
            <div>Sáb: 8:00 AM - 6:00 PM</div>
            <div>Dom: 9:00 AM - 5:00 PM</div>
          </div>
        </div>

        {preferredBranch.phone && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Teléfono:</strong> {preferredBranch.phone}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientBranchInfo;