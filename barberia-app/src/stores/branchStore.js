import { create } from 'zustand';
import { getDataSections } from '../utils/dataLoader.js';

const useBranchStore = create((set, get) => ({
  branches: [],
  selectedBranch: null,
  isLoading: false,
  
  // REFACTORED: Lista de países cargada desde JSON
  availableCountries: [],

  setBranches: (branches) => set({ branches }),

  setSelectedBranch: (branch) => set({ selectedBranch: branch }),

  // Métodos para gestión de países
  addCountry: (countryData) => {
    const { availableCountries } = get();
    if (!availableCountries.find(c => c.code === countryData.code)) {
      set(state => ({
        availableCountries: [...state.availableCountries, countryData]
      }));
      return { success: true };
    }
    return { success: false, error: 'País ya existe' };
  },

  getCountryByCode: (code) => {
    const { availableCountries } = get();
    return availableCountries.find(c => c.code === code);
  },

  addBranch: async (branchData) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newBranch = {
        id: Date.now(),
        ...branchData,
        status: 'active',
        stats: {
          totalAppointments: 0,
          monthlyRevenue: 0,
          staffCount: 0,
          clientCount: 0
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      set(state => ({
        branches: [...state.branches, newBranch],
        isLoading: false
      }));

      return { success: true, branch: newBranch };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: 'Error al crear la sede' };
    }
  },

  updateBranch: async (id, updates) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        branches: state.branches.map(branch => 
          branch.id === id 
            ? { ...branch, ...updates, updatedAt: new Date() }
            : branch
        ),
        isLoading: false
      }));

      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: 'Error al actualizar la sede' };
    }
  },

  deleteBranch: async (id) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        branches: state.branches.filter(branch => branch.id !== id),
        isLoading: false
      }));

      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: 'Error al eliminar la sede' };
    }
  },

  toggleBranchStatus: async (id) => {
    const { branches } = get();
    const branch = branches.find(b => b.id === id);
    
    if (branch) {
      const newStatus = branch.status === 'active' ? 'inactive' : 'active';
      return await get().updateBranch(id, { status: newStatus });
    }
    
    return { success: false, error: 'Sede no encontrada' };
  },

  getActiveBranches: () => {
    const { branches } = get();
    return branches.filter(branch => branch.status === 'active');
  },

  getBranchById: (id) => {
    const { branches } = get();
    return branches.find(branch => branch.id === id);
  },

  updateBranchStats: (branchId, stats) => {
    set(state => ({
      branches: state.branches.map(branch => 
        branch.id === branchId 
          ? { 
              ...branch, 
              stats: { ...branch.stats, ...stats },
              updatedAt: new Date()
            }
          : branch
      )
    }));
  },

  getBranchPerformance: () => {
    const { branches } = get();
    
    return branches.map(branch => ({
      id: branch.id,
      name: branch.name,
      city: branch.city,
      country: branch.country,
      revenue: branch.stats?.monthlyRevenue || 0,
      appointments: branch.stats?.totalAppointments || 0,
      staff: branch.stats?.staffCount || 0,
      clients: branch.stats?.clientCount || 0,
      efficiency: (branch.stats?.staffCount || 0) > 0 
        ? Math.round((branch.stats?.totalAppointments || 0) / branch.stats.staffCount)
        : 0,
      revenuePerClient: (branch.stats?.clientCount || 0) > 0 
        ? Math.round((branch.stats?.monthlyRevenue || 0) / branch.stats.clientCount)
        : 0
    })).sort((a, b) => b.revenue - a.revenue);
  },

  getTopPerformingBranches: (limit = 3) => {
    return get().getBranchPerformance().slice(0, limit);
  },

  getTotalStats: () => {
    const { branches } = get();
    const activeBranches = branches.filter(b => b.status === 'active');
    
    return {
      totalBranches: activeBranches.length,
      totalRevenue: activeBranches.reduce((sum, b) => sum + (b.stats?.monthlyRevenue || 0), 0),
      totalAppointments: activeBranches.reduce((sum, b) => sum + (b.stats?.totalAppointments || 0), 0),
      totalStaff: activeBranches.reduce((sum, b) => sum + (b.stats?.staffCount || 0), 0),
      totalClients: activeBranches.reduce((sum, b) => sum + (b.stats?.clientCount || 0), 0),
      avgRevenuePerBranch: activeBranches.length > 0 
        ? activeBranches.reduce((sum, b) => sum + (b.stats?.monthlyRevenue || 0), 0) / activeBranches.length
        : 0
    };
  },

  loadMockBranches: async () => {
    try {
      // REFACTORED: Cargar datos desde JSON
      const { branches, countries } = await getDataSections(['branches', 'countries']);
      
      // Asegurar que todas las sucursales tengan stats
      const branchesWithStats = (branches || []).map(branch => ({
        ...branch,
        status: branch.isActive ? 'active' : 'inactive',
        stats: branch.stats || {
          totalAppointments: Math.floor(Math.random() * 500) + 100,
          monthlyRevenue: Math.floor(Math.random() * 50000) + 20000,
          staffCount: Math.floor(Math.random() * 10) + 3,
          clientCount: Math.floor(Math.random() * 200) + 50
        }
      }));
      
      set({ 
        branches: branchesWithStats,
        availableCountries: countries || []
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error cargando datos de sucursales:', error);
      set({ 
        branches: [],
        availableCountries: []
      });
      return { success: false, error: error.message };
    }
  },

  loadMockBranchesOld: () => {
    const mockBranches = [
      {
        id: 1,
        name: 'Barbería Central Lima',
        city: 'Lima',
        country: 'PE',
        address: 'Av. Pardo 123, Miraflores',
        phone: '+51 1 234 5678',
        email: 'lima@barberia.com',
        manager: 'Ana García',
        managerPhone: '+51 900 123 456',
        coordinates: { lat: -12.1211, lng: -77.0365 },
        workingHours: {
          monday: { open: '08:00', close: '22:00' },
          tuesday: { open: '08:00', close: '22:00' },
          wednesday: { open: '08:00', close: '22:00' },
          thursday: { open: '08:00', close: '22:00' },
          friday: { open: '08:00', close: '22:00' },
          saturday: { open: '08:00', close: '22:00' },
          sunday: { open: '08:00', close: '22:00' }
        },
        services: ['Corte Clásico', 'Fade', 'Barba', 'Diseño', 'Tinte', 'Cejas'],
        amenities: ['WiFi', 'Aire Acondicionado', 'TV', 'Música', 'Bebidas'],
        status: 'active',
        stats: {
          totalAppointments: 2456,
          monthlyRevenue: 91200,
          staffCount: 8,
          clientCount: 1240
        },
        images: ['/images/branches/bogota-1.jpg', '/images/branches/bogota-2.jpg'],
        createdAt: new Date('2022-01-15'),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Barbería Premium Callao',
        city: 'Callao',
        country: 'PE',
        address: 'Av. Sáenz Peña 456, Callao',
        phone: '+51 1 345 6789',
        email: 'callao@barberia.com',
        manager: 'Carlos Ruiz',
        managerPhone: '+51 901 234 567',
        coordinates: { lat: -12.0432, lng: -77.1142 },
        workingHours: {
          monday: { open: '08:00', close: '22:00' },
          tuesday: { open: '08:00', close: '22:00' },
          wednesday: { open: '08:00', close: '22:00' },
          thursday: { open: '08:00', close: '22:00' },
          friday: { open: '08:00', close: '22:00' },
          saturday: { open: '08:00', close: '22:00' },
          sunday: { open: '08:00', close: '22:00' }
        },
        services: ['Corte Moderno', 'Fade Artístico', 'Barba Vintage', 'Tratamientos', 'Masajes'],
        amenities: ['WiFi Premium', 'Zona VIP', 'Bar de Café', 'Periódicos', 'Masajes'],
        status: 'active',
        stats: {
          totalAppointments: 1890,
          monthlyRevenue: 76400,
          staffCount: 6,
          clientCount: 945
        },
        images: ['/images/branches/medellin-1.jpg', '/images/branches/medellin-2.jpg'],
        createdAt: new Date('2022-03-20'),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'Barbería Moderna Arequipa',
        city: 'Arequipa',
        country: 'PE',
        address: 'Av. Ejército 789, Arequipa',
        phone: '+51 54 456 789',
        email: 'arequipa@barberia.com',
        manager: 'Luis Moreno',
        managerPhone: '+51 902 345 678',
        coordinates: { lat: -16.3988, lng: -71.5350 },
        workingHours: {
          monday: { open: '08:00', close: '22:00' },
          tuesday: { open: '08:00', close: '22:00' },
          wednesday: { open: '08:00', close: '22:00' },
          thursday: { open: '08:00', close: '22:00' },
          friday: { open: '08:00', close: '22:00' },
          saturday: { open: '08:00', close: '22:00' },
          sunday: { open: '08:00', close: '22:00' }
        },
        services: ['Corte Urbano', 'Fade Profesional', 'Barba Clásica', 'Diseños Creativos'],
        amenities: ['WiFi', 'Clima', 'Música Ambiental', 'Zona de Espera'],
        status: 'active',
        stats: {
          totalAppointments: 1567,
          monthlyRevenue: 64200,
          staffCount: 5,
          clientCount: 783
        },
        images: ['/images/branches/cali-1.jpg'],
        createdAt: new Date('2022-06-10'),
        updatedAt: new Date()
      },
      {
        id: 4,
        name: 'Barbería Norteña Trujillo',
        city: 'Trujillo',
        country: 'PE',
        address: 'Av. España 321, Trujillo',
        phone: '+51 44 567 890',
        email: 'trujillo@barberia.com',
        manager: 'María Fernández',
        managerPhone: '+51 903 456 789',
        coordinates: { lat: -8.1090, lng: -79.0215 },
        workingHours: {
          monday: { open: '08:00', close: '22:00' },
          tuesday: { open: '08:00', close: '22:00' },
          wednesday: { open: '08:00', close: '22:00' },
          thursday: { open: '08:00', close: '22:00' },
          friday: { open: '08:00', close: '22:00' },
          saturday: { open: '08:00', close: '22:00' },
          sunday: { open: '08:00', close: '22:00' }
        },
        services: ['Corte Tropical', 'Fade Caribeño', 'Barba Playera', 'Peinados Eventos'],
        amenities: ['WiFi', 'Ventilación Natural', 'Música Caribeña', 'Jugos Naturales'],
        status: 'active',
        stats: {
          totalAppointments: 1234,
          monthlyRevenue: 51600,
          staffCount: 4,
          clientCount: 617
        },
        images: ['/images/branches/barranquilla-1.jpg'],
        createdAt: new Date('2022-09-05'),
        updatedAt: new Date()
      },
      {
        id: 5,
        name: 'Barbería Colonial Cusco',
        city: 'Cusco',
        country: 'PE',
        address: 'Av. El Sol 654, Centro Histórico',
        phone: '+51 84 678 901',
        email: 'cusco@barberia.com',
        manager: 'Pedro Sánchez',
        managerPhone: '+51 904 567 890',
        coordinates: { lat: -13.5319, lng: -71.9675 },
        workingHours: {
          monday: { open: '08:00', close: '22:00' },
          tuesday: { open: '08:00', close: '22:00' },
          wednesday: { open: '08:00', close: '22:00' },
          thursday: { open: '08:00', close: '22:00' },
          friday: { open: '08:00', close: '22:00' },
          saturday: { open: '08:00', close: '22:00' },
          sunday: { open: '08:00', close: '22:00' }
        },
        services: ['Corte Colonial', 'Afeitado Tradicional', 'Barba Vintage', 'Servicios Premium'],
        amenities: ['Ambiente Colonial', 'WiFi', 'Vista al Mar', 'Música Clásica', 'Ron Cortesía'],
        status: 'active',
        stats: {
          totalAppointments: 987,
          monthlyRevenue: 56800,
          staffCount: 3,
          clientCount: 493
        },
        images: ['/images/branches/cartagena-1.jpg', '/images/branches/cartagena-2.jpg'],
        createdAt: new Date('2023-01-12'),
        updatedAt: new Date()
      },
      {
        id: 6,
        name: 'Barbería Elite Bogotá',
        city: 'Bogotá',
        country: 'CO',
        address: 'Carrera 13 #85-32, Chapinero',
        phone: '+57 1 234 5678',
        email: 'bogota@barberia.com',
        manager: 'Andrés Gómez',
        managerPhone: '+57 300 123 4567',
        coordinates: { lat: 4.6097, lng: -74.0817 },
        workingHours: {
          monday: { open: '08:00', close: '22:00' },
          tuesday: { open: '08:00', close: '22:00' },
          wednesday: { open: '08:00', close: '22:00' },
          thursday: { open: '08:00', close: '22:00' },
          friday: { open: '08:00', close: '22:00' },
          saturday: { open: '08:00', close: '22:00' },
          sunday: { open: '08:00', close: '22:00' }
        },
        services: ['Corte Colombiano', 'Fade Bogotano', 'Barba Cafetera', 'Diseños Urbanos'],
        amenities: ['WiFi', 'Café Colombiano', 'TV', 'Aire Acondicionado'],
        status: 'active',
        stats: {
          totalAppointments: 2100,
          monthlyRevenue: 85300,
          staffCount: 7,
          clientCount: 1050
        },
        images: ['/images/branches/bogota-1.jpg'],
        createdAt: new Date('2023-03-15'),
        updatedAt: new Date()
      },
      {
        id: 7,
        name: 'Barbería Santiago Premium',
        city: 'Santiago',
        country: 'CL',
        address: 'Av. Providencia 2500, Providencia',
        phone: '+56 2 2345 6789',
        email: 'santiago@barberia.com',
        manager: 'Felipe Rodríguez',
        managerPhone: '+56 9 8765 4321',
        coordinates: { lat: -33.4489, lng: -70.6693 },
        workingHours: {
          monday: { open: '08:00', close: '22:00' },
          tuesday: { open: '08:00', close: '22:00' },
          wednesday: { open: '08:00', close: '22:00' },
          thursday: { open: '08:00', close: '22:00' },
          friday: { open: '08:00', close: '22:00' },
          saturday: { open: '08:00', close: '22:00' },
          sunday: { open: '08:00', close: '22:00' }
        },
        services: ['Corte Chileno', 'Fade Andino', 'Barba Premium', 'Tratamientos'],
        amenities: ['WiFi', 'Vino Chileno', 'Calefacción', 'Revistas'],
        status: 'active',
        stats: {
          totalAppointments: 1890,
          monthlyRevenue: 78900,
          staffCount: 6,
          clientCount: 945
        },
        images: ['/images/branches/santiago-1.jpg'],
        createdAt: new Date('2023-05-20'),
        updatedAt: new Date()
      }
    ];

    set({ branches: mockBranches });
  },

  getBranchOperatingHours: (branchId, day) => {
    const { branches } = get();
    const branch = branches.find(b => b.id === branchId);
    
    if (!branch || !branch.workingHours[day]) {
      return null;
    }
    
    return branch.workingHours[day];
  },

  isBranchOpen: (branchId) => {
    const now = new Date();
    const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
    
    const hours = get().getBranchOperatingHours(branchId, currentDay);
    
    if (!hours || !hours.open || !hours.close) {
      return false;
    }
    
    return currentTime >= hours.open && currentTime <= hours.close;
  },

  getNearbyBranches: (lat, lng, radius = 10) => {
    const { branches } = get();
    
    const calculateDistance = (lat1, lng1, lat2, lng2) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };
    
    return branches
      .map(branch => ({
        ...branch,
        distance: calculateDistance(lat, lng, branch.coordinates.lat, branch.coordinates.lng)
      }))
      .filter(branch => branch.distance <= radius)
      .sort((a, b) => a.distance - b.distance);
  }
}));

export default useBranchStore;