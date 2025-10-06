/**
 * TODO REFACTOR - STORES ARCHITECTURE (Prioridad: ALTA)
 * 
 * PROBLEMAS IDENTIFICADOS:
 * 1. 📊 DATA MIXING: Mock data mezclada con lógica de store
 * 2. 🔄 NO NORMALIZATION: Datos duplicados entre stores
 * 3. 📝 NO TYPESCRIPT: Sin tipado, propenso a errores
 * 4. 🧪 NO TESTING: Stores sin unit tests
 * 
 * PLAN DE REFACTOR:
 * - Crear src/data/ folder con JSON files
 * - Implementar DataService layer
 * - Agregar TypeScript interfaces
 * - Normalizar data relationships (appointments <-> clients <-> staff)
 * - Agregar unit tests para cada store
 * 
 * STORES AFECTADOS:
 * - authStore.js ← Contraseñas en texto plano 🚨
 * - appointmentStore.js ← Sin mock data aún ⚠️
 * - financialStore.js ← Sin mock data aún ⚠️
 * - staffStore.js ← Sin mock data aún ⚠️
 * - clientStore.js ← Sin mock data aún ⚠️
 * - branchStore.js ← Sin mock data aún ⚠️
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