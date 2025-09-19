import { useState, useEffect } from 'react';
import { FiCalendar } from 'react-icons/fi';
import { useAppointments } from '../../hooks/useAppointments';
import { APPOINTMENT_FORM_LABELS } from '../../constants/appointments';
import { useCurrency } from '../../hooks/useCurrency';
import { FormInput, Button, Modal, Select, Card } from '../common';

const AppointmentForm = ({ appointment = null, onClose, onSuccess }) => {
  const {
    loading,
    clients,
    services,
    getBarbers,
    calculateServicesSummary,
    getAvailableTimeSlots,
    saveAppointment
  } = useAppointments();

  const { formatCurrency } = useCurrency();

  const [formData, setFormData] = useState({
    clientId: appointment?.clientId || '',
    barberId: appointment?.barberId || '',
    date: appointment?.date || new Date().toISOString().split('T')[0],
    time: appointment?.time || '',
    services: appointment?.services || [],
    notes: appointment?.notes || ''
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const barbers = getBarbers();

  useEffect(() => {
    if (formData.date && formData.barberId) {
      const slots = getAvailableTimeSlots(formData.date, formData.barberId);
      setAvailableSlots(slots);
    }
  }, [formData.date, formData.barberId, getAvailableTimeSlots]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await saveAppointment(formData, appointment);

    if (result.success) {
      onSuccess();
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

  const servicesSummary = calculateServicesSummary(formData.services);
  const { selectedServices, totalPrice, totalDuration, formattedPrice } = servicesSummary;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={appointment ? APPOINTMENT_FORM_LABELS.TITLE_EDIT : APPOINTMENT_FORM_LABELS.TITLE_NEW}
      size="md"
    >

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Client Selection */}
        <Select
          label={APPOINTMENT_FORM_LABELS.CLIENT}
          name="clientId"
          value={formData.clientId}
          onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
          options={clients}
          placeholder={APPOINTMENT_FORM_LABELS.PLACEHOLDER.CLIENT}
          renderOption={(client) => ({
            value: client.id,
            label: client.name
          })}
          required
        />

        {/* Barber Selection */}
        <Select
          label={APPOINTMENT_FORM_LABELS.BARBER}
          name="barberId"
          value={formData.barberId}
          onChange={(e) => setFormData({ ...formData, barberId: e.target.value })}
          options={barbers}
          placeholder={APPOINTMENT_FORM_LABELS.PLACEHOLDER.BARBER}
          renderOption={(barber) => ({
            value: barber.id,
            label: `${barber.name} - ${barber.specialties?.join(', ') || ''}`
          })}
          required
        />

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
          <Button
            variant="secondary"
            onClick={onClose}
            type="button"
          >
            {APPOINTMENT_FORM_LABELS.BUTTONS.CANCEL}
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={loading || formData.services.length === 0}
            loading={loading}
          >
            {loading
              ? APPOINTMENT_FORM_LABELS.BUTTONS.SAVING
              : appointment
              ? APPOINTMENT_FORM_LABELS.BUTTONS.UPDATE
              : APPOINTMENT_FORM_LABELS.BUTTONS.CREATE
            }
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AppointmentForm;