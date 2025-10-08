# 📦 JSON Server - Guía de Implementación Completa

## ✅ Instalación Completada

Se ha configurado **JSON Server** de forma profesional en tu proyecto de barbería.

---

## 📁 Archivos Creados

### 1. **db.json** (Base de datos)
- ✅ Base de datos unificada con toda la data
- ✅ Incluye: users, clients, branches, barbers, services, appointments, etc.
- ✅ Ubicación: raíz del proyecto

### 2. **src/services/api.js** (Capa de API)
- ✅ Servicios centralizados para todas las entidades
- ✅ CRUD completo con métodos extendidos
- ✅ Manejo de errores robusto
- ✅ Filtros avanzados (por branch, por date, por status, etc.)

### 3. **src/stores/clientStore_refactored.js** (Ejemplo refactorizado)
- ✅ Store que usa API real en lugar de mocks
- ✅ Sincronización con json-server
- ✅ Mantiene lógica de negocio local
- ✅ Usa como referencia para refactorizar los otros stores

### 4. **.env** (Variables de entorno)
- ✅ Configuración de API URL
- ✅ Puerto configurable (3001)

### 5. **json-server.json** (Configuración)
- ✅ Puerto: 3001
- ✅ Delay: 500ms (simula latencia real)
- ✅ Static files: ./public

---

## 🚀 Cómo Usar

### Iniciar el proyecto completo:
```bash
npm run dev
```

Esto inicia **simultáneamente**:
- ✅ **Vite** (Frontend) en `http://localhost:5173`
- ✅ **JSON Server** (Backend) en `http://localhost:3001`

### Scripts disponibles:
```bash
npm run client  # Solo frontend (Vite)
npm run server  # Solo backend (JSON Server)
npm run dev     # Ambos en paralelo ⭐
npm start       # Alias de npm run dev
```

---

## 🎯 Endpoints Disponibles

JSON Server genera automáticamente endpoints REST para cada colección:

### Usuarios
```
GET    /users              # Listar todos
GET    /users/:id          # Obtener por ID
POST   /users              # Crear
PUT    /users/:id          # Actualizar completo
PATCH  /users/:id          # Actualizar parcial
DELETE /users/:id          # Eliminar
```

### Clientes
```
GET    /clients
GET    /clients/:id
GET    /clients?status=active
GET    /clients?preferredBranch=1
GET    /clients?name_like=Juan
POST   /clients
PATCH  /clients/:id
DELETE /clients/:id
```

### Barberos
```
GET    /barbers
GET    /barbers?branchId=1
GET    /barbers?status=active
POST   /barbers
PATCH  /barbers/:id
```

### Citas
```
GET    /appointments
GET    /appointments?barberId=1
GET    /appointments?clientId=3
GET    /appointments?date=2025-08-09
GET    /appointments?status=confirmed
POST   /appointments
PATCH  /appointments/:id
DELETE /appointments/:id
```

### Otros recursos:
- `/branches`
- `/services`
- `/loyaltyRewards`
- `/pointsTransactions`
- `/clientRewards`
- `/portfolio`
- `/transactions`
- `/attendance`

---

## 🔍 Características Avanzadas de JSON Server

### 1. **Filtros**
```
GET /clients?status=active
GET /barbers?branchId=1&status=active
```

### 2. **Búsqueda Full-text**
```
GET /clients?q=Juan
```

### 3. **Búsqueda parcial**
```
GET /clients?name_like=Juan
GET /clients?email_like=@gmail
```

### 4. **Paginación**
```
GET /clients?_page=1&_limit=10
```

### 5. **Ordenamiento**
```
GET /clients?_sort=name&_order=asc
GET /clients?_sort=totalSpent&_order=desc
```

### 6. **Relaciones**
```
GET /appointments?_expand=client
GET /barbers?_expand=branch
```

### 7. **Operadores**
```
GET /clients?totalSpent_gte=1000  # Mayor o igual
GET /clients?totalSpent_lte=500   # Menor o igual
GET /appointments?date_gte=2025-08-01&date_lte=2025-08-31
```

---

## 💡 Cómo Usar la API en tu Código

### Ejemplo básico:
```javascript
import { clientsApiExtended } from './services/api';

// Obtener todos los clientes
const clients = await clientsApiExtended.getAll();

// Obtener clientes activos
const activeClients = await clientsApiExtended.getActive();

// Obtener clientes de una sucursal
const branchClients = await clientsApiExtended.getByBranch(1);

// Crear cliente
const newClient = await clientsApiExtended.create({
  name: 'Juan Pérez',
  email: 'juan@email.com',
  phone: '+51 999 888 777'
});

// Actualizar cliente (parcial)
await clientsApiExtended.patch(clientId, {
  loyaltyPoints: 150
});

// Eliminar cliente
await clientsApiExtended.delete(clientId);
```

### Ejemplo con manejo de errores:
```javascript
import api from './services/api';

try {
  const clients = await api.clients.getAll();
  console.log('✅ Clientes cargados:', clients);
} catch (error) {
  console.error('❌ Error:', error.message);
  if (error.status === 404) {
    // Manejar no encontrado
  } else if (error.status === 0) {
    // Error de conexión
    console.error('Servidor no disponible');
  }
}
```

---

## 📝 Refactorizar Otros Stores

Ya refactoricé `clientStore` como ejemplo. Para refactorizar los otros stores:

### Patrón a seguir:

#### ANTES (Mock):
```javascript
addItem: async (itemData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newItem = {
    id: Date.now(),
    ...itemData
  };
  set(state => ({
    items: [...state.items, newItem]
  }));
}
```

#### DESPUÉS (API Real):
```javascript
addItem: async (itemData) => {
  set({ isLoading: true, error: null });
  try {
    const newItem = await itemsApi.create(itemData);
    set(state => ({
      items: [...state.items, newItem],
      isLoading: false
    }));
    return { success: true, item: newItem };
  } catch (error) {
    set({ isLoading: false, error: error.message });
    return { success: false, error: error.message };
  }
}
```

### Stores pendientes de refactorizar:
- [ ] `authStore.js` → Usar `api.auth.login()`
- [ ] `appointmentStore.js` → Usar `api.appointments`
- [ ] `staffStore.js` → Usar `api.barbers`
- [ ] `branchStore.js` → Usar `api.branches`
- [ ] `financialStore.js` → Usar `api.transactions`
- [ ] `loyaltyStore.js` → Usar `api.loyaltyRewards`

---

## 🔄 Sincronización de Datos

### Estrategia actual:
1. **Persistencia Zustand**: Cache local en `localStorage`
2. **JSON Server**: Fuente de verdad
3. **Carga inicial**: `loadMockXXX()` carga desde API
4. **CRUD**: Siempre actualiza API primero, luego state local

### Flujo:
```
App Init → Load from API → Update Zustand → Persist to localStorage
                                                        ↓
User Action → Call API → Success → Update Zustand → Auto-persist
```

---

## 🛠️ Troubleshooting

### Problema: "Cannot GET /"
**Solución**: Asegúrate de estar en `http://localhost:5173` (Vite) no en `:3001` (API)

### Problema: "fetch failed" o "ECONNREFUSED"
**Solución**:
```bash
# Verifica que json-server esté corriendo
npm run server

# O reinicia todo
npm run dev
```

### Problema: Datos no se actualizan
**Solución**:
1. Verifica que uses la versión refactorizada del store
2. Chequea la consola de desarrollador por errores
3. Verifica que `db.json` tenga los datos correctos

### Problema: Delay muy largo
**Solución**: Edita `package.json`:
```json
"server": "json-server --watch db.json --port 3001 --delay 200"
```

---

## 📊 Testing con Postman/Insomnia

Puedes probar los endpoints directamente:

### Ejemplo GET:
```
GET http://localhost:3001/clients
```

### Ejemplo POST:
```
POST http://localhost:3001/clients
Content-Type: application/json

{
  "name": "Test Cliente",
  "email": "test@example.com",
  "phone": "+51 999 888 777",
  "status": "active"
}
```

### Ejemplo PATCH:
```
PATCH http://localhost:3001/clients/1
Content-Type: application/json

{
  "loyaltyPoints": 200
}
```

---

## 🎓 Siguientes Pasos Recomendados

1. **Refactorizar resto de stores** usando `clientStore_refactored.js` como guía
2. **Implementar React Router** (ya está en el TODO del App.jsx)
3. **Agregar validación** en formularios antes de enviar a API
4. **Implementar refresh automático** cuando otros usuarios actualicen datos
5. **Agregar interceptors** para auth tokens (cuando implementes login real)

---

## 📚 Recursos

- [JSON Server Docs](https://github.com/typicode/json-server)
- [JSON Server v1 (beta) Changes](https://github.com/typicode/json-server/tree/v1)
- Archivo de ejemplo refactorizado: `src/stores/clientStore_refactored.js`
- API Service: `src/services/api.js`

---

## ✨ Ventajas de esta Implementación

✅ **Backend real** funcionando en minutos
✅ **REST API completa** sin código backend
✅ **Desarrollo rápido** con hot-reload
✅ **Fácil migración** a backend real después
✅ **Testing sencillo** con herramientas estándar
✅ **Documentación automática** (esta misma guía)
✅ **Arquitectura profesional** separando concerns

---

**¿Dudas?** Revisa el archivo `clientStore_refactored.js` para ver implementación completa.
