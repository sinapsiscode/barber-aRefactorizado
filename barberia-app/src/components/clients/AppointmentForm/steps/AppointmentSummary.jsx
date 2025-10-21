import { FiInfo } from 'react-icons/fi';

/**
 * Paso 7: Resumen y Confirmación
 */
const AppointmentSummary = ({
  selectedBranch,
  selectedBarber,
  selectedServices,
  date,
  time,
  totalPrice,
  totalDuration,
  paymentMethod,
  voucherNumber,
  notes,
  onNotesChange
}) => {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="mb-4 text-xl font-semibold text-gray-900">
        Resumen de tu reserva
      </h3>

      <div className="p-6 space-y-4 rounded-lg bg-gray-50">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-600">Sede</p>
            <p className="font-semibold text-gray-900">{selectedBranch?.name}</p>
            <p className="text-sm text-gray-600">{selectedBranch?.address}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Barbero</p>
            <p className="font-semibold text-gray-900">{selectedBarber?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Fecha</p>
            <p className="font-semibold text-gray-900">
              {formatDate(date)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Hora</p>
            <p className="font-semibold text-gray-900">{time}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="mb-2 text-sm text-gray-600">Servicios seleccionados</p>
          {selectedServices.map(service => (
            <div key={service.id} className="flex items-center justify-between py-1">
              <span className="text-gray-900">{service.name}</span>
              <span className="font-semibold">S/{service.price}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total a pagar</p>
              <p className="text-xs text-gray-500">Duración estimada: {totalDuration} min</p>
            </div>
            <p className="text-2xl font-bold text-primary-600">S/{totalPrice}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">Método de pago</p>
          <p className="font-semibold text-gray-900">
            {paymentMethod === 'efectivo' ? 'Efectivo (pagar en tienda)' : paymentMethod.toUpperCase()}
          </p>
          {voucherNumber && (
            <p className="text-sm text-gray-600">Voucher: #{voucherNumber}</p>
          )}
        </div>

        {notes && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">Notas adicionales</p>
            <p className="text-gray-900">{notes}</p>
          </div>
        )}
      </div>

      <div className="p-4 rounded-lg bg-yellow-50">
        <div className="flex items-start">
          <FiInfo className="w-5 h-5 mt-0.5 text-yellow-600 flex-shrink-0" />
          <div className="ml-3">
            <p className="text-sm text-yellow-800">
              {paymentMethod === 'efectivo'
                ? 'Tu cita quedará confirmada automáticamente. Recuerda llegar 10 minutos antes.'
                : 'Tu cita quedará pendiente hasta que verifiquemos tu pago. Te notificaremos cuando esté confirmada.'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">
            Notas adicionales (opcional)
          </span>
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Alguna preferencia o indicación especial..."
          />
        </label>
      </div>
    </div>
  );
};

export default AppointmentSummary;
