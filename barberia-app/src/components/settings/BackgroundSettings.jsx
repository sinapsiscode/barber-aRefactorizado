import { useState, useRef } from 'react';
import { 
  FiImage, FiUpload, FiEye, FiSettings, FiCheck, FiX, FiRefreshCw,
  FiLayers, FiSliders, FiMonitor, FiSmartphone, FiTablet 
} from 'react-icons/fi';
import { useAuthStore, useBranchStore } from '../../stores';
import useBackgroundStore from '../../stores/backgroundStore';
import Swal from 'sweetalert2';

const BackgroundSettings = () => {
  const { user } = useAuthStore();
  const { selectedBranch } = useBranchStore();
  const {
    getAvailableBackgrounds,
    getCurrentBackgroundStyle,
    setCurrentBackground,
    setUserPreference,
    setBranchBackground,
    uploadBackgroundImage,
    setOpacity,
    setBlur,
    opacity,
    blur,
    userPreference,
    resetToDefaults
  } = useBackgroundStore();

  const [activeTab, setActiveTab] = useState('gallery');
  const [previewMode, setPreviewMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const currentBranchId = selectedBranch?.id || user?.branchId;
  const availableBackgrounds = getAvailableBackgrounds(user?.role, currentBranchId);
  const currentStyle = getCurrentBackgroundStyle(user?.role, currentBranchId, user?.id);

  // Categorizar fondos
  const categorizedBackgrounds = {
    default: Object.values(availableBackgrounds).filter(bg => bg.category === 'default'),
    gradient: Object.values(availableBackgrounds).filter(bg => bg.category === 'gradient'),
    texture: Object.values(availableBackgrounds).filter(bg => bg.category === 'texture'),
    pattern: Object.values(availableBackgrounds).filter(bg => bg.category === 'pattern'),
    custom: Object.values(availableBackgrounds).filter(bg => bg.category === 'custom')
  };

  const handleBackgroundSelect = (backgroundId) => {
    if (user?.role === 'super_admin' || user?.role === 'branch_admin') {
      // Admins pueden establecer como fondo de sede
      Swal.fire({
        title: 'Aplicar Fondo',
        text: '¿Cómo quieres aplicar este fondo?',
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: user?.role === 'branch_admin' ? 'Para mi sede' : 'Para toda la aplicación',
        denyButtonText: 'Solo para mí',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#ffc000',
        denyButtonColor: '#6b7280'
      }).then((result) => {
        if (result.isConfirmed) {
          if (user?.role === 'super_admin') {
            setCurrentBackground(backgroundId);
          } else {
            setBranchBackground(currentBranchId, backgroundId);
          }
          showSuccessMessage('Fondo aplicado para la sede');
        } else if (result.isDenied) {
          setUserPreference(backgroundId);
          showSuccessMessage('Fondo aplicado a tu perfil');
        }
      });
    } else {
      // Usuarios normales solo pueden cambiar su preferencia
      setUserPreference(backgroundId);
      showSuccessMessage('Fondo aplicado a tu perfil');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const backgroundId = await uploadBackgroundImage(file, 
        user?.role === 'branch_admin' ? currentBranchId : null
      );
      
      await Swal.fire({
        title: '¡Imagen subida!',
        text: 'Tu fondo personalizado ha sido creado exitosamente',
        icon: 'success',
        confirmButtonColor: '#ffc000'
      });

      // Auto-aplicar el fondo subido
      handleBackgroundSelect(backgroundId);
    } catch (error) {
      Swal.fire({
        title: 'Error al subir imagen',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#ffc000'
      });
    } finally {
      setUploading(false);
      event.target.value = ''; // Reset input
    }
  };

  const showSuccessMessage = (message) => {
    Swal.fire({
      title: '¡Éxito!',
      text: message,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  };

  const handleReset = async () => {
    const result = await Swal.fire({
      title: '¿Restaurar valores por defecto?',
      text: 'Esto restaurará el fondo blanco original',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ffc000',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, restaurar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      resetToDefaults();
      showSuccessMessage('Configuración restaurada');
    }
  };

  const BackgroundCard = ({ background, isActive }) => (
    <div
      onClick={() => handleBackgroundSelect(background.id)}
      className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
        isActive 
          ? 'border-primary-500 shadow-lg' 
          : 'border-gray-200 hover:border-primary-300'
      }`}
    >
      <div className="aspect-video relative">
        {background.type === 'color' ? (
          <div 
            className="w-full h-full" 
            style={{ background: background.value }}
          />
        ) : (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ 
              background: background.preview || background.value,
              backgroundSize: 'cover'
            }}
          />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            {isActive ? (
              <FiCheck className="w-8 h-8 text-white bg-primary-500 rounded-full p-1" />
            ) : (
              <FiEye className="w-8 h-8 text-white bg-black/50 rounded-full p-1" />
            )}
          </div>
        </div>
      </div>
      
      <div className="p-3">
        <h4 className="font-medium text-sm text-gray-900 dark:text-white">
          {background.name}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
          {background.type}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Personalización de Fondo
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Personaliza el fondo de la aplicación
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              previewMode 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <FiEye className="w-4 h-4 mr-2 inline" />
            {previewMode ? 'Vista Normal' : 'Vista Previa'}
          </button>
          
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <FiRefreshCw className="w-4 h-4 mr-2 inline" />
            Restaurar
          </button>
        </div>
      </div>

      {/* Info del fondo actual */}
      <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <FiMonitor className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <div>
            <p className="font-medium text-primary-900 dark:text-primary-100">
              Fondo Activo: {currentStyle.info.name}
            </p>
            <p className="text-sm text-primary-700 dark:text-primary-300">
              Tipo: {currentStyle.info.type} • Categoría: {currentStyle.info.category}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'gallery', name: 'Galería', icon: FiImage },
            { id: 'upload', name: 'Subir Imagen', icon: FiUpload },
            { id: 'effects', name: 'Efectos', icon: FiSliders }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'gallery' && (
          <div className="space-y-8">
            {Object.entries(categorizedBackgrounds).map(([category, backgrounds]) => {
              if (backgrounds.length === 0) return null;
              
              const categoryInfo = {
                default: { name: 'Por Defecto', icon: FiMonitor },
                gradient: { name: 'Degradados', icon: FiSettings },
                texture: { name: 'Texturas', icon: FiLayers },
                pattern: { name: 'Patrones', icon: FiSliders },
                custom: { name: 'Personalizados', icon: FiImage }
              };

              const IconComponent = categoryInfo[category].icon;
              
              return (
                <div key={category}>
                  <div className="flex items-center space-x-2 mb-4">
                    <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {categoryInfo[category].name}
                    </h3>
                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-xs">
                      {backgrounds.length}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {backgrounds.map(bg => (
                      <BackgroundCard 
                        key={bg.id}
                        background={bg}
                        isActive={currentStyle.info.id === bg.id}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 hover:border-primary-400 transition-colors">
                <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Subir Imagen Personalizada
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Arrastra una imagen aquí o haz clic para seleccionar
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Subiendo...' : 'Seleccionar Imagen'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Recomendaciones:
                </h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Tamaño máximo: 5MB</li>
                  <li>• Formatos: JPG, PNG, WebP</li>
                  <li>• Resolución mínima: 1920x1080px</li>
                  <li>• Usa imágenes con colores suaves</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Permisos:
                </h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {user?.role === 'super_admin' && (
                    <li>• Puedes subir fondos globales</li>
                  )}
                  {user?.role === 'branch_admin' && (
                    <li>• Puedes subir fondos para tu sede</li>
                  )}
                  <li>• Los fondos serán aplicados automáticamente</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'effects' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Opacidad del Fondo
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={opacity}
                      onChange={(e) => setOpacity(parseFloat(e.target.value))}
                      className="w-full accent-primary-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Transparente</span>
                      <span>{Math.round(opacity * 100)}%</span>
                      <span>Opaco</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Desenfoque (Blur)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={blur}
                      onChange={(e) => setBlur(parseFloat(e.target.value))}
                      className="w-full accent-primary-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Nítido</span>
                      <span>{blur}px</span>
                      <span>Difuso</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Vista Previa de Efectos
                </h4>
                <div className="aspect-video border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <div
                    className="w-full h-full"
                    style={{
                      ...currentStyle.style,
                      filter: blur > 0 ? `blur(${blur}px)` : 'none'
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center bg-white/90">
                      <div className="text-center p-4">
                        <p className="text-gray-900 font-medium">Vista Previa</p>
                        <p className="text-gray-600 text-sm">Contenido de la aplicación</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackgroundSettings;