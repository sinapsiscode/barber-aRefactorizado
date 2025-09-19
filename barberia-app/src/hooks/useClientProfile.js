// ===================================================================
// 👤 HOOK DE PERFIL DE CLIENTE - REFACTORIZADO
// ===================================================================
// Hook personalizado para manejar la lógica compleja del perfil de cliente

import { useState } from 'react';
import Swal from 'sweetalert2';
import { useClientStore } from '../stores';
import {
  CLIENT_PROFILE_LABELS,
  CLIENT_LOYALTY_TIERS,
  CLIENT_MOCK_REWARDS
} from '../constants/clients';
import { SWEETALERT_CONFIG } from '../constants/auth';

export const useClientProfile = (client, onClose) => {
  const {
    calculateLoyaltyTier,
    getLoyaltyRecommendations,
    updateClientWarningSettings,
    clearSecurityFlags
  } = useClientStore();

  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [warningSettings, setWarningSettings] = useState({
    enabled: client.warningEnabled !== false,
    interval: client.cutoffWarningInterval || 15
  });

  // Datos computados
  const tier = calculateLoyaltyTier(client);
  const recommendations = getLoyaltyRecommendations(client.id);

  // Funciones utilitarias
  const getTierColor = (tierName) => {
    return CLIENT_LOYALTY_TIERS.COLORS[tierName] || CLIENT_LOYALTY_TIERS.DEFAULT_COLOR;
  };

  const getDaysSinceLastVisit = () => {
    if (!client.lastVisit) return CLIENT_PROFILE_LABELS.STATS.NEVER;
    const days = Math.floor((new Date() - new Date(client.lastVisit)) / (1000 * 60 * 60 * 24));
    return `${days} días`;
  };

  const calculateNextWarningDays = () => {
    if (!client.lastVisit) return warningSettings.interval;
    return Math.max(0, warningSettings.interval - Math.floor((new Date() - new Date(client.lastVisit)) / (1000 * 60 * 60 * 24)));
  };

  // Manejo de configuración de avisos
  const handleWarningSettingsChange = (field, value) => {
    setWarningSettings(prev => ({ ...prev, [field]: value }));
    updateClientWarningSettings(
      client.id,
      field === 'interval' ? value : warningSettings.interval,
      field === 'enabled' ? value : warningSettings.enabled
    );
  };

  // Mostrar alertas
  const showAlert = async (type, title, text, options = {}) => {
    const config = {
      icon: type,
      title,
      text,
      ...SWEETALERT_CONFIG.THEME,
      ...options
    };

    return await Swal.fire(config);
  };

  // Manejar limpieza de banderas de seguridad
  const handleClearSecurityFlags = async () => {
    const result = await showAlert(
      'warning',
      CLIENT_PROFILE_LABELS.SECURITY.CLEAR_FLAGS_TITLE,
      CLIENT_PROFILE_LABELS.SECURITY.CLEAR_FLAGS_TEXT,
      {
        showCancelButton: true,
        confirmButtonText: CLIENT_PROFILE_LABELS.SECURITY.CLEAR_FLAGS_CONFIRM,
        cancelButtonText: CLIENT_PROFILE_LABELS.SECURITY.CLEAR_FLAGS_CANCEL,
        confirmButtonColor: '#10b981'
      }
    );

    if (result.isConfirmed) {
      clearSecurityFlags(client.id);
      await showAlert(
        'success',
        CLIENT_PROFILE_LABELS.SECURITY.FLAGS_CLEARED_TITLE,
        CLIENT_PROFILE_LABELS.SECURITY.FLAGS_CLEARED_TEXT
      );
      onClose();
    }
  };

  // Manejar canje de puntos
  const handleRedeemPoints = () => {
    const rewardsText = CLIENT_MOCK_REWARDS
      .map(reward => `• ${reward.points} pts: ${reward.reward}`)
      .join('\n');

    alert(
      `Tienes ${client.loyaltyPoints} puntos disponibles.\n\nRecompensas disponibles:\n${rewardsText}`
    );
  };

  // Manejar éxito de nueva cita
  const handleAppointmentSuccess = async () => {
    setShowAppointmentForm(false);
    await showAlert(
      'success',
      CLIENT_PROFILE_LABELS.SUCCESS_MESSAGES.APPOINTMENT_CREATED,
      CLIENT_PROFILE_LABELS.SUCCESS_MESSAGES.APPOINTMENT_SUCCESS
    );
  };

  // Obtener estilo de recomendación
  const getRecommendationStyle = (type) => {
    const styles = {
      'service': CLIENT_RECOMMENDATION_TYPES?.SERVICE || { borderColor: 'border-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900' },
      'loyalty': CLIENT_RECOMMENDATION_TYPES?.LOYALTY || { borderColor: 'border-yellow-400', bgColor: 'bg-yellow-50 dark:bg-yellow-900' }
    };
    return styles[type] || (CLIENT_RECOMMENDATION_TYPES?.DEFAULT || { borderColor: 'border-green-400', bgColor: 'bg-green-50 dark:bg-green-900' });
  };

  return {
    // Estado
    showAppointmentForm,
    warningSettings,

    // Datos computados
    tier,
    recommendations,

    // Funciones utilitarias
    getTierColor,
    getDaysSinceLastVisit,
    calculateNextWarningDays,
    getRecommendationStyle,

    // Handlers
    handleWarningSettingsChange,
    handleClearSecurityFlags,
    handleRedeemPoints,
    handleAppointmentSuccess,

    // Controles de modal
    setShowAppointmentForm
  };
};