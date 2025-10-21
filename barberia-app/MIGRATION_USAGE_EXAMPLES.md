# EJEMPLOS DE USO - STORES MIGRADOS

Esta guía muestra cómo usar los stores migrados a JSON Server API.

---

## 1. FINANCIAL STORE

### Cargar Transacciones (en componente)

```javascript
import { useEffect } from 'react';
import useFinancialStore from '../stores/financialStore';

function FinancialDashboard() {
  const {
    transactions,
    isLoading,
    error,
    loadTransactions,
    loadMockData
  } = useFinancialStore();

  useEffect(() => {
    // Cargar datos maestros (categorías, métodos de pago)
    loadMockData();

    // Cargar transacciones desde API
    loadTransactions();
  }, []);

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Transacciones ({transactions.length})</h2>
      {/* ... */}
    </div>
  );
}
```

### Crear Transacción

```javascript
import useFinancialStore from '../stores/financialStore';

function TransactionForm() {
  const { addTransaction, isLoading } = useFinancialStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await addTransaction({
      type: 'income',           // 'income' o 'expense'
      category: 'services',     // 'services', 'products', 'rent', etc.
      amount: 50,
      paymentMethod: 'cash',    // 'cash', 'card', 'transfer'
      description: 'Corte de cabello',
      branchId: 1,
      clientId: 1,              // Opcional, para agregar puntos automáticamente
      barberId: 1,              // Opcional
      appointmentId: 1          // Opcional
    });

    if (result.success) {
      console.log('Transacción creada:', result.transaction);
      // Si hay clientId, se agregaron puntos automáticamente
    } else {
      console.error('Error:', result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... campos del formulario ... */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
}
```

### Actualizar Transacción

```javascript
const { updateTransaction } = useFinancialStore();

const handleUpdate = async (transactionId) => {
  const result = await updateTransaction(transactionId, {
    amount: 60,
    description: 'Corte + barba'
  });

  if (result.success) {
    console.log('Actualizado:', result.transaction);
  }
};
```

### Eliminar Transacción

```javascript
const { deleteTransaction } = useFinancialStore();

const handleDelete = async (transactionId) => {
  const result = await deleteTransaction(transactionId);

  if (result.success) {
    console.log('Transacción eliminada');
  }
};
```

### Obtener Métricas

```javascript
const {
  metrics,
  getFinancialSummary,
  getChartData
} = useFinancialStore();

// Métricas automáticas (se calculan al cargar/modificar)
console.log('Ingresos mensuales:', metrics.monthlyIncome);
console.log('Gastos mensuales:', metrics.monthlyExpenses);
console.log('Ganancia neta:', metrics.monthlyProfit);

// Resumen completo
const summary = getFinancialSummary();
console.log('Crecimiento:', summary.incomeGrowth);

// Datos para gráfico
const chartData = getChartData('month'); // 'week', 'month', 'year'
```

---

## 2. LOYALTY STORE

### Cargar Datos (en componente)

```javascript
import { useEffect } from 'react';
import useLoyaltyStore from '../stores/loyaltyStore';

function LoyaltyDashboard() {
  const {
    rewards,
    pointsTransactions,
    clientRewards,
    isLoading,
    error,
    loadRewards,
    loadPointsTransactions,
    loadClientRewards
  } = useLoyaltyStore();

  useEffect(() => {
    // Cargar todos los datos
    loadRewards();
    loadPointsTransactions();
    loadClientRewards();
  }, []);

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Recompensas ({rewards.length})</h2>
      {/* ... */}
    </div>
  );
}
```

### Agregar Recompensa

```javascript
const { addReward } = useLoyaltyStore();

const handleCreateReward = async () => {
  const result = await addReward({
    name: 'Descuento 20%',
    description: 'Descuento del 20% en cualquier servicio',
    pointsCost: 500,
    discountType: 'percentage',  // 'percentage' o 'fixed'
    discountValue: 20,            // 20% o S/20
    validityDays: 30,
    category: 'discount',         // 'discount', 'service', 'vip', 'combo'
    maxUses: 1,
    applicableServices: [1, 2, 3], // IDs de servicios
    icon: '🎁',
    image: '/images/reward.png'
  });

  if (result.success) {
    console.log('Recompensa creada:', result.reward);
  }
};
```

### Agregar Puntos por Servicio

```javascript
const { addPointsForService } = useLoyaltyStore();

// Esto se hace automáticamente desde financialStore,
// pero también se puede llamar manualmente:
const pointsEarned = await addPointsForService(
  clientId,      // ID del cliente
  servicePrice,  // Precio del servicio (ej: 50)
  branchId,      // ID de la sucursal
  'service',     // Referencia opcional
  appointmentId  // ID de referencia opcional
);

console.log('Puntos ganados:', pointsEarned); // 50 puntos (si pointsPerSol = 1)
```

### Canjear Recompensa

```javascript
const { redeemReward, canRedeemReward } = useLoyaltyStore();

const handleRedeem = async (clientId, rewardId, branchId) => {
  // Verificar si tiene suficientes puntos
  const canRedeem = canRedeemReward(clientId, rewardId);

  if (!canRedeem) {
    alert('No tienes suficientes puntos');
    return;
  }

  try {
    const clientReward = await redeemReward(clientId, rewardId, branchId);
    console.log('Recompensa canjeada:', clientReward);
    console.log('Código de descuento:', clientReward.discountCode);

    // El clientReward contiene:
    // - id
    // - clientId
    // - rewardId
    // - redeemDate
    // - expiryDate
    // - status: 'active'
    // - discountCode: 'DESCUENTO20%-1-234'
  } catch (error) {
    console.error('Error al canjear:', error.message);
  }
};
```

### Usar Recompensa

```javascript
const { useReward } = useLoyaltyStore();

const handleUseReward = async (clientRewardId) => {
  const result = await useReward(clientRewardId);

  if (result.success) {
    console.log('Recompensa usada');
    // El status cambia de 'active' a 'used'
  }
};
```

### Obtener Puntos y Nivel del Cliente

```javascript
const {
  getClientPoints,
  getClientLevel,
  getClientActiveRewards,
  getClientTransactions
} = useLoyaltyStore();

// Puntos actuales
const points = getClientPoints(clientId);
console.log('Puntos:', points);

// Nivel de lealtad
const level = getClientLevel(clientId);
console.log('Nivel:', level.name); // 'Bronce', 'Plata', 'Oro', 'Platino'
console.log('Beneficios:', level.benefits);
// benefits: {
//   pointsMultiplier: 1.0,
//   discountPercentage: 0,
//   freeServicesPerMonth: 0,
//   priorityBooking: false,
//   birthdayBonus: 50
// }

// Recompensas activas (canjeadas pero no usadas)
const activeRewards = getClientActiveRewards(clientId);
activeRewards.forEach(cr => {
  console.log('Código:', cr.discountCode);
  console.log('Expira:', cr.expiryDate);
  console.log('Recompensa:', cr.reward.name);
});

// Historial de puntos
const transactions = getClientTransactions(clientId);
transactions.forEach(t => {
  console.log(`${t.date}: ${t.points} puntos - ${t.description}`);
});
```

### Agregar Bono de Bienvenida

```javascript
const { addWelcomeBonus } = useLoyaltyStore();

// Cuando se registra un nuevo cliente
const pointsAwarded = await addWelcomeBonus(clientId, branchId);
console.log('Bono de bienvenida:', pointsAwarded); // 50 puntos por defecto
```

---

## 3. REVIEW STORE

### Cargar Reviews (en componente)

```javascript
import { useEffect } from 'react';
import useReviewStore from '../stores/reviewStore';

function ReviewsPage() {
  const {
    reviews,
    isLoading,
    error,
    loadReviews
  } = useReviewStore();

  useEffect(() => {
    loadReviews();
  }, []);

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Reseñas ({reviews.length})</h2>
      {/* ... */}
    </div>
  );
}
```

### Agregar Review

```javascript
const { addReview } = useReviewStore();

const handleSubmitReview = async () => {
  const result = await addReview({
    barberId: 1,
    clientId: 1,
    clientName: 'Juan Pérez',
    appointmentId: 1,
    rating: 5,                    // 1-5 estrellas
    comment: 'Excelente servicio, muy profesional',
    serviceType: 'Corte Clásico'
  });

  if (result.success) {
    console.log('Review creada:', result.review);
  }
};
```

### Responder a Review

```javascript
const { addResponse } = useReviewStore();

const handleRespond = async (reviewId) => {
  const result = await addResponse(
    reviewId,
    'Gracias por tu comentario, nos alegra que hayas quedado satisfecho'
  );

  if (result.success) {
    console.log('Respuesta agregada');
  }
};
```

### Cambiar Visibilidad de Review

```javascript
const { toggleReviewVisibility } = useReviewStore();

const handleToggleVisibility = async (reviewId) => {
  const result = await toggleReviewVisibility(reviewId);

  if (result.success) {
    console.log('Visibilidad cambiada');
    // Si era pública, ahora es privada y viceversa
  }
};
```

### Eliminar Review

```javascript
const { deleteReview } = useReviewStore();

const handleDelete = async (reviewId) => {
  const result = await deleteReview(reviewId);

  if (result.success) {
    console.log('Review eliminada');
  }
};
```

### Obtener Estadísticas de Barbero

```javascript
const { getBarberStats } = useReviewStore();

const stats = getBarberStats(barberId);
console.log('Total de reseñas:', stats.totalReviews);
console.log('Rating promedio:', stats.averageRating); // 4.5
console.log('Distribución:', stats.ratingDistribution);
// ratingDistribution: {
//   5: 10,  // 10 reviews con 5 estrellas
//   4: 5,   // 5 reviews con 4 estrellas
//   3: 2,   // etc.
//   2: 1,
//   1: 0
// }
console.log('Reseñas recientes:', stats.recentReviews); // Últimas 5
```

### Filtrar Reviews

```javascript
const { getFilteredReviews } = useReviewStore();

// Filtrar reviews
const filtered = getFilteredReviews({
  barberId: 1,              // Opcional: solo de este barbero
  rating: 5,                // Opcional: solo 5 estrellas
  dateFrom: '2024-01-01',   // Opcional: desde esta fecha
  dateTo: '2024-12-31',     // Opcional: hasta esta fecha
  onlyPublic: true,         // Opcional: solo públicas
  serviceType: 'Corte Clásico' // Opcional: tipo de servicio
});

console.log('Reviews filtradas:', filtered.length);
```

### Verificar si Cita tiene Review

```javascript
const { hasReview, getReviewByAppointment } = useReviewStore();

// Verificar si existe
if (hasReview(appointmentId)) {
  console.log('Esta cita ya tiene review');

  // Obtener la review
  const review = getReviewByAppointment(appointmentId);
  console.log('Review:', review);
}
```

---

## FLUJOS COMPLETOS

### Flujo: Cliente completa servicio y gana puntos

```javascript
// 1. Crear transacción financiera
const financialStore = useFinancialStore.getState();
const result = await financialStore.addTransaction({
  type: 'income',
  category: 'services',
  amount: 50,
  paymentMethod: 'cash',
  description: 'Corte de cabello',
  branchId: 1,
  clientId: 1,  // ← Importante: con clientId se agregan puntos automáticamente
  barberId: 1,
  appointmentId: 1
});

// 2. Los puntos se agregaron automáticamente (integración interna)
const loyaltyStore = useLoyaltyStore.getState();
const points = loyaltyStore.getClientPoints(1);
console.log('Puntos del cliente:', points); // 50

// 3. Verificar nivel
const level = loyaltyStore.getClientLevel(1);
console.log('Nivel:', level.name); // 'Bronce', 'Plata', etc.
```

### Flujo: Cliente canjea y usa recompensa

```javascript
const loyaltyStore = useLoyaltyStore.getState();

// 1. Verificar puntos disponibles
const points = loyaltyStore.getClientPoints(clientId);
console.log('Puntos disponibles:', points);

// 2. Ver recompensas disponibles
const rewards = loyaltyStore.getAvailableRewards();
console.log('Recompensas:', rewards);

// 3. Canjear recompensa
const clientReward = await loyaltyStore.redeemReward(
  clientId,
  rewardId,
  branchId
);
console.log('Código de descuento:', clientReward.discountCode);

// 4. En el siguiente servicio, usar la recompensa
const activeRewards = loyaltyStore.getClientActiveRewards(clientId);
const rewardToUse = activeRewards[0];

// Aplicar descuento en el pago
const discount = rewardToUse.reward.discountValue;
console.log('Descuento:', discount);

// 5. Marcar como usada
await loyaltyStore.useReward(rewardToUse.id);
```

### Flujo: Cliente deja review después de cita

```javascript
const reviewStore = useReviewStore.getState();
const appointmentStore = useAppointmentStore.getState();

// 1. Obtener datos de la cita
const appointment = appointmentStore.getAppointmentById(appointmentId);

// 2. Verificar si ya tiene review
if (reviewStore.hasReview(appointmentId)) {
  alert('Ya dejaste una reseña para esta cita');
  return;
}

// 3. Crear review
const result = await reviewStore.addReview({
  barberId: appointment.barberId,
  clientId: appointment.clientId,
  clientName: appointment.clientName,
  appointmentId: appointment.id,
  rating: 5,
  comment: 'Excelente servicio',
  serviceType: appointment.services[0].name
});

// 4. El barbero ve su nueva estadística
const stats = reviewStore.getBarberStats(appointment.barberId);
console.log('Nuevo rating promedio:', stats.averageRating);
```

---

## ERRORES COMUNES Y SOLUCIONES

### Error: "Cannot read property 'map' of undefined"

**Causa**: Intentar renderizar datos antes de cargarlos

**Solución**:
```javascript
const { transactions, isLoading, loadTransactions } = useFinancialStore();

useEffect(() => {
  loadTransactions();
}, []);

// ✅ CORRECTO: Verificar antes de mapear
if (isLoading) return <div>Cargando...</div>;

return (
  <div>
    {transactions.map(t => (
      <div key={t.id}>{t.description}</div>
    ))}
  </div>
);
```

### Error: "No tienes suficientes puntos"

**Causa**: Intentar canjear sin suficientes puntos

**Solución**:
```javascript
const { canRedeemReward } = useLoyaltyStore();

// ✅ CORRECTO: Verificar antes de canjear
if (!canRedeemReward(clientId, rewardId)) {
  alert('No tienes suficientes puntos');
  return;
}

await redeemReward(clientId, rewardId, branchId);
```

### Error: "Review no encontrada"

**Causa**: Intentar modificar review inexistente

**Solución**:
```javascript
const { reviews } = useReviewStore();

// ✅ CORRECTO: Verificar existencia
const review = reviews.find(r => r.id === reviewId);
if (!review) {
  alert('Review no encontrada');
  return;
}

await addResponse(reviewId, response);
```

---

**Última actualización**: 8 de Octubre 2025
