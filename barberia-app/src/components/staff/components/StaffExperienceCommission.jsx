// ===================================================================
// 💼 EXPERIENCIA Y COMISIÓN - COMPONENTE ESPECIALIZADO
// ===================================================================
// Campos de experiencia y comisión del barbero

import React from 'react';
import { FormInput } from '../../common';
import { STAFF_LABELS, STAFF_STYLES } from '../../../constants/staff';

const StaffExperienceCommission = ({
  formData,
  commissionValidation,
  onFieldChange
}) => {
  return (
    <div className={STAFF_STYLES.FORM.GRID_2}>
      <FormInput
        label={STAFF_LABELS.FORM.EXPERIENCE}
        value={formData.experience}
        onChange={(e) => onFieldChange('experience', e.target.value)}
        placeholder={STAFF_LABELS.PLACEHOLDERS.EXPERIENCE}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {STAFF_LABELS.FORM.COMMISSION}
        </label>
        <input
          type="number"
          min={commissionValidation.min}
          max={commissionValidation.max}
          step={commissionValidation.step}
          value={formData.commission}
          onChange={(e) => onFieldChange('commission', parseFloat(e.target.value))}
          className="input-field"
          placeholder={STAFF_LABELS.PLACEHOLDERS.COMMISSION}
        />
        <p className="text-xs text-gray-500 mt-1">
          {STAFF_LABELS.FORM.COMMISSION_HELP} ({commissionValidation.percentage}%)
        </p>
      </div>
    </div>
  );
};

export default StaffExperienceCommission;