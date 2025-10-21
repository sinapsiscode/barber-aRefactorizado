/**
 * ✅ STORES MIGRADOS A JSON SERVER - COMPLETADO
 *
 * Estado de migración:
 * ✅ authStore.js         → Migrado (usa authApi del backend)
 * ✅ clientStore.js       → Migrado (clientesApiExtended)
 * ✅ branchStore.js       → Migrado (sucursalesApi)
 * ✅ staffStore.js        → Migrado (barberosApi + asistenciasApi)
 * ✅ appointmentStore.js  → Migrado (citasApi + serviciosApi)
 * ✅ financialStore.js    → Migrado (transaccionesApi)
 * ✅ loyaltyStore.js      → Migrado (recompensasApi + transaccionesPuntosApi + recompensasClienteApi)
 * ✅ reviewStore.js       → Migrado (reviewsApi)
 * ℹ️  backgroundStore.js  → Local (no requiere API)
 *
 * Características implementadas:
 * - ✅ CRUD completo contra JSON Server
 * - ✅ Mapeo bidireccional español (backend) ↔ inglés (frontend)
 * - ✅ Persist middleware en todos los stores
 * - ✅ Manejo de errores robusto
 * - ✅ Estados de loading
 * - ✅ Lógica de negocio mantenida localmente
 * - ✅ Integración entre stores preservada
 *
 * Total eliminado:
 * - ~800 líneas de hardcode de servicios
 * - ~445 líneas de hardcode de sucursales
 * - ~300 líneas de hardcode de mock data
 *
 * Próximos pasos recomendados:
 * - [ ] Agregar React Query para caching inteligente
 * - [ ] Implementar TypeScript interfaces
 * - [ ] Agregar unit tests
 * - [ ] Implementar optimistic updates
 */

export { default as useAuthStore } from './authStore';
export { default as useAppointmentStore } from './appointmentStore';
export { default as useFinancialStore } from './financialStore';
export { default as useStaffStore } from './staffStore';
export { default as useClientStore } from './clientStore';
export { default as useBranchStore } from './branchStore';
export { default as useBackgroundStore } from './backgroundStore';
export { default as useLoyaltyStore } from './loyaltyStore';
export { default as useReviewStore } from './reviewStore';