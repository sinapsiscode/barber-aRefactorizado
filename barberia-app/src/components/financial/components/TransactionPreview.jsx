// ===================================================================
// 👁️ PREVIEW DE TRANSACCIÓN - COMPONENTE ESPECIALIZADO
// ===================================================================
// Preview visual de la transacción antes de guardar
import React from 'react';
import { TRANSACTION_TYPES, TRANSACTION_STYLES } from '../../../constants/financial';

const TransactionPreview = ({
  amount,
  type,
  date,
  getPreviewAmount,
  getPreviewDate,
  getTransactionTypeLabel
}) => {
  if (!amount) return null;

  const previewStyle = type === TRANSACTION_TYPES.INCOME
    ? TRANSACTION_STYLES.INCOME.preview
    : TRANSACTION_STYLES.EXPENSE.preview;

  return (
    <div className={`p-4 rounded-lg border-2 border-dashed ${previewStyle.border} ${previewStyle.bg}`}>
      <div className="text-center">
        <div className={`text-2xl font-bold ${previewStyle.text}`}>
          {getPreviewAmount?.()}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {getTransactionTypeLabel?.()} - {getPreviewDate?.()}
        </div>
      </div>
    </div>
  );
};

export default TransactionPreview;