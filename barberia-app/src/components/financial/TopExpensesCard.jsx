import { FINANCIAL_TEXTS } from '../../constants/financial';

/**
 * Card de top categorías de gastos
 */
const TopExpensesCard = ({ filteredTransactions, categories }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {FINANCIAL_TEXTS.topExpensesTitle}
      </h3>
      <div className="space-y-3">
        {categories.expense.slice(0, 5).map(category => {
          const categoryTransactions = filteredTransactions.filter(
            t => t.type === 'expense' && t.category === category.id
          );
          const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);

          return (
            <div key={category.id} className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">{category.name}</span>
              <span className="font-semibold text-red-600">
                S/{total.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopExpensesCard;
