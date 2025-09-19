// ===================================================================
// 🔄 SELECTOR DE TIPO DE TRANSACCIÓN - COMPONENTE ESPECIALIZADO
// ===================================================================
// Selector de tipo de transacción (ingreso/gasto)
import React from 'react';
import { TRANSACTION_TYPES, TRANSACTION_LABELS, TRANSACTION_STYLES } from '../../../constants/financial';

const TransactionTypeSelector = ({
  selectedType,
  onChange
}) => {
  const getTypeStyle = (type) => {
    if (selectedType === type) {
      return type === TRANSACTION_TYPES.INCOME
        ? `${TRANSACTION_STYLES.INCOME.border} ${TRANSACTION_STYLES.INCOME.bg} ${TRANSACTION_STYLES.INCOME.text}`
        : `${TRANSACTION_STYLES.EXPENSE.border} ${TRANSACTION_STYLES.EXPENSE.bg} ${TRANSACTION_STYLES.EXPENSE.text}`;
    }
    return `${TRANSACTION_STYLES.NEUTRAL.border} ${TRANSACTION_STYLES.NEUTRAL.bg}`;
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {TRANSACTION_LABELS.FORM.TYPE_LABEL}
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${getTypeStyle(TRANSACTION_TYPES.INCOME)}`}>
          <input
            type="radio"
            name="type"
            value={TRANSACTION_TYPES.INCOME}
            checked={selectedType === TRANSACTION_TYPES.INCOME}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
          <span className="font-medium">{TRANSACTION_LABELS.FORM.INCOME_TYPE}</span>
        </label>

        <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${getTypeStyle(TRANSACTION_TYPES.EXPENSE)}`}>
          <input
            type="radio"
            name="type"
            value={TRANSACTION_TYPES.EXPENSE}
            checked={selectedType === TRANSACTION_TYPES.EXPENSE}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
          <span className="font-medium">{TRANSACTION_LABELS.FORM.EXPENSE_TYPE}</span>
        </label>
      </div>
    </div>
  );
};

export default TransactionTypeSelector;