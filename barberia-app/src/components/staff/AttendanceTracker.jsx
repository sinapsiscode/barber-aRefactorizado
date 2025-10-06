import { useState } from 'react';
import { FiX, FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { useStaffStore } from '../../stores';
import { DataTable } from '../common';

const AttendanceTracker = ({ onClose }) => {
  const { barbers, attendance, getAttendanceByDate, getBarberStats } = useStaffStore();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const todayAttendance = getAttendanceByDate(selectedDate);

  const attendanceColumns = [
    {
      key: 'barberId',
      label: 'Barbero',
      render: (value) => {
        const barber = barbers.find(b => b.id === value);
        return (
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {barber?.name.charAt(0)}
              </span>
            </div>
            <span className="font-medium">{barber?.name}</span>
          </div>
        );
      }
    },
    {
      key: 'checkIn',
      label: 'Entrada',
      render: (value) => value || '--'
    },
    {
      key: 'checkOut',
      label: 'Salida',
      render: (value) => value || 'En trabajo'
    },
    {
      key: 'hoursWorked',
      label: 'Horas Trabajadas',
      render: (value) => value ? `${value.toFixed(1)}h` : '--'
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'present' 
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-600'
        }`}>
          {value === 'present' ? 'Presente' : 'Ausente'}
        </span>
      )
    }
  ];

  const barberStatsColumns = [
    {
      key: 'name',
      label: 'Barbero',
      render: (value) => (
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {value.charAt(0)}
            </span>
          </div>
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'thisMonthHours',
      label: 'Horas Este Mes',
      render: (value, barber) => {
        const stats = getBarberStats(barber.id);
        return `${stats.thisMonthHours.toFixed(1)}h`;
      }
    },
    {
      key: 'totalDays',
      label: 'Días Trabajados',
      render: (value, barber) => {
        const stats = getBarberStats(barber.id);
        return stats.totalDays;
      }
    },
    {
      key: 'averageHours',
      label: 'Promedio Diario',
      render: (value, barber) => {
        const stats = getBarberStats(barber.id);
        return `${stats.averageHours.toFixed(1)}h`;
      }
    },
    {
      key: 'attendanceRate',
      label: 'Asistencia',
      render: (value, barber) => {
        const totalWorkingDays = 22; // Días laborables aproximados por mes
        const stats = getBarberStats(barber.id);
        const rate = stats.totalDays > 0 ? (stats.totalDays / totalWorkingDays) * 100 : 0;
        return (
          <span className={`font-medium ${
            rate >= 90 ? 'text-green-600' : 
            rate >= 80 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {rate.toFixed(0)}%
          </span>
        );
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          <div className="bg-white dark:bg-dark-800 px-6 py-4 border-b border-gray-200 dark:border-dark-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Control de Asistencia
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
            {/* Date Selector */}
            <div className="flex items-center space-x-4">
              <FiCalendar className="h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-field w-auto"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {todayAttendance.length} registros para esta fecha
              </span>
            </div>

            {/* Daily Attendance */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                Asistencia del {new Date(selectedDate).toLocaleDateString()}
              </h4>
              <DataTable
                data={todayAttendance}
                columns={attendanceColumns}
                pagination={false}
                emptyMessage="No hay registros de asistencia para esta fecha"
              />
            </div>

            {/* Monthly Statistics */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                Estadísticas Mensuales
              </h4>
              <DataTable
                data={barbers}
                columns={barberStatsColumns}
                pagination={false}
                emptyMessage="No hay datos de barberos"
              />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FiUser className="h-5 w-5 text-blue-600" />
                  <h5 className="font-medium text-blue-900 dark:text-blue-100">
                    Personal Presente
                  </h5>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-blue-600">
                    {barbers.filter(b => b.isPresent).length}/{barbers.length}
                  </div>
                  <div className="text-sm text-blue-600">
                    {((barbers.filter(b => b.isPresent).length / barbers.length) * 100).toFixed(0)}% asistencia
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FiClock className="h-5 w-5 text-green-600" />
                  <h5 className="font-medium text-green-900 dark:text-green-100">
                    Horas Promedio
                  </h5>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-green-600">
                    {todayAttendance.length > 0 
                      ? (todayAttendance.reduce((sum, att) => sum + (att.hoursWorked || 0), 0) / todayAttendance.length).toFixed(1)
                      : '0'
                    }h
                  </div>
                  <div className="text-sm text-green-600">
                    Por barbero hoy
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FiCalendar className="h-5 w-5 text-purple-600" />
                  <h5 className="font-medium text-purple-900 dark:text-purple-100">
                    Total Horas Mes
                  </h5>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-purple-600">
                    {barbers.reduce((total, barber) => {
                      const stats = getBarberStats(barber.id);
                      return total + stats.thisMonthHours;
                    }, 0).toFixed(0)}h
                  </div>
                  <div className="text-sm text-purple-600">
                    Acumuladas
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-dark-700 px-6 py-3 flex justify-end">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;