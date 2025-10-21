import { FiDollarSign, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { MetricCard } from '../common';
import { FINANCIAL_TEXTS } from '../../constants/financial';

/**
 * Grid de 4 métricas principales
 */
const FinancialMetrics = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title={FINANCIAL_TEXTS.monthlyIncomeTitle}
        value={`S/${((summary.monthlyIncome || 0) / 1000).toFixed(1)}K`}
        icon={FiTrendingUp}
        color="bg-green-500"
        change={summary.incomeGrowth || 0}
      />
      <MetricCard
        title={FINANCIAL_TEXTS.monthlyExpensesTitle}
        value={`S/${((summary.monthlyExpenses || 0) / 1000).toFixed(1)}K`}
        icon={FiTrendingDown}
        color="bg-red-500"
      />
      <MetricCard
        title={FINANCIAL_TEXTS.netProfitTitle}
        value={`S/${((summary.monthlyProfit || 0) / 1000).toFixed(1)}K`}
        icon={FiDollarSign}
        color="bg-blue-500"
      />
      <MetricCard
        title={FINANCIAL_TEXTS.todayIncomeTitle}
        value={`S/${((summary.dailyIncome || 0) / 1000).toFixed(0)}K`}
        icon={FiDollarSign}
        color="bg-purple-500"
      />
    </div>
  );
};

export default FinancialMetrics;
