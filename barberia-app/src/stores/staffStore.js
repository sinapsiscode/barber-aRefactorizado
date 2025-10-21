/**
 * STAFF STORE - REFACTORIZADO CON JSON SERVER
 *
 * Cambios:
 * ✅ Migrado a API real
 * ✅ Eliminado hardcode de asistencias mock
 * ✅ CRUD completo para barberos y asistencias
 * ✅ Lógica de negocio mantenida localmente
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { barberosApiExtended, asistenciasApi } from '../services/api';

const useStaffStore = create(
  persist(
    (set, get) => ({
      barbers: [],
      attendance: [],
      isLoading: false,
      error: null,
      selectedBarber: null,

      setBarbers: (barbers) => set({ barbers }),
      setSelectedBarber: (barber) => set({ selectedBarber: barber }),

      /**
       * CARGAR BARBEROS - Fetch desde API
       */
      loadStaff: async () => {
        set({ isLoading: true, error: null });
        try {
          // Cargar barberos
          const barberosData = await barberosApiExtended.getAll();

          // Mapear estructura backend (español) a frontend (inglés)
          const barbers = barberosData.map(b => ({
            id: b.id,
            name: b.nombre,
            email: b.email,
            phone: b.telefono,
            branchId: b.sucursalId,
            specialties: b.especialidades || [],
            rating: b.calificacion || 5.0,
            totalServices: b.totalServicios || 0,
            totalEarnings: b.totalGanancias || 0,
            isPresent: b.presente || false,
            country: b.pais,
            status: b.estado,
            experience: b.experiencia,
            achievements: b.logros || [],
            description: b.descripcion,
            createdAt: b.createdAt,
            updatedAt: b.updatedAt
          }));

          // Cargar asistencias
          const asistenciasData = await asistenciasApi.getAll();

          const attendance = asistenciasData.map(a => ({
            id: a.id,
            barberId: a.barberoId,
            date: a.fecha,
            checkIn: a.entrada,
            checkOut: a.salida,
            hoursWorked: a.horasTrabajadas || 0,
            status: a.estado,
            notes: a.notas
          }));

          set({ barbers, attendance, isLoading: false });
          return { success: true };
        } catch (error) {
          console.error('Error cargando personal:', error);
          set({ barbers: [], attendance: [], isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * AGREGAR BARBERO - POST a API
       */
      addBarber: async (barberData) => {
        set({ isLoading: true, error: null });
        try {
          // Mapear a estructura backend
          const barberoData = {
            nombre: barberData.name,
            email: barberData.email,
            telefono: barberData.phone,
            sucursalId: barberData.branchId,
            especialidades: barberData.specialties || [],
            calificacion: 5.0,
            totalServicios: 0,
            totalGanancias: 0,
            presente: false,
            pais: barberData.country,
            estado: 'active',
            experiencia: barberData.experience,
            logros: barberData.achievements || [],
            descripcion: barberData.description,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          const createdBarbero = await barberosApiExtended.create(barberoData);

          // Mapear de vuelta
          const newBarber = {
            id: createdBarbero.id,
            name: createdBarbero.nombre,
            email: createdBarbero.email,
            phone: createdBarbero.telefono,
            branchId: createdBarbero.sucursalId,
            specialties: createdBarbero.especialidades,
            rating: createdBarbero.calificacion,
            totalServices: createdBarbero.totalServicios,
            totalEarnings: createdBarbero.totalGanancias,
            isPresent: createdBarbero.presente,
            country: createdBarbero.pais,
            status: createdBarbero.estado,
            experience: createdBarbero.experiencia,
            achievements: createdBarbero.logros,
            description: createdBarbero.descripcion,
            createdAt: createdBarbero.createdAt,
            updatedAt: createdBarbero.updatedAt
          };

          set(state => ({
            barbers: [...state.barbers, newBarber],
            isLoading: false
          }));

          return { success: true, barber: newBarber };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * ACTUALIZAR BARBERO - PATCH a API
       */
      updateBarber: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          // Mapear updates a estructura backend
          const barberoUpdates = {};
          if (updates.name) barberoUpdates.nombre = updates.name;
          if (updates.email) barberoUpdates.email = updates.email;
          if (updates.phone) barberoUpdates.telefono = updates.phone;
          if (updates.branchId !== undefined) barberoUpdates.sucursalId = updates.branchId;
          if (updates.specialties) barberoUpdates.especialidades = updates.specialties;
          if (updates.rating !== undefined) barberoUpdates.calificacion = updates.rating;
          if (updates.totalServices !== undefined) barberoUpdates.totalServicios = updates.totalServices;
          if (updates.totalEarnings !== undefined) barberoUpdates.totalGanancias = updates.totalEarnings;
          if (updates.isPresent !== undefined) barberoUpdates.presente = updates.isPresent;
          if (updates.country) barberoUpdates.pais = updates.country;
          if (updates.status) barberoUpdates.estado = updates.status;
          if (updates.experience) barberoUpdates.experiencia = updates.experience;
          if (updates.achievements) barberoUpdates.logros = updates.achievements;
          if (updates.description) barberoUpdates.descripcion = updates.description;

          barberoUpdates.updatedAt = new Date().toISOString();

          const updatedBarbero = await barberosApiExtended.patch(id, barberoUpdates);

          // Mapear de vuelta
          const updatedBarber = {
            id: updatedBarbero.id,
            name: updatedBarbero.nombre,
            email: updatedBarbero.email,
            phone: updatedBarbero.telefono,
            branchId: updatedBarbero.sucursalId,
            specialties: updatedBarbero.especialidades,
            rating: updatedBarbero.calificacion,
            totalServices: updatedBarbero.totalServicios,
            totalEarnings: updatedBarbero.totalGanancias,
            isPresent: updatedBarbero.presente,
            country: updatedBarbero.pais,
            status: updatedBarbero.estado,
            experience: updatedBarbero.experiencia,
            achievements: updatedBarbero.logros,
            description: updatedBarbero.descripcion,
            createdAt: updatedBarbero.createdAt,
            updatedAt: updatedBarbero.updatedAt
          };

          set(state => ({
            barbers: state.barbers.map(barber =>
              barber.id === id ? updatedBarber : barber
            ),
            isLoading: false
          }));

          return { success: true, barber: updatedBarber };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * ELIMINAR BARBERO - DELETE a API
       */
      deleteBarber: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await barberosApiExtended.delete(id);

          set(state => ({
            barbers: state.barbers.filter(barber => barber.id !== id),
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * CHECK-IN - Registrar entrada (POST asistencia)
       */
      checkIn: async (barberId) => {
        set({ isLoading: true, error: null });
        try {
          const now = new Date();
          const today = now.toISOString().split('T')[0];
          const checkInTime = now.toTimeString().split(' ')[0];

          // Crear asistencia en API
          const asistenciaData = {
            barberoId: barberId,
            fecha: today,
            entrada: checkInTime,
            salida: null,
            horasTrabajadas: 0,
            estado: 'present',
            notas: ''
          };

          const createdAsistencia = await asistenciasApi.create(asistenciaData);

          // Mapear
          const newAttendance = {
            id: createdAsistencia.id,
            barberId: createdAsistencia.barberoId,
            date: createdAsistencia.fecha,
            checkIn: createdAsistencia.entrada,
            checkOut: createdAsistencia.salida,
            hoursWorked: createdAsistencia.horasTrabajadas,
            status: createdAsistencia.estado,
            notes: createdAsistencia.notas
          };

          // Actualizar isPresent del barbero
          await get().updateBarber(barberId, { isPresent: true });

          set(state => ({
            attendance: [...state.attendance, newAttendance],
            isLoading: false
          }));

          return { success: true, attendance: newAttendance };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * CHECK-OUT - Registrar salida (PATCH asistencia)
       */
      checkOut: async (barberId) => {
        set({ isLoading: true, error: null });
        try {
          const now = new Date();
          const today = now.toISOString().split('T')[0];

          // Buscar asistencia de hoy sin salida
          const attendanceRecord = get().attendance.find(
            att => att.barberId === barberId && att.date === today && !att.checkOut
          );

          if (!attendanceRecord) {
            set({ isLoading: false });
            return { success: false, error: 'No hay registro de entrada para hoy' };
          }

          // Calcular horas trabajadas
          const checkInTime = new Date(`${today}T${attendanceRecord.checkIn}`);
          const hoursWorked = (now - checkInTime) / (1000 * 60 * 60);
          const checkOutTime = now.toTimeString().split(' ')[0];

          // Actualizar en API
          const updatedAsistencia = await asistenciasApi.patch(attendanceRecord.id, {
            salida: checkOutTime,
            horasTrabajadas: Math.round(hoursWorked * 100) / 100
          });

          // Actualizar isPresent del barbero
          await get().updateBarber(barberId, { isPresent: false });

          // Actualizar local
          set(state => ({
            attendance: state.attendance.map(att =>
              att.id === attendanceRecord.id
                ? {
                    ...att,
                    checkOut: updatedAsistencia.salida,
                    hoursWorked: updatedAsistencia.horasTrabajadas
                  }
                : att
            ),
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * AUSENCIA TEMPORAL (local, sin persistir en API por ahora)
       */
      setTemporaryAbsence: async (barberId, isAbsent) => {
        const barber = get().barbers.find(b => b.id === barberId);
        if (!barber) {
          return { success: false, message: 'Barbero no encontrado' };
        }

        set(state => ({
          barbers: state.barbers.map(b =>
            b.id === barberId
              ? { ...b, temporaryAbsence: isAbsent }
              : b
          )
        }));

        return { success: true };
      },

      /**
       * MÉTODOS DE CONSULTA LOCAL (No requieren API)
       */
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

      /**
       * ESTADÍSTICAS DE BARBERO
       */
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

            // Tardanza si llega después de las 8:30
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

      /**
       * ACTUALIZAR ESTADÍSTICAS DE BARBERO
       */
      updateBarberStats: async (barberId, serviceCount, earnings) => {
        const barber = get().barbers.find(b => b.id === barberId);
        if (!barber) return { success: false, error: 'Barbero no encontrado' };

        return await get().updateBarber(barberId, {
          totalServices: barber.totalServices + serviceCount,
          totalEarnings: barber.totalEarnings + earnings
        });
      },

      /**
       * RESUMEN DEL PERSONAL
       */
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
    }),
    {
      name: 'staff-storage',
      partialize: (state) => ({
        // Solo persistir como cache
        barbers: state.barbers,
        attendance: state.attendance
      })
    }
  )
);

export default useStaffStore;
