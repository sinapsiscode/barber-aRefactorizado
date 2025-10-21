import { FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import ChangeIndicator from '../StaffStats/ChangeIndicator';
import { calculateNetMargin } from '../../../utils/staff/commissionCalculations';

/**
 * Desglose Financiero
 * Líneas 678-747 del original
 */
const CommissionBreakdown = ({ commissionData }) => {
  const netMargin = calculateNetMargin(commissionData.totalEarnings, commissionData.totalCommissions);
  const retention = commissionData.totalEarnings - commissionData.totalCommissions;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <FiDollarSign className="h-5 w-5 text-[#D4AF37] mr-2" />
          Desglose Financiero
        </h4>
      </div>
      <div className="space-y-4">
        {/* Comparación Mensual */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
          <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center">
            <FiTrendingUp className="h-4 w-4 mr-2" />
            Comparación Mensual
          </h5>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-blue-700 dark:text-blue-300">Mes Actual</p>
              <p className="font-bold text-blue-900 dark:text-blue-100">
                S/{commissionData.totalCommissions.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-blue-700 dark:text-blue-300">Mes Anterior</p>
              <p className="font-bold text-blue-900 dark:text-blue-100">
                S/{commissionData.previousMonth.totalCommissions.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-2 flex justify-center">
            <ChangeIndicator change={commissionData.changes.commissions} prefix="Diferencia: " />
          </div>
        </div>

        {/* Ingresos Totales */}
        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-400">Ingresos Totales</span>
          <div className="text-right">
            <span className="font-semibold text-gray-900 dark:text-white">
              S/{commissionData.totalEarnings.toLocaleString()}
            </span>
            <div className="text-right">
              <ChangeIndicator change={commissionData.changes.earnings} />
            </div>
          </div>
        </div>

        {/* Comisiones (70%) */}
        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-400">Comisiones (70%)</span>
          <div className="text-right">
            <span className="font-semibold text-[#D4AF37]">
              -S/{commissionData.totalCommissions.toLocaleString()}
            </span>
            <div className="text-right">
              <ChangeIndicator change={commissionData.changes.commissions} />
            </div>
          </div>
        </div>

        {/* Retención (30%) */}
        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-400">Retención (30%)</span>
          <span className="font-semibold text-green-600">
            S/{retention.toLocaleString()}
          </span>
        </div>

        {/* Margen Neto */}
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900 dark:text-white">Margen Neto</span>
            <span className="text-lg font-bold text-green-600">
              {netMargin.toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Después del pago de comisiones
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommissionBreakdown;
