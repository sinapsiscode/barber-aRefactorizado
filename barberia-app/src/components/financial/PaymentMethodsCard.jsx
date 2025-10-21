import { FINANCIAL_TEXTS } from '../../constants/financial';

/**
 * Card de desglose por métodos de pago
 */
const PaymentMethodsCard = ({ filteredTransactions, paymentMethods, totalIncome }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {FINANCIAL_TEXTS.paymentMethodsTitle}
      </h3>
      <div className="space-y-3">
        {paymentMethods.map(method => {
          const methodTransactions = filteredTransactions.filter(t => t.paymentMethod === method.id);
          const total = methodTransactions.reduce((sum, t) => sum + t.amount, 0);
          const percentage = totalIncome > 0 ? (total / totalIncome * 100).toFixed(1) : 0;

          return (
            <div key={method.id} className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">{method.name}</span>
              <div className="text-right">
                <span className="font-semibold">S/{total.toLocaleString()}</span>
                <div className="text-xs text-gray-500">{percentage}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentMethodsCard;
