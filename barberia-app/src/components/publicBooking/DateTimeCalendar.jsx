import { FiChevronLeft, FiChevronRight, FiClock, FiCalendar } from 'react-icons/fi';
import { formatMonthYear, formatSelectedDate, isToday, isValidBookingDate } from '../../utils/publicBooking/publicBookingUtils';
import { WEEK_DAYS, PAYMENT_INFO } from '../../constants/publicBooking';

/**
 * Calendario de selección de fecha y hora
 */
const DateTimeCalendar = ({
  currentDate,
  selectedDate,
  days,
  totalDuration,
  onNavigateMonth,
  onDateSelect,
  isDateSelected,
  isCurrentMonth
}) => {
  return (
    <div className="lg:w-2/3 p-6">
      {/* Título Principal */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">RESERVA AQUÍ</h2>

        {/* Duración del servicio */}
        <div className="flex items-center space-x-2 text-gray-600 mb-2">
          <FiClock className="w-4 h-4" />
          <span className="font-medium">{totalDuration} Min</span>
        </div>

        {/* Fecha seleccionada */}
        <div className="flex items-center space-x-2 text-gray-600 mb-4">
          <FiCalendar className="w-4 h-4" />
          <span className="font-medium">{formatSelectedDate(selectedDate)}</span>
        </div>
      </div>

      {/* Información de contacto */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-700 leading-relaxed">
          Recuerda que para asegurar tu reserva tienes que enviar un{' '}
          <span className="font-semibold text-blue-600">
            adelanto del {PAYMENT_INFO.advancePercentage}% del servicio
          </span>{' '}
          que deseas realizar dentro de los primeros {PAYMENT_INFO.timeLimit} minutos.{' '}
          <span className="font-semibold">
            YAPE O PLIN: {PAYMENT_INFO.yapeNumber}
          </span>{' '}
          - {PAYMENT_INFO.yapeName}
        </p>
      </div>

      {/* Título del Calendario */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Seleccione la Fecha & Hora</h3>

      {/* Navegación del Calendario */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onNavigateMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <h4 className="text-lg font-semibold text-gray-800 capitalize">
          {formatMonthYear(currentDate)}
        </h4>

        <button
          onClick={() => onNavigateMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Calendario */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const selected = isDateSelected(date);
          const currentMonth = isCurrentMonth(date);
          const today = isToday(date);
          const validBookingDate = isValidBookingDate(date);

          return (
            <button
              key={index}
              onClick={() => onDateSelect(date)}
              disabled={!currentMonth || !validBookingDate}
              className={`
                p-3 text-center text-sm rounded-lg transition-all duration-200
                ${selected
                  ? 'bg-blue-500 text-white font-semibold shadow-lg'
                  : currentMonth
                    ? 'hover:bg-blue-50 text-gray-700'
                    : 'text-gray-300 cursor-not-allowed'
                }
                ${today && !selected ? 'bg-blue-100 text-blue-600 font-semibold' : ''}
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DateTimeCalendar;
