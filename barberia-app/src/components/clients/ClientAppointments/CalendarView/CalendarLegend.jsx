/**
 * Leyenda de colores del calendario
 * Líneas 323-340 del original
 */
const CalendarLegend = () => {
  return (
    <div className="mt-6 flex flex-wrap gap-4 text-sm">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-blue-500 rounded"></div>
        <span className="text-gray-600 dark:text-gray-400">Confirmada</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-yellow-500 rounded"></div>
        <span className="text-gray-600 dark:text-gray-400">Pendiente</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-green-500 rounded"></div>
        <span className="text-gray-600 dark:text-gray-400">Completada</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-red-500 rounded"></div>
        <span className="text-gray-600 dark:text-gray-400">Cancelada</span>
      </div>
    </div>
  );
};

export default CalendarLegend;
