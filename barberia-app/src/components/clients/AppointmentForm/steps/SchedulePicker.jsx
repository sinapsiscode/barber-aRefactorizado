/**
 * Paso 5: Selección de Horario
 */
const SchedulePicker = ({
  date,
  time,
  availableSlots,
  onDateChange,
  onTimeChange
}) => {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-xl font-semibold text-gray-900">
          Selecciona fecha y hora
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Fecha
            </label>
            <input
              type="date"
              value={date}
              min={today}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Hora disponible
            </label>
            <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
              {availableSlots.map(slot => (
                <button
                  key={slot.time}
                  onClick={() => onTimeChange(slot.time)}
                  className={`px-3 py-2 text-sm rounded-lg transition-all ${
                    time === slot.time
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
            {availableSlots.length === 0 && date && (
              <p className="mt-2 text-sm text-red-600">
                No hay horarios disponibles para esta fecha
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePicker;
