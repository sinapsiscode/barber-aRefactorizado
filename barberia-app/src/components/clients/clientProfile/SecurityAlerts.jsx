import { FiShield, FiXCircle } from 'react-icons/fi';
import { getPaymentMethodName } from '../../../utils/paymentUtils';
import { CLIENT_PROFILE_TEXTS } from '../../../constants/clientProfile';

/**
 * Card de alertas de seguridad (vouchers falsos, pagos rechazados)
 * Solo visible para super_admin y branch_admin
 */
const SecurityAlerts = ({ client, onClearFlags }) => {
  const hasSecurityIssues = client.securityFlags?.falseVouchersCount > 0 || client.paymentHistory?.length > 0;

  if (!hasSecurityIssues) return null;

  return (
    <div className="card border-2 border-red-200 dark:border-red-800">
      <div className="flex items-center space-x-2 mb-4">
        <FiShield className="h-5 w-5 text-red-500" />
        <h4 className="text-md font-semibold text-red-800 dark:text-red-200">
          {CLIENT_PROFILE_TEXTS.securityAlertsTitle}
        </h4>
      </div>

      <div className="space-y-4">
        {/* Resumen de banderas */}
        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-red-800 dark:text-red-200">
              {CLIENT_PROFILE_TEXTS.securityStatusLabel}
            </span>
            {client.securityFlags?.blacklisted && (
              <span className="px-2 py-1 text-xs font-bold bg-red-600 text-white rounded">
                {CLIENT_PROFILE_TEXTS.blockedLabel}
              </span>
            )}
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-red-700 dark:text-red-300">{CLIENT_PROFILE_TEXTS.falseVouchersLabel}</span>
              <span className="font-bold text-red-900 dark:text-red-100">
                {client.securityFlags?.falseVouchersCount || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-700 dark:text-red-300">{CLIENT_PROFILE_TEXTS.rejectedPaymentsLabel}</span>
              <span className="font-bold text-red-900 dark:text-red-100">
                {client.securityFlags?.rejectedPaymentsCount || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Historial de rechazos */}
        {client.paymentHistory && client.paymentHistory.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {CLIENT_PROFILE_TEXTS.rejectionHistoryTitle}
            </h5>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {client.paymentHistory.map((rejection) => (
                <div key={rejection.id} className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {new Date(rejection.date).toLocaleDateString()} - S/{rejection.amount}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {getPaymentMethodName(rejection.paymentMethod)} - N° {rejection.voucherNumber}
                      </div>
                      <div className="text-red-600 dark:text-red-400 italic">
                        "{rejection.reason}"
                      </div>
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {CLIENT_PROFILE_TEXTS.verifiedByLabel} {rejection.verifiedBy}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botón de limpiar banderas */}
        {client.securityFlags?.blacklisted && (
          <div className="pt-2 border-t border-red-200 dark:border-red-800">
            <button
              onClick={onClearFlags}
              className="text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center space-x-1"
            >
              <FiXCircle className="h-4 w-4" />
              <span>{CLIENT_PROFILE_TEXTS.clearFlagsButton}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityAlerts;
