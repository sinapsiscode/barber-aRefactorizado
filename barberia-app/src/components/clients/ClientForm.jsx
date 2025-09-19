import { useState } from 'react';
import { FiX, FiUser, FiMail, FiPhone, FiMapPin, FiCalendar } from 'react-icons/fi';
import { useClientStore, useBranchStore } from '../../stores';
import { FormInput } from '../common';

const ClientForm = ({ client = null, onClose, onSuccess }) => {
  const { addClient, updateClient } = useClientStore();
  const { branches } = useBranchStore();
  
  const [formData, setFormData] = useState({
    name: client?.name || '',
    email: client?.email || '',
    phone: client?.phone || '',
    birthDate: client?.birthDate || '',
    address: client?.address || '',
    preferredBranch: client?.preferredBranch || 1,
    notes: client?.notes || ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (client) {
        await updateClient(client.id, formData);
      } else {
        await addClient(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving client:', error);
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
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                {client ? 'Editar Cliente' : 'Nuevo Cliente'}
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
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Nombre Completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                icon={FiUser}
                required
                placeholder="Juan Carlos Pérez"
              />
              
              <FormInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                icon={FiMail}
                required
                placeholder="juan@email.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Teléfono"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                icon={FiPhone}
                required
                placeholder="+57 300 123 4567"
              />
              
              <FormInput
                label="Fecha de Nacimiento"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                icon={FiCalendar}
              />
            </div>

            {/* Address */}
            <FormInput
              label="Dirección"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              icon={FiMapPin}
              placeholder="Calle 123 #45-67, Ciudad"
            />

            {/* Preferred Branch */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sede Preferida
              </label>
              <select
                value={formData.preferredBranch}
                onChange={(e) => setFormData({ ...formData, preferredBranch: parseInt(e.target.value) })}
                className="input-field"
              >
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} - {branch.city}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notas Adicionales
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="input-field"
                placeholder="Preferencias, alergias, instrucciones especiales..."
              />
            </div>

            {/* Client Welcome Info */}
            {!client && (
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Beneficios del Cliente Nuevo
                </h4>
                <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <div>• Programa de puntos de fidelización</div>
                  <div>• Descuentos especiales en cumpleaños</div>
                  <div>• Recordatorios automáticos de citas</div>
                  <div>• Historial completo de servicios</div>
                </div>
              </div>
            )}

            {/* Current Client Stats */}
            {client && (
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-dark-700 p-3 rounded-lg text-center">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {client.totalVisits}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Visitas</div>
                </div>
                <div className="bg-gray-50 dark:bg-dark-700 p-3 rounded-lg text-center">
                  <div className="text-lg font-semibold text-green-600">
                    S/{client.totalSpent?.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Gastado</div>
                </div>
                <div className="bg-gray-50 dark:bg-dark-700 p-3 rounded-lg text-center">
                  <div className="text-lg font-semibold text-yellow-600">
                    {client.loyaltyPoints}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Puntos</div>
                </div>
              </div>
            )}

            {/* Actions */}
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
                {loading ? 'Guardando...' : client ? 'Actualizar' : 'Crear Cliente'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientForm;