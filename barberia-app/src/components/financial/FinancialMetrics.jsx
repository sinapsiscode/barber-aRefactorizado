import { FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi';
import { MetricCard } from '../common';
import { FINANCIAL_METRICS_CONFIG } from '../../constants/financial';

const FinancialMetrics = ({ summary }) => {
  const metrics = [
    {
      ...FINANCIAL_METRICS_CONFIG.MONTHLY_INCOME,
      value: FINANCIAL_METRICS_CONFIG.MONTHLY_INCOME.formatter(summary.monthlyIncome),
      icon: FiTrendingUp,
      change: summary.incomeGrowth || 0
    },
    {
      ...FINANCIAL_METRICS_CONFIG.MONTHLY_EXPENSES,
      value: FINANCIAL_METRICS_CONFIG.MONTHLY_EXPENSES.formatter(summary.monthlyExpenses),
      icon: FiTrendingDown
    },
    {
      ...FINANCIAL_METRICS_CONFIG.NET_PROFIT,
      value: FINANCIAL_METRICS_CONFIG.NET_PROFIT.formatter(summary.monthlyProfit),
      icon: FiDollarSign
    },
    {
      ...FINANCIAL_METRICS_CONFIG.TODAY_INCOME,
      value: FINANCIAL_METRICS_CONFIG.TODAY_INCOME.formatter(summary.dailyIncome),
      icon: FiDollarSign
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.key}
          title={metric.title}
          value={metric.value}
          icon={metric.icon}
          color={metric.color}
          change={metric.change}
        />
      ))}
    </div>
  );
};

export default FinancialMetrics;