import { FiBarChart, FiDownload, FiPlus } from 'react-icons/fi';
import { FINANCIAL_TEXTS } from '../../constants/financial';

/**
 * Header de la página financiera con botones de acción
 */
const FinancialHeader = ({ title, subtitle, showCharts, onToggleCharts, onNewTransaction }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {subtitle}
        </p>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={onToggleCharts}
          className="btn-secondary"
        >
          <FiBarChart className="h-4 w-4 mr-2" />
          {showCharts ? FINANCIAL_TEXTS.hideChartsButton : FINANCIAL_TEXTS.showChartsButton}
        </button>
        <button className="btn-secondary">
          <FiDownload className="h-4 w-4 mr-2" />
          {FINANCIAL_TEXTS.exportButton}
        </button>
        <button
          onClick={onNewTransaction}
          className="btn-primary"
        >
          <FiPlus className="h-4 w-4 mr-2" />
          {FINANCIAL_TEXTS.newTransactionButton}
        </button>
      </div>
    </div>
  );
};

export default FinancialHeader;
