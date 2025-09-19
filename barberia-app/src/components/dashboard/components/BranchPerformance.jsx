// ===================================================================
// 🏢 RENDIMIENTO DE SUCURSAL - COMPONENTE ESPECIALIZADO
// ===================================================================
// Panel de métricas de rendimiento general de la sucursal
import React from 'react';
import { FiUserCheck } from 'react-icons/fi';

const BranchPerformance = ({
  attendanceStats = {},
  branchStaff = [],
  todayAppointments = [],
  completedToday = 0,
  title = "Rendimiento de la Sucursal"
}) => {
  const attendanceRate = branchStaff.length > 0
    ? Math.round(attendanceStats.present / branchStaff.length * 100)
    : 0;

  const completionRate = todayAppointments.length > 0
    ? Math.round(completedToday / todayAppointments.length * 100)
    : 0;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Tasa de Asistencia
            </span>
            <span className="font-semibold">{attendanceRate}%</span>
          </div>
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Citas Completadas
            </span>
            <span className="font-semibold">{completionRate}%</span>
          </div>
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {todayAppointments.length}
            </p>
            <p className="text-xs text-gray-500">Citas Hoy</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {completedToday}
            </p>
            <p className="text-xs text-gray-500">Completadas</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <FiUserCheck className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Personal total: {branchStaff.length} barberos
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchPerformance;