// ===================================================================
// 🏢 LISTA DE RENDIMIENTO DE SUCURSALES - COMPONENTE ESPECIALIZADO
// ===================================================================
// Panel de rendimiento por sucursal para super admin
import React from 'react';

const BranchPerformanceList = ({
  branches = [],
  title = "Rendimiento por Sede"
}) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>

      <div className="space-y-4">
        {branches.length > 0 ? (
          branches.map((branch) => (
            <div
              key={branch.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {branch.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {branch.city}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600 dark:text-green-400">
                  S/{((branch.stats?.monthlyRevenue || 0) / 1000).toFixed(1)}K
                </p>
                <p className="text-xs text-gray-500">
                  {branch.stats?.totalAppointments || 0} citas
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>No hay datos de sucursales disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BranchPerformanceList;