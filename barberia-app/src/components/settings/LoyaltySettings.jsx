import { useState, useEffect } from 'react';
import { FiGift, FiDollarSign, FiUsers, FiCalendar, FiSave, FiRefreshCw, FiStar, FiTrendingUp, FiPlus, FiEdit, FiTrash, FiAward, FiSettings } from 'react-icons/fi';
import { useLoyaltyStore } from '../../stores';
import LoyaltyLevelForm from './LoyaltyLevelForm';
import Swal from 'sweetalert2';

const LoyaltySettings = () => {
  const {
    settings,
    updateSettings,
    getPointsStats,
    loyaltyLevels,
    updateLoyaltyLevel,
    addLoyaltyLevel,
    deleteLoyaltyLevel,
    getClientsByLevel
  } = useLoyaltyStore();
  const [formData, setFormData] = useState({
    pointsPerSol: settings.pointsPerSol || 1,
    enabled: settings.enabled !== false,
    minimumPointsToRedeem: settings.minimumPointsToRedeem || 50,
    pointsExpiryDays: settings.pointsExpiryDays || 365,
    welcomeBonusPoints: settings.welcomeBonusPoints || 50,
    birthdayBonusPoints: settings.birthdayBonusPoints || 100,
    referralBonusPoints: settings.referralBonusPoints || 150
  });
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showLevelForm, setShowLevelForm] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [activeSection, setActiveSection] = useState('basic'); // 'basic' o 'levels'

  const pointsStats = getPointsStats();

  useEffect(() => {
    // Detectar cambios en el formulario
    const hasFormChanges = Object.keys(formData).some(key =>
      formData[key] !== settings[key]
    );
    setHasChanges(hasFormChanges);
  }, [formData, settings]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Validaciones
      if (formData.pointsPerSol <= 0) {
        throw new Error('Los puntos por sol deben ser mayor a 0');
      }
      if (formData.minimumPointsToRedeem < 0) {
        throw new Error('Los puntos mínimos no pueden ser negativos');
      }
      if (formData.pointsExpiryDays <= 0) {
        throw new Error('Los días de expiración deben ser mayor a 0');
      }

      await updateSettings(formData);

      Swal.fire({
        title: '¡Configuración Guardada!',
        text: 'Los cambios se han aplicado exitosamente',
        icon: 'success',
        confirmButtonColor: '#ffc000'
      });

      setHasChanges(false);
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudo guardar la configuración',
        icon: 'error',
        confirmButtonColor: '#ffc000'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({
      pointsPerSol: settings.pointsPerSol || 1,
      enabled: settings.enabled !== false,
      minimumPointsToRedeem: settings.minimumPointsToRedeem || 50,
      pointsExpiryDays: settings.pointsExpiryDays || 365,
      welcomeBonusPoints: settings.welcomeBonusPoints || 50,
      birthdayBonusPoints: settings.birthdayBonusPoints || 100,
      referralBonusPoints: settings.referralBonusPoints || 150
    });
  };

  const handleEditLevel = (level) => {
    setSelectedLevel(level);
    setShowLevelForm(true);
  };

  const handleDeleteLevel = async (levelId) => {
    const result = await Swal.fire({
      title: '¿Eliminar Nivel?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        deleteLoyaltyLevel(levelId);
        Swal.fire({
          title: '¡Eliminado!',
          text: 'El nivel ha sido eliminado',
          icon: 'success',
          confirmButtonColor: '#ffc000'
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el nivel',
          icon: 'error',
          confirmButtonColor: '#ffc000'
        });
      }
    }
  };

  const clientsByLevel = getClientsByLevel();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <FiGift className="h-5 w-5 text-purple-500 mr-2" />
            Sistema de Fidelización
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Configura cómo los clientes ganan y usan puntos de fidelidad
          </p>
        </div>
        <div className="flex space-x-3">
          {hasChanges && activeSection === 'basic' && (
            <button
              onClick={handleReset}
              className="btn-secondary flex items-center text-sm px-3 py-2"
            >
              <FiRefreshCw className="h-4 w-4 mr-1" />
              Deshacer
            </button>
          )}
          {activeSection === 'basic' && (
            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="btn-primary flex items-center text-sm px-3 py-2 disabled:opacity-50"
            >
              <FiSave className="h-4 w-4 mr-1" />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          )}
          {activeSection === 'levels' && (
            <button
              onClick={() => {
                setSelectedLevel(null);
                setShowLevelForm(true);
              }}
              className="btn-primary flex items-center text-sm px-3 py-2"
            >
              <FiPlus className="h-4 w-4 mr-1" />
              Nuevo Nivel
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveSection('basic')}
          className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeSection === 'basic'
              ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <FiSettings className="h-4 w-4 mr-2" />
          Configuración Básica
        </button>
        <button
          onClick={() => setActiveSection('levels')}
          className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeSection === 'levels'
              ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <FiAward className="h-4 w-4 mr-2" />
          Niveles de Fidelidad
        </button>
      </div>

      {/* Contenido de la sección activa */}
      {activeSection === 'basic' && (
        <>
          {/* Estado del Sistema */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white">Estado del Sistema</h4>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white">
                Sistema de Puntos
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formData.enabled ? 'Los clientes pueden ganar y canjear puntos' : 'Sistema desactivado, no se otorgan puntos'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => handleInputChange('enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Estadísticas de Puntos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-dark-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
              <FiTrendingUp className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Puntos Otorgados</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {pointsStats.totalEarned.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
              <FiGift className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Puntos Canjeados</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {pointsStats.totalRedeemed.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
              <FiStar className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Puntos Activos</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {pointsStats.totalActive.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Configuración Principal */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white">Configuración de Puntos</h4>
        </div>
        <div className="p-4 space-y-6">
          {/* Conversión de Soles a Puntos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FiDollarSign className="inline h-4 w-4 mr-1" />
                Soles por Punto
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={formData.pointsPerSol}
                  onChange={(e) => handleInputChange('pointsPerSol', parseFloat(e.target.value) || 1)}
                  className="input-field pr-12"
                  placeholder="1.0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  S/
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Por cada S/{formData.pointsPerSol} gastados = 1 punto
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FiGift className="inline h-4 w-4 mr-1" />
                Puntos Mínimos para Canje
              </label>
              <input
                type="number"
                min="1"
                value={formData.minimumPointsToRedeem}
                onChange={(e) => handleInputChange('minimumPointsToRedeem', parseInt(e.target.value) || 50)}
                className="input-field"
                placeholder="50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Mínimo de puntos requeridos para canjear recompensas
              </p>
            </div>
          </div>

          {/* Configuración de Expiración */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FiCalendar className="inline h-4 w-4 mr-1" />
              Expiración de Puntos
            </label>
            <div className="relative">
              <input
                type="number"
                min="30"
                max="1095"
                value={formData.pointsExpiryDays}
                onChange={(e) => handleInputChange('pointsExpiryDays', parseInt(e.target.value) || 365)}
                className="input-field pr-16"
                placeholder="365"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                días
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Los puntos expirarán después de {formData.pointsExpiryDays} días
            </p>
          </div>
        </div>
      </div>

      {/* Bonificaciones Especiales */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white">Bonificaciones Especiales</h4>
        </div>
        <div className="p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FiUsers className="inline h-4 w-4 mr-1" />
                Bono de Bienvenida
              </label>
              <input
                type="number"
                min="0"
                value={formData.welcomeBonusPoints}
                onChange={(e) => handleInputChange('welcomeBonusPoints', parseInt(e.target.value) || 0)}
                className="input-field"
                placeholder="50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Puntos otorgados a nuevos clientes
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FiGift className="inline h-4 w-4 mr-1" />
                Bono de Cumpleaños
              </label>
              <input
                type="number"
                min="0"
                value={formData.birthdayBonusPoints}
                onChange={(e) => handleInputChange('birthdayBonusPoints', parseInt(e.target.value) || 0)}
                className="input-field"
                placeholder="100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Puntos de regalo en cumpleaños
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FiStar className="inline h-4 w-4 mr-1" />
                Bono por Referido
              </label>
              <input
                type="number"
                min="0"
                value={formData.referralBonusPoints}
                onChange={(e) => handleInputChange('referralBonusPoints', parseInt(e.target.value) || 0)}
                className="input-field"
                placeholder="150"
              />
              <p className="text-xs text-gray-500 mt-1">
                Puntos por traer un amigo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ejemplo de Cálculo */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <h5 className="font-medium text-purple-900 dark:text-purple-100 mb-3">
          📊 Ejemplo de Cálculo
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-purple-800 dark:text-purple-200">
              <strong>Cliente gasta S/{(formData.pointsPerSol * 10).toFixed(1)}:</strong>
            </p>
            <p className="text-purple-700 dark:text-purple-300">
              • Gana: {Math.floor((formData.pointsPerSol * 10) / formData.pointsPerSol)} puntos
            </p>
            <p className="text-purple-700 dark:text-purple-300">
              • Cliente nuevo: +{formData.welcomeBonusPoints} puntos adicionales
            </p>
          </div>
          <div>
            <p className="text-purple-800 dark:text-purple-200">
              <strong>Para canjear necesita:</strong>
            </p>
            <p className="text-purple-700 dark:text-purple-300">
              • Mínimo: {formData.minimumPointsToRedeem} puntos
            </p>
            <p className="text-purple-700 dark:text-purple-300">
              • Equivale a: S/{(formData.minimumPointsToRedeem * formData.pointsPerSol).toFixed(1)} en compras
            </p>
          </div>
        </div>
      </div>
        </>
      )}

      {/* Sección de Niveles de Fidelidad */}
      {activeSection === 'levels' && (
        <>
          {/* Resumen de Niveles */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {loyaltyLevels.map((level) => (
              <div key={level.id} className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden border-2"
                    style={{
                      backgroundColor: level.image ? 'transparent' : level.color,
                      borderColor: level.color
                    }}
                  >
                    {level.image ? (
                      <img
                        src={level.image}
                        alt={level.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-white font-bold">{level.name.charAt(0)}</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {clientsByLevel[level.id]?.length || 0} clientes
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {level.name}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {level.minPoints} - {level.maxPoints ? level.maxPoints : '∞'} puntos
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>• {level.benefits.discountPercentage}% descuento</div>
                  <div>• {level.benefits.pointsMultiplier}x puntos</div>
                </div>
              </div>
            ))}
          </div>

          {/* Lista Detallada de Niveles */}
          <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white">Gestión de Niveles</h4>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {loyaltyLevels.map((level) => (
                <div key={level.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className="h-12 w-12 rounded-full flex items-center justify-center text-white font-medium overflow-hidden border-2"
                        style={{
                          backgroundColor: level.image ? 'transparent' : level.color,
                          borderColor: level.color
                        }}
                      >
                        {level.image ? (
                          <img
                            src={level.image}
                            alt={level.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          level.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {level.name}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {level.minPoints} - {level.maxPoints ? level.maxPoints : '∞'} puntos
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      {/* Beneficios resumidos */}
                      <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <FiTrendingUp className="h-4 w-4" />
                          <span>{level.benefits.pointsMultiplier}x puntos</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FiDollarSign className="h-4 w-4" />
                          <span>{level.benefits.discountPercentage}% desc.</span>
                        </div>
                        {level.benefits.freeServicesPerMonth > 0 && (
                          <div className="flex items-center space-x-1">
                            <FiGift className="h-4 w-4" />
                            <span>{level.benefits.freeServicesPerMonth} gratis/mes</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <FiUsers className="h-4 w-4" />
                          <span>{clientsByLevel[level.id]?.length || 0}</span>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditLevel(level)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Editar"
                        >
                          <FiEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLevel(level.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Eliminar"
                        >
                          <FiTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Beneficios detallados para móvil */}
                  <div className="md:hidden mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <div>• {level.benefits.pointsMultiplier}x puntos</div>
                      <div>• {level.benefits.discountPercentage}% descuento</div>
                      {level.benefits.freeServicesPerMonth > 0 && (
                        <div>• {level.benefits.freeServicesPerMonth} servicios gratis/mes</div>
                      )}
                      {level.benefits.priorityBooking && (
                        <div>• Reservas prioritarias</div>
                      )}
                      <div>• {clientsByLevel[level.id]?.length || 0} clientes</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Modal del formulario de nivel */}
      {showLevelForm && (
        <LoyaltyLevelForm
          level={selectedLevel}
          onClose={() => {
            setShowLevelForm(false);
            setSelectedLevel(null);
          }}
          onSuccess={() => {
            setShowLevelForm(false);
            setSelectedLevel(null);
          }}
        />
      )}
    </div>
  );
};

export default LoyaltySettings;