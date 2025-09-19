// ===================================================================
// 🖼️ GALERÍA DE FONDOS - COMPONENTE ESPECIALIZADO
// ===================================================================
// Galería visual de fondos disponibles con categorías

import React from 'react';
import { FiImage, FiPalette } from 'react-icons/fi';
import { SETTINGS_LABELS, SETTINGS_STYLES, BACKGROUND_CATEGORIES } from '../../../constants/settings';

const BackgroundGallery = ({
  filteredBackgrounds = [],
  currentBackground,
  activeCategory,
  onCategoryChange,
  onPreviewBackground,
  getFallbackImage
}) => {
  const categories = [
    { key: BACKGROUND_CATEGORIES.DEFAULT, icon: FiPalette },
    { key: BACKGROUND_CATEGORIES.GRADIENT, icon: FiPalette },
    { key: BACKGROUND_CATEGORIES.TEXTURE, icon: FiImage },
    { key: BACKGROUND_CATEGORIES.PATTERN, icon: FiImage },
    { key: BACKGROUND_CATEGORIES.CUSTOM, icon: FiImage }
  ];

  return (
    <div className="space-y-4">
      {/* Categorías */}
      <div className="flex flex-wrap gap-2">
        {categories.map(({ key, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onCategoryChange(key)}
            className={`flex items-center px-3 py-2 rounded-lg font-medium transition-colors ${
              activeCategory === key
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Icon className="h-4 w-4 mr-2" />
            {SETTINGS_LABELS.CATEGORIES[key.toUpperCase()]}
          </button>
        ))}
      </div>

      {/* Grid de fondos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBackgrounds.map((background) => (
          <div
            key={background.id}
            className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
              currentBackground?.id === background.id
                ? SETTINGS_STYLES.BACKGROUND_CARD.ACTIVE
                : SETTINGS_STYLES.BACKGROUND_CARD.INACTIVE
            }`}
            onClick={() => onPreviewBackground(background)}
          >
            {/* Imagen de fondo */}
            <div
              className="h-24 w-full"
              style={{
                background: background.type === 'color'
                  ? background.value
                  : `url(${background.url || getFallbackImage()})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />

            {/* Overlay con información */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-center text-white">
                <p className="text-sm font-medium">{background.name}</p>
                {currentBackground?.id === background.id && (
                  <p className="text-xs mt-1">Activo</p>
                )}
              </div>
            </div>

            {/* Indicador de fondo activo */}
            {currentBackground?.id === background.id && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
        ))}
      </div>

      {/* Mensaje si no hay fondos */}
      {filteredBackgrounds.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <FiImage className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No hay fondos disponibles en esta categoría</p>
        </div>
      )}
    </div>
  );
};

export default BackgroundGallery;