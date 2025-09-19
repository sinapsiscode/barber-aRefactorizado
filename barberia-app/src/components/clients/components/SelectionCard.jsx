// ===================================================================
// 🎯 TARJETA DE SELECCIÓN - COMPONENTE REUTILIZABLE
// ===================================================================
// Tarjeta reutilizable para selecciones en el formulario

import React from 'react';
import { FiCheck } from 'react-icons/fi';
import { CLIENT_APPOINTMENT_STYLES } from '../../../constants';

const SelectionCard = ({
  isSelected,
  onClick,
  children,
  className = '',
  showCheckmark = true
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
        isSelected
          ? CLIENT_APPOINTMENT_STYLES.SELECTION_CARD.SELECTED
          : CLIENT_APPOINTMENT_STYLES.SELECTION_CARD.UNSELECTED
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {children}
        </div>
        {isSelected && showCheckmark && (
          <FiCheck className="w-5 h-5 text-primary-600" />
        )}
      </div>
    </div>
  );
};

export default SelectionCard;