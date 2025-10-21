import { FiImage } from 'react-icons/fi';
import { DataTable } from '../common';
import { FINANCIAL_TEXTS, TRANSACTION_COLORS } from '../../constants/financial';

/**
 * Tabla de transacciones con columnas personalizadas
 */
const TransactionsTable = ({ filteredTransactions, paymentMethods, categories, onVoucherClick }) => {
  const columns = [
    {
      key: 'date',
      label: FINANCIAL_TEXTS.dateLabel,
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'type',
      label: FINANCIAL_TEXTS.typeLabel,
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'income' ? TRANSACTION_COLORS.income.badge : TRANSACTION_COLORS.expense.badge
        }`}>
          {value === 'income' ? FINANCIAL_TEXTS.incomeLabel : FINANCIAL_TEXTS.expenseLabel}
        </span>
      )
    },
    {
      key: 'category',
      label: FINANCIAL_TEXTS.categoryLabel,
      render: (value, item) => {
        const categoryList = item.type === 'income' ? categories.income : categories.expense;
        const category = categoryList.find(c => c.id === value);
        return category?.name || value;
      }
    },
    {
      key: 'description',
      label: FINANCIAL_TEXTS.descriptionLabel
    },
    {
      key: 'amount',
      label: FINANCIAL_TEXTS.amountLabel,
      render: (value, item) => (
        <span className={`font-semibold ${
          item.type === 'income' ? TRANSACTION_COLORS.income.text : TRANSACTION_COLORS.expense.text
        }`}>
          {item.type === 'income' ? '+' : '-'}S/{value.toLocaleString()}
        </span>
      )
    },
    {
      key: 'paymentMethod',
      label: FINANCIAL_TEXTS.methodLabel,
      render: (value) => {
        const method = paymentMethods.find(m => m.id === value);
        return method?.name || value;
      }
    },
    {
      key: 'voucherUrl',
      label: FINANCIAL_TEXTS.voucherLabel,
      render: (value, item) => {
        if (!value) {
          return (
            <span className="text-xs text-gray-400 italic">{FINANCIAL_TEXTS.noVoucherText}</span>
          );
        }
        return (
          <button
            onClick={() => onVoucherClick(value, item)}
            className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-sm"
          >
            <FiImage className="h-4 w-4" />
            <span>{FINANCIAL_TEXTS.viewVoucherButton}</span>
          </button>
        );
      }
    }
  ];

  return (
    <DataTable
      data={filteredTransactions}
      columns={columns}
      searchable
      emptyMessage={FINANCIAL_TEXTS.emptyTableMessage}
    />
  );
};

export default TransactionsTable;
