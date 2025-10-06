/**
 * SERVICIO DE DEMO/SIMULACIÓN
 * 
 * Este servicio maneja toda la funcionalidad de simulación del sistema de vouchers falsos.
 * Mantiene los datos de demo completamente separados de la lógica principal para evitar
 * contaminación del código de producción.
 * 
 * CARACTERÍSTICAS:
 * - Todos los IDs de demo tienen prefijo "DEMO_" para fácil identificación
 * - Datos de prueba realistas con diferentes estados de seguridad
 * - Fácil activación/desactivación sin dejar rastros
 * - No requiere cambios en los stores principales
 */

export const DemoService = {
  /**
   * Verifica si el modo demo está activo
   * @returns {boolean} true si está en modo demo
   */
  isDemoMode: () => {
    return localStorage.getItem('demoMode') === 'true';
  },

  /**
   * Activa o desactiva el modo demo
   * @returns {boolean} nuevo estado del modo demo
   */
  toggleDemoMode: () => {
    const current = localStorage.getItem('demoMode') === 'true';
    localStorage.setItem('demoMode', !current ? 'true' : 'false');
    return !current;
  },

  /**
   * Genera los escenarios de prueba con diferentes tipos de clientes
   * 
   * ESCENARIOS:
   * 1. normalClient: Cliente sin historial de problemas
   * 2. warningClient: Cliente con 1 voucher falso (advertencia)
   * 3. flaggedClient: Cliente con 2 vouchers falsos (marcado con bandera)
   * 4. blockedClient: Cliente con 3+ vouchers falsos (bloqueado)
   * 
   * @returns {Object} Objeto con los 4 escenarios de clientes
   */
  generateDemoScenarios: () => {
    return {
      // ESCENARIO 1: Cliente sin problemas - Representa un cliente confiable
      normalClient: {
        id: 'DEMO_CLIENT_1',
        name: 'DEMO - María García',
        email: 'demo.maria@test.com',
        phone: '+51 900 000 001',
        securityFlags: {
          falseVouchersCount: 0,
          rejectedPaymentsCount: 0,
          isFlagged: false,
          blacklisted: false
        },
        paymentHistory: [],
        loyaltyPoints: 100,
        totalVisits: 5,
        totalSpent: 200,
        status: 'active'
      },

      // ESCENARIO 2: Cliente con advertencia - 1 intento de fraude registrado
      // Este cliente aparecerá con indicadores visuales pero aún puede hacer citas
      warningClient: {
        id: 'DEMO_CLIENT_2',
        name: 'DEMO - Carlos Sospechoso',
        email: 'demo.carlos@test.com',
        phone: '+51 900 000 002',
        securityFlags: {
          falseVouchersCount: 1,
          rejectedPaymentsCount: 1,
          lastRejectionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          isFlagged: false,
          blacklisted: false
        },
        paymentHistory: [
          {
            id: 'DEMO_REJECTION_1',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            reason: 'Voucher editado - número no coincide',
            voucherNumber: '123456',
            amount: 40,
            paymentMethod: 'yape',
            verifiedBy: 'Ana Administradora'
          }
        ],
        loyaltyPoints: 50,
        totalVisits: 3,
        totalSpent: 120,
        status: 'active'
      },

      // ESCENARIO 3: Cliente marcado - 2 intentos de fraude
      // Aparece con bandera roja de alerta ⚠️ en todas las interfaces
      flaggedClient: {
        id: 'DEMO_CLIENT_3',
        name: 'DEMO - Pedro Marcado',
        email: 'demo.pedro@test.com',
        phone: '+51 900 000 003',
        securityFlags: {
          falseVouchersCount: 2,
          rejectedPaymentsCount: 2,
          lastRejectionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          isFlagged: true,
          flagReason: 'Cliente con 2 vouchers falsos',
          blacklisted: false
        },
        paymentHistory: [
          {
            id: 'DEMO_REJECTION_2',
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            reason: 'Voucher falso - operación no existe',
            voucherNumber: '789012',
            amount: 35,
            paymentMethod: 'plin',
            verifiedBy: 'Carlos Administrador'
          },
          {
            id: 'DEMO_REJECTION_3',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            reason: 'Imagen editada digitalmente',
            voucherNumber: '345678',
            amount: 40,
            paymentMethod: 'yape',
            verifiedBy: 'Ana Administradora'
          }
        ],
        loyaltyPoints: 0,
        totalVisits: 2,
        totalSpent: 0,
        status: 'active'
      },

      // ESCENARIO 4: Cliente bloqueado - 3+ intentos de fraude
      // Este cliente no puede hacer nuevas citas hasta que un admin lo reactive
      blockedClient: {
        id: 'DEMO_CLIENT_4',
        name: 'DEMO - Luis Bloqueado',
        email: 'demo.luis@test.com',
        phone: '+51 900 000 004',
        securityFlags: {
          falseVouchersCount: 3,
          rejectedPaymentsCount: 3,
          lastRejectionDate: new Date().toISOString(),
          isFlagged: true,
          flagReason: 'Cliente con 3 vouchers falsos',
          blacklisted: true
        },
        paymentHistory: [
          {
            id: 'DEMO_REJECTION_4',
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            reason: 'Voucher falsificado',
            voucherNumber: '111111',
            amount: 40,
            paymentMethod: 'transferencia',
            verifiedBy: 'Carlos Administrador'
          },
          {
            id: 'DEMO_REJECTION_5',
            date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            reason: 'Número de operación no válido',
            voucherNumber: '222222',
            amount: 35,
            paymentMethod: 'yape',
            verifiedBy: 'Ana Administradora'
          },
          {
            id: 'DEMO_REJECTION_6',
            date: new Date().toISOString(),
            reason: 'Voucher falso - monto no coincide',
            voucherNumber: '333333',
            amount: 45,
            paymentMethod: 'plin',
            verifiedBy: 'Carlos Administrador'
          }
        ],
        loyaltyPoints: 0,
        totalVisits: 0,
        totalSpent: 0,
        status: 'blacklisted'
      }
    };
  },

  /**
   * Genera citas de demo con pagos pendientes de verificación
   * 
   * Cada cita está asociada a un cliente demo diferente para mostrar
   * cómo el sistema maneja las alertas de seguridad durante la verificación
   * 
   * @returns {Array} Array de 3 citas con diferentes niveles de riesgo
   */
  generateDemoAppointments: () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return [
      // CITA 1: Cliente normal - Sin alertas de seguridad
      // Simula una verificación de rutina sin problemas
      {
        id: 'DEMO_APT_1',
        clientId: 'DEMO_CLIENT_1',
        clientName: 'DEMO - María García',
        barberId: 1,
        barberName: 'Miguel Rodríguez',
        branchId: 1,
        date: tomorrow.toISOString().split('T')[0],
        time: '10:00',
        services: [1],
        totalPrice: 40,
        duration: 30,
        status: 'pending_payment',
        paymentMethod: 'yape',
        voucherNumber: '987654',
        voucherUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        notes: 'Cliente regular - sin problemas anteriores'
      },

      // CITA 2: Cliente sospechoso - Mostrará alerta amarilla
      // Al verificar aparecerá historial de 1 voucher falso previo
      {
        id: 'DEMO_APT_2',
        clientId: 'DEMO_CLIENT_2',
        clientName: 'DEMO - Carlos Sospechoso',
        barberId: 2,
        barberName: 'Luis Martínez',
        branchId: 1,
        date: tomorrow.toISOString().split('T')[0],
        time: '11:00',
        services: [2],
        totalPrice: 35,
        duration: 30,
        status: 'pending_payment',
        paymentMethod: 'plin',
        voucherNumber: '456789',
        voucherUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        notes: 'ALERTA: 1 voucher falso previo'
      },

      // CITA 3: Cliente marcado - Mostrará alerta roja de alta prioridad
      // Al verificar aparecerá con 2 vouchers falsos y advertencia prominente
      {
        id: 'DEMO_APT_3',
        clientId: 'DEMO_CLIENT_3',
        clientName: 'DEMO - Pedro Marcado',
        barberId: 1,
        barberName: 'Miguel Rodríguez',
        branchId: 1,
        date: tomorrow.toISOString().split('T')[0],
        time: '14:00',
        services: [1, 3],
        totalPrice: 60,
        duration: 45,
        status: 'pending_payment',
        paymentMethod: 'transferencia',
        voucherNumber: '789456',
        voucherUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        notes: 'ALERTA: Cliente marcado - 2 vouchers falsos'
      },

      // CITA 4: Cliente normal con pago en efectivo - Confirmada directamente
      {
        id: 'DEMO_APT_4',
        clientId: 'DEMO_CLIENT_1',
        clientName: 'DEMO - María García',
        barberId: 2,
        barberName: 'Luis Martínez',
        branchId: 1,
        date: tomorrow.toISOString().split('T')[0],
        time: '16:00',
        services: [2],
        totalPrice: 35,
        duration: 30,
        status: 'confirmed',
        paymentMethod: 'efectivo',
        voucherNumber: null,
        voucherUrl: null,
        notes: 'Pago en efectivo - Confirmada automáticamente'
      }
    ];
  },

  /**
   * Limpia todos los datos de demo de los stores
   * 
   * Filtra y elimina cualquier registro que tenga el prefijo "DEMO_"
   * No afecta a los datos reales del sistema
   * 
   * @param {Object} clientStore - Store de clientes
   * @param {Object} appointmentStore - Store de citas
   */
  cleanDemoData: (clientStore, appointmentStore) => {
    // Remover clientes de demo
    const nonDemoClients = clientStore.clients.filter(c => !c.id.startsWith('DEMO_'));
    clientStore.setClients(nonDemoClients);

    // Remover citas de demo
    const nonDemoAppointments = appointmentStore.appointments.filter(a => !a.id.startsWith('DEMO_'));
    appointmentStore.setAppointments(nonDemoAppointments);
  },

  /**
   * Inyecta los datos de demo en los stores
   * 
   * PROCESO:
   * 1. Primero limpia cualquier dato demo existente
   * 2. Genera nuevos escenarios y citas
   * 3. Los agrega a los stores junto con los datos reales
   * 4. Retorna estadísticas de lo que se creó
   * 
   * @param {Object} clientStore - Store de clientes
   * @param {Object} appointmentStore - Store de citas
   * @returns {Object} Estadísticas de datos creados
   */
  injectDemoData: (clientStore, appointmentStore) => {
    const scenarios = DemoService.generateDemoScenarios();
    const demoAppointments = DemoService.generateDemoAppointments();

    // Primero limpiar datos de demo existentes
    DemoService.cleanDemoData(clientStore, appointmentStore);

    // Agregar clientes de demo
    const currentClients = clientStore.clients;
    const newClients = [
      ...currentClients,
      scenarios.normalClient,
      scenarios.warningClient,
      scenarios.flaggedClient,
      scenarios.blockedClient
    ];
    clientStore.setClients(newClients);

    // Agregar citas de demo
    const currentAppointments = appointmentStore.appointments;
    const newAppointments = [...currentAppointments, ...demoAppointments];
    appointmentStore.setAppointments(newAppointments);

    return {
      clients: 4,
      appointments: demoAppointments.length
    };
  }
};