// ===================================================================
// 🏢 GESTIÓN DE SUCURSALES - COMPONENTE ESPECIALIZADO
// ===================================================================
// Panel de gestión de sucursales para super admin
import React from 'react';
import { FiPlus, FiEdit, FiMapPin } from 'react-icons/fi';
import { CountryFlag } from '../../common';

const BranchManagement = ({
  branches = [],
  getCountryByCode,
  onAddBranch,
  onEditBranch,
  title = "Gestión de Sucursales"
}) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
        <button
          onClick={onAddBranch}
          className="flex items-center space-x-2 px-4 py-2 bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-lg transition-colors"
        >
          <FiPlus className="h-4 w-4" />
          <span>Nueva Sucursal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {branches.length > 0 ? (
          branches.map((branch) => (
            <div
              key={branch.id}
              className="border border-gray-200 dark:border-[#D4AF37]/20 rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <CountryFlag countryCode={branch.country} size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {branch.name}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {branch.city}, {getCountryByCode?.(branch.country)?.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onEditBranch?.(branch)}
                  className="text-gray-400 hover:text-[#D4AF37] transition-colors"
                >
                  <FiEdit className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Ingresos:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    S/{((branch.stats?.monthlyRevenue || 0) / 1000).toFixed(1)}K
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Personal:</span>
                  <span className="font-medium">{branch.stats?.staffCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Citas:</span>
                  <span className="font-medium">{branch.stats?.totalAppointments || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Clientes:</span>
                  <span className="font-medium">{branch.stats?.clientCount || 0}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#D4AF37]/10">
                <div className="flex items-center space-x-2">
                  <FiMapPin className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500 truncate">
                    {branch.address}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            <p>No hay sucursales disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BranchManagement;