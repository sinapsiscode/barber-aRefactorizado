import { useState } from 'react';
import { useClientStore } from '../../stores';

/**
 * Hook para gestionar la configuración de avisos del cliente en el perfil
 */
export const useProfileWarningSettings = (client) => {
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

  const getDaysUntilNextWarning = () => {
    if (!client.lastVisit) return warningSettings.interval;
    const daysSinceLastVisit = Math.floor(
      (new Date() - new Date(client.lastVisit)) / (1000 * 60 * 60 * 24)
    );
    return Math.max(0, warningSettings.interval - daysSinceLastVisit);
  };

  return {
    warningSettings,
    handleWarningSettingsChange,
    getDaysUntilNextWarning
  };
};
