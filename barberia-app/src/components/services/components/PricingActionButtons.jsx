// ===================================================================
// ⚡ BOTONES DE ACCIONES DE PRECIOS - COMPONENTE ESPECIALIZADO
// ===================================================================
// Botones de acciones para el gestor de precios de servicios
import React from 'react';
import { FiSave, FiRefreshCw, FiTrendingUp } from 'react-icons/fi';
import { SERVICE_LABELS, SERVICE_STYLES } from '../../../constants/services';

const PricingActionButtons = ({
  hasChanges,
  isLoading,
  savingStatus,
  onSaveChanges,
  onResetPrices,
  onBulkUpdate
}) => {
  const getSaveButtonText = () => {
    if (savingStatus === 'saving') {
      return SERVICE_LABELS.ACTIONS.SAVING;
    }
    return SERVICE_LABELS.ACTIONS.SAVE_CHANGES;
  };

  const getSaveButtonStyle = () => {
    return hasChanges && !isLoading
      ? SERVICE_STYLES.BUTTONS.SAVE_ENABLED
      : SERVICE_STYLES.BUTTONS.SAVE_DISABLED;
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={onSaveChanges}
        disabled={!hasChanges || isLoading}
        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${getSaveButtonStyle()}`}
      >
        <FiSave className="h-4 w-4 mr-2" />
        {getSaveButtonText()}
      </button>

      <button
        onClick={onResetPrices}
        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${SERVICE_STYLES.BUTTONS.RESET}`}
      >
        <FiRefreshCw className="h-4 w-4 mr-2" />
        {SERVICE_LABELS.ACTIONS.RESET_PRICES}
      </button>

      <button
        onClick={onBulkUpdate}
        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${SERVICE_STYLES.BUTTONS.BULK}`}
      >
        <FiTrendingUp className="h-4 w-4 mr-2" />
        {SERVICE_LABELS.ACTIONS.BULK_UPDATE}
      </button>
    </div>
  );
};

export default PricingActionButtons;