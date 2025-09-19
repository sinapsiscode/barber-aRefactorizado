// ===================================================================
// ℹ️ INFORMACIÓN BÁSICA DEL PERSONAL - COMPONENTE ESPECIALIZADO
// ===================================================================
// Campos básicos del formulario de barberos

import React from 'react';
import { FiUser, FiMail, FiPhone } from 'react-icons/fi';
import { FormInput } from '../../common';
import { STAFF_LABELS, STAFF_STYLES } from '../../../constants/staff';

const StaffBasicInfo = ({
  formData,
  onFieldChange
}) => {
  return (
    <div className={STAFF_STYLES.FORM.GRID_2}>
      <FormInput
        label={STAFF_LABELS.FORM.FULL_NAME}
        value={formData.name}
        onChange={(e) => onFieldChange('name', e.target.value)}
        icon={FiUser}
        required
        placeholder={STAFF_LABELS.PLACEHOLDERS.NAME}
      />

      <FormInput
        label={STAFF_LABELS.FORM.EMAIL}
        type="email"
        value={formData.email}
        onChange={(e) => onFieldChange('email', e.target.value)}
        icon={FiMail}
        required
        placeholder={STAFF_LABELS.PLACEHOLDERS.EMAIL}
      />

      <FormInput
        label={STAFF_LABELS.FORM.PHONE}
        type="tel"
        value={formData.phone}
        onChange={(e) => onFieldChange('phone', e.target.value)}
        icon={FiPhone}
        required
        placeholder={STAFF_LABELS.PLACEHOLDERS.PHONE}
      />
    </div>
  );
};

export default StaffBasicInfo;