import { create } from 'zustand';
import { getDataSections } from '../utils/dataLoader.js';

const useAppointmentStore = create((set, get) => ({
  appointments: [],
  selectedDate: new Date(),
  selectedBarber: null,
  isLoading: false,
  availableSlots: [],
  // REFACTORED: Servicios cargados desde JSON
  services: [],
  branchPricing: [],
  
  servicesOld: [
    { 
      id: 1, 
      name: 'Corte Clásico', 
      duration: 30, 
      price: 25,
      image: '/images/placeholder-service.jpg',
      category: 'Cortes',
      description: 'El corte tradicional que nunca pasa de moda. Perfecto para un look profesional y elegante.',
      features: ['Corte con tijera', 'Peinado incluido', 'Lavado de cabello'],
      gallery: [
        '/images/placeholder-service.jpg',
        '/images/placeholder-service.jpg',
        '/images/placeholder-service.jpg'
      ],
      videoUrl: null,
      popular: true
    },
    { 
      id: 2, 
      name: 'Fade Moderno', 
      duration: 45, 
      price: 35,
      image: '/images/placeholder-service.jpg',
      category: 'Cortes',
      description: 'Corte degradado moderno con transiciones suaves. Ideal para un estilo contemporáneo y fresco.',
      features: ['Degradado profesional', 'Diseño personalizado', 'Acabado con máquina'],
      gallery: [
        '/images/placeholder-service.jpg',
        '/images/placeholder-service.jpg',
        '/images/placeholder-service.jpg',
        '/images/placeholder-service.jpg'
      ],
      videoUrl: null,
      popular: true
    },
    { 
      id: 3, 
      name: 'Barba', 
      duration: 20, 
      price: 15,
      image: '/images/placeholder-service.jpg',
      category: 'Barba',
      description: 'Perfilado y arreglo profesional de barba. Incluye recorte, perfilado y hidratación.',
      features: ['Recorte preciso', 'Perfilado de líneas', 'Aceite hidratante'],
      gallery: [
        '/images/placeholder-service.jpg',
        '/images/placeholder-service.jpg',
        '/images/placeholder-service.jpg'
      ],
      videoUrl: null,
      popular: false
    },
    { 
      id: 4, 
      name: 'Corte + Barba', 
      duration: 50, 
      price: 40,
      image: '/images/placeholder-service.jpg',
      category: 'Combos',
      description: 'Nuestro combo más popular. Corte completo más arreglo de barba para un look completo.',
      features: ['Corte personalizado', 'Arreglo de barba', 'Lavado incluido', 'Peinado final'],
      gallery: [
        '/images/placeholder-service.jpg',
        '/images/placeholder-service.jpg',
        '/images/placeholder-service.jpg',
        '/images/placeholder-service.jpg'
      ],
      videoUrl: null,
      popular: true,
      discount: 10 // 10% de descuento vs servicios separados
    },
    { 
      id: 5, 
      name: 'Diseño Especial', 
      duration: 60, 
      price: 50,
      image: '/images/placeholder-service.jpg',
      category: 'Diseños',
      description: 'Diseños creativos y personalizados. Desde líneas simples hasta patrones complejos.',
      features: ['Diseño personalizado', 'Plantillas incluidas', 'Retoque gratuito en 7 días'],
      gallery: [
        '/images/placeholder-service.jpg',
        '/images/placeholder-service.jpg',
        '/images/placeholder-service.jpg',
        '/images/placeholder-service.jpg',
        '/images/placeholder-service.jpg'
      ],
      videoUrl: null,
      popular: false
    },
    { 
      id: 6, 
      name: 'Tinte', 
      duration: 90, 
      price: 70,
      image: '/images/placeholder-service.jpg',
      category: 'Coloración',
      description: 'Coloración profesional con productos de alta calidad. Diversos tonos disponibles.',
      features: ['Consulta de color', 'Productos premium', 'Cuidado post-tinte'],
      gallery: [
        '/images/placeholder-service.jpg',
        '/images/placeholder-service.jpg',
        '/images/placeholder-service.jpg'
      ],
      videoUrl: null,
      popular: false,
      note: 'Requiere cita con 24h de anticipación'
    },
    { 
      id: 7, 
      name: 'Cejas', 
      duration: 15, 
      price: 10,
      image: '/images/placeholder-service.jpg',
      category: 'Detalles',
      description: 'Perfilado y arreglo de cejas masculinas. Definición natural y profesional.',
      features: ['Perfilado con pinza', 'Recorte con tijera', 'Cera si es necesario'],
      gallery: [
        '/images/placeholder-service.jpg',
        '/images/placeholder-service.jpg'
      ],
      videoUrl: null,
      popular: false
    },
    { 
      id: 8, 
      name: 'Tratamiento Capilar', 
      duration: 45, 
      price: 60,
      image: '/images/placeholder-service.jpg',
      category: 'Tratamientos',
      description: 'Tratamiento nutritivo para el cabello. Ideal para cabello dañado o muy seco.',
      features: ['Análisis capilar', 'Mascarilla nutritiva', 'Masaje capilar', 'Consejos de cuidado'],
      gallery: [
        '/images/placeholder-service.jpg',
        '/images/placeholder-service.jpg',
        '/images/placeholder-service.jpg'
      ],
      videoUrl: null,
      popular: false
    }
  ],


  setAppointments: (appointments) => set({ appointments }),

  setSelectedDate: (date) => set({ selectedDate: date }),

  setSelectedBarber: (barber) => set({ selectedBarber: barber }),

  createAppointment: async (appointmentData) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newAppointment = {
        id: Date.now(),
        ...appointmentData,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      set(state => ({
        appointments: [...state.appointments, newAppointment],
        isLoading: false
      }));

      return { success: true, appointment: newAppointment };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: 'Error al crear la cita' };
    }
  },

  updateAppointment: async (id, updates) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        appointments: state.appointments.map(apt => 
          apt.id === id 
            ? { ...apt, ...updates, updatedAt: new Date() }
            : apt
        ),
        isLoading: false
      }));

      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: 'Error al actualizar la cita' };
    }
  },

  deleteAppointment: async (id) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        appointments: state.appointments.filter(apt => apt.id !== id),
        isLoading: false
      }));

      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: 'Error al eliminar la cita' };
    }
  },

  getAppointmentsByDate: (date) => {
    const { appointments } = get();
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
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

  getAppointmentsByBarberDupe: (barberId) => {
    const { appointments } = get();
    return appointments.filter(apt => apt.barberId === barberId);
  },

  getAppointmentsByStatus: (status) => {
    const { appointments } = get();
    return appointments.filter(apt => apt.status === status);
  },

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
          const aptDate = new Date(apt.date);
          const aptTime = apt.time;
          return aptDate.toDateString() === date.toDateString() && 
                 aptTime === time && 
                 apt.barberId === barberId &&
                 apt.status !== 'cancelled';
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

  loadMockData: async () => {
    try {
      // REFACTORED: Cargar servicios y citas desde JSON
      const { services, branchPricing, appointments } = await getDataSections(['services', 'branchPricing', 'appointments']);
      
      set({ 
        services: services || [],
        branchPricing: branchPricing || [],
        appointments: appointments || []
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error cargando datos de citas:', error);
      set({ 
        services: [],
        branchPricing: [],
        appointments: []
      });
      return { success: false, error: error.message };
    }
  },

  loadMockAppointments: () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const mockAppointments = [
      // Cita para usuario cliente demo
      {
        id: 1,
        clientId: 3, // ID del usuario cliente en authStore
        clientName: 'Juan Cliente',
        barberId: 1,
        barberName: 'Miguel Rodríguez',
        branchId: 1,
        date: tomorrow.toISOString().split('T')[0],
        time: '10:00',
        services: [1, 3],
        totalPrice: 40,
        duration: 50,
        status: 'confirmed',
        notes: 'Corte preferido: fade corto',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Cita completada para el cliente
      {
        id: 2,
        clientId: 3,
        clientName: 'Juan Cliente',
        barberId: 1,
        barberName: 'Miguel Rodríguez',
        branchId: 1,
        date: lastWeek.toISOString().split('T')[0],
        time: '15:00',
        services: [1],
        totalPrice: 25,
        duration: 30,
        status: 'completed',
        notes: '',
        createdAt: lastWeek,
        updatedAt: lastWeek
      },
      // Otras citas para otros clientes
      {
        id: 3,
        clientId: 1,
        clientName: 'Juan Pérez',
        barberId: 2,
        barberName: 'Luis Martínez',
        branchId: 1,
        date: new Date().toISOString().split('T')[0],
        time: '14:30',
        services: [2],
        totalPrice: 35,
        duration: 45,
        status: 'pending',
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        clientId: 2,
        clientName: 'María López',
        barberId: 1,
        barberName: 'Miguel Rodríguez',
        branchId: 2,
        date: today.toISOString().split('T')[0],
        time: '11:30',
        services: [4],
        totalPrice: 40,
        duration: 50,
        status: 'confirmed',
        notes: 'Cliente VIP',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    set({ appointments: mockAppointments });
  },

  getAppointmentStats: () => {
    const { appointments } = get();
    const today = new Date().toDateString();
    
    const todayAppointments = appointments.filter(apt => 
      new Date(apt.date).toDateString() === today
    );

    return {
      total: appointments.length,
      today: todayAppointments.length,
      pending: appointments.filter(apt => apt.status === 'pending').length,
      confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
      completed: appointments.filter(apt => apt.status === 'completed').length,
      cancelled: appointments.filter(apt => apt.status === 'cancelled').length
    };
  },

  // Obtener precio de un servicio para una sede específica
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

  // Obtener servicios con precios actualizados para una sede
  getServicesWithBranchPricing: (branchId = 1) => {
    const { services, getServicePrice } = get();
    
    return services.map(service => ({
      ...service,
      price: getServicePrice(service.id, branchId),
      originalPrice: service.price // Mantener precio original como referencia
    }));
  },

  // Actualizar precio de un servicio para una sede específica (solo para administradores)
  updateServicePrice: async (serviceId, branchId, newPrice) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
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

      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: 'Error al actualizar el precio' };
    }
  },

  // Actualizar múltiples precios para una sede
  updateBranchPricing: async (branchId, pricingUpdates) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
      set({ isLoading: false });
      return { success: false, error: 'Error al actualizar los precios' };
    }
  },

  // Obtener estadísticas de precios por sede
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
  }
}));

export default useAppointmentStore;