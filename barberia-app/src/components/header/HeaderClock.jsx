/**
 * Reloj en tiempo real del header
 */
const HeaderClock = ({ currentTime }) => {
  return (
    <div className="text-center">
      <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
        {currentTime.toLocaleDateString('es-ES', { weekday: 'long' })}
      </div>
      <div className="text-lg font-mono text-gray-900 dark:text-gray-100">
        {currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

export default HeaderClock;
