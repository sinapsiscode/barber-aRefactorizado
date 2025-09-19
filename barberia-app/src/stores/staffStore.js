import { create } from 'zustand';
import { getDataSection } from '../utils/dataLoader.js';

const useStaffStore = create((set, get) => ({
  barbers: [],
  attendance: [],
  isLoading: false,
  selectedBarber: null,

  setBarbers: (barbers) => set({ barbers }),

  setSelectedBarber: (barber) => set({ selectedBarber: barber }),

  addBarber: async (barberData) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newBarber = {
        id: Date.now(),
        ...barberData,
        status: 'active',
        rating: 5.0,
        totalServices: 0,
        totalEarnings: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      set(state => ({
        barbers: [...state.barbers, newBarber],
        isLoading: false
      }));

      return { success: true, barber: newBarber };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: 'Error al agregar el barbero' };
    }
  },

  updateBarber: async (id, updates) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        barbers: state.barbers.map(barber => 
          barber.id === id 
            ? { ...barber, ...updates, updatedAt: new Date() }
            : barber
        ),
        isLoading: false
      }));

      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: 'Error al actualizar el barbero' };
    }
  },

  deleteBarber: async (id) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        barbers: state.barbers.filter(barber => barber.id !== id),
        isLoading: false
      }));

      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: 'Error al eliminar el barbero' };
    }
  },

  checkIn: async (barberId) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      const newAttendance = {
        id: Date.now(),
        barberId,
        date: today,
        checkIn: now.toTimeString().split(' ')[0],
        checkOut: null,
        hoursWorked: 0,
        status: 'present'
      };

      set(state => ({
        attendance: [...state.attendance, newAttendance],
        barbers: state.barbers.map(barber => 
          barber.id === barberId 
            ? { ...barber, isPresent: true }
            : barber
        ),
        isLoading: false
      }));

      return { success: true, attendance: newAttendance };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: 'Error al registrar entrada' };
    }
  },

  checkOut: async (barberId) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      set(state => {
        const attendanceRecord = state.attendance.find(
          att => att.barberId === barberId && att.date === today && !att.checkOut
        );

        if (attendanceRecord) {
          const checkInTime = new Date(`${today}T${attendanceRecord.checkIn}`);
          const hoursWorked = (now - checkInTime) / (1000 * 60 * 60);
          
          return {
            attendance: state.attendance.map(att => 
              att.id === attendanceRecord.id
                ? { 
                    ...att, 
                    checkOut: now.toTimeString().split(' ')[0],
                    hoursWorked: Math.round(hoursWorked * 100) / 100
                  }
                : att
            ),
            barbers: state.barbers.map(barber => 
              barber.id === barberId 
                ? { ...barber, isPresent: false }
                : barber
            ),
            isLoading: false
          };
        }
        return { ...state, isLoading: false };
      });

      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: 'Error al registrar salida' };
    }
  },

  setTemporaryAbsence: async (barberId, isAbsent) => {
    const barber = get().barbers.find(b => b.id === barberId);
    if (barber) {
      set(state => ({
        barbers: state.barbers.map(b => 
          b.id === barberId 
            ? { ...b, temporaryAbsence: isAbsent }
            : b
        )
      }));
      return { success: true };
    }
    return { success: false, message: 'Barbero no encontrado' };
  },

  getStaffByBranch: (branchId) => {
    const { barbers } = get();
    return barbers.filter(barber => barber.branchId === branchId && barber.status === 'active');
  },

  getBarbersByBranch: (branchId) => {
    const { barbers } = get();
    return barbers.filter(barber => barber.branchId === branchId);
  },

  getActiveBarbers: () => {
    const { barbers } = get();
    return barbers.filter(barber => barber.status === 'active');
  },

  getPresentBarbers: () => {
    const { barbers } = get();
    return barbers.filter(barber => barber.isPresent);
  },

  getAttendanceByDate: (date) => {
    const { attendance } = get();
    return attendance.filter(att => att.date === date);
  },

  getBarberStats: (barberId) => {
    const { attendance } = get();
    const barberAttendance = attendance.filter(att => att.barberId === barberId);
    
    const totalHours = barberAttendance.reduce((sum, att) => sum + (att.hoursWorked || 0), 0);
    const totalDays = barberAttendance.length;
    const averageHours = totalDays > 0 ? totalHours / totalDays : 0;

    return {
      totalHours,
      totalDays,
      averageHours,
      thisMonthHours: barberAttendance
        .filter(att => {
          const attDate = new Date(att.date);
          const now = new Date();
          return attDate.getMonth() === now.getMonth() && 
                 attDate.getFullYear() === now.getFullYear();
        })
        .reduce((sum, att) => sum + (att.hoursWorked || 0), 0)
    };
  },

  getAttendanceStats: (date, branchId) => {
    const { attendance, barbers } = get();
    const branchBarbers = branchId ? barbers.filter(b => b.branchId === branchId) : barbers;
    const dayAttendance = attendance.filter(att => att.date === date);
    
    let present = 0;
    let late = 0;
    let absent = 0;
    const details = [];

    branchBarbers.forEach(barber => {
      const barberAttendance = dayAttendance.find(att => att.barberId === barber.id);
      
      if (barberAttendance) {
        const checkInTime = barberAttendance.checkIn.split(':');
        const checkInHour = parseInt(checkInTime[0]);
        const checkInMinute = parseInt(checkInTime[1]);
        
        // Consideramos tardanza si llega después de las 8:30
        if (checkInHour > 8 || (checkInHour === 8 && checkInMinute > 30)) {
          late++;
          details.push({
            barberId: barber.id,
            name: barber.name,
            status: 'late',
            checkIn: barberAttendance.checkIn,
            checkOut: barberAttendance.checkOut
          });
        } else {
          present++;
          details.push({
            barberId: barber.id,
            name: barber.name,
            status: 'present',
            checkIn: barberAttendance.checkIn,
            checkOut: barberAttendance.checkOut
          });
        }
      } else {
        absent++;
        details.push({
          barberId: barber.id,
          name: barber.name,
          status: 'absent',
          checkIn: null,
          checkOut: null
        });
      }
    });

    return {
      present,
      late,
      absent,
      details,
      total: branchBarbers.length
    };
  },

  updateBarberStats: (barberId, serviceCount, earnings) => {
    set(state => ({
      barbers: state.barbers.map(barber => 
        barber.id === barberId 
          ? { 
              ...barber, 
              totalServices: barber.totalServices + serviceCount,
              totalEarnings: barber.totalEarnings + earnings,
              updatedAt: new Date()
            }
          : barber
      )
    }));
  },

  loadMockStaff: async () => {
    try {
      // REFACTORED: Cargar datos desde JSON
      const staff = await getDataSection('barbers');
      
      // Generar asistencias mock (mantener lógica original)
      const mockAttendance = [];
      const today = new Date();
      
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        staff.forEach(barber => {
          if (Math.random() > 0.1) { // 90% probabilidad de asistencia
            const checkInHour = 8 + Math.floor(Math.random() * 2);
            const workHours = 7 + Math.random() * 3;
            
            mockAttendance.push({
              id: Date.now() + Math.random(),
              barberId: barber.id,
              date: dateStr,
              checkIn: `${checkInHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
              checkOut: `${(checkInHour + Math.floor(workHours)).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
              hoursWorked: Math.round(workHours * 100) / 100,
              status: 'present'
            });
          }
        });
      }

      set({ 
        barbers: staff || [],
        attendance: mockAttendance 
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error cargando datos de personal:', error);
      set({ 
        barbers: [],
        attendance: []
      });
      return { success: false, error: error.message };
    }
  },

  getStaffSummary: () => {
    const { barbers, attendance } = get();
    const today = new Date().toISOString().split('T')[0];
    
    const todayAttendance = attendance.filter(att => att.date === today);
    const presentToday = todayAttendance.length;
    const totalStaff = barbers.filter(b => b.status === 'active').length;
    
    const avgRating = barbers.length > 0 
      ? barbers.reduce((sum, b) => sum + b.rating, 0) / barbers.length 
      : 0;

    const totalServices = barbers.reduce((sum, b) => sum + b.totalServices, 0);
    const totalEarnings = barbers.reduce((sum, b) => sum + b.totalEarnings, 0);

    return {
      totalStaff,
      presentToday,
      attendanceRate: totalStaff > 0 ? (presentToday / totalStaff) * 100 : 0,
      avgRating: Math.round(avgRating * 10) / 10,
      totalServices,
      totalEarnings
    };
  }
}));

export default useStaffStore;