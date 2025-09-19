// ===================================================================
// ℹ️ CAJA DE INFORMACIÓN DE PRECIOS - COMPONENTE ESPECIALIZADO
// ===================================================================
// Caja informativa con detalles importantes sobre la gestión de precios
import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { SERVICE_LABELS, SERVICE_STYLES } from '../../../constants/services';

const PricingInfoBox = ({
  branchName
}) => {
  return (
    <div className={`${SERVICE_STYLES.INFO_BOX.bg} border ${SERVICE_STYLES.INFO_BOX.border} rounded-lg p-4`}>
      <div className="flex items-start">
        <FiAlertCircle className={`h-5 w-5 ${SERVICE_STYLES.INFO_BOX.iconColor} mr-3 mt-0.5`} />
        <div>
          <h4 className={`font-medium ${SERVICE_STYLES.INFO_BOX.titleColor} mb-1`}>
            {SERVICE_LABELS.PRICING_MANAGER.INFO_TITLE}
          </h4>
          <ul className={`text-sm ${SERVICE_STYLES.INFO_BOX.textColor} space-y-1`}>
            {SERVICE_LABELS.INFO_ITEMS.map((item, index) => (
              <li key={index}>
                • {index === 0 ? `${item} (${branchName})` : item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PricingInfoBox;