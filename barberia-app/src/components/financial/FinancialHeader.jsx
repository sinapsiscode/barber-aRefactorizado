import { FiPlus, FiDownload, FiBarChart } from 'react-icons/fi';
import {
  FINANCIAL_TEXTS,
  FINANCIAL_FORMATTERS
} from '../../constants/financial';
import {
  shouldShowAllBranchesLabel,
  getFinancialSubtitle
} from '../../utils/financialHelpers';

const FinancialHeader = ({
  user,
  currentBranch,
  selectedBranch,
  showCharts,
  onToggleCharts,
  onNewTransaction,
  onExportPDF
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {FINANCIAL_TEXTS.TITLE}
          {currentBranch && (
            <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-2">
              - {currentBranch.name}
            </span>
          )}
          {shouldShowAllBranchesLabel(user?.role, selectedBranch) && (
            <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-2">
              - {FINANCIAL_TEXTS.ALL_BRANCHES}
            </span>
          )}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {getFinancialSubtitle(currentBranch, user?.role, selectedBranch)}
        </p>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onToggleCharts}
          className="btn-secondary"
        >
          <FiBarChart className="h-4 w-4 mr-2" />
          {showCharts ? FINANCIAL_TEXTS.HIDE_CHARTS : FINANCIAL_TEXTS.SHOW_CHARTS}
        </button>

        <button onClick={onExportPDF} className="btn-secondary">
          <FiDownload className="h-4 w-4 mr-2" />
          {FINANCIAL_TEXTS.EXPORT_PDF}
        </button>

        <button
          onClick={onNewTransaction}
          className="btn-primary"
        >
          <FiPlus className="h-4 w-4 mr-2" />
          {FINANCIAL_TEXTS.NEW_TRANSACTION}
        </button>
      </div>
    </div>
  );
};

export default FinancialHeader;