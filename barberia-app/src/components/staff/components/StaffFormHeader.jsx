// ===================================================================
// 📋 CABECERA DEL FORMULARIO DE PERSONAL - COMPONENTE ESPECIALIZADO
// ===================================================================
// Cabecera del modal de formulario de barberos

import React from 'react';
import { FiX } from 'react-icons/fi';
import { STAFF_LABELS, STAFF_STYLES } from '../../../constants/staff';

const StaffFormHeader = ({
  isEditing,
  onClose
}) => {
  return (
    <div className={STAFF_STYLES.HEADER.CONTAINER}>
      <div className="flex items-center justify-between">
        <h3 className={STAFF_STYLES.HEADER.TITLE}>
          {isEditing ? STAFF_LABELS.FORM.TITLE_EDIT : STAFF_LABELS.FORM.TITLE_NEW}
        </h3>
        <button
          onClick={onClose}
          className={STAFF_STYLES.HEADER.CLOSE_BUTTON}
        >
          <FiX className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default StaffFormHeader;