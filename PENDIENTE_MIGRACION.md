# ⚠️ PENDIENTE DE MIGRACIÓN A JSON SERVER

## 📊 Resumen

Aunque los 8 stores principales están migrados, quedan **DATOS MAESTROS** que aún NO están en JSON Server:

---

## ❌ 1. **branchPricing** (Precios por Sucursal)

**Store:** `appointmentStore.js`
**Estado actual:** ❌ Solo localStorage (NO persiste en backend)

### Métodos que necesitan migración:
```javascript
// Línea 511-533 - appointmentStore.js
updateServicePrice: async (serviceId, branchId, newPrice) => {
  // ❌ Simula delay pero NO hace POST/PATCH
  await new Promise(resolve => setTimeout(resolve, 500));

  // ❌ Solo actualiza estado local
  set(state => ({
    branchPricing: {
      ...state.branchPricing,
      [branchId]: {
        ...state.branchPricing[branchId],
        [serviceId]: newPrice
      }
    }
  }));
}

// Línea 538-560
updateBranchPricing: async (branchId, pricingUpdates) => {
  // ❌ Mismo problema - solo localStorage
}
```

### ✅ Solución Requerida:
Crear endpoint en backend:
```
POST   /preciosSucursal     # Crear precio personalizado
PATCH  /preciosSucursal/:id # Actualizar precio
DELETE /preciosSucursal/:id # Eliminar precio personalizado
GET    /preciosSucursal?sucursalId=X&servicioId=Y
```

### Estructura sugerida en db.json:
```json
{
  "preciosSucursal": [
    {
      "id": 1,
      "sucursalId": 1,
      "servicioId": 1,
      "precio": 35,
      "activo": true,
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

---

## ❌ 2. **paymentMethods** (Métodos de Pago)

**Store:** `financialStore.js`
**Estado actual:** ❌ Carga desde `data.json` estático (NO desde JSON Server)

### Método que necesita migración:
```javascript
// Línea 337-356 - financialStore.js
loadMockData: async () => {
  try {
    // ❌ Carga desde archivo JSON estático
    const { paymentMethods, categories } = await getDataSections(['paymentMethods', 'categories']);

    set({
      paymentMethods: paymentMethods || [],
      categories: categories || { income: [], expense: [] }
    });
  }
}
```

### ✅ Solución Requerida:
Agregar endpoint en backend:
```
GET    /metodosPago     # Listar métodos de pago
POST   /metodosPago     # Crear método
PATCH  /metodosPago/:id # Actualizar método
DELETE /metodosPago/:id # Eliminar método
```

### Estructura sugerida en db.json:
```json
{
  "metodosPago": [
    { "id": "efectivo", "nombre": "Efectivo", "activo": true, "icono": "💵" },
    { "id": "tarjeta", "nombre": "Tarjeta", "activo": true, "icono": "💳" },
    { "id": "yape", "nombre": "Yape", "activo": true, "icono": "📱" },
    { "id": "plin", "nombre": "Plin", "activo": true, "icono": "📱" },
    { "id": "transferencia", "nombre": "Transferencia", "activo": true, "icono": "🏦" }
  ]
}
```

---

## ❌ 3. **categories** (Categorías de Ingresos/Gastos)

**Store:** `financialStore.js`
**Estado actual:** ❌ Carga desde `data.json` estático (NO desde JSON Server)

### Mismo problema que paymentMethods

### ✅ Solución Requerida:
Agregar endpoints en backend:
```
GET    /categoriasIngresos  # Categorías de ingresos
GET    /categoriasGastos    # Categorías de gastos
POST   /categoriasIngresos  # Crear categoría ingreso
POST   /categoriasGastos    # Crear categoría gasto
```

### Estructura sugerida en db.json:
```json
{
  "categoriasIngresos": [
    { "id": "services", "nombre": "Servicios", "icono": "✂️", "color": "#10b981" },
    { "id": "products", "nombre": "Productos", "icono": "🛍️", "color": "#3b82f6" },
    { "id": "tips", "nombre": "Propinas", "icono": "💰", "color": "#f59e0b" }
  ],
  "categoriasGastos": [
    { "id": "salaries", "nombre": "Salarios", "icono": "👥", "color": "#ef4444" },
    { "id": "supplies", "nombre": "Insumos", "icono": "📦", "color": "#8b5cf6" },
    { "id": "rent", "nombre": "Alquiler", "icono": "🏠", "color": "#ec4899" },
    { "id": "utilities", "nombre": "Servicios", "icono": "⚡", "color": "#f97316" }
  ]
}
```

---

## ❌ 4. **loyaltyLevels** (Niveles de Lealtad)

**Store:** `loyaltyStore.js`
**Estado actual:** ❌ Hardcoded en el store (líneas 23-84)

### Datos actualmente hardcoded:
```javascript
// Línea 23-84 - loyaltyStore.js
loyaltyLevels: [
  {
    id: 1,
    name: 'Bronce',
    color: '#CD7F32',
    minPoints: 0,
    maxPoints: 499,
    benefits: {
      pointsMultiplier: 1.0,
      discountPercentage: 0,
      freeServicesPerMonth: 0,
      priorityBooking: false,
      birthdayBonus: 50
    }
  },
  // ... Plata, Oro, Platino
]
```

### Métodos que necesitan migración:
```javascript
// Línea 661-687 - loyaltyStore.js
updateLoyaltyLevel: (levelId, levelData) => {
  // ❌ Solo actualiza estado local
}

addLoyaltyLevel: (levelData) => {
  // ❌ Solo actualiza estado local
}

deleteLoyaltyLevel: (levelId) => {
  // ❌ Solo actualiza estado local
}
```

### ✅ Solución Requerida:
Ya existe en db.json como `nivelesLealtad`, pero el store NO lo usa.

### Acción requerida:
1. Crear método `loadLoyaltyLevels()` que haga GET a `/nivelesLealtad`
2. Migrar métodos de actualización a usar API
3. Eliminar hardcode del store

---

## ❌ 5. **loyaltySettings** (Configuración de Lealtad)

**Store:** `loyaltyStore.js`
**Estado actual:** ❌ Hardcoded en el store (líneas 85-93)

### Datos actualmente hardcoded:
```javascript
// Línea 85-93 - loyaltyStore.js
settings: {
  pointsPerSol: 1,
  enabled: true,
  minimumPointsToRedeem: 50,
  pointsExpiryDays: 365,
  welcomeBonusPoints: 50,
  birthdayBonusPoints: 100,
  referralBonusPoints: 150
}
```

### Método que necesita migración:
```javascript
// Línea 692-696 - loyaltyStore.js
updateSettings: (newSettings) => {
  // ❌ Solo actualiza estado local
  set(state => ({
    settings: { ...state.settings, ...newSettings }
  }));
}
```

### ✅ Solución Requerida:
Ya existe en db.json como `puntosSettings`, pero el store NO lo usa.

### Acción requerida:
1. Crear método `loadLoyaltySettings()` que haga GET a `/puntosSettings`
2. Migrar método `updateSettings()` a usar PATCH `/puntosSettings/1`

---

## 📈 Impacto de NO migrar estos datos

### ⚠️ Problema 1: Pérdida de datos
- Si dos usuarios configuran precios por sucursal en diferentes navegadores, se sobrescriben
- Los cambios no se sincronizan entre sesiones

### ⚠️ Problema 2: No hay fuente única de verdad
- `branchPricing` existe solo en localStorage
- Si se borra localStorage, se pierden todos los precios personalizados

### ⚠️ Problema 3: No se puede gestionar centralmente
- No hay forma de que un super_admin vea/edite los precios de todas las sucursales
- Cada navegador tiene su propia copia

### ⚠️ Problema 4: Escalabilidad
- En producción, con backend real, estos datos DEBEN estar en base de datos
- La estructura actual no es compatible con multi-usuario real

---

## ✅ Plan de Acción Recomendado

### Prioridad Alta (Crítico):
1. ✅ **branchPricing** - Afecta cálculo de precios por sucursal
2. ✅ **paymentMethods** - Usado en transacciones financieras
3. ✅ **categories** - Usado en transacciones financieras

### Prioridad Media:
4. ⚠️ **loyaltyLevels** - Ya existe en db.json, solo falta conectar
5. ⚠️ **loyaltySettings** - Ya existe en db.json, solo falta conectar

---

## 🎯 Resumen

```
╔════════════════════════════════════════════════╗
║         DATOS MAESTROS NO MIGRADOS             ║
╠════════════════════════════════════════════════╣
║ 1. branchPricing      ❌ Solo localStorage     ║
║ 2. paymentMethods     ❌ JSON estático         ║
║ 3. categories         ❌ JSON estático         ║
║ 4. loyaltyLevels      ⚠️  Existe en db.json    ║
║ 5. loyaltySettings    ⚠️  Existe en db.json    ║
╚════════════════════════════════════════════════╝

STORES PRINCIPALES:     8/8  ✅ Migrados
DATOS MAESTROS:         0/5  ❌ Sin migrar
CRUD TRANSACCIONAL:     100% ✅ Completo
```

---

## 🚀 Siguiente Paso

¿Quieres que te ayude a migrar estos 5 datos maestros ahora?

El orden sugerido es:
1. **paymentMethods + categories** (financialStore)
2. **branchPricing** (appointmentStore)
3. **loyaltyLevels + loyaltySettings** (loyaltyStore)

---

**Fecha:** 09 de Octubre 2025
**Estado:** IDENTIFICADO - Pendiente de migración
