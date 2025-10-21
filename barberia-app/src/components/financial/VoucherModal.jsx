import { FiX, FiImage } from 'react-icons/fi';
import { FINANCIAL_TEXTS, TRANSACTION_COLORS } from '../../constants/financial';

/**
 * Modal para visualizar vouchers/comprobantes
 */
const VoucherModal = ({ selectedVoucher, paymentMethods, onClose }) => {
  if (!selectedVoucher) return null;

  const { url, transaction } = selectedVoucher;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          {/* Header */}
          <div className="bg-white dark:bg-dark-800 px-6 py-4 border-b border-gray-200 dark:border-dark-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
                <FiImage className="h-5 w-5 text-blue-500 mr-2" />
                {FINANCIAL_TEXTS.voucherModalTitle}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Información de la transacción */}
            <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">{FINANCIAL_TEXTS.typeModalLabel}</span>
                  <span className={`ml-2 font-medium ${
                    transaction.type === 'income' ? TRANSACTION_COLORS.income.text : TRANSACTION_COLORS.expense.text
                  }`}>
                    {transaction.type === 'income' ? FINANCIAL_TEXTS.incomeLabel : FINANCIAL_TEXTS.expenseLabel}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">{FINANCIAL_TEXTS.amountModalLabel}</span>
                  <span className="ml-2 font-semibold">S/{transaction.amount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">{FINANCIAL_TEXTS.dateModalLabel}</span>
                  <span className="ml-2 font-medium">{new Date(transaction.date).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">{FINANCIAL_TEXTS.methodModalLabel}</span>
                  <span className="ml-2 font-medium">
                    {paymentMethods.find(m => m.id === transaction.paymentMethod)?.name}
                  </span>
                </div>
              </div>
              {transaction.description && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">{FINANCIAL_TEXTS.descriptionModalLabel}</span>
                  <p className="text-sm mt-1 text-gray-900 dark:text-white">{transaction.description}</p>
                </div>
              )}
            </div>

            {/* Imagen del voucher */}
            <div className="bg-gray-100 dark:bg-dark-700 rounded-lg p-4">
              <img
                src={url}
                alt="Voucher"
                className="w-full h-auto max-h-96 object-contain rounded"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-dark-700 px-6 py-3 flex justify-end">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              {FINANCIAL_TEXTS.closeButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherModal;
