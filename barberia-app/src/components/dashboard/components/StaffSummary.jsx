// ===================================================================
// 👥 RESUMEN DE PERSONAL - COMPONENTE ESPECIALIZADO
// ===================================================================
// Resumen visual del estado del personal para admin de sede
import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiXCircle, FiUserCheck } from 'react-icons/fi';

const StaffSummary = ({
  attendanceStats = {},
  branchStaff = [],
  title = "Estado del Personal"
}) => {
  const attendanceRate = branchStaff.length > 0
    ? Math.round(attendanceStats.present / branchStaff.length * 100)
    : 0;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <FiCheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-800 dark:text-green-200">
              Presentes
            </span>
          </div>
          <span className="text-2xl font-bold text-green-600">
            {attendanceStats.present || 0}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <FiAlertCircle className="h-5 w-5 text-yellow-600" />
            <span className="font-medium text-yellow-800 dark:text-yellow-200">
              Tardanzas
            </span>
          </div>
          <span className="text-2xl font-bold text-yellow-600">
            {attendanceStats.late || 0}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <FiXCircle className="h-5 w-5 text-red-600" />
            <span className="font-medium text-red-800 dark:text-red-200">
              Ausentes
            </span>
          </div>
          <span className="text-2xl font-bold text-red-600">
            {attendanceStats.absent || 0}
          </span>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
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

export default StaffSummary;