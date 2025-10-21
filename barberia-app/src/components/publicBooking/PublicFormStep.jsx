import { FiCalendar, FiArrowRight } from 'react-icons/fi';
import { formatSelectedDate } from '../../utils/publicBooking/publicBookingUtils';
import ClientInfoForm from './ClientInfoForm';
import ServiceSelector from './ServiceSelector';

/**
 * Paso 2: Formulario de información del cliente
 */
const PublicFormStep = ({
  selectedDate,
  selectedTime,
  totalDuration,
  totalPrice,
  formData,
  formErrors,
  selectedServices,
  otherService,
  otherServiceText,
  acceptTerms,
  onFormChange,
  onServiceToggle,
  onOtherServiceToggle,
  onOtherServiceTextChange,
  onAcceptTermsChange,
  onSubmit
}) => {
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        {/* Título del formulario */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Introducir información</h2>
          <h3 className="text-xl font-semibold text-gray-700">Ingrese su información</h3>
        </div>

        {/* Información de la reserva */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FiCalendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Fecha y hora seleccionada:</p>
                <p className="font-semibold text-gray-800">
                  {formatSelectedDate(selectedDate)} a las {selectedTime}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Duración total:</p>
              <p className="font-semibold text-gray-800">
                {totalDuration} Min
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="space-y-6">
          {/* Información Personal */}
          <ClientInfoForm
            formData={formData}
            formErrors={formErrors}
            onFormChange={onFormChange}
          />

          {/* Sección de servicios */}
          <ServiceSelector
            selectedServices={selectedServices}
            otherService={otherService}
            otherServiceText={otherServiceText}
            formErrors={formErrors}
            onServiceToggle={onServiceToggle}
            onOtherServiceToggle={onOtherServiceToggle}
            onOtherServiceTextChange={onOtherServiceTextChange}
          />

          {/* Checkbox de Términos y Condiciones */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => onAcceptTermsChange(e.target.checked)}
                className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-700">
                He leído y acepto los <span className="font-semibold">Términos y Condiciones</span> y confirmo que deseo recibir contenido de esta empresa utilizando la información de contacto que proporcione.
              </span>
            </label>
            {formErrors.terms && (
              <p className="mt-2 text-sm text-red-500">{formErrors.terms}</p>
            )}
          </div>

          {/* Total y botón de envío */}
          <div className="border-t pt-6 mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-lg font-semibold text-gray-800">Total a pagar:</p>
                <p className="text-sm text-gray-600">Adelanto requerido (50%): S/ {totalPrice / 2}</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">S/ {totalPrice}</p>
            </div>

            <button
              onClick={onSubmit}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <span>Programar Reunión</span>
              <FiArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicFormStep;
