// ===================================================================
// 🏢 SELECTOR DE SEDE - COMPONENTE ESPECIALIZADO
// ===================================================================
// Selector de sede para asignación de barberos

import React from 'react';
import { STAFF_LABELS, STAFF_STYLES } from '../../../constants/staff';

const StaffBranchSelector = ({
  selectedBranchId,
  branches,
  onBranchChange
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {STAFF_LABELS.FORM.BRANCH}
      </label>
      <select
        value={selectedBranchId}
        onChange={(e) => onBranchChange(parseInt(e.target.value))}
        className="input-field"
        required
      >
        {branches.map(branch => (
          <option key={branch.id} value={branch.id}>
            {branch.name} - {branch.city}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StaffBranchSelector;