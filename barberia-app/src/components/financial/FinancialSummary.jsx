import {
  FINANCIAL_SECTIONS_TEXTS,
  FINANCIAL_FORMATTERS
} from '../../constants/financial';

const FinancialSummary = ({
  summary,
  paymentMethodStats,
  categoryStats
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <MonthlySummaryCard summary={summary} />
      <PaymentMethodsCard paymentMethodStats={paymentMethodStats} />
      <ExpenseCategoriesCard categoryStats={categoryStats} />
    </div>
  );
};

const MonthlySummaryCard = ({ summary }) => (
  <div className="card">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      {FINANCIAL_SECTIONS_TEXTS.MONTHLY_SUMMARY}
    </h3>
    <div className="space-y-3">
      <SummaryItem
        label={FINANCIAL_SECTIONS_TEXTS.TOTAL_INCOME}
        value={FINANCIAL_FORMATTERS.CURRENCY(summary.monthlyIncome)}
        className="text-green-600"
      />
      <SummaryItem
        label={FINANCIAL_SECTIONS_TEXTS.TOTAL_EXPENSES}
        value={FINANCIAL_FORMATTERS.CURRENCY(summary.monthlyExpenses)}
        className="text-red-600"
      />
      <hr className="border-gray-200 dark:border-dark-600" />
      <SummaryItem
        label={FINANCIAL_SECTIONS_TEXTS.NET_PROFIT}
        value={FINANCIAL_FORMATTERS.CURRENCY(summary.monthlyProfit)}
        className="text-primary-600"
        isBold
      />
    </div>
  </div>
);

const PaymentMethodsCard = ({ paymentMethodStats }) => (
  <div className="card">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      {FINANCIAL_SECTIONS_TEXTS.PAYMENT_METHODS}
    </h3>
    <div className="space-y-3">
      {paymentMethodStats.map(method => (
        <div key={method.id} className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">{method.name}</span>
          <div className="text-right">
            <span className="font-semibold">
              {FINANCIAL_FORMATTERS.CURRENCY(method.total)}
            </span>
            <div className="text-xs text-gray-500">
              {FINANCIAL_FORMATTERS.PERCENTAGE(method.percentage)}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ExpenseCategoriesCard = ({ categoryStats }) => (
  <div className="card">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      {FINANCIAL_SECTIONS_TEXTS.TOP_EXPENSE_CATEGORIES}
    </h3>
    <div className="space-y-3">
      {categoryStats.map(category => (
        <div key={category.id} className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">{category.name}</span>
          <span className="font-semibold text-red-600">
            {FINANCIAL_FORMATTERS.CURRENCY(category.total)}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const SummaryItem = ({ label, value, className = "font-semibold", isBold = false }) => (
  <div className="flex justify-between items-center">
    <span className={`text-gray-600 dark:text-gray-400 ${isBold ? 'font-medium' : ''}`}>
      {label}
    </span>
    <span className={`${className} ${isBold ? 'font-bold' : 'font-semibold'}`}>
      {value}
    </span>
  </div>
);

export default FinancialSummary;