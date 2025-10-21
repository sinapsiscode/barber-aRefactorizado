import { FiDollarSign, FiChevronUp } from 'react-icons/fi';
import CommissionMetrics from './CommissionMetrics';
import CommissionBreakdown from './CommissionBreakdown';
import TopPerformersCommission from './TopPerformersCommission';

/**
 * Panel expandible de comisiones
 * Líneas 510-751 del original
 */
const CommissionPanel = ({
  show,
  commissionData,
  filteredBarbers,
  onClose
}) => {
  if (!show || !commissionData) return null;

  return (
    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
      show ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
    }`}>
      <div className="space-y-6">
        {/* Header de la sección */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-[#D4AF37]/20 rounded-lg flex items-center justify-center">
              <FiDollarSign className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Análisis Detallado de Comisiones
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sistema de comisiones del 70% para barberos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <FiChevronUp className="h-5 w-5" />
          </button>
        </div>

        {/* Métricas detalladas */}
        <CommissionMetrics commissionData={commissionData} />

        {/* Top Performers y Desglose */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopPerformersCommission barbers={filteredBarbers} />
          <CommissionBreakdown commissionData={commissionData} />
        </div>
      </div>
    </div>
  );
};

export default CommissionPanel;
