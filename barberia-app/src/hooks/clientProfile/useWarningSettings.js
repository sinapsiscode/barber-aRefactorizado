import { useState } from 'react';
import { useClientStore } from '../../stores';

/**
 * Hook para gestionar la configuración de avisos del cliente
 */
export const useWarningSettings = (client) => {
  const { updateClientWarningSettings } = useClientStore();

  const [warningSettings, setWarningSettings] = useState({
    enabled: client.warningEnabled !== false,
    interval: client.cutoffWarningInterval || 15
  });

  const handleWarningSettingsChange = (field, value) => {
    setWarningSettings(prev => ({ ...prev, [field]: value }));
    updateClientWarningSettings(
      client.id,
      field === 'interval' ? value : warningSettings.interval,
      field === 'enabled' ? value : warningSettings.enabled
    );
  };

  return {
    warningSettings,
    handleWarningSettingsChange
  };
};
