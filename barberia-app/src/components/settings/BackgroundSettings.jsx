// ===================================================================
// 🎨 CONFIGURACIÓN DE FONDOS - REFACTORIZADO
// ===================================================================
// Componente principal para la personalización de fondos de la aplicación

import React from 'react';
import { FiEye, FiRefreshCw } from 'react-icons/fi';
import { useBackgroundSettings } from '../../hooks/useBackgroundSettings';
import { SETTINGS_LABELS, SETTINGS_STYLES } from '../../constants/settings';
import {
  BackgroundGallery,
  BackgroundUpload,
  EffectsPanel,
  BackgroundPreview
} from './components';

const BackgroundSettings = () => {
  const {
    // Estados
    activeTab,
    setActiveTab,
    activeCategory,
    previewMode,
    previewBackground,
    isUploading,
    opacity,
    setOpacity,
    blur,
    setBlur,

    // Datos
    branchData,
    userPermissions,
    filteredBackgrounds,
    currentBackground,

    // Funciones
    handleCategoryChange,
    handlePreviewBackground,
    exitPreview,
    handleApplyBackground,
    handleFileUpload,
    handleResetToDefault,
    getFallbackImage
  } = useBackgroundSettings();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {SETTINGS_LABELS.BACKGROUND.TITLE}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {SETTINGS_LABELS.BACKGROUND.SUBTITLE}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => handlePreviewBackground(currentBackground)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              previewMode
                ? SETTINGS_STYLES.BUTTONS.PREVIEW_ACTIVE
                : SETTINGS_STYLES.BUTTONS.PREVIEW_INACTIVE
            }`}
          >
            <FiEye className="w-4 h-4 mr-2 inline" />
            {previewMode ? SETTINGS_LABELS.BACKGROUND.NORMAL_VIEW : SETTINGS_LABELS.BACKGROUND.PREVIEW_VIEW}
          </button>

          <button
            onClick={handleResetToDefault}
            className={`px-4 py-2 rounded-lg transition-colors ${SETTINGS_STYLES.BUTTONS.RESTORE}`}
          >
            <FiRefreshCw className="w-4 h-4 mr-2 inline" />
            {SETTINGS_LABELS.BACKGROUND.RESTORE}
          </button>
        </div>
      </div>

      {/* Info del fondo actual */}
      <div className={`${SETTINGS_STYLES.INFO_BOX.bg} border ${SETTINGS_STYLES.INFO_BOX.border} rounded-lg p-4`}>
        <div className="flex items-center space-x-3">
          <FiEye className={`w-5 h-5 ${SETTINGS_STYLES.INFO_BOX.iconColor}`} />
          <div>
            <p className={`font-medium ${SETTINGS_STYLES.INFO_BOX.titleColor}`}>
              {SETTINGS_LABELS.BACKGROUND.CURRENT_BACKGROUND}: {currentBackground?.name || 'Ninguno'}
            </p>
            <p className={`text-sm ${SETTINGS_STYLES.INFO_BOX.textColor}`}>
              {branchData.name}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {Object.entries(SETTINGS_LABELS.TABS).map(([key, label]) => (
            <button
              key={key.toLowerCase()}
              onClick={() => setActiveTab(key.toLowerCase())}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === key.toLowerCase()
                  ? SETTINGS_STYLES.TABS.ACTIVE
                  : SETTINGS_STYLES.TABS.INACTIVE
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'gallery' && (
          <BackgroundGallery
            filteredBackgrounds={filteredBackgrounds}
            currentBackground={currentBackground}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            onPreviewBackground={handlePreviewBackground}
            getFallbackImage={getFallbackImage}
          />
        )}

        {activeTab === 'upload' && (
          <BackgroundUpload
            isUploading={isUploading}
            uploadProgress={0}
            userPermissions={userPermissions}
            onFileUpload={handleFileUpload}
          />
        )}

        {activeTab === 'effects' && (
          <EffectsPanel
            opacity={opacity}
            blur={blur}
            onOpacityChange={setOpacity}
            onBlurChange={setBlur}
          />
        )}
      </div>

      {/* Vista previa modal */}
      <BackgroundPreview
        isActive={previewMode}
        previewBackground={previewBackground}
        opacity={opacity}
        blur={blur}
        onExit={exitPreview}
        onApply={handleApplyBackground}
        onTogglePreview={() => {}}
      />
    </div>
  );
};

export default BackgroundSettings;