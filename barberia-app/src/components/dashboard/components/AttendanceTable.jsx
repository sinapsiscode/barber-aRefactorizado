// ===================================================================
// 📅 TABLA DE ASISTENCIA - COMPONENTE ESPECIALIZADO
// ===================================================================
// Tabla detallada de asistencia del personal para admin de sede
import React from 'react';
import CountryFlag from '../../common/CountryFlag';

const AttendanceTable = ({
  branchStaff = [],
  attendanceStats = {},
  title = "Detalle de Asistencia"
}) => {
  const getStatusStyle = (status) => {
    const styles = {
      present: 'bg-green-100 text-green-800',
      late: 'bg-yellow-100 text-yellow-800',
      absent: 'bg-red-100 text-red-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      present: 'Presente',
      late: 'Tardanza',
      absent: 'Ausente'
    };
    return texts[status] || 'Sin marcar';
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title} - {new Date().toLocaleDateString('es-ES')}
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="text-left py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Barbero
              </th>
              <th className="text-center py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Estado
              </th>
              <th className="text-center py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Hora Entrada
              </th>
              <th className="text-center py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Hora Salida
              </th>
            </tr>
          </thead>
          <tbody>
            {branchStaff.map((barber) => {
              const attendance = attendanceStats.details?.find(a => a.barberId === barber.id);

              return (
                <tr key={barber.id} className="border-b dark:border-gray-700">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <CountryFlag countryCode={barber.country || 'PE'} size={16} />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {barber.name}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center">
                    {attendance ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(attendance.status)}`}>
                        {getStatusText(attendance.status)}
                      </span>
                    ) : (
                      <span className="text-gray-500">Sin marcar</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">
                    {attendance?.checkIn || '--:--'}
                  </td>

                  <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">
                    {attendance?.checkOut || '--:--'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;