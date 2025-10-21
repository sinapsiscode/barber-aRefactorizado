import { FiArrowLeft } from 'react-icons/fi';
import { BOOKING_STEPS } from '../../constants/publicBooking';

/**
 * Header del wizard de reservas públicas
 * Incluye logo, navegación entre pasos e indicador de progreso
 */
const PublicBookingHeader = ({ currentStep, onBackToCalendar, onBackToLanding }) => {
  return (
    <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {/* Botón de navegación entre pasos */}
        {currentStep === BOOKING_STEPS.FORM && (
          <button
            onClick={onBackToCalendar}
            className="text-blue-600 hover:text-blue-700"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
        )}

        {/* Logo El Cirujano */}
        <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">EC</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">BARBERÍA</h1>
          <p className="text-xs text-gray-500 uppercase tracking-wide">BARBER STUDIO</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Indicador de pasos */}
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            currentStep >= BOOKING_STEPS.CALENDAR ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            1
          </div>
          <div className={`w-12 h-1 ${currentStep >= BOOKING_STEPS.FORM ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            currentStep >= BOOKING_STEPS.FORM ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            2
          </div>
        </div>

        {/* Botón volver a landing */}
        {onBackToLanding && (
          <button
            onClick={onBackToLanding}
            className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md text-sm"
          >
            ← Volver
          </button>
        )}
      </div>
    </div>
  );
};

export default PublicBookingHeader;
