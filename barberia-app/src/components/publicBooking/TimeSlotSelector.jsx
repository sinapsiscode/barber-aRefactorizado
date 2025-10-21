import { AVAILABLE_TIMES } from '../../constants/publicBooking';
import ContactInfo from './ContactInfo';

/**
 * Selector de horarios disponibles
 */
const TimeSlotSelector = ({ selectedTime, onTimeSelect, onProceed }) => {
  return (
    <div className="lg:w-1/3 bg-gray-50 p-6 border-l">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Horarios Disponibles</h3>

      <div className="space-y-3">
        {AVAILABLE_TIMES.map((time) => (
          <button
            key={time}
            onClick={() => onTimeSelect(time)}
            className={`
              w-full p-3 rounded-lg text-left transition-all duration-200 border
              ${selectedTime === time
                ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }
            `}
          >
            <span className="font-medium">{time}</span>
          </button>
        ))}
      </div>

      {/* Botón de Reserva */}
      <div className="mt-8">
        <button
          onClick={onProceed}
          disabled={!selectedTime}
          className={`
            w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200
            ${selectedTime
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {selectedTime ? 'Confirmar Reserva' : 'Selecciona una hora'}
        </button>
      </div>

      {/* Información de contacto adicional */}
      <ContactInfo />
    </div>
  );
};

export default TimeSlotSelector;
