import { FINANCIAL_TEXTS } from '../../constants/financial';

/**
 * Card de resumen mensual (ingresos, gastos, ganancia neta)
 */
const MonthlySummaryCard = ({ summary }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {FINANCIAL_TEXTS.monthlySummaryTitle}
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">{FINANCIAL_TEXTS.totalIncomeLabel}</span>
          <span className="font-semibold text-green-600">
            S/{(summary.monthlyIncome || 0).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">{FINANCIAL_TEXTS.totalExpensesLabel}</span>
          <span className="font-semibold text-red-600">
            S/{(summary.monthlyExpenses || 0).toLocaleString()}
          </span>
        </div>
        <hr className="border-gray-200 dark:border-dark-600" />
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-900 dark:text-white">{FINANCIAL_TEXTS.netProfitLabel}</span>
          <span className="font-bold text-primary-600">
            S/{(summary.monthlyProfit || 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MonthlySummaryCard;
