import { useState } from 'react';
import { useClientStore } from '../../stores';

/**
 * Hook para gestionar la configuración de avisos del cliente
 */
export const useWarningSettings = (currentClient) => {
  const { updateClientWarningSettings } = useClientStore();

  const [warningSettings, setWarningSettings] = useState({
    enabled: currentClient?.warningEnabled !== false,
    interval: currentClient?.cutoffWarningInterval || 15
  });

  const handleWarningSettingsChange = (field, value) => {
    setWarningSettings(prev => ({ ...prev, [field]: value }));
    if (currentClient) {
      updateClientWarningSettings(
        currentClient.id,
        field === 'interval' ? value : warningSettings.interval,
        field === 'enabled' ? value : warningSettings.enabled
      );
    }
  };

  const getDaysUntilNextWarning = () => {
    if (!currentClient?.lastVisit) return warningSettings.interval;
    const daysSinceLastVisit = Math.floor(
      (new Date() - new Date(currentClient.lastVisit)) / (1000 * 60 * 60 * 24)
    );
    return Math.max(0, warningSettings.interval - daysSinceLastVisit);
  };

  return {
    warningSettings,
    handleWarningSettingsChange,
    getDaysUntilNextWarning
  };
};
