import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useLoyaltyStore } from '../../stores';
import { DEFAULT_LOYALTY_SETTINGS, VALIDATION_RULES, LOYALTY_TEXTS, ALERT_COLORS } from '../../constants/loyaltySettings';

/**
 * Hook para gestionar el formulario de configuración de lealtad
 */
export const useLoyaltySettingsForm = () => {
  const { settings, updateSettings } = useLoyaltyStore();
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [formData, setFormData] = useState({
    pointsPerSol: settings.pointsPerSol || DEFAULT_LOYALTY_SETTINGS.pointsPerSol,
    enabled: settings.enabled !== false,
    minimumPointsToRedeem: settings.minimumPointsToRedeem || DEFAULT_LOYALTY_SETTINGS.minimumPointsToRedeem,
    pointsExpiryDays: settings.pointsExpiryDays || DEFAULT_LOYALTY_SETTINGS.pointsExpiryDays,
    welcomeBonusPoints: settings.welcomeBonusPoints || DEFAULT_LOYALTY_SETTINGS.welcomeBonusPoints,
    birthdayBonusPoints: settings.birthdayBonusPoints || DEFAULT_LOYALTY_SETTINGS.birthdayBonusPoints,
    referralBonusPoints: settings.referralBonusPoints || DEFAULT_LOYALTY_SETTINGS.referralBonusPoints
  });

  // Detectar cambios en el formulario
  useEffect(() => {
    const hasFormChanges = Object.keys(formData).some(key =>
      formData[key] !== settings[key]
    );
    setHasChanges(hasFormChanges);
  }, [formData, settings]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (formData.pointsPerSol <= 0) {
      throw new Error(VALIDATION_RULES.pointsPerSol.errorMessage);
    }
    if (formData.minimumPointsToRedeem < 0) {
      throw new Error(VALIDATION_RULES.minimumPointsToRedeem.errorMessage);
    }
    if (formData.pointsExpiryDays <= 0) {
      throw new Error(VALIDATION_RULES.pointsExpiryDays.errorMessage);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      validateForm();
      await updateSettings(formData);

      Swal.fire({
        title: LOYALTY_TEXTS.saveSuccessTitle,
        text: LOYALTY_TEXTS.saveSuccessText,
        icon: 'success',
        confirmButtonColor: ALERT_COLORS.confirm
      });

      setHasChanges(false);
    } catch (error) {
      Swal.fire({
        title: LOYALTY_TEXTS.saveErrorTitle,
        text: error.message || LOYALTY_TEXTS.saveErrorText,
        icon: 'error',
        confirmButtonColor: ALERT_COLORS.confirm
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({
      pointsPerSol: settings.pointsPerSol || DEFAULT_LOYALTY_SETTINGS.pointsPerSol,
      enabled: settings.enabled !== false,
      minimumPointsToRedeem: settings.minimumPointsToRedeem || DEFAULT_LOYALTY_SETTINGS.minimumPointsToRedeem,
      pointsExpiryDays: settings.pointsExpiryDays || DEFAULT_LOYALTY_SETTINGS.pointsExpiryDays,
      welcomeBonusPoints: settings.welcomeBonusPoints || DEFAULT_LOYALTY_SETTINGS.welcomeBonusPoints,
      birthdayBonusPoints: settings.birthdayBonusPoints || DEFAULT_LOYALTY_SETTINGS.birthdayBonusPoints,
      referralBonusPoints: settings.referralBonusPoints || DEFAULT_LOYALTY_SETTINGS.referralBonusPoints
    });
  };

  return {
    formData,
    saving,
    hasChanges,
    handleInputChange,
    handleSave,
    handleReset
  };
};
