// ===================================================================
// 👁️ VISTA PREVIA DE FONDO - COMPONENTE ESPECIALIZADO
// ===================================================================
// Modal/Overlay para previsualizar fondos antes de aplicar

import React from 'react';
import { FiX, FiCheck, FiEye, FiEyeOff } from 'react-icons/fi';
import { SETTINGS_LABELS, SETTINGS_STYLES } from '../../../constants/settings';

const BackgroundPreview = ({
  isActive,
  previewBackground,
  opacity,
  blur,
  onExit,
  onApply,
  onTogglePreview
}) => {
  if (!isActive || !previewBackground) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Fondo de preview */}
      <div
        className="absolute inset-0"
        style={{
          background: previewBackground.type === 'color'
            ? previewBackground.value
            : `url(${previewBackground.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: previewBackground.type === 'image' ? `blur(${blur}px)` : 'none',
          opacity: previewBackground.type === 'image' ? opacity : 1
        }}
      />

      {/* Contenido del preview */}
      <div className="relative z-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {SETTINGS_LABELS.BACKGROUND.PREVIEW_VIEW}
          </h3>
          <button
            onClick={onExit}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Información del fondo */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            {previewBackground.name}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {previewBackground.description || 'Vista previa del fondo seleccionado'}
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex space-x-3">
          <button
            onClick={() => onApply(previewBackground)}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${SETTINGS_STYLES.BUTTONS.UPLOAD}`}
          >
            <FiCheck className="h-4 w-4 mr-2" />
            Aplicar Fondo
          </button>

          <button
            onClick={onTogglePreview}
            className={`flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${SETTINGS_STYLES.BUTTONS.PREVIEW_INACTIVE}`}
          >
            <FiEyeOff className="h-4 w-4" />
          </button>

          <button
            onClick={onExit}
            className={`flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${SETTINGS_STYLES.BUTTONS.RESTORE}`}
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>

        {/* Vista normal toggle */}
        <div className="mt-4 text-center">
          <button
            onClick={onTogglePreview}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center justify-center mx-auto"
          >
            <FiEye className="h-4 w-4 mr-1" />
            {SETTINGS_LABELS.BACKGROUND.NORMAL_VIEW}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackgroundPreview;