import { useState, useEffect } from 'react';
import { FiX, FiSave } from 'react-icons/fi';
import Swal from 'sweetalert2';

/**
 * Formulario para crear/editar servicios
 */
const ServiceForm = ({ service, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    duration: 30,
    price: 0,
    category: 'cortes',
    description: '',
    features: [],
    popular: false,
    discount: null,
    image: '',
    note: ''
  });

  const [newFeature, setNewFeature] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Categorías disponibles
  const categories = [
    { value: 'cortes', label: 'Cortes' },
    { value: 'barba', label: 'Barba' },
    { value: 'combos', label: 'Combos' },
    { value: 'tratamientos', label: 'Tratamientos' },
    { value: 'otros', label: 'Otros' }
  ];

  // Cargar datos del servicio si es edición
  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        duration: service.duration || 30,
        price: service.price || 0,
        category: service.category || 'cortes',
        description: service.description || '',
        features: service.features || [],
        popular: service.popular || false,
        discount: service.discount || null,
        image: service.image || '',
        note: service.note || ''
      });
    } else {
      // Reset para nuevo servicio
      setFormData({
        name: '',
        duration: 30,
        price: 0,
        category: 'cortes',
        description: '',
        features: [],
        popular: false,
        discount: null,
        image: '',
        note: ''
      });
    }
  }, [service]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.name.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre del servicio es obligatorio',
        confirmButtonColor: '#ffc000'
      });
      return;
    }

    if (formData.price <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El precio debe ser mayor a 0',
        confirmButtonColor: '#ffc000'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let result;
      if (service) {
        // Editar servicio existente
        result = await onSave(service.id, formData);
      } else {
        // Crear nuevo servicio
        result = await onSave(formData);
      }

      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: service ? 'Servicio Actualizado' : 'Servicio Creado',
          text: service
            ? 'El servicio se ha actualizado correctamente'
            : 'El servicio se ha creado correctamente',
          confirmButtonColor: '#ffc000',
          timer: 2000
        });
        onClose();
      } else {
        throw new Error(result.error || 'Error al guardar el servicio');
      }
    } catch (error) {
      console.error('Error al guardar servicio:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'No se pudo guardar el servicio',
        confirmButtonColor: '#ffc000'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {service ? 'Editar Servicio' : 'Nuevo Servicio'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <FiX className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre del Servicio *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field w-full"
              placeholder="Ej: Corte Clásico"
              required
            />
          </div>

          {/* Categoría y Popular */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoría *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field w-full"
                required
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.popular}
                  onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Marcar como Popular
                </span>
              </label>
            </div>
          </div>

          {/* Precio y Duración */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Precio (S/) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="input-field w-full"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duración (minutos) *
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="input-field w-full"
                min="5"
                step="5"
                required
              />
            </div>
          </div>

          {/* Descuento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descuento (%)
            </label>
            <input
              type="number"
              value={formData.discount || ''}
              onChange={(e) => setFormData({
                ...formData,
                discount: e.target.value ? parseInt(e.target.value) : null
              })}
              className="input-field w-full"
              min="0"
              max="100"
              placeholder="Opcional"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field w-full"
              rows="3"
              placeholder="Describe el servicio..."
            />
          </div>

          {/* Características */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Características
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                className="input-field flex-1"
                placeholder="Agregar característica..."
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="btn-secondary"
              >
                Agregar
              </button>
            </div>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* URL de Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL de Imagen
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="input-field w-full"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notas Adicionales
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="input-field w-full"
              rows="2"
              placeholder="Notas internas..."
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center"
              disabled={isSubmitting}
            >
              <FiSave className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Guardando...' : (service ? 'Actualizar' : 'Crear Servicio')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;
