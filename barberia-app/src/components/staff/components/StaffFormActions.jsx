// ===================================================================
// 🎯 ACCIONES DEL FORMULARIO - COMPONENTE ESPECIALIZADO
// ===================================================================
// Botones de acción del formulario de barberos

import React from 'react';
import { STAFF_LABELS, STAFF_STYLES } from '../../../constants/staff';

const StaffFormActions = ({
  isEditing,
  loading,
  isFormValid,
  onCancel
}) => {
  const getSubmitButtonText = () => {
    if (loading) return STAFF_LABELS.FORM.BUTTON_SAVING;
    return isEditing
      ? STAFF_LABELS.FORM.BUTTON_UPDATE
      : STAFF_LABELS.FORM.BUTTON_CREATE;
  };

  return (
    <div className={STAFF_STYLES.ACTIONS.CONTAINER}>
      <button
        type="button"
        onClick={onCancel}
        className="btn-secondary"
      >
        {STAFF_LABELS.FORM.BUTTON_CANCEL}
      </button>

      <button
        type="submit"
        disabled={loading || !isFormValid}
        className="btn-primary disabled:opacity-50"
      >
        {getSubmitButtonText()}
      </button>
    </div>
  );
};

export default StaffFormActions;