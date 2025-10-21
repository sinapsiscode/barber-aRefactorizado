import { useState, useCallback, useMemo } from 'react';
import { getTabsByRole } from '../../utils/settings/settingsUtils';

/**
 * Hook para manejar la navegación entre tabs
 */
export const useTabNavigation = (userRole, initialTab = 'profile') => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const availableTabs = useMemo(() => {
    return getTabsByRole(userRole);
  }, [userRole]);

  const changeTab = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  return {
    activeTab,
    availableTabs,
    changeTab
  };
};
