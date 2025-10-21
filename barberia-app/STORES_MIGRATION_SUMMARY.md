# RESUMEN DE MIGRACIÓN DE STORES A JSON SERVER

## Stores Migrados (3)

### 1. financialStore.js (428 líneas)
**API Usada**: `transaccionesApi`

**Cambios Principales**:
- ✅ Eliminado hardcode de transacciones mock
- ✅ Agregado método `loadTransactions()` para cargar desde API
- ✅ `addTransaction()` ahora hace POST a `/transacciones`
- ✅ `updateTransaction()` ahora hace PATCH a `/transacciones/:id`
- ✅ `deleteTransaction()` ahora hace DELETE a `/transacciones/:id`
- ✅ Agregado persist middleware
- ✅ Integración con loyaltyStore mantenida (puntos automáticos)

**Mapeo Español ↔ Inglés**:
```javascript
Frontend (inglés)    →  Backend (español)
---------------------------------------------
type                 →  tipo
category             →  categoria
amount               →  monto
paymentMethod        →  metodoPago
description          →  descripcion
branchId             →  sucursalId
clientId             →  clienteId
barberId             →  barberoId
appointmentId        →  citaId
date                 →  fecha
```

**Lógica Local Mantenida**:
- ✅ `calculateMetrics()` - Cálculo de métricas financieras
- ✅ `getTransactionsByPeriod()` - Filtrado por período
- ✅ `getTransactionsByBranch()` - Filtrado por sucursal
- ✅ `getTransactionsByCategory()` - Filtrado por categoría
- ✅ `getChartData()` - Generación de datos para gráficos
- ✅ `getFinancialSummary()` - Resumen financiero completo

**Nuevos Métodos**:
- `loadTransactions()` - Cargar desde API

**Métodos Eliminados**:
- `loadMockTransactions()` - Ya no es necesario (mock)

---

### 2. loyaltyStore.js (722 líneas)
**APIs Usadas**:
- `recompensasApi`
- `transaccionesPuntosApi`
- `recompensasClienteApi`

**Cambios Principales**:
- ✅ Eliminado import de `mockData`
- ✅ Agregado método `loadRewards()` para cargar recompensas desde API
- ✅ Agregado método `loadPointsTransactions()` para cargar transacciones de puntos
- ✅ Agregado método `loadClientRewards()` para cargar recompensas de clientes
- ✅ `addReward()` ahora hace POST a `/recompensas`
- ✅ `updateReward()` ahora hace PATCH a `/recompensas/:id`
- ✅ `deleteReward()` ahora hace soft delete (PATCH activo=false)
- ✅ `addPointsForService()` ahora hace POST a `/transaccionesPuntos`
- ✅ `redeemReward()` ahora hace POST doble: `/recompensasCliente` + `/transaccionesPuntos`
- ✅ `useReward()` ahora hace PATCH a `/recompensasCliente/:id`
- ✅ `addWelcomeBonus()` ahora hace POST a `/transaccionesPuntos`
- ✅ Persist middleware ya existente (mantenido)

**Mapeo Español ↔ Inglés - Recompensas**:
```javascript
Frontend (inglés)       →  Backend (español)
-----------------------------------------------
name                    →  nombre
description             →  descripcion
pointsCost              →  costoEnPuntos
discountType            →  tipoDescuento
discountValue           →  valorDescuento
validityDays            →  diasValidez
category                →  categoria
isActive                →  activo
maxUses                 →  usosMaximos
applicableServices      →  serviciosAplicables
icon                    →  icono
image                   →  imagen
```

**Mapeo Español ↔ Inglés - Transacciones de Puntos**:
```javascript
Frontend (inglés)    →  Backend (español)
---------------------------------------------
clientId             →  clienteId (igual)
type                 →  tipo
points               →  puntos
description          →  descripcion
reference            →  referencia
referenceId          →  referenciaId
date                 →  fecha
branchId             →  sucursalId
rewardId             →  recompensaId
```

**Mapeo Español ↔ Inglés - Recompensas de Cliente**:
```javascript
Frontend (inglés)    →  Backend (español)
---------------------------------------------
clientId             →  clienteId (igual)
rewardId             →  recompensaId
redeemDate           →  fechaCanje
expiryDate           →  fechaExpiracion
status               →  estado
usedDate             →  fechaUso
branchId             →  sucursalId
discountCode         →  codigoDescuento
```

**Lógica Local Mantenida**:
- ✅ `getAvailableRewards()` - Filtrado de recompensas activas
- ✅ `getRewardsByCategory()` - Filtrado por categoría
- ✅ `getClientPoints()` - Cálculo de puntos del cliente
- ✅ `getClientTransactions()` - Historial de transacciones
- ✅ `getClientActiveRewards()` - Recompensas activas del cliente
- ✅ `canRedeemReward()` - Verificación de puntos suficientes
- ✅ `getClientLevel()` - Cálculo de nivel de lealtad
- ✅ `getPointsStats()` - Estadísticas de puntos
- ✅ `getTopClientsByPoints()` - Top clientes por puntos
- ✅ `getClientsByLevel()` - Agrupación por nivel
- ✅ `updateLoyaltyLevel()` - Gestión de niveles (local)
- ✅ `addLoyaltyLevel()` - Agregar nivel (local)
- ✅ `deleteLoyaltyLevel()` - Eliminar nivel (local)
- ✅ `updateSettings()` - Configuración (local)

**Nuevos Métodos**:
- `loadRewards()` - Cargar recompensas desde API
- `loadPointsTransactions()` - Cargar transacciones de puntos
- `loadClientRewards()` - Cargar recompensas de clientes

**Métodos Eliminados**:
- `initializeMockData()` - Ya no es necesario (mock)

---

### 3. reviewStore.js (356 líneas)
**API Usada**: `reviewsApi`

**Cambios Principales**:
- ✅ Eliminado hardcode de reviews mock (array de 8 elementos)
- ✅ Agregado método `loadReviews()` para cargar desde API
- ✅ `addReview()` ahora hace POST a `/reviews`
- ✅ `addResponse()` ahora hace PATCH a `/reviews/:id`
- ✅ `toggleReviewVisibility()` ahora hace PATCH a `/reviews/:id`
- ✅ Agregado método `deleteReview()` con DELETE a `/reviews/:id`
- ✅ Persist middleware ya existente (mantenido)
- ✅ Estado de loading y error agregados

**Mapeo Español ↔ Inglés**:
```javascript
Frontend (inglés)    →  Backend (español)
---------------------------------------------
barberId             →  barberoId
clientId             →  clienteId (igual)
clientName           →  nombreCliente
appointmentId        →  citaId
rating               →  calificacion
comment              →  comentario
serviceType          →  tipoServicio
date                 →  fecha
isPublic             →  esPublico
response             →  respuesta
responseDate         →  fechaRespuesta
```

**Lógica Local Mantenida**:
- ✅ `getReviewsByBarber()` - Filtrado por barbero
- ✅ `getBarberStats()` - Estadísticas de barbero (rating promedio, distribución)
- ✅ `getFilteredReviews()` - Filtrado múltiple (barbero, rating, fecha, tipo)
- ✅ `getOverallStats()` - Estadísticas generales (tendencias)
- ✅ `getReviewsByClient()` - Filtrado por cliente
- ✅ `getReviewByAppointment()` - Obtener review de una cita
- ✅ `hasReview()` - Verificar si cita tiene review

**Nuevos Métodos**:
- `loadReviews()` - Cargar desde API
- `deleteReview()` - Eliminar review (antes no existía)

---

## Patrón de Migración Aplicado

### 1. Estructura Común
Todos los stores migrados siguen el mismo patrón:

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiResource } from '../services/api';

const useStore = create(
  persist(
    (set, get) => ({
      // Estado
      items: [],
      isLoading: false,
      error: null,

      // Métodos de carga desde API
      loadItems: async () => { /* GET */ },

      // Métodos CRUD con API
      addItem: async (data) => { /* POST */ },
      updateItem: async (id, updates) => { /* PATCH */ },
      deleteItem: async (id) => { /* DELETE */ },

      // Métodos de consulta local
      getFilteredItems: (filters) => { /* local */ }
    }),
    {
      name: 'store-name',
      partialize: (state) => ({ items: state.items })
    }
  )
);
```

### 2. Mapeo Bidireccional
Cada método que interactúa con la API realiza mapeo en ambas direcciones:

```javascript
// Al enviar datos
const backendData = {
  nombreBackend: frontendData.nameFrontend,
  // ...
};
await api.create(backendData);

// Al recibir datos
const frontendData = backendData.map(item => ({
  nameFrontend: item.nombreBackend,
  // ...
}));
```

### 3. Separación de Responsabilidades
- **API calls**: Métodos async que hacen fetch
- **Estado local**: Actualizaciones inmediatas del state
- **Lógica de negocio**: Cálculos, filtros, agregaciones (local)
- **Persistencia**: Middleware persist para cache

### 4. Manejo de Errores
Todos los métodos async incluyen try-catch:

```javascript
async method() {
  set({ isLoading: true, error: null });
  try {
    const data = await api.operation();
    set({ data, isLoading: false });
    return { success: true, data };
  } catch (error) {
    set({ isLoading: false, error: error.message });
    return { success: false, error: error.message };
  }
}
```

---

## Integración entre Stores Mantenida

### financialStore ↔ loyaltyStore
Cuando se crea una transacción de tipo "income" con categoría "services" y clientId:
```javascript
// En financialStore.addTransaction()
if (newTransaction.type === 'income' &&
    newTransaction.category === 'services' &&
    newTransaction.clientId) {
  const loyaltyStore = useLoyaltyStore.getState();
  loyaltyStore.addPointsForService(
    newTransaction.clientId,
    newTransaction.amount,
    newTransaction.branchId,
    'service_payment',
    newTransaction.id
  );
}
```

---

## Testing Recomendado

### 1. financialStore
```javascript
// Cargar transacciones
await financialStore.loadTransactions();

// Crear transacción
await financialStore.addTransaction({
  type: 'income',
  category: 'services',
  amount: 50,
  paymentMethod: 'cash',
  description: 'Corte de cabello',
  branchId: 1,
  clientId: 1
});

// Verificar que se crearon puntos automáticamente
const points = loyaltyStore.getClientPoints(1); // Debería ser 50
```

### 2. loyaltyStore
```javascript
// Cargar datos
await loyaltyStore.loadRewards();
await loyaltyStore.loadPointsTransactions();
await loyaltyStore.loadClientRewards();

// Agregar puntos
await loyaltyStore.addPointsForService(1, 100, 1);

// Canjear recompensa
await loyaltyStore.redeemReward(1, 1, 1);

// Usar recompensa
await loyaltyStore.useReward(rewardId);
```

### 3. reviewStore
```javascript
// Cargar reviews
await reviewStore.loadReviews();

// Agregar review
await reviewStore.addReview({
  barberId: 1,
  clientId: 1,
  clientName: 'Juan Cliente',
  appointmentId: 1,
  rating: 5,
  comment: 'Excelente servicio',
  serviceType: 'Corte Clásico'
});

// Responder review
await reviewStore.addResponse(reviewId, 'Gracias por tu comentario');
```

---

## Próximos Pasos

1. **Actualizar componentes** que usan estos stores:
   - Cambiar de métodos mock a métodos API
   - Agregar llamadas a `loadX()` en `useEffect`
   - Manejar estados de `isLoading` y `error`

2. **Verificar integración** con otros stores:
   - financialStore → loyaltyStore (puntos automáticos)
   - appointmentStore → reviewStore (reviews de citas)
   - clientStore → loyaltyStore (niveles, puntos)

3. **Testing end-to-end**:
   - Crear transacción → verificar puntos
   - Canjear recompensa → verificar descuento
   - Crear review → verificar estadísticas

---

## Resumen de Archivos Modificados

```
barberia-app/src/stores/
├── financialStore.js    (428 líneas) ✅ MIGRADO
├── loyaltyStore.js      (722 líneas) ✅ MIGRADO
└── reviewStore.js       (356 líneas) ✅ MIGRADO
```

**Total**: 1,506 líneas de código migradas a JSON Server API

---

**Fecha de migración**: 8 de Octubre 2025
**Migrado por**: Claude
**Estado**: ✅ COMPLETO
