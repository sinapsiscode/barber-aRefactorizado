/**
 * APPOINTMENT STORE - REFACTORIZADO CON JSON SERVER
 *
 * Cambios principales:
 * 1. ✅ Eliminado TODO el hardcode de servicios (543+ líneas)
 * 2. ✅ Usa API real: citasApiExtended y serviciosApi
 * 3. ✅ Mapeo español (backend) ↔ inglés (frontend)
 * 4. ✅ CRUD completo contra json-server
 * 5. ✅ Manejo de errores mejorado
 * 6. ✅ Mantiene TODA la lógica de negocio local
 * 7. ✅ Persist middleware agregado
 * 8. ✅ loadMockData() carga desde API
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { citasApiExtended, serviciosApi, preciosSucursalApiExtended } from '../services/api';

const useAppointmentStore = create(
  persist(
    (set, get) => ({
      appointments: [],
      selectedDate: new Date(),
      selectedBarber: null,
      isLoading: false,
      error: null,
      availableSlots: [],
      services: [],
      branchPricing: {},

      /**
       * SETTERS BÁSICOS
       */
      setAppointments: (appointments) => set({ appointments }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setSelectedBarber: (barber) => set({ selectedBarber: barber }),

      /**
       * CARGAR DATOS - Fetch appointments + services desde API
       */
      loadMockData: async () => {
        set({ isLoading: true, error: null });
        try {
          // Cargar citas y servicios en paralelo
          const [citasBackend, serviciosBackend] = await Promise.all([
            citasApiExtended.getAll(),
            serviciosApi.getAll()
          ]);

          // Mapear citas de español a inglés
          const appointments = citasBackend.map(cita => ({
            id: cita.id,
            clientId: cita.clienteId,
            clientName: cita.nombreCliente,
            clientPhone: cita.telefonoCliente,
            clientEmail: cita.emailCliente,
            barberId: cita.barberoId,
            barberName: cita.nombreBarbero,
            branchId: cita.sucursalId,
            date: cita.fecha,
            time: cita.hora,
            services: cita.servicios || [],
            totalPrice: cita.precioTotal,
            duration: cita.duracion,
            status: cita.estado,
            notes: cita.notas || '',
            createdAt: cita.createdAt,
            updatedAt: cita.updatedAt,
            reminderSent: cita.recordatorioEnviado || false,
            cancelReason: cita.razonCancelacion,
            rating: cita.calificacion,
            review: cita.resena,
            reviewData: cita.datosRevision,
            approvalData: cita.datosAprobacion,
            rejectionData: cita.datosRechazo
          }));

          // Mapear servicios de español a inglés
          const services = serviciosBackend.map(servicio => ({
            id: servicio.id,
            name: servicio.nombre,
            duration: servicio.duracion,
            price: servicio.precio,
            image: servicio.imagen || '/images/placeholder-service.jpg',
            category: servicio.categoria,
            description: servicio.descripcion,
            features: servicio.caracteristicas || [],
            gallery: servicio.galeria || [],
            videoUrl: servicio.videoUrl || null,
            popular: servicio.popular || false,
            discount: servicio.descuento,
            note: servicio.nota
          }));

          set({
            appointments,
            services,
            isLoading: false
          });

          return { success: true };
        } catch (error) {
          console.error('Error cargando datos de citas:', error);
          set({
            appointments: [],
            services: [],
            isLoading: false,
            error: error.message
          });
          return { success: false, error: error.message };
        }
      },

      /**
       * CRUD DE APPOINTMENTS
       */

      /**
       * CREAR CITA - POST a API
       */
      createAppointment: async (appointmentData) => {
        set({ isLoading: true, error: null });
        try {
          // Mapear de inglés a español para backend
          const citaData = {
            clienteId: appointmentData.clientId,
            nombreCliente: appointmentData.clientName,
            telefonoCliente: appointmentData.clientPhone,
            emailCliente: appointmentData.clientEmail,
            barberoId: appointmentData.barberId,
            nombreBarbero: appointmentData.barberName,
            sucursalId: appointmentData.branchId,
            fecha: appointmentData.date,
            hora: appointmentData.time,
            servicios: appointmentData.services || [],
            precioTotal: appointmentData.totalPrice,
            duracion: appointmentData.duration,
            estado: appointmentData.status || 'pending',
            notas: appointmentData.notes || '',
            recordatorioEnviado: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          // Crear en API
          const citaCreada = await citasApiExtended.create(citaData);

          // Mapear respuesta de español a inglés
          const newAppointment = {
            id: citaCreada.id,
            clientId: citaCreada.clienteId,
            clientName: citaCreada.nombreCliente,
            clientPhone: citaCreada.telefonoCliente,
            clientEmail: citaCreada.emailCliente,
            barberId: citaCreada.barberoId,
            barberName: citaCreada.nombreBarbero,
            branchId: citaCreada.sucursalId,
            date: citaCreada.fecha,
            time: citaCreada.hora,
            services: citaCreada.servicios,
            totalPrice: citaCreada.precioTotal,
            duration: citaCreada.duracion,
            status: citaCreada.estado,
            notes: citaCreada.notas,
            createdAt: citaCreada.createdAt,
            updatedAt: citaCreada.updatedAt,
            reminderSent: citaCreada.recordatorioEnviado
          };

          // Actualizar estado local
          set(state => ({
            appointments: [...state.appointments, newAppointment],
            isLoading: false
          }));

          return { success: true, appointment: newAppointment };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * ACTUALIZAR CITA - PATCH a API
       */
      updateAppointment: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          // Mapear updates de inglés a español
          const citaUpdates = {};
          if (updates.clientId !== undefined) citaUpdates.clienteId = updates.clientId;
          if (updates.clientName !== undefined) citaUpdates.nombreCliente = updates.clientName;
          if (updates.clientPhone !== undefined) citaUpdates.telefonoCliente = updates.clientPhone;
          if (updates.clientEmail !== undefined) citaUpdates.emailCliente = updates.clientEmail;
          if (updates.barberId !== undefined) citaUpdates.barberoId = updates.barberId;
          if (updates.barberName !== undefined) citaUpdates.nombreBarbero = updates.barberName;
          if (updates.branchId !== undefined) citaUpdates.sucursalId = updates.branchId;
          if (updates.date !== undefined) citaUpdates.fecha = updates.date;
          if (updates.time !== undefined) citaUpdates.hora = updates.time;
          if (updates.services !== undefined) citaUpdates.servicios = updates.services;
          if (updates.totalPrice !== undefined) citaUpdates.precioTotal = updates.totalPrice;
          if (updates.duration !== undefined) citaUpdates.duracion = updates.duration;
          if (updates.status !== undefined) citaUpdates.estado = updates.status;
          if (updates.notes !== undefined) citaUpdates.notas = updates.notes;
          if (updates.reminderSent !== undefined) citaUpdates.recordatorioEnviado = updates.reminderSent;
          if (updates.cancelReason !== undefined) citaUpdates.razonCancelacion = updates.cancelReason;
          if (updates.rating !== undefined) citaUpdates.calificacion = updates.rating;
          if (updates.review !== undefined) citaUpdates.resena = updates.review;
          if (updates.reviewData !== undefined) citaUpdates.datosRevision = updates.reviewData;
          if (updates.approvalData !== undefined) citaUpdates.datosAprobacion = updates.approvalData;
          if (updates.rejectionData !== undefined) citaUpdates.datosRechazo = updates.rejectionData;

          citaUpdates.updatedAt = new Date().toISOString();

          // Actualizar en API
          const citaActualizada = await citasApiExtended.patch(id, citaUpdates);

          // Mapear respuesta de español a inglés
          const updatedAppointment = {
            id: citaActualizada.id,
            clientId: citaActualizada.clienteId,
            clientName: citaActualizada.nombreCliente,
            clientPhone: citaActualizada.telefonoCliente,
            clientEmail: citaActualizada.emailCliente,
            barberId: citaActualizada.barberoId,
            barberName: citaActualizada.nombreBarbero,
            branchId: citaActualizada.sucursalId,
            date: citaActualizada.fecha,
            time: citaActualizada.hora,
            services: citaActualizada.servicios,
            totalPrice: citaActualizada.precioTotal,
            duration: citaActualizada.duracion,
            status: citaActualizada.estado,
            notes: citaActualizada.notas,
            createdAt: citaActualizada.createdAt,
            updatedAt: citaActualizada.updatedAt,
            reminderSent: citaActualizada.recordatorioEnviado,
            cancelReason: citaActualizada.razonCancelacion,
            rating: citaActualizada.calificacion,
            review: citaActualizada.resena,
            reviewData: citaActualizada.datosRevision,
            approvalData: citaActualizada.datosAprobacion,
            rejectionData: citaActualizada.datosRechazo
          };

          // Actualizar estado local
          set(state => ({
            appointments: state.appointments.map(apt =>
              apt.id === id ? updatedAppointment : apt
            ),
            isLoading: false
          }));

          return { success: true, appointment: updatedAppointment };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * ELIMINAR CITA - DELETE a API
       */
      deleteAppointment: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await citasApiExtended.delete(id);

          // Actualizar estado local
          set(state => ({
            appointments: state.appointments.filter(apt => apt.id !== id),
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * MÉTODOS DE ESTADO DE CITAS
       */
      confirmAppointment: async (id) => {
        return await get().updateAppointment(id, { status: 'confirmed' });
      },

      completeAppointment: async (id) => {
        return await get().updateAppointment(id, { status: 'completed' });
      },

      cancelAppointment: async (id, reason) => {
        return await get().updateAppointment(id, {
          status: 'cancelled',
          cancelReason: reason
        });
      },

      markAsNoShow: async (id) => {
        return await get().updateAppointment(id, { status: 'no-show' });
      },

      /**
       * SISTEMA DE APROBACIÓN DE CITAS (Recepción)
       */
      reviewAppointment: async (appointmentId, reviewData) => {
        return await get().updateAppointment(appointmentId, {
          status: 'under_review',
          reviewData: {
            reviewedBy: reviewData.reviewedBy,
            reviewedAt: new Date().toISOString(),
            notes: reviewData.notes || ''
          }
        });
      },

      approveAppointment: async (appointmentId, approvalData) => {
        return await get().updateAppointment(appointmentId, {
          status: 'confirmed',
          approvalData: {
            approvedBy: approvalData.approvedBy,
            approvedAt: new Date().toISOString(),
            notes: approvalData.notes || '',
            autoConfirm: approvalData.autoConfirm || false
          }
        });
      },

      rejectAppointment: async (appointmentId, rejectionData) => {
        return await get().updateAppointment(appointmentId, {
          status: 'rejected',
          rejectionData: {
            rejectedBy: rejectionData.rejectedBy,
            rejectedAt: new Date().toISOString(),
            reason: rejectionData.reason,
            notes: rejectionData.notes || '',
            suggestedAlternatives: rejectionData.suggestedAlternatives || []
          }
        });
      },

      /**
       * MÉTODOS DE CONSULTA LOCAL (No requieren API)
       */
      getAppointmentsByDate: (date) => {
        const { appointments } = get();
        return appointments.filter(apt => {
          const appointmentDate = apt.date || apt.fecha;
          if (!appointmentDate) return false;
          const aptDate = new Date(appointmentDate);
          return aptDate.toDateString() === date.toDateString();
        });
      },

      getAppointmentsByBarber: (barberId) => {
        const { appointments } = get();
        return appointments.filter(apt => apt.barberId === barberId);
      },

      getAppointmentsByClient: (clientId) => {
        const { appointments } = get();
        return appointments.filter(apt => apt.clientId === clientId);
      },

      getAppointmentsByStatus: (status) => {
        const { appointments } = get();
        return appointments.filter(apt => (apt.status || apt.estado) === status);
      },

      getPendingAppointments: () => {
        const { appointments } = get();
        return appointments.filter(apt => (apt.status || apt.estado) === 'pending');
      },

      getAppointmentDetails: (appointmentId) => {
        const { appointments } = get();
        return appointments.find(apt => apt.id === appointmentId);
      },

      /**
       * LÓGICA DE NEGOCIO LOCAL - Generación de slots disponibles
       */
      generateTimeSlots: (date, barberId, duration = 30) => {
        const slots = [];
        const startHour = 8;
        const endHour = 18;

        for (let hour = startHour; hour < endHour; hour++) {
          for (let minute = 0; minute < 60; minute += duration) {
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const slotDate = new Date(date);
            slotDate.setHours(hour, minute, 0, 0);

            const isAvailable = !get().appointments.some(apt => {
              const appointmentDate = apt.date || apt.fecha;
              if (!appointmentDate) return false;
              const aptDate = new Date(appointmentDate);
              const aptTime = apt.time;
              const appointmentStatus = apt.status || apt.estado;
              return aptDate.toDateString() === date.toDateString() &&
                aptTime === time &&
                apt.barberId === barberId &&
                appointmentStatus !== 'cancelled';
            });

            slots.push({
              time,
              available: isAvailable,
              datetime: slotDate
            });
          }
        }

        return slots;
      },

      /**
       * LÓGICA DE NEGOCIO LOCAL - Cálculo de precios por sucursal
       */
      getServicePrice: (serviceId, branchId = 1) => {
        const { branchPricing, services } = get();

        // Si existe precio específico para la sede, usarlo
        if (branchPricing[branchId] && branchPricing[branchId][serviceId] !== undefined) {
          return branchPricing[branchId][serviceId];
        }

        // Si no, usar el precio base del servicio
        const service = services.find(s => s.id === serviceId);
        return service ? service.price : 0;
      },

      getServicesWithBranchPricing: (branchId = 1) => {
        const { services, getServicePrice } = get();

        return services.map(service => ({
          ...service,
          price: getServicePrice(service.id, branchId),
          originalPrice: service.price
        }));
      },

      calculateTotalPrice: (serviceIds, branchId = 1) => {
        const { getServicePrice } = get();
        return serviceIds.reduce((total, serviceId) => {
          return total + getServicePrice(serviceId, branchId);
        }, 0);
      },

      /**
       * CRUD DE SERVICIOS
       */

      /**
       * ACTUALIZAR SERVICIO - PATCH a API
       */
      updateService: async (serviceId, updates) => {
        set({ isLoading: true, error: null });
        try {
          // Mapear updates de inglés a español
          const servicioUpdates = {};
          if (updates.name !== undefined) servicioUpdates.nombre = updates.name;
          if (updates.duration !== undefined) servicioUpdates.duracion = updates.duration;
          if (updates.price !== undefined) servicioUpdates.precio = updates.price;
          if (updates.image !== undefined) servicioUpdates.imagen = updates.image;
          if (updates.category !== undefined) servicioUpdates.categoria = updates.category;
          if (updates.description !== undefined) servicioUpdates.descripcion = updates.description;
          if (updates.features !== undefined) servicioUpdates.caracteristicas = updates.features;
          if (updates.gallery !== undefined) servicioUpdates.galeria = updates.gallery;
          if (updates.videoUrl !== undefined) servicioUpdates.videoUrl = updates.videoUrl;
          if (updates.popular !== undefined) servicioUpdates.popular = updates.popular;
          if (updates.discount !== undefined) servicioUpdates.descuento = updates.discount;
          if (updates.note !== undefined) servicioUpdates.nota = updates.note;

          servicioUpdates.updatedAt = new Date().toISOString();

          // Actualizar en API
          const servicioActualizado = await serviciosApi.patch(serviceId, servicioUpdates);

          // Mapear respuesta de español a inglés
          const updatedService = {
            id: servicioActualizado.id,
            name: servicioActualizado.nombre,
            duration: servicioActualizado.duracion,
            price: servicioActualizado.precio,
            image: servicioActualizado.imagen,
            category: servicioActualizado.categoria,
            description: servicioActualizado.descripcion,
            features: servicioActualizado.caracteristicas,
            gallery: servicioActualizado.galeria,
            videoUrl: servicioActualizado.videoUrl,
            popular: servicioActualizado.popular,
            discount: servicioActualizado.descuento,
            note: servicioActualizado.nota
          };

          // Actualizar estado local
          set(state => ({
            services: state.services.map(service =>
              service.id === serviceId ? updatedService : service
            ),
            isLoading: false
          }));

          return { success: true, service: updatedService };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * CARGAR PRECIOS POR SUCURSAL - Fetch desde API
       */
      loadBranchPricing: async (branchId) => {
        set({ isLoading: true, error: null });
        try {
          const preciosData = await preciosSucursalApiExtended.getByBranch(branchId);

          // Mapear a estructura {[serviceId]: precio}
          const branchPricing = {};
          preciosData.forEach(precio => {
            if (!branchPricing[precio.sucursalId]) {
              branchPricing[precio.sucursalId] = {};
            }
            branchPricing[precio.sucursalId][precio.servicioId] = precio.precio;
          });

          set(state => ({
            branchPricing: { ...state.branchPricing, ...branchPricing },
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          console.error('Error cargando precios de sucursal:', error);
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * ACTUALIZAR PRECIO DE SERVICIO PARA SUCURSAL ESPECÍFICA - POST/PATCH a API
       */
      updateServicePrice: async (serviceId, branchId, newPrice) => {
        set({ isLoading: true, error: null });
        try {
          // Verificar si ya existe el precio personalizado
          const existing = await preciosSucursalApiExtended.getByServiceAndBranch(serviceId, branchId);

          let precioData;
          if (existing) {
            // Actualizar precio existente
            precioData = await preciosSucursalApiExtended.patch(existing.id, {
              precio: newPrice,
              updatedAt: new Date().toISOString()
            });
          } else {
            // Crear nuevo precio personalizado
            precioData = await preciosSucursalApiExtended.create({
              sucursalId: branchId,
              servicioId: serviceId,
              precio: newPrice,
              activo: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          }

          // Actualizar estado local
          set(state => ({
            branchPricing: {
              ...state.branchPricing,
              [branchId]: {
                ...state.branchPricing[branchId],
                [serviceId]: newPrice
              }
            },
            isLoading: false
          }));

          return { success: true, pricing: precioData };
        } catch (error) {
          console.error('Error actualizando precio de servicio:', error);
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * ACTUALIZAR MÚLTIPLES PRECIOS PARA UNA SUCURSAL - POST/PATCH múltiples a API
       */
      updateBranchPricing: async (branchId, pricingUpdates) => {
        set({ isLoading: true, error: null });
        try {
          // pricingUpdates es un objeto { serviceId: newPrice, ... }
          const updatePromises = Object.entries(pricingUpdates).map(async ([serviceId, newPrice]) => {
            // Verificar si ya existe
            const existing = await preciosSucursalApiExtended.getByServiceAndBranch(
              parseInt(serviceId),
              branchId
            );

            if (existing) {
              // Actualizar
              return preciosSucursalApiExtended.patch(existing.id, {
                precio: newPrice,
                updatedAt: new Date().toISOString()
              });
            } else {
              // Crear
              return preciosSucursalApiExtended.create({
                sucursalId: branchId,
                servicioId: parseInt(serviceId),
                precio: newPrice,
                activo: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              });
            }
          });

          // Ejecutar todas las actualizaciones en paralelo
          await Promise.all(updatePromises);

          // Actualizar estado local
          set(state => ({
            branchPricing: {
              ...state.branchPricing,
              [branchId]: {
                ...state.branchPricing[branchId],
                ...pricingUpdates
              }
            },
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          console.error('Error actualizando precios de sucursal:', error);
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * ESTADÍSTICAS Y ANALYTICS LOCAL
       */
      getAppointmentStats: () => {
        const { appointments } = get();
        const today = new Date().toDateString();

        const todayAppointments = appointments.filter(apt => {
          const appointmentDate = apt.date || apt.fecha;
          return appointmentDate && new Date(appointmentDate).toDateString() === today;
        });

        return {
          total: appointments.length,
          today: todayAppointments.length,
          pending: appointments.filter(apt => (apt.status || apt.estado) === 'pending').length,
          confirmed: appointments.filter(apt => (apt.status || apt.estado) === 'confirmed').length,
          completed: appointments.filter(apt => (apt.status || apt.estado) === 'completed').length,
          cancelled: appointments.filter(apt => (apt.status || apt.estado) === 'cancelled').length
        };
      },

      getReceptionStats: () => {
        const { appointments } = get();
        const pending = appointments.filter(apt => (apt.status || apt.estado) === 'pending').length;
        const underReview = appointments.filter(apt => (apt.status || apt.estado) === 'under_review').length;
        const approved = appointments.filter(apt => (apt.status || apt.estado) === 'confirmed').length;
        const rejected = appointments.filter(apt => (apt.status || apt.estado) === 'rejected').length;

        return {
          pending,
          underReview,
          approved,
          rejected,
          total: appointments.length
        };
      },

      getBranchPricingStats: (branchId) => {
        const { services, branchPricing } = get();
        const branchPrices = branchPricing[branchId] || {};

        const stats = {
          totalServices: services.length,
          customPrices: Object.keys(branchPrices).length,
          averagePrice: 0,
          minPrice: Infinity,
          maxPrice: -Infinity
        };

        const prices = services.map(service => {
          const price = branchPrices[service.id] || service.price;
          stats.minPrice = Math.min(stats.minPrice, price);
          stats.maxPrice = Math.max(stats.maxPrice, price);
          return price;
        });

        stats.averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

        return stats;
      },

      /**
       * RECORDATORIOS (Mantener lógica local)
       */
      getAppointmentsNeedingReminders: () => {
        const { appointments } = get();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        return appointments.filter(apt => {
          const appointmentDate = apt.date || apt.fecha;
          const appointmentStatus = apt.status || apt.estado;
          return appointmentDate === tomorrowStr &&
            appointmentStatus === 'confirmed' &&
            !apt.reminderSent;
        });
      },

      markReminderSent: async (appointmentId) => {
        return await get().updateAppointment(appointmentId, {
          reminderSent: true
        });
      },

      /**
       * MOCK DATA (DEPRECATED - usar loadMockData en su lugar)
       */
      loadMockAppointments: (forceReload = false) => {
        console.warn('loadMockAppointments is deprecated. Use loadMockData() instead.');
        // Ya no genera mock data, solo llama a loadMockData
        return get().loadMockData();
      }
    }),
    {
      name: 'appointment-storage',
      partialize: (state) => ({
        // Solo persistir como cache, la verdad está en la API
        appointments: state.appointments,
        services: state.services,
        branchPricing: state.branchPricing
      })
    }
  )
);

export default useAppointmentStore;
