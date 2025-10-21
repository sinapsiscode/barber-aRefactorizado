import { useState } from 'react';
import Swal from 'sweetalert2';
import { useLoyaltyStore } from '../../stores';
import { LOYALTY_TEXTS, ALERT_COLORS } from '../../constants/loyaltySettings';

/**
 * Hook para gestionar los niveles de lealtad (CRUD)
 */
export const useLoyaltyLevelsManagement = () => {
  const {
    loyaltyLevels,
    updateLoyaltyLevel,
    addLoyaltyLevel,
    deleteLoyaltyLevel,
    getClientsByLevel
  } = useLoyaltyStore();

  const [showLevelForm, setShowLevelForm] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const clientsByLevel = getClientsByLevel();

  const handleEditLevel = (level) => {
    setSelectedLevel(level);
    setShowLevelForm(true);
  };

  const handleNewLevel = () => {
    setSelectedLevel(null);
    setShowLevelForm(true);
  };

  const handleCloseLevelForm = () => {
    setShowLevelForm(false);
    setSelectedLevel(null);
  };

  const handleDeleteLevel = async (levelId) => {
    const result = await Swal.fire({
      title: LOYALTY_TEXTS.deleteLevelTitle,
      text: LOYALTY_TEXTS.deleteLevelText,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: ALERT_COLORS.danger,
      cancelButtonColor: ALERT_COLORS.cancel,
      confirmButtonText: LOYALTY_TEXTS.deleteLevelConfirm,
      cancelButtonText: LOYALTY_TEXTS.deleteLevelCancel
    });

    if (result.isConfirmed) {
      try {
        deleteLoyaltyLevel(levelId);
        Swal.fire({
          title: LOYALTY_TEXTS.deleteSuccessTitle,
          text: LOYALTY_TEXTS.deleteSuccessText,
          icon: 'success',
          confirmButtonColor: ALERT_COLORS.confirm
        });
      } catch (error) {
        Swal.fire({
          title: LOYALTY_TEXTS.saveErrorTitle,
          text: LOYALTY_TEXTS.deleteErrorText,
          icon: 'error',
          confirmButtonColor: ALERT_COLORS.confirm
        });
      }
    }
  };

  return {
    loyaltyLevels,
    clientsByLevel,
    showLevelForm,
    selectedLevel,
    handleEditLevel,
    handleNewLevel,
    handleCloseLevelForm,
    handleDeleteLevel
  };
};
