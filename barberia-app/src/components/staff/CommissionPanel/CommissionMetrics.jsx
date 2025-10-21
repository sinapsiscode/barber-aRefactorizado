import { FiTrendingUp, FiDollarSign, FiClock, FiAward } from 'react-icons/fi';
import ChangeIndicator from '../StaffStats/ChangeIndicator';

/**
 * Métricas detalladas con comparativas
 * Líneas 539-618 del original
 */
const CommissionMetrics = ({ commissionData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Ingresos Brutos */}
      <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-green-100 dark:bg-green-800/50 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">Ingresos Brutos</p>
              <p className="text-xl font-bold text-green-900 dark:text-green-100">
                S/{commissionData.totalEarnings.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <ChangeIndicator change={commissionData.changes.earnings} />
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">vs mes ant.</p>
          </div>
        </div>
      </div>

      {/* Comisiones Pagadas */}
      <div className="card bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/20 border-[#D4AF37]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-[#D4AF37]/20 rounded-lg flex items-center justify-center">
              <FiDollarSign className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#D4AF37]">Comisiones Pagadas</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                S/{commissionData.totalCommissions.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <ChangeIndicator change={commissionData.changes.commissions} />
            <p className="text-xs text-[#D4AF37] mt-1">vs mes ant.</p>
          </div>
        </div>
      </div>

      {/* Servicios Totales */}
      <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-800/50 rounded-lg flex items-center justify-center">
              <FiClock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Servicios Totales</p>
              <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                {commissionData.totalServices.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <ChangeIndicator change={commissionData.changes.services} />
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">vs mes ant.</p>
          </div>
        </div>
      </div>

      {/* Promedio por Barbero */}
      <div className="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-purple-100 dark:bg-purple-800/50 rounded-lg flex items-center justify-center">
              <FiAward className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-800 dark:text-purple-200">Promedio/Barbero</p>
              <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                S/{Math.round(commissionData.avgCommissionPerBarber).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <ChangeIndicator change={commissionData.changes.avgCommission} />
            <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">vs mes ant.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionMetrics;
