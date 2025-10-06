import { useState } from 'react';
import { useBranchStore } from '../../stores';
import { FormInput } from '../common';
import Swal from 'sweetalert2';
import ReactFlagsSelect from 'react-flags-select';

const BranchForm = ({ branch = null, onClose }) => {
  const { addBranch, updateBranch, availableCountries, isLoading } = useBranchStore();
  
  const [formData, setFormData] = useState({
    name: branch?.name || '',
    city: branch?.city || '',
    country: branch?.country || 'PE',
    address: branch?.address || '',
    phone: branch?.phone || '',
    email: branch?.email || '',
    manager: branch?.manager || '',
    managerPhone: branch?.managerPhone || '',
    services: branch?.services?.join(', ') || '',
    amenities: branch?.amenities?.join(', ') || '',
    workingHours: branch?.workingHours || {
      monday: { open: '08:00', close: '22:00' },
      tuesday: { open: '08:00', close: '22:00' },
      wednesday: { open: '08:00', close: '22:00' },
      thursday: { open: '08:00', close: '22:00' },
      friday: { open: '08:00', close: '22:00' },
      saturday: { open: '08:00', close: '22:00' },
      sunday: { open: '08:00', close: '22:00' }
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const processedData = {
      ...formData,
      services: formData.services.split(',').map(s => s.trim()).filter(s => s),
      amenities: formData.amenities.split(',').map(a => a.trim()).filter(a => a),
      coordinates: { lat: 0, lng: 0 } // Valores por defecto hasta implementar geocoding
    };

    const result = branch 
      ? await updateBranch(branch.id, processedData)
      : await addBranch(processedData);

    if (result.success) {
      await Swal.fire({
        title: '¡Éxito!',
        text: `Sede ${branch ? 'actualizada' : 'creada'} correctamente`,
        icon: 'success',
        confirmButtonColor: '#D4AF37'
      });
      onClose();
    } else {
      await Swal.fire({
        title: 'Error',
        text: result.error || 'Error al procesar la sede',
        icon: 'error',
        confirmButtonColor: '#D4AF37'
      });
    }
  };


  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-black rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto elevation-24">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-normal text-gray-900 dark:text-gray-100">
              {branch ? 'Editar Sede' : 'Nueva Sede'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-8">
          {/* Información Básica */}
          <div>
            <h3 className="text-lg font-normal text-gray-700 dark:text-gray-300 mb-6">
              Información Básica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Nombre de la Sede"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Barbería Premium Centro"
              />
              
              <FormInput
                label="Ciudad"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                placeholder="Lima"
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  País
                </label>
                <div className="react-flags-select-wrapper">
                  <ReactFlagsSelect
                    selected={formData.country}
                    onSelect={(countryCode) => setFormData({ ...formData, country: countryCode })}
                    countries={['PE', 'CO', 'CL', 'AR', 'EC', 'BO', 'VE', 'UY', 'PY', 'BR', 'MX', 'US', 'ES']}
                    customLabels={{
                      PE: 'Perú',
                      CO: 'Colombia', 
                      CL: 'Chile',
                      AR: 'Argentina',
                      EC: 'Ecuador',
                      BO: 'Bolivia',
                      VE: 'Venezuela',
                      UY: 'Uruguay',
                      PY: 'Paraguay',
                      BR: 'Brasil',
                      MX: 'México',
                      US: 'Estados Unidos',
                      ES: 'España'
                    }}
                    placeholder="Seleccionar país"
                    searchable={false}
                    className="w-full"
                  />
                </div>
              </div>

              <FormInput
                label="Dirección"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                placeholder="Av. Pardo 123, Miraflores"
              />
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-normal text-gray-700 dark:text-gray-300 mb-6">
              Información de Contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Teléfono"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                placeholder="+51 1 234 5678"
              />
              
              <FormInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="sede@barberia.com"
              />

              <FormInput
                label="Nombre del Gerente"
                value={formData.manager}
                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                required
                placeholder="Ana García"
              />
              
              <FormInput
                label="Teléfono del Gerente"
                value={formData.managerPhone}
                onChange={(e) => setFormData({ ...formData, managerPhone: e.target.value })}
                required
                placeholder="+51 900 123 456"
              />
            </div>
          </div>


          {/* Servicios y Amenidades */}
          <div>
            <h3 className="text-lg font-normal text-gray-700 dark:text-gray-300 mb-6">
              Servicios y Amenidades
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Servicios (separados por coma)
                </label>
                <textarea
                  value={formData.services}
                  onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-base focus:outline-none focus:bg-white dark:focus:bg-gray-800 transition-all duration-200"
                  rows="3"
                  placeholder="Corte Clásico, Fade, Barba, Diseño, Tinte, Cejas"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amenidades (separadas por coma)
                </label>
                <textarea
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-base focus:outline-none focus:bg-white dark:focus:bg-gray-800 transition-all duration-200"
                  rows="3"
                  placeholder="WiFi, Aire Acondicionado, TV, Música, Bebidas"
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-[#D4AF37]/20">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors ripple"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium uppercase tracking-wider transition-all elevation-1 hover:elevation-2 disabled:opacity-50 disabled:cursor-not-allowed ripple"
            >
              {isLoading ? 'Procesando...' : (branch ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BranchForm;