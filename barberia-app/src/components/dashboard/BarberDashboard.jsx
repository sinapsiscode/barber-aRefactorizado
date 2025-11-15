import { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiDollarSign, FiUsers, FiCheckCircle, FiXCircle, FiCoffee, FiActivity, FiAward, FiTrendingUp, FiStar } from 'react-icons/fi';
import { useAuthStore, useStaffStore, useAppointmentStore } from '../../stores';
import CountryFlag from '../common/CountryFlag';
import Swal from 'sweetalert2';

const BarberDashboard = ({ onPageChange }) => {
  const { user } = useAuthStore();
  const { checkIn, checkOut, setTemporaryAbsence, barbers, getBarberStats, attendance, loadStaff } = useStaffStore();
  const { appointments } = useAppointmentStore();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [isTemporarilyAbsent, setIsTemporarilyAbsent] = useState(false);

  // Actualizar reloj cada segundo
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Cargar asistencias y verificar si ya marcó entrada hoy
  useEffect(() => {
    const initializeAttendance = async () => {
      // Cargar asistencias si no están cargadas
      if (attendance.length === 0) {
        await loadStaff(true); // true = incluir asistencias
      }

      // Verificar si ya marcó entrada hoy
      const today = new Date().toISOString().split('T')[0];
      const todayAttendance = attendance.find(
        att => {
          const attDate = att.date || att.fecha;
          const attCheckOut = att.checkOut || att.salida;
          return att.barberId === user?.id &&
                 attDate === today &&
                 !attCheckOut; // Solo si no ha marcado salida
        }
      );

      if (todayAttendance) {
        setIsCheckedIn(true);
        const checkInStr = todayAttendance.checkIn || todayAttendance.entrada;
        if (checkInStr) {
          const [hours, minutes, seconds] = checkInStr.split(':');
          const checkInDate = new Date();
          checkInDate.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds || 0));
          setCheckInTime(checkInDate);
        }
      }
    };

    if (user?.id) {
      initializeAttendance();
    }
  }, [user?.id, attendance.length]);

  // Obtener datos del barbero actual
  const currentBarber = barbers.find(b => b.id === user?.id) || {
    id: user?.id,
    name: user?.name,
    country: 'PE', // País por defecto
    totalServices: 1250,
    totalEarnings: 37500,
    rating: 4.8,
    status: 'active'
  };

  // Obtener estadísticas del barbero
  const barberStats = getBarberStats(currentBarber.id);

  // Calcular citas del día
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(apt => {
    const appointmentDate = apt.date || apt.fecha;
    return apt.barberId === user?.id && appointmentDate === today;
  });

  const completedToday = todayAppointments.filter(apt => {
    const appointmentStatus = apt.status || apt.estado;
    return appointmentStatus === 'completed';
  }).length;
  const pendingToday = todayAppointments.filter(apt => {
    const appointmentStatus = apt.status || apt.estado;
    return appointmentStatus === 'confirmed';
  }).length;
  const nextAppointment = todayAppointments
    .filter(apt => {
      const appointmentStatus = apt.status || apt.estado;
      return appointmentStatus === 'confirmed';
    })
    .sort((a, b) => {
      const timeA = a.time || a.hora;
      const timeB = b.time || b.hora;
      return (timeA || '').localeCompare(timeB || '');
    })[0];

  // Calcular ingresos del día (estimado)
  const todayEarnings = completedToday * 30; // S/30 promedio por servicio
  const todayCommission = todayEarnings * 0.7; // 70% de comisión

  // Manejar check-in
  const handleCheckIn = async () => {
    const result = await Swal.fire({
      title: '¿Marcar entrada?',
      text: `Hora actual: ${currentTime.toLocaleTimeString()}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, marcar entrada',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#10b981'
    });

    if (result.isConfirmed) {
      const checkInResult = await checkIn(user.id);
      if (checkInResult.success) {
        setIsCheckedIn(true);
        setCheckInTime(currentTime);
        // Recargar asistencias para actualizar el estado
        await loadStaff(true);
        Swal.fire('¡Entrada registrada!', 'Tu hora de entrada ha sido marcada', 'success');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: checkInResult.error || 'No se pudo registrar la entrada',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  // Manejar check-out
  const handleCheckOut = async () => {
    const result = await Swal.fire({
      title: '¿Marcar salida?',
      text: `Hora actual: ${currentTime.toLocaleTimeString()}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, marcar salida',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444'
    });

    if (result.isConfirmed) {
      const checkOutResult = await checkOut(user.id);
      if (checkOutResult.success) {
        setIsCheckedIn(false);
        setCheckInTime(null);
        // Recargar asistencias para actualizar el estado
        await loadStaff(true);
        Swal.fire('¡Salida registrada!', 'Tu hora de salida ha sido marcada', 'success');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: checkOutResult.error || 'No se pudo registrar la salida',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  // Manejar ausencia temporal
  const handleTemporaryAbsence = async () => {
    const result = await Swal.fire({
      title: isTemporarilyAbsent ? '¿Regresar de ausencia?' : '¿Marcar ausencia temporal?',
      text: isTemporarilyAbsent 
        ? 'Marcarte como disponible nuevamente'
        : 'Esto indicará que estás temporalmente ausente (almuerzo, descanso, etc.)',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: isTemporarilyAbsent ? 'Sí, ya regresé' : 'Sí, ausente temporal',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#f59e0b'
    });

    if (result.isConfirmed) {
      setIsTemporarilyAbsent(!isTemporarilyAbsent);
      await setTemporaryAbsence(user.id, !isTemporarilyAbsent);
      
      Swal.fire(
        isTemporarilyAbsent ? '¡Bienvenido de vuelta!' : 'Ausencia registrada',
        isTemporarilyAbsent 
          ? 'Has sido marcado como disponible'
          : 'Has sido marcado como temporalmente ausente',
        'success'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con información personal */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold">¡Hola, {user?.name}!</h1>
              <CountryFlag countryCode={currentBarber.country} size={24} />
            </div>
            <p className="text-green-100">
              {currentTime.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-mono font-bold">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-green-100 text-sm mt-1">
              {isCheckedIn ? `Entrada: ${checkInTime?.toLocaleTimeString() || '--'}` : 'No has marcado entrada'}
            </div>
          </div>
        </div>
      </div>

      {/* Botones de Asistencia */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {!isCheckedIn ? (
          <button
            onClick={handleCheckIn}
            className="card hover:shadow-lg transition-all bg-gradient-to-r from-green-500 to-green-600 text-white"
          >
            <div className="flex items-center justify-center space-x-3 py-4">
              <FiCheckCircle className="h-8 w-8" />
              <span className="text-xl font-semibold">Marcar Entrada</span>
            </div>
          </button>
        ) : (
          <button
            onClick={handleCheckOut}
            className="card hover:shadow-lg transition-all bg-gradient-to-r from-red-500 to-red-600 text-white"
          >
            <div className="flex items-center justify-center space-x-3 py-4">
              <FiXCircle className="h-8 w-8" />
              <span className="text-xl font-semibold">Marcar Salida</span>
            </div>
          </button>
        )}

        <button
          onClick={handleTemporaryAbsence}
          disabled={!isCheckedIn}
          className={`card hover:shadow-lg transition-all ${
            !isCheckedIn 
              ? 'bg-gray-300 cursor-not-allowed' 
              : isTemporarilyAbsent
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
              : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
          }`}
        >
          <div className="flex items-center justify-center space-x-3 py-4">
            <FiCoffee className="h-8 w-8" />
            <span className="text-xl font-semibold">
              {isTemporarilyAbsent ? 'Regresar' : 'Ausente Temporal'}
            </span>
          </div>
        </button>

        <div className={`card ${isTemporarilyAbsent ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300' : ''}`}>
          <div className="flex items-center justify-center space-x-3 py-4">
            <FiActivity className="h-8 w-8 text-gray-600 dark:text-gray-400" />
            <div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">Estado:</span>
              <span className={`ml-2 text-lg font-bold ${
                !isCheckedIn ? 'text-gray-500' :
                isTemporarilyAbsent ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {!isCheckedIn ? 'No disponible' :
                 isTemporarilyAbsent ? 'Ausente temporal' : 'Disponible'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas del día */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Citas Hoy</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{todayAppointments.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {completedToday} completadas, {pendingToday} pendientes
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-500">
              <FiCalendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Próxima Cita</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {nextAppointment ? nextAppointment.time : '--:--'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {nextAppointment ? nextAppointment.clientName : 'Sin citas pendientes'}
              </p>
            </div>
            <div className="p-3 rounded-full bg-orange-500">
              <FiClock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Comisión Hoy (70%)</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                S/{todayCommission.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                De S/{todayEarnings} en servicios
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-500">
              <FiDollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Servicios</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentBarber.totalServices.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Histórico total
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-500">
              <FiAward className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas adicionales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Mi Rendimiento Mensual
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Horas trabajadas este mes</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {barberStats.thisMonthHours.toFixed(1)}h
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Días trabajados</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {barberStats.totalDays} días
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Promedio diario</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {barberStats.averageHours.toFixed(1)}h
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Calificación promedio</span>
              <div className="flex items-center space-x-1">
                <span className="font-semibold text-yellow-600">
                  {currentBarber.rating}/5.0
                </span>
                <FiStar className="h-4 w-4 text-yellow-500 fill-current" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Comisiones del Mes
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Ingresos totales</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                S/{currentBarber.totalEarnings.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Comisión (70%)</span>
              <span className="font-semibold text-green-600">
                S/{(currentBarber.totalEarnings * 0.7).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Promedio por servicio</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                S/{Math.round(currentBarber.totalEarnings / currentBarber.totalServices)}
              </span>
            </div>
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <FiTrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  ¡Sigue así! Estás en el top 3 de barberos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberDashboard;