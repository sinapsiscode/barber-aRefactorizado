import { useState, useCallback } from 'react';
import { DEFAULT_NOTIFICATIONS } from '../../constants/settings';

/**
 * Hook para manejar configuraciones de notificaciones
 */
export const useNotificationSettings = () => {
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);

  const toggleNotification = useCallback((key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const updateNotification = useCallback((key, value) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  }, []);

  return {
    notifications,
    toggleNotification,
    updateNotification
  };
};
