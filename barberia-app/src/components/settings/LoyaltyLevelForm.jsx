import { useState } from 'react';
import { FiX, FiAward, FiTrendingUp, FiDollarSign, FiGift, FiCalendar, FiClock, FiUpload, FiTrash2 } from 'react-icons/fi';
import { useLoyaltyStore } from '../../stores';
import { FormInput } from '../common';
import Swal from 'sweetalert2';

const LoyaltyLevelForm = ({ level = null, onClose, onSuccess }) => {
  const { addLoyaltyLevel, updateLoyaltyLevel } = useLoyaltyStore();

  const [formData, setFormData] = useState({
    name: level?.name || '',
    color: level?.color || '#FFD700',
    image: level?.image || null,
    minPoints: level?.minPoints || 0,
    maxPoints: level?.maxPoints || null,
    pointsMultiplier: level?.benefits?.pointsMultiplier || 1.0,
    discountPercentage: level?.benefits?.discountPercentage || 0,
    freeServicesPerMonth: level?.benefits?.freeServicesPerMonth || 0,
    priorityBooking: level?.benefits?.priorityBooking || false,
    birthdayBonus: level?.benefits?.birthdayBonus || 50
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const predefinedColors = [
    { name: 'Oro', value: '#FFD700' },
    { name: 'Plata', value: '#C0C0C0' },
    { name: 'Bronce', value: '#CD7F32' },
    { name: 'Platino', value: '#E5E4E2' },
    { name: 'Púrpura', value: '#8B5CF6' },
    { name: 'Azul', value: '#3B82F6' },
    { name: 'Verde', value: '#10B981' },
    { name: 'Rojo', value: '#EF4444' }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor selecciona un archivo de imagen válido',
        icon: 'error',
        confirmButtonColor: '#ffc000'
      });
      return;
    }

    // Validar tamaño (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        title: 'Error',
        text: 'La imagen no debe superar los 2MB',
        icon: 'error',
        confirmButtonColor: '#ffc000'
      });
      return;
    }

    // Convertir a base64
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData({ ...formData, image: event.target.result });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: null });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (formData.minPoints < 0) {
      newErrors.minPoints = 'Los puntos mínimos no pueden ser negativos';
    }

    if (formData.maxPoints !== null && formData.maxPoints <= formData.minPoints) {
      newErrors.maxPoints = 'Los puntos máximos deben ser mayores a los mínimos';
    }

    if (formData.pointsMultiplier <= 0) {
      newErrors.pointsMultiplier = 'El multiplicador debe ser mayor a 0';
    }

    if (formData.discountPercentage < 0 || formData.discountPercentage > 100) {
      newErrors.discountPercentage = 'El descuento debe estar entre 0 y 100%';
    }

    if (formData.freeServicesPerMonth < 0) {
      newErrors.freeServicesPerMonth = 'Los servicios gratis no pueden ser negativos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const levelData = {
        name: formData.name,
        color: formData.color,
        image: formData.image,
        minPoints: parseInt(formData.minPoints),
        maxPoints: formData.maxPoints ? parseInt(formData.maxPoints) : null,
        benefits: {
          pointsMultiplier: parseFloat(formData.pointsMultiplier),
          discountPercentage: parseInt(formData.discountPercentage),
          freeServicesPerMonth: parseInt(formData.freeServicesPerMonth),
          priorityBooking: formData.priorityBooking,
          birthdayBonus: parseInt(formData.birthdayBonus)
        }
      };

      if (level) {
        updateLoyaltyLevel(level.id, levelData);
        Swal.fire({
          title: '¡Nivel Actualizado!',
          text: 'El nivel de fidelidad ha sido actualizado exitosamente',
          icon: 'success',
          confirmButtonColor: '#ffc000'
        });
      } else {
        addLoyaltyLevel(levelData);
        Swal.fire({
          title: '¡Nivel Creado!',
          text: 'El nuevo nivel de fidelidad ha sido creado exitosamente',
          icon: 'success',
          confirmButtonColor: '#ffc000'
        });
      }

      onSuccess();
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudo guardar el nivel',
        icon: 'error',
        confirmButtonColor: '#ffc000'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white dark:bg-dark-800 px-6 py-4 border-b border-gray-200 dark:border-dark-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
                <FiAward className="h-5 w-5 text-purple-500 mr-2" />
                {level ? 'Editar Nivel de Fidelidad' : 'Nuevo Nivel de Fidelidad'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Información Básica */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Información Básica</h4>

              <div>
                <FormInput
                  label="Nombre del Nivel"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  icon={FiAward}
                  required
                  placeholder="Oro, Plata, VIP..."
                  error={errors.name}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color del Nivel
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {predefinedColors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: color.value })}
                        className={`h-10 rounded-lg border-2 transition-all ${
                          formData.color === color.value
                            ? 'border-purple-500 scale-110'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="mt-2 w-full h-8 rounded border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Imagen del Nivel (Opcional)
                  </label>
                  <div className="space-y-2">
                    {!formData.image ? (
                      <label className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <div className="text-center">
                          <FiUpload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Clic para subir imagen
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Máximo 2MB
                          </p>
                        </div>
                      </label>
                    ) : (
                      <div className="relative h-32 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors"
                          title="Eliminar imagen"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    La imagen se mostrará en el círculo del nivel
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormInput
                    label="Puntos Mínimos"
                    type="number"
                    min="0"
                    value={formData.minPoints}
                    onChange={(e) => setFormData({ ...formData, minPoints: e.target.value })}
                    required
                    placeholder="0"
                    error={errors.minPoints}
                  />
                </div>

                <div>
                  <FormInput
                    label="Puntos Máximos (opcional)"
                    type="number"
                    min="1"
                    value={formData.maxPoints || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      maxPoints: e.target.value ? parseInt(e.target.value) : null
                    })}
                    placeholder="Dejar vacío para ilimitado"
                    error={errors.maxPoints}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Deja vacío para el nivel más alto (ilimitado)
                  </p>
                </div>
              </div>
            </div>

            {/* Beneficios */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Beneficios del Nivel</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormInput
                    label="Multiplicador de Puntos"
                    type="number"
                    min="1"
                    step="0.1"
                    value={formData.pointsMultiplier}
                    onChange={(e) => setFormData({ ...formData, pointsMultiplier: e.target.value })}
                    icon={FiTrendingUp}
                    required
                    placeholder="1.0"
                    error={errors.pointsMultiplier}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Multiplicador para ganar puntos (ej: 1.5 = 50% más puntos)
                  </p>
                </div>

                <div>
                  <FormInput
                    label="Descuento (%)"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                    icon={FiDollarSign}
                    placeholder="0"
                    error={errors.discountPercentage}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Descuento automático en todos los servicios
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormInput
                    label="Servicios Gratis por Mes"
                    type="number"
                    min="0"
                    value={formData.freeServicesPerMonth}
                    onChange={(e) => setFormData({ ...formData, freeServicesPerMonth: e.target.value })}
                    icon={FiGift}
                    placeholder="0"
                    error={errors.freeServicesPerMonth}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Cantidad de servicios básicos gratis cada mes
                  </p>
                </div>

                <div>
                  <FormInput
                    label="Bono de Cumpleaños"
                    type="number"
                    min="0"
                    value={formData.birthdayBonus}
                    onChange={(e) => setFormData({ ...formData, birthdayBonus: e.target.value })}
                    icon={FiCalendar}
                    placeholder="50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Puntos de regalo en el cumpleaños del cliente
                  </p>
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.priorityBooking}
                    onChange={(e) => setFormData({ ...formData, priorityBooking: e.target.checked })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                      <FiClock className="h-4 w-4 mr-1" />
                      Reservas Prioritarias
                    </span>
                    <p className="text-xs text-gray-500">
                      Permite al cliente reservar citas con prioridad
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Preview del Nivel */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                Vista Previa del Nivel
              </h5>
              <div className="flex items-center space-x-4">
                <div
                  className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold overflow-hidden border-2"
                  style={{
                    backgroundColor: formData.image ? 'transparent' : formData.color,
                    borderColor: formData.color
                  }}
                >
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt={formData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    formData.name.charAt(0) || 'N'
                  )}
                </div>
                <div>
                  <h6 className="font-semibold text-gray-900 dark:text-white">
                    {formData.name || 'Nombre del Nivel'}
                  </h6>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formData.minPoints} - {formData.maxPoints ? formData.maxPoints : '∞'} puntos
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                    <span>{formData.pointsMultiplier}x puntos</span>
                    <span>{formData.discountPercentage}% descuento</span>
                    {formData.freeServicesPerMonth > 0 && (
                      <span>{formData.freeServicesPerMonth} gratis/mes</span>
                    )}
                    {formData.priorityBooking && <span>Prioritario</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Guardando...' : level ? 'Actualizar' : 'Crear Nivel'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyLevelForm;