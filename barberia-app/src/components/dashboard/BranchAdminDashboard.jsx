import { useState, useEffect } from 'react';
import { FiUsers, FiCalendar, FiDollarSign, FiClock, FiActivity, FiCheckCircle, FiXCircle, FiAlertCircle, FiTrendingUp, FiUserCheck } from 'react-icons/fi';
import { useAuthStore, useStaffStore, useAppointmentStore, useBranchStore } from '../../stores';
import MetricCard from '../common/MetricCard';
import CountryFlag from '../common/CountryFlag';

const BranchAdminDashboard = () => {
  const { user } = useAuthStore();
  const { getStaffByBranch, getAttendanceStats, loadStaff, barbers, attendance } = useStaffStore();
  const { appointments } = useAppointmentStore();
  const { branches } = useBranchStore();

  const [showAttendanceDetails, setShowAttendanceDetails] = useState(false);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);

  // Cargar datos al montar el componente
  useEffect(() => {
    // Cargar personal y asistencias
    if (barbers.length === 0 || attendance.length === 0) {
      loadStaff(true); // true = incluir asistencias
    }
  }, []);
  
  // Obtener personal de la sucursal del admin
  const branchStaff = getStaffByBranch(user?.branchId || 1);
  const currentBranch = branches.find(b => b.id === (user?.branchId || 1));
  
  // Calcular asistencia del día
  const today = new Date().toISOString().split('T')[0];
  const attendanceStats = getAttendanceStats(today, user?.branchId);
  
  // Filtrar citas de la sucursal
  const branchAppointments = appointments.filter(apt => 
    apt.branchId === (user?.branchId || 1)
  );
  
  // Citas del día
  const todayAppointments = branchAppointments.filter(apt => {
    const appointmentDate = apt.date || apt.fecha;
    return appointmentDate === today;
  });
  const completedToday = todayAppointments.filter(apt => {
    const appointmentStatus = apt.status || apt.estado;
    return appointmentStatus === 'completed';
  }).length;
  const pendingToday = todayAppointments.filter(apt => {
    const appointmentStatus = apt.status || apt.estado;
    return appointmentStatus === 'confirmed';
  }).length;
  
  // Estadísticas por barbero
  const barberStats = branchStaff.map(barber => {
    const barberAppointments = todayAppointments.filter(apt => apt.barberId === barber.id);
    const completed = barberAppointments.filter(apt => {
      const appointmentStatus = apt.status || apt.estado;
      return appointmentStatus === 'completed';
    }).length;
    const total = barberAppointments.length;
    
    return {
      ...barber,
      appointmentsToday: total,
      completedToday: completed,
      completionRate: total > 0 ? (completed / total * 100).toFixed(0) : 0
    };
  }).sort((a, b) => b.completedToday - a.completedToday);
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Dashboard - {currentBranch?.name || 'Sede'}</h1>
        <p className="text-blue-100">Gestión y supervisión de personal</p>
        <div className="flex items-center space-x-2 mt-2">
          <CountryFlag countryCode={currentBranch?.country || 'PE'} size={20} />
          <span className="text-sm">{currentBranch?.city}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          onClick={() => setShowAppointmentDetails(!showAppointmentDetails)}
          title={
            <div className="flex items-center justify-between">
              <span>Citas Hoy</span>
              {showAppointmentDetails ? 
                <FiTrendingUp className="h-4 w-4 text-blue-500" /> : 
                <FiTrendingUp className="h-4 w-4 text-blue-500" />
              }
            </div>
          }
          value={todayAppointments.length}
          subtitle={`${completedToday} completadas, ${pendingToday} pendientes`}
          icon={FiCalendar}
          iconBgColor="bg-blue-500"
          iconColor="text-white"
        />

        <MetricCard
          onClick={() => setShowAttendanceDetails(!showAttendanceDetails)}
          title={
            <div className="flex items-center justify-between">
              <span>Asistencia</span>
              {showAttendanceDetails ? 
                <FiActivity className="h-4 w-4 text-green-500" /> : 
                <FiActivity className="h-4 w-4 text-green-500" />
              }
            </div>
          }
          value={`${attendanceStats.present}/${branchStaff.length}`}
          subtitle={`${attendanceStats.late} tardanzas, ${attendanceStats.absent} ausentes`}
          icon={FiUsers}
          iconBgColor="bg-green-500"
          iconColor="text-white"
        />

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ingresos Hoy</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                S/{(completedToday * 30).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Estimado ({completedToday} servicios)
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-500">
              <FiDollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Productividad</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {todayAppointments.length > 0 ? 
                  Math.round(completedToday / todayAppointments.length * 100) : 0}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Citas completadas
              </p>
            </div>
            <div className="p-3 rounded-full bg-orange-500">
              <FiCheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Detalles de Asistencia */}
      {showAttendanceDetails && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Detalle de Asistencia - {new Date().toLocaleDateString('es-ES')}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Barbero</th>
                  <th className="text-center py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Estado</th>
                  <th className="text-center py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Hora Entrada</th>
                  <th className="text-center py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Hora Salida</th>
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
                          <span className="font-medium text-gray-900 dark:text-white">{barber.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {attendance ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            attendance.status === 'present' ? 'bg-green-100 text-green-800' :
                            attendance.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {attendance.status === 'present' ? 'Presente' :
                             attendance.status === 'late' ? 'Tardanza' : 'Ausente'}
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
      )}

      {/* Detalles de Citas por Barbero */}
      {showAppointmentDetails && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Citas Atendidas por Barbero - Hoy
          </h3>
          <div className="space-y-4">
            {barberStats.map((barber) => (
              <div key={barber.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CountryFlag countryCode={barber.country || 'PE'} size={20} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{barber.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {barber.completedToday} de {barber.appointmentsToday} citas completadas
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {barber.completionRate}%
                    </p>
                    <p className="text-xs text-gray-500">Completado</p>
                  </div>
                  <div className="w-20">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${barber.completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumen de Estado del Personal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Estado del Personal
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <FiCheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-200">Presentes</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{attendanceStats.present}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <FiAlertCircle className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-800 dark:text-yellow-200">Tardanzas</span>
              </div>
              <span className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <FiXCircle className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-800 dark:text-red-200">Ausentes</span>
              </div>
              <span className="text-2xl font-bold text-red-600">{attendanceStats.absent}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Rendimiento de la Sucursal
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tasa de Asistencia</span>
                <span className="font-semibold">
                  {branchStaff.length > 0 ? Math.round(attendanceStats.present / branchStaff.length * 100) : 0}%
                </span>
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${branchStaff.length > 0 ? Math.round(attendanceStats.present / branchStaff.length * 100) : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Citas Completadas</span>
                <span className="font-semibold">
                  {todayAppointments.length > 0 ? Math.round(completedToday / todayAppointments.length * 100) : 0}%
                </span>
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${todayAppointments.length > 0 ? Math.round(completedToday / todayAppointments.length * 100) : 0}%` }}
                />
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <FiUserCheck className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Personal total: {branchStaff.length} barberos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchAdminDashboard;