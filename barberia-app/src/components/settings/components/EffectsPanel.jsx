// ===================================================================
// 🎨 PANEL DE EFECTOS DE FONDO - COMPONENTE ESPECIALIZADO
// ===================================================================
// Controles para opacidad y desenfoque de fondos

import React from 'react';
import { SETTINGS_LABELS, SETTINGS_CONFIG } from '../../../constants/settings';

const EffectsPanel = ({
  opacity,
  blur,
  onOpacityChange,
  onBlurChange
}) => {
  return (
    <div className="space-y-6">
      {/* Control de Opacidad */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {SETTINGS_LABELS.BACKGROUND.OPACITY_LABEL}
          </label>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(opacity * 100)}%
          </span>
        </div>

        <div className="relative">
          <input
            type="range"
            min={SETTINGS_CONFIG.OPACITY.MIN}
            max={SETTINGS_CONFIG.OPACITY.MAX}
            step={SETTINGS_CONFIG.OPACITY.STEP}
            value={opacity}
            onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />

          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>{SETTINGS_LABELS.SLIDERS.TRANSPARENT}</span>
            <span>{SETTINGS_LABELS.SLIDERS.OPAQUE}</span>
          </div>
        </div>
      </div>

      {/* Control de Desenfoque */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {SETTINGS_LABELS.BACKGROUND.BLUR_LABEL}
          </label>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {blur}px
          </span>
        </div>

        <div className="relative">
          <input
            type="range"
            min={SETTINGS_CONFIG.BLUR.MIN}
            max={SETTINGS_CONFIG.BLUR.MAX}
            step={SETTINGS_CONFIG.BLUR.STEP}
            value={blur}
            onChange={(e) => onBlurChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />

          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>{SETTINGS_LABELS.SLIDERS.SHARP}</span>
            <span>{SETTINGS_LABELS.SLIDERS.BLURRED}</span>
          </div>
        </div>
      </div>

      {/* Vista previa de efectos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {SETTINGS_LABELS.BACKGROUND.PREVIEW_TITLE}
        </h4>

        <div
          className="h-20 rounded-lg border border-gray-300 dark:border-gray-600 relative overflow-hidden"
          style={{
            background: 'linear-gradient(45deg, #f3f4f6, #e5e7eb)',
            filter: `blur(${blur}px)`,
            opacity: opacity
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white bg-opacity-90 px-3 py-1 rounded text-sm text-gray-700">
              {SETTINGS_LABELS.BACKGROUND.PREVIEW_CONTENT}
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          {SETTINGS_LABELS.BACKGROUND.PREVIEW_SUBTITLE}
        </p>
      </div>
    </div>
  );
};

export default EffectsPanel;