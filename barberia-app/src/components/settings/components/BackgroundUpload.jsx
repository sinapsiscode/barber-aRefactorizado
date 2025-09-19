// ===================================================================
// ⬆️ SUBIDA DE FONDOS PERSONALIZADOS - COMPONENTE ESPECIALIZADO
// ===================================================================
// Área de carga de imágenes con validaciones y recomendaciones

import React, { useRef } from 'react';
import { FiUpload, FiInfo, FiShield } from 'react-icons/fi';
import { SETTINGS_LABELS, SETTINGS_STYLES, SETTINGS_CONFIG } from '../../../constants/settings';

const BackgroundUpload = ({
  isUploading,
  uploadProgress,
  userPermissions,
  onFileUpload
}) => {
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className="space-y-6">
      {/* Área de subida */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${SETTINGS_STYLES.UPLOAD_AREA.border} ${
          isUploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={SETTINGS_CONFIG.UPLOAD.ACCEPTED_TYPES.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        <FiUpload className={`h-12 w-12 mx-auto mb-4 ${SETTINGS_STYLES.UPLOAD_AREA.iconColor}`} />

        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {SETTINGS_LABELS.BACKGROUND.UPLOAD_AREA_TITLE}
        </h3>

        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {SETTINGS_LABELS.BACKGROUND.UPLOAD_AREA_SUBTITLE}
        </p>

        {/* Barra de progreso */}
        {isUploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {SETTINGS_LABELS.BACKGROUND.UPLOADING} {uploadProgress}%
            </p>
          </div>
        )}
      </div>

      {/* Recomendaciones */}
      <div className={`${SETTINGS_STYLES.INFO_BOX.bg} border ${SETTINGS_STYLES.INFO_BOX.border} rounded-lg p-4`}>
        <div className="flex items-start">
          <FiInfo className={`h-5 w-5 ${SETTINGS_STYLES.INFO_BOX.iconColor} mr-3 mt-0.5`} />
          <div>
            <h4 className={`font-medium ${SETTINGS_STYLES.INFO_BOX.titleColor} mb-2`}>
              {SETTINGS_LABELS.RECOMMENDATIONS.TITLE}
            </h4>
            <ul className={`text-sm ${SETTINGS_STYLES.INFO_BOX.textColor} space-y-1`}>
              <li>• {SETTINGS_LABELS.RECOMMENDATIONS.MAX_SIZE} ({formatFileSize(SETTINGS_CONFIG.UPLOAD.MAX_SIZE)})</li>
              <li>• {SETTINGS_LABELS.RECOMMENDATIONS.FORMATS}</li>
              <li>• {SETTINGS_LABELS.RECOMMENDATIONS.RESOLUTION}</li>
              <li>• {SETTINGS_LABELS.RECOMMENDATIONS.COLORS}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Permisos */}
      <div className={`${SETTINGS_STYLES.INFO_BOX.bg} border ${SETTINGS_STYLES.INFO_BOX.border} rounded-lg p-4`}>
        <div className="flex items-start">
          <FiShield className={`h-5 w-5 ${SETTINGS_STYLES.INFO_BOX.iconColor} mr-3 mt-0.5`} />
          <div>
            <h4 className={`font-medium ${SETTINGS_STYLES.INFO_BOX.titleColor} mb-2`}>
              {SETTINGS_LABELS.PERMISSIONS.TITLE}
            </h4>
            <ul className={`text-sm ${SETTINGS_STYLES.INFO_BOX.textColor} space-y-1`}>
              {userPermissions.canUploadGlobal && (
                <li>• {SETTINGS_LABELS.PERMISSIONS.SUPER_ADMIN}</li>
              )}
              {userPermissions.canUploadBranch && (
                <li>• {SETTINGS_LABELS.PERMISSIONS.BRANCH_ADMIN}</li>
              )}
              {userPermissions.autoApply && (
                <li>• {SETTINGS_LABELS.PERMISSIONS.AUTO_APPLY}</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundUpload;