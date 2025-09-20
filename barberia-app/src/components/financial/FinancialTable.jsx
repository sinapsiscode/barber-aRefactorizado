import { DataTable } from '../common';
import {
  TRANSACTION_TABLE_LABELS,
  TRANSACTION_TYPE_TEXTS,
  TRANSACTION_TYPE_COLORS,
  FINANCIAL_TEXTS,
  FINANCIAL_FORMATTERS
} from '../../constants/financial';
import {
  getCategoryName,
  getPaymentMethodName,
  getAmountSign
} from '../../utils/financialHelpers';

const FinancialTable = ({
  transactions,
  paymentMethods,
  categories
}) => {
  const columns = [
    {
      key: 'date',
      label: TRANSACTION_TABLE_LABELS.DATE,
      render: (value) => FINANCIAL_FORMATTERS.DATE(value)
    },
    {
      key: 'type',
      label: TRANSACTION_TABLE_LABELS.TYPE,
      render: (value) => (
        <TransactionTypeBadge type={value} />
      )
    },
    {
      key: 'category',
      label: TRANSACTION_TABLE_LABELS.CATEGORY,
      render: (value, item) => getCategoryName(value, categories, item.type)
    },
    {
      key: 'description',
      label: TRANSACTION_TABLE_LABELS.DESCRIPTION
    },
    {
      key: 'amount',
      label: TRANSACTION_TABLE_LABELS.AMOUNT,
      render: (value, item) => (
        <TransactionAmount amount={value} type={item.type} />
      )
    },
    {
      key: 'paymentMethod',
      label: TRANSACTION_TABLE_LABELS.PAYMENT_METHOD,
      render: (value) => getPaymentMethodName(value, paymentMethods)
    }
  ];

  return (
    <DataTable
      data={transactions}
      columns={columns}
      searchable
      emptyMessage={FINANCIAL_TEXTS.EMPTY_MESSAGE}
    />
  );
};

const TransactionTypeBadge = ({ type }) => {
  const colors = TRANSACTION_TYPE_COLORS[type];
  const text = TRANSACTION_TYPE_TEXTS[type];

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors.badge}`}>
      {text}
    </span>
  );
};

const TransactionAmount = ({ amount, type }) => {
  const colors = TRANSACTION_TYPE_COLORS[type];
  const sign = getAmountSign(type);

  return (
    <span className={`font-semibold ${colors.text}`}>
      {sign}{FINANCIAL_FORMATTERS.CURRENCY(amount)}
    </span>
  );
};

export default FinancialTable;