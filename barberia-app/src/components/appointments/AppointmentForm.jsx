import { useState, useEffect } from 'react';
import { FiX, FiCalendar, FiClock, FiUser, FiScissors } from 'react-icons/fi';
import { useAppointmentStore, useStaffStore, useClientStore } from '../../stores';
import { FormInput } from '../common';

const AppointmentForm = ({ appointment = null, onClose, onSuccess }) => {
  const { services, createAppointment, updateAppointment, generateTimeSlots } = useAppointmentStore();
  const { getActiveBarbers } = useStaffStore();
  const { clients } = useClientStore();
  
  const [formData, setFormData] = useState({
    clientId: appointment?.clientId || '',
    barberId: appointment?.barberId || '',
    date: appointment?.date || new Date().toISOString().split('T')[0],
    time: appointment?.time || '',
    services: appointment?.services || [],
    notes: appointment?.notes || ''
  });
  
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const barbers = getActiveBarbers();

  useEffect(() => {
    if (formData.date && formData.barberId) {
      const slots = generateTimeSlots(new Date(formData.date), parseInt(formData.barberId));
      setAvailableSlots(slots.filter(slot => slot.available));
    }
  }, [formData.date, formData.barberId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const selectedServices = services.filter(s => formData.services.includes(s.id));
    const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);
    const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);

    const appointmentData = {
      ...formData,
      clientName: clients.find(c => c.id == formData.clientId)?.name || 'Cliente',
      barberName: barbers.find(b => b.id == formData.barberId)?.name || 'Barbero',
      duration: totalDuration,
      totalPrice,
      branchId: 1
    };

    try {
      if (appointment) {
        await updateAppointment(appointment.id, appointmentData);
      } else {
        await createAppointment(appointmentData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceToggle = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const selectedServices = services.filter(s => formData.services.includes(s.id));
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

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
                {appointment ? 'Editar Cita' : 'Nueva Cita'}
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
            {/* Client Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cliente
              </label>
              <select
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Seleccionar cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Barber Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Barbero
              </label>
              <select
                value={formData.barberId}
                onChange={(e) => setFormData({ ...formData, barberId: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Seleccionar barbero</option>
                {barbers.map(barber => (
                  <option key={barber.id} value={barber.id}>
                    {barber.name} - {barber.specialties.join(', ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Fecha"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                icon={FiCalendar}
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hora
                </label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Seleccionar hora</option>
                  {availableSlots.map(slot => (
                    <option key={slot.time} value={slot.time}>
                      {slot.time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Services */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Servicios
              </label>
              <div className="grid grid-cols-2 gap-3">
                {services.map(service => (
                  <label
                    key={service.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.services.includes(service.id)
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                        : 'border-gray-300 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service.id)}
                      onChange={() => handleServiceToggle(service.id)}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {service.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {service.duration} min - S/{service.price.toLocaleString()}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Summary */}
            {selectedServices.length > 0 && (
              <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Resumen</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Servicios:</span>
                    <span>{selectedServices.map(s => s.name).join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duración total:</span>
                    <span>{totalDuration} minutos</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>S/{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notas adicionales
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="input-field"
                placeholder="Preferencias del cliente, instrucciones especiales..."
              />
            </div>

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
                disabled={loading || formData.services.length === 0}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Guardando...' : appointment ? 'Actualizar' : 'Crear Cita'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;