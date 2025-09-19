// ===================================================================
// ✂️ ESPECIALIDADES DEL PERSONAL - COMPONENTE ESPECIALIZADO
// ===================================================================
// Grid de selección de especialidades del barbero

import React from 'react';
import { STAFF_LABELS, STAFF_STYLES, STAFF_SPECIALTIES } from '../../../constants/staff';

const StaffSpecialties = ({
  selectedSpecialties,
  onSpecialtyToggle
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        {STAFF_LABELS.FORM.SPECIALTIES}
      </label>

      <div className={STAFF_STYLES.FORM.GRID_3}>
        {STAFF_SPECIALTIES.map(specialty => {
          const isSelected = selectedSpecialties.includes(specialty);

          return (
            <label
              key={specialty}
              className={`${STAFF_STYLES.SPECIALTY.LABEL} ${
                isSelected
                  ? STAFF_STYLES.SPECIALTY.ACTIVE
                  : STAFF_STYLES.SPECIALTY.INACTIVE
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSpecialtyToggle(specialty)}
                className="sr-only"
              />
              <span className={STAFF_STYLES.SPECIALTY.TEXT}>
                {specialty}
              </span>
            </label>
          );
        })}
      </div>

      <p className="text-xs text-gray-500 mt-2">
        {STAFF_LABELS.FORM.SPECIALTIES_HELP}
      </p>
    </div>
  );
};

export default StaffSpecialties;