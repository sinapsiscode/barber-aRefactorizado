# 📚 BARBERÍA APP - ANÁLISIS COMPLETO DEL PROYECTO

> **Última actualización**: 07 de Octubre 2025
> **Autor**: Claude (Análisis técnico detallado)
> **Propósito**: Documentación completa para implementación de JSON Server

---

## 📋 ÍNDICE

1. [Arquitectura General](#arquitectura-general)
2. [Estructura de Carpetas](#estructura-de-carpetas)
3. [Stores (Estado Global - Zustand)](#stores-estado-global)
4. [Pages (Páginas principales)](#pages-páginas)
5. [Components (Componentes)](#components-componentes)
6. [Hooks Personalizados](#hooks-personalizados)
7. [Services](#services)
8. [Utils](#utils)
9. [Flujos de Datos Completos](#flujos-de-datos)
10. [Roles y Permisos](#roles-y-permisos)
11. [Entidades y Relaciones](#entidades-y-relaciones)
12. [Plan de Migración a JSON Server](#plan-de-migración)

---

## 🏗️ ARQUITECTURA GENERAL

### Stack Tecnológico
- **Frontend**: React 18.3.1
- **Build Tool**: Vite 5.4.0
- **Styling**: Tailwind CSS 3.4.1
- **Estado Global**: Zustand 4.5.0 (con persist middleware)
- **Iconos**: React Icons 5.0.1
- **Alertas**: SweetAlert2 11.10.5
- **PDFs**: @react-pdf/renderer 3.4.4
- **Flags**: react-flags-select 2.5.0

### Patrón de Arquitectura
```
┌─────────────────────────────────────────────┐
│           UI LAYER (React)                  │
│  Pages → Components → Common Components     │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│     STATE MANAGEMENT (Zustand)              │
│  9 Stores independientes con persistencia   │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         DATA LAYER (Actual)                 │
│  localStorage + JSON imports + mocks        │
└─────────────────────────────────────────────┘
                   │
                   ▼
         [MIGRAR A JSON SERVER]
```

### Características Clave
1. **Multi-tenant**: Múltiples sucursales (branches)
2. **Multi-role**: 5 roles con permisos granulares
3. **Sistema de Lealtad**: Puntos, recompensas, niveles
4. **Gestión Financiera**: Ingresos, gastos, reportes
5. **Portfolio**: Galería de trabajos de barberos
6. **Reservas Públicas**: Clientes pueden reservar sin login
7. **Asistencia**: Check-in/Check-out de barberos
8. **Reviews**: Sistema de reseñas para barberos
9. **Recordatorios**: Sistema automático de notificaciones

---

## 📂 ESTRUCTURA DE CARPETAS

```
barberia-app/
├── public/
│   ├── logo.png
│   └── images/
├── src/
│   ├── App.jsx                 # Punto de entrada, routing manual
│   ├── main.jsx                # Root de React
│   ├── index.css               # Estilos globales Tailwind
│   │
│   ├── assets/                 # Recursos estáticos
│   │
│   ├── components/            # Componentes organizados por módulo
│   │   ├── admins/            # Gestión de admins de sede
│   │   ├── appointments/      # Citas (formularios, calendarios)
│   │   ├── auth/              # Login, Register, ProtectedRoute
│   │   ├── branches/          # Sucursales (formularios)
│   │   ├── clients/           # Clientes (formularios, perfiles)
│   │   ├── common/            # Componentes reutilizables
│   │   ├── dashboard/         # Dashboards por rol
│   │   ├── financial/         # Gráficos, formularios de transacciones
│   │   ├── loyalty/           # Puntos, recompensas, tienda
│   │   ├── services/          # Servicios y precios
│   │   ├── settings/          # Configuraciones
│   │   └── staff/             # Barberos, asistencia, reviews
│   │
│   ├── pages/                 # Páginas principales (contenedores)
│   │   ├── Dashboard.jsx      # Dashboard dinámico por rol
│   │   ├── Appointments.jsx   # Gestión de citas (admin/reception)
│   │   ├── BarberAppointments.jsx  # Vista de barbero
│   │   ├── ClientAppointments.jsx  # Vista de cliente
│   │   ├── Clients.jsx        # Gestión de clientes
│   │   ├── Staff.jsx          # Gestión de personal
│   │   ├── Financial.jsx      # Finanzas
│   │   ├── Services.jsx       # Servicios
│   │   ├── Portfolio.jsx      # Galería de trabajos
│   │   ├── Settings.jsx       # Configuración
│   │   ├── LandingPage.jsx    # Página pública
│   │   ├── PublicBooking.jsx  # Reservas públicas
│   │   └── ReceptionCalendar.jsx  # Calendario de recepción
│   │
│   ├── stores/                # Estado global (Zustand)
│   │   ├── index.js           # Exporta todos los stores
│   │   ├── authStore.js       # Autenticación y usuarios
│   │   ├── appointmentStore.js  # Citas
│   │   ├── clientStore.js     # Clientes
│   │   ├── staffStore.js      # Barberos y asistencia
│   │   ├── branchStore.js     # Sucursales y países
│   │   ├── financialStore.js  # Transacciones financieras
│   │   ├── loyaltyStore.js    # Sistema de lealtad
│   │   ├── reviewStore.js     # Reseñas de barberos
│   │   └── backgroundStore.js # Tema oscuro/claro
│   │
│   ├── hooks/                 # Custom Hooks
│   │   ├── useReminders.js    # Sistema de recordatorios
│   │   ├── useBranchFilter.js # Filtrado por sucursal
│   │   └── useTheme.js        # Tema oscuro/claro
│   │
│   ├── services/              # Lógica de negocio y APIs
│   │   ├── api.js             # ✅ API Layer (JSON Server) - NUEVO
│   │   ├── demoService.js     # Generación de datos de demo
│   │   └── reminderService.js # Procesamiento de recordatorios
│   │
│   ├── utils/                 # Utilidades
│   │   ├── dataLoader.js      # Carga de JSON con cache
│   │   └── paymentUtils.js    # Utilidades de pagos
│   │
│   └── data/                  # Datos JSON
│       ├── data.json          # Datos maestros unificados
│       └── portfolio.json     # Portfolio de trabajos
│
├── db.json                    # ✅ Base de datos JSON Server - NUEVO
├── json-server.json           # ✅ Configuración JSON Server - NUEVO
├── .env                       # ✅ Variables de entorno - NUEVO
└── package.json               # Dependencias y scripts
```

---

## 🗄️ STORES (ESTADO GLOBAL)

### 1. **authStore.js** - Autenticación y Usuarios

**Estado**:
```javascript
{
  user: null | User,              // Usuario actual logueado
  users: User[],                  // Lista de todos los usuarios
  currentBranch: null | Branch,   // Sucursal seleccionada
  isAuthenticated: boolean,
  isLoading: boolean,
  permissions: string[]           // Permisos del usuario actual
}
```

**Métodos Principales**:
- `login(credentials)` - Login con email/password
- `logout()` - Cerrar sesión
- `setCurrentBranch(branch)` - Cambiar sucursal (solo admins)
- `hasPermission(permission)` - Verificar permiso
- `canAccessModule(module)` - Verificar acceso a módulo
- `updateUserProfile(data)` - Actualizar perfil
- `addUser(userData)` - Agregar usuario
- `deleteUser(userId)` - Eliminar usuario

**Flujo de Login**:
1. Usuario ingresa email/password
2. `authStore.login()` busca en data.json
3. Valida credenciales (texto plano ⚠️)
4. Persiste user en localStorage
5. Redirige a Dashboard

**⚠️ Deuda Técnica**:
- Contraseñas en texto plano
- No hay hash de passwords
- Mock data mezclado con lógica

---

### 2. **clientStore.js** - Gestión de Clientes

**Estado**:
```javascript
{
  clients: Client[],
  selectedClient: null | Client,
  isLoading: boolean,
  error: null | string
}
```

**Entidad Client**:
```javascript
{
  id: number,
  name: string,
  email: string,
  phone: string,
  birthDate: string,
  address: string,
  preferredBranch: number,
  preferredBarber: number,
  loyaltyPoints: number,
  totalVisits: number,
  totalSpent: number,
  preferredServices: string[],
  notes: string,
  status: 'active' | 'blacklisted',
  cutoffWarningInterval: number,  // Días para recordatorio
  lastWarningDate: Date | null,
  warningEnabled: boolean,
  lastVisit: Date,
  createdAt: Date,
  updatedAt: Date,

  // Flags de seguridad
  isFlagged?: boolean,
  flagReason?: string,
  blacklistReason?: string,
  isUnwelcome?: boolean,
  fakeVouchers?: number
}
```

**Métodos CRUD**:
- `addClient(clientData)` - Crear cliente
- `updateClient(id, updates)` - Actualizar cliente
- `deleteClient(id)` - Eliminar cliente
- `getClientById(id)` - Obtener por ID
- `getActiveClients()` - Clientes activos
- `searchClients(term)` - Búsqueda por nombre/email/phone

**Métodos de Loyalty**:
- `updateClientLoyalty(clientId, points)` - Agregar puntos
- `updateClientStats(clientId, amount)` - Actualizar stats
- `calculateLoyaltyTier(client)` - Bronze/Silver/Gold/Platinum
- `getLoyaltyRecommendations(clientId)` - Sugerencias

**Métodos de Recordatorios**:
- `getClientsNeedingReminders()` - Clientes sin visita reciente
- `getClientsForWarning()` - Clientes para advertencia
- `markWarningAsSent(clientId)` - Marcar recordatorio enviado
- `sendCutoffWarning(clientId)` - Enviar advertencia

**Métodos de Seguridad**:
- `flagClient(clientId, reason)` - Marcar cliente
- `blacklistClient(clientId, reason)` - Blacklist
- `reactivateClient(clientId)` - Reactivar
- `markAsUnwelcome(clientId, reason)` - Marcar no bienvenido

**Métodos de Analytics**:
- `getClientStats()` - Estadísticas generales
- `getTopClients(limit)` - Top clientes por gasto
- `getVIPClients()` - Clientes VIP (>S/1000)
- `getClientsBirthdays(month)` - Cumpleaños del mes

**⚠️ Pendiente JSON Server**:
- Actualmente todos los métodos son mocks
- Cambios solo persisten en localStorage
- No hay sincronización entre usuarios

---

### 3. **appointmentStore.js** - Gestión de Citas

**Estado**:
```javascript
{
  appointments: Appointment[],
  selectedDate: Date,
  selectedBarber: null | number,
  isLoading: boolean,
  availableSlots: string[],
  services: Service[],
  branchPricing: object
}
```

**Entidad Appointment**:
```javascript
{
  id: number,
  clientId: number,
  clientName: string,
  barberId: number,
  barberName: string,
  branchId: number,
  date: string,              // YYYY-MM-DD
  time: string,              // HH:MM
  services: number[],        // IDs de servicios
  totalPrice: number,
  duration: number,          // minutos
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show',
  notes: string,
  createdAt: Date,
  updatedAt: Date,
  reminderSent?: boolean,
  cancelReason?: string,
  rating?: number,
  review?: string
}
```

**Entidad Service**:
```javascript
{
  id: number,
  name: string,
  duration: number,          // minutos
  price: number,             // precio base
  image: string,
  category: string,
  description: string,
  features: string[],
  gallery: string[],
  videoUrl: string | null,
  popular: boolean,
  discount?: number,
  note?: string
}
```

**Métodos CRUD**:
- `addAppointment(data)` - Crear cita
- `updateAppointment(id, updates)` - Actualizar cita
- `deleteAppointment(id)` - Eliminar cita
- `getAppointmentById(id)` - Obtener por ID
- `getAppointmentsByDate(date)` - Citas de una fecha
- `getAppointmentsByBarber(barberId)` - Citas de un barbero
- `getAppointmentsByClient(clientId)` - Citas de un cliente

**Métodos de Estado**:
- `confirmAppointment(id)` - Confirmar cita
- `completeAppointment(id)` - Completar cita
- `cancelAppointment(id, reason)` - Cancelar cita
- `markAsNoShow(id)` - Marcar no show

**Métodos de Disponibilidad**:
- `generateAvailableSlots(date, barberId, branchId)` - Generar slots
- `isSlotAvailable(date, time, barberId)` - Verificar disponibilidad
- `getBarberSchedule(barberId, date)` - Horario de barbero

**Métodos de Recordatorios**:
- `getAppointmentsNeedingReminders()` - Citas para recordar
- `markReminderSent(id)` - Marcar recordatorio enviado

**Métodos de Servicios**:
- `getServiceById(id)` - Obtener servicio
- `getServicePrice(serviceId, branchId)` - Precio por sucursal
- `calculateTotalPrice(services, branchId)` - Calcular total
- `updateService(id, data)` - Actualizar servicio
- `updateServicePricing(branchId, prices)` - Precios por sucursal

**⚠️ Lógica Compleja**:
- Generación de slots disponibles considera:
  - Horario de la sucursal
  - Disponibilidad del barbero
  - Duración de servicios
  - Citas existentes
  - Días de la semana

---

### 4. **staffStore.js** - Gestión de Personal

**Estado**:
```javascript
{
  barbers: Barber[],
  attendance: Attendance[],
  isLoading: boolean,
  selectedBarber: null | Barber
}
```

**Entidad Barber**:
```javascript
{
  id: number,
  name: string,
  email: string,
  phone: string,
  branchId: number,
  specialties: string[],
  rating: number,
  totalServices: number,
  totalEarnings: number,
  isPresent: boolean,
  country: string,           // Código de país
  status: 'active' | 'inactive',
  experience: string,
  achievements: string[],
  description: string,
  createdAt: Date,
  updatedAt: Date
}
```

**Entidad Attendance**:
```javascript
{
  id: string,
  barberId: number,
  date: string,              // YYYY-MM-DD
  checkIn: string,           // HH:MM
  checkOut: string | null,   // HH:MM
  hoursWorked: number,
  status: 'present' | 'late' | 'absent',
  notes: string
}
```

**Métodos CRUD Barberos**:
- `addBarber(data)` - Agregar barbero
- `updateBarber(id, updates)` - Actualizar barbero
- `deleteBarber(id)` - Eliminar barbero
- `getBarberById(id)` - Obtener por ID
- `getBarbersByBranch(branchId)` - Barberos de sucursal
- `getActiveBarbers()` - Barberos activos

**Métodos de Asistencia**:
- `checkIn(barberId)` - Registrar entrada
- `checkOut(barberId)` - Registrar salida
- `getTodayAttendance()` - Asistencia de hoy
- `getAttendanceByBarber(barberId, month)` - Asistencia mensual
- `getAttendanceStats(month)` - Estadísticas de asistencia

**Métodos de Performance**:
- `updateBarberStats(barberId, serviceAmount)` - Actualizar stats
- `getBarberRanking()` - Ranking por earnings
- `getTopBarbers(limit)` - Top barberos

**⚠️ Generación de Asistencia**:
- Sistema genera asistencia automática con:
  - 90% de asistencia random
  - Horarios entre 8-10 AM
  - 7-10 horas trabajadas
  - Marcado como "late" si después de 8:30 AM

---

### 5. **branchStore.js** - Gestión de Sucursales

**Estado**:
```javascript
{
  branches: Branch[],
  selectedBranch: null | Branch,
  isLoading: boolean,
  availableCountries: Country[]
}
```

**Entidad Branch**:
```javascript
{
  id: number,
  name: string,
  address: string,
  city: string,
  country: string,           // Código de país (PE, ES, etc)
  phone: string,
  email: string,
  manager: string,
  openTime: string,          // HH:MM
  closeTime: string,         // HH:MM
  capacity: number,          // Cantidad de sillas
  services: number[],        // IDs de servicios disponibles
  isActive: boolean,
  workingHours: {
    monday: { open: string, close: string, isOpen: boolean },
    tuesday: {...},
    // ... resto de días
  },
  stats: {
    totalAppointments: number,
    monthlyRevenue: number,
    staffCount: number,
    clientCount: number
  }
}
```

**Métodos CRUD**:
- `addBranch(data)` - Crear sucursal
- `updateBranch(id, updates)` - Actualizar sucursal
- `deleteBranch(id)` - Eliminar sucursal
- `getBranchById(id)` - Obtener por ID
- `getActiveBranches()` - Sucursales activas

**Métodos de Países**:
- `addCountry(countryData)` - Agregar país
- `getCountryByCode(code)` - Obtener país

**Métodos de Horarios**:
- `isOpenNow(branchId)` - ¿Está abierta ahora?
- `getWorkingHours(branchId, day)` - Horario de un día
- `updateWorkingHours(branchId, hours)` - Actualizar horarios

---

### 6. **financialStore.js** - Gestión Financiera

**Estado**:
```javascript
{
  transactions: Transaction[],
  metrics: {
    totalIncome: number,
    totalExpenses: number,
    netProfit: number,
    dailyIncome: number,
    monthlyIncome: number,
    monthlyExpenses: number,
    monthlyProfit: number
  },
  isLoading: boolean,
  selectedPeriod: 'day' | 'week' | 'month' | 'year',
  paymentMethods: PaymentMethod[],
  categories: {
    income: Category[],
    expense: Category[]
  }
}
```

**Entidad Transaction**:
```javascript
{
  id: number,
  type: 'income' | 'expense',
  category: string,
  amount: number,
  paymentMethod: string,
  description: string,
  branchId: number,
  clientId?: number,
  barberId?: number,
  appointmentId?: number,
  date: string,
  createdAt: Date,
  updatedAt: Date
}
```

**Métodos CRUD**:
- `addTransaction(data)` - Registrar transacción
- `updateTransaction(id, updates)` - Actualizar
- `deleteTransaction(id)` - Eliminar
- `getTransactionById(id)` - Obtener por ID

**Métodos de Métricas**:
- `calculateMetrics()` - Recalcular métricas
- `getIncomeByPeriod(period)` - Ingresos por período
- `getExpensesByPeriod(period)` - Gastos por período
- `getProfitByPeriod(period)` - Ganancia neta

**Métodos de Reportes**:
- `getMonthlyReport(month, year)` - Reporte mensual
- `getCategoryBreakdown(type)` - Desglose por categoría
- `getPaymentMethodBreakdown()` - Desglose por método pago

**Integración con Loyalty**:
- Al crear transacción de tipo "income" + categoría "services":
  - Automáticamente agrega puntos al cliente
  - Usa `loyaltyStore.addPointsForService()`

---

### 7. **loyaltyStore.js** - Sistema de Lealtad

**Estado**:
```javascript
{
  rewards: Reward[],
  pointsTransactions: PointsTransaction[],
  clientRewards: ClientReward[],
  loyaltyLevels: LoyaltyLevel[],
  settings: {
    pointsPerSol: number,
    enabled: boolean,
    minimumPointsToRedeem: number,
    pointsExpiryDays: number,
    welcomeBonusPoints: number,
    birthdayBonusPoints: number,
    referralBonusPoints: number
  }
}
```

**Entidad Reward**:
```javascript
{
  id: number,
  name: string,
  description: string,
  pointsCost: number,
  discountType: 'percentage' | 'fixed',
  discountValue: number,
  validityDays: number,
  category: 'discount' | 'service' | 'vip' | 'combo',
  isActive: boolean,
  maxUses: number,
  applicableServices: number[],
  icon: string,
  image: string
}
```

**Entidad LoyaltyLevel**:
```javascript
{
  id: number,
  name: 'Bronce' | 'Plata' | 'Oro' | 'Platino',
  color: string,
  image: string | null,
  minPoints: number,
  maxPoints: number | null,
  benefits: {
    pointsMultiplier: number,      // 1.0, 1.2, 1.5, 2.0
    discountPercentage: number,    // 0%, 5%, 10%, 15%
    freeServicesPerMonth: number,  // 0, 0, 1, 2
    priorityBooking: boolean,      // false, false, true, true
    birthdayBonus: number          // 50, 100, 200, 500
  }
}
```

**Métodos de Puntos**:
- `addPointsForService(clientId, amount, branchId)` - Agregar puntos
- `addPointsManual(clientId, points, reason)` - Puntos manuales
- `deductPoints(clientId, points, reason)` - Deducir puntos
- `getClientPoints(clientId)` - Obtener puntos de cliente

**Métodos de Recompensas**:
- `redeemReward(clientId, rewardId)` - Canjear recompensa
- `getAvailableRewards(clientId)` - Recompensas disponibles
- `getClientRewards(clientId)` - Recompensas del cliente
- `useReward(clientRewardId)` - Usar recompensa canjeada

**Métodos de Niveles**:
- `getClientLevel(clientId)` - Nivel actual del cliente
- `getNextLevelProgress(clientId)` - Progreso al siguiente nivel
- `applyLevelBenefits(clientId, amount)` - Aplicar multiplicador

**Métodos de Transacciones**:
- `getPointsHistory(clientId)` - Historial de puntos
- `getPointsStats(clientId)` - Estadísticas de puntos

---

### 8. **reviewStore.js** - Sistema de Reseñas

**Estado**:
```javascript
{
  reviews: Review[],
  isLoading: boolean
}
```

**Entidad Review**:
```javascript
{
  id: number,
  barberId: number,
  clientId: number,
  clientName: string,
  appointmentId: number,
  rating: number,             // 1-5
  comment: string,
  date: Date,
  response: string | null,    // Respuesta del barbero
  isPublic: boolean
}
```

**Métodos**:
- `addReview(data)` - Agregar reseña
- `getBarberReviews(barberId)` - Reseñas de barbero
- `getAverageRating(barberId)` - Rating promedio
- `respondToReview(reviewId, response)` - Responder reseña

---

### 9. **backgroundStore.js** - Tema y Personalización

**Estado**:
```javascript
{
  isDarkMode: boolean,
  customBackground: string | null
}
```

**Métodos**:
- `toggleDarkMode()` - Cambiar tema
- `setCustomBackground(url)` - Fondo personalizado

---

## 📄 PAGES (PÁGINAS PRINCIPALES)

### 1. **Dashboard.jsx** - Dashboard Dinámico

**Función**: Router de dashboards según rol

**Lógica**:
```javascript
switch (user.role) {
  case 'super_admin': return <SuperAdminDashboard />;
  case 'branch_admin': return <BranchAdminDashboard />;
  case 'barber': return <BarberDashboard />;
  case 'reception': return <ReceptionDashboard />;
  case 'client': return <ClientDashboard />;
}
```

**Stores Usados**:
- `authStore` (rol del usuario)

---

### 2. **Appointments.jsx** - Gestión de Citas (Admin/Reception)

**Funcionalidad**:
- Listar todas las citas
- Filtrar por fecha, barbero, estado, sucursal
- Crear nueva cita
- Editar cita existente
- Cancelar/Confirmar/Completar citas
- Marcar no-show
- Ver detalles de cita
- Búsqueda de citas

**Stores Usados**:
- `appointmentStore` (CRUD citas, servicios)
- `clientStore` (datos clientes)
- `staffStore` (barberos disponibles)
- `branchStore` (sucursales)
- `authStore` (permisos)

**Componentes Clave**:
- `AppointmentCalendar` - Vista de calendario
- `AppointmentForm` - Formulario de cita

**Flujo Crear Cita**:
1. Click "Nueva Cita"
2. Seleccionar cliente (o crear nuevo)
3. Seleccionar sucursal
4. Seleccionar fecha
5. Ver slots disponibles
6. Seleccionar barbero
7. Seleccionar servicios
8. Calcular precio total
9. Agregar notas
10. Confirmar
11. `appointmentStore.addAppointment()`
12. Actualizar `clientStore.updateClientStats()`

---

### 3. **BarberAppointments.jsx** - Vista de Barbero

**Funcionalidad**:
- Ver solo citas del barbero logueado
- Filtrar por fecha y estado
- Confirmar/Completar citas
- Ver detalles de cliente
- Marcar asistencia (check-in/check-out)

**Stores Usados**:
- `appointmentStore`
- `staffStore`
- `authStore`

**Restricciones**:
- Solo ve sus propias citas
- No puede crear citas
- No puede ver citas de otros barberos

---

### 4. **ClientAppointments.jsx** - Vista de Cliente

**Funcionalidad**:
- Ver historial de citas
- Crear nueva cita (self-booking)
- Cancelar cita (con restricciones)
- Ver puntos de lealtad
- Ver recompensas disponibles
- Canjear recompensas

**Stores Usados**:
- `appointmentStore`
- `clientStore`
- `loyaltyStore`
- `authStore`

---

### 5. **Clients.jsx** - Gestión de Clientes

**Funcionalidad**:
- Listar todos los clientes
- Buscar clientes
- Filtrar por sucursal, estado, tier
- Crear nuevo cliente
- Editar cliente
- Ver perfil detallado
- Ver historial de citas
- Ver puntos de lealtad
- Gestionar flags de seguridad
- Blacklist/Reactivar clientes
- Ver estadísticas
- Exportar/Importar datos

**Componentes Clave**:
- `ClientForm` - Formulario cliente
- `ClientProfile` - Perfil detallado
- `DataTable` - Tabla de clientes

**Stores Usados**:
- `clientStore`
- `appointmentStore`
- `loyaltyStore`
- `branchStore`
- `authStore`

---

### 6. **Staff.jsx** - Gestión de Personal

**Funcionalidad**:
- Listar barberos
- Filtrar por sucursal
- Crear nuevo barbero
- Editar barbero
- Ver perfil de barbero
- Ver estadísticas de barbero
- Gestionar asistencia
- Ver calendario de asistencia
- Check-in/Check-out
- Ver reviews
- Ver earnings

**Componentes Clave**:
- `StaffForm` - Formulario barbero
- `AttendanceTracker` - Seguimiento de asistencia
- `BarberReviews` - Reseñas

**Stores Usados**:
- `staffStore`
- `branchStore`
- `reviewStore`
- `appointmentStore`
- `authStore`

---

### 7. **Financial.jsx** - Gestión Financiera

**Funcionalidad**:
- Ver dashboard financiero
- Crear transacción (ingreso/gasto)
- Listar transacciones
- Filtrar por tipo, categoría, período, sucursal
- Ver gráficos de ingresos/gastos
- Ver métricas (profit, trends)
- Exportar reportes
- Desglose por categoría
- Desglose por método de pago

**Componentes Clave**:
- `TransactionForm` - Formulario transacción
- `FinancialCharts` - Gráficos

**Stores Usados**:
- `financialStore`
- `branchStore`
- `clientStore`
- `staffStore`
- `authStore`

---

### 8. **Services.jsx** - Gestión de Servicios

**Funcionalidad**:
- Listar servicios
- Ver detalles de servicio
- Editar servicio
- Gestionar precios por sucursal
- Ver galería de servicios
- Marcar servicios populares

**Componentes Clave**:
- `ServiceModal` - Modal de detalles
- `ServicePricingManager` - Gestión de precios

**Stores Usados**:
- `appointmentStore` (contiene servicios)
- `branchStore`
- `authStore`

---

### 9. **Portfolio.jsx** - Galería de Trabajos

**Funcionalidad**:
- Ver galería de trabajos
- Filtrar por barbero, categoría, sucursal
- Ver detalles de trabajo
- Like/Unlike trabajos
- Ver rating
- Agregar nuevo trabajo (barberos)
- Editar trabajo
- Eliminar trabajo

**Datos**:
- Cargados desde `data/portfolio.json`
- Contiene fotos de trabajos con:
  - Barbero que lo hizo
  - Servicios aplicados
  - Precio
  - Rating
  - Likes
  - Tags

---

### 10. **Settings.jsx** - Configuración

**Funcionalidad**:
- Gestión de sucursales
- Gestión de administradores de sede
- Configuración de loyalty
- Crear/Editar niveles de lealtad
- Configurar puntos por sol
- Configurar bonos
- Tema oscuro/claro
- Fondo personalizado

**Componentes Clave**:
- `BranchAdminsSettings` - Gestión admins
- `LoyaltySettings` - Config loyalty
- `LoyaltyLevelForm` - Formulario niveles
- `BackgroundSettings` - Personalización

**Stores Usados**:
- `branchStore`
- `authStore`
- `loyaltyStore`
- `backgroundStore`

---

### 11. **LandingPage.jsx** - Página Pública

**Funcionalidad**:
- Hero section
- Servicios destacados
- Sucursales
- Testimonios
- Call to action (Login / Reservar)
- Navbar público

**Características**:
- NO requiere autenticación
- Entrada al sistema
- Navegación a PublicBooking

---

### 12. **PublicBooking.jsx** - Reservas Públicas

**Funcionalidad**:
- Reservar cita sin login
- Seleccionar sucursal
- Ver barberos disponibles
- Seleccionar fecha/hora
- Seleccionar servicios
- Ingresar datos personales
- Confirmar reserva
- Ver confirmación

**Flujo**:
1. Seleccionar sucursal
2. Seleccionar fecha
3. Ver slots disponibles
4. Seleccionar barbero
5. Seleccionar servicios
6. Formulario datos personales
7. Confirmar reserva
8. `appointmentStore.addAppointment()`
9. Si es nuevo: `clientStore.addClient()`
10. Mostrar confirmación

---

### 13. **ReceptionCalendar.jsx** - Calendario de Recepción

**Funcionalidad**:
- Vista de calendario completo
- Ver todas las citas del día
- Filtrar por barbero
- Quick actions (confirmar, cancelar)
- Vista por hora
- Vista de disponibilidad

**Stores Usados**:
- `appointmentStore`
- `staffStore`
- `branchStore`

---

## 🧩 COMPONENTS (COMPONENTES)

### Common Components (Reutilizables)

1. **Layout.jsx** - Layout principal con sidebar y header
2. **Sidebar.jsx** - Menú lateral dinámico por rol
3. **Header.jsx** - Header con usuario, sucursal, notificaciones
4. **DataTable.jsx** - Tabla de datos reutilizable
5. **MetricCard.jsx** - Card de métrica
6. **EmptyState.jsx** - Estado vacío
7. **LoadingSpinner.jsx** - Spinner de carga
8. **FormInput.jsx** - Input de formulario
9. **BranchStatus.jsx** - Estado de sucursal
10. **BranchRestrictionNotice.jsx** - Aviso de restricción
11. **CountryFlag.jsx** - Bandera de país
12. **DemoModeControl.jsx** - Control modo demo
13. **NotificationService.jsx** - Sistema de notificaciones
14. **RoleBasedNotifications.jsx** - Notificaciones por rol

### Dashboard Components

1. **SuperAdminDashboard.jsx** - Dashboard super admin
2. **BranchAdminDashboard.jsx** - Dashboard admin sede
3. **BarberDashboard.jsx** - Dashboard barbero
4. **ReceptionDashboard.jsx** - Dashboard recepción
5. **ClientDashboard.jsx** - Dashboard cliente
6. **ReviewsSummary.jsx** - Resumen de reviews

### Auth Components

1. **LoginForm.jsx** - Formulario de login
2. **RegisterForm.jsx** - Formulario de registro
3. **ProtectedRoute.jsx** - HOC para rutas protegidas
4. **TermsAndConditions.jsx** - Términos y condiciones

---

## 🪝 HOOKS PERSONALIZADOS

### 1. **useReminders.js**

**Propósito**: Sistema de recordatorios automático

**Lógica**:
- Se ejecuta cada hora
- Verifica si es las 6 PM
- Procesa recordatorios de citas del día siguiente
- Marca recordatorios como enviados
- Log de resultados

**Uso**:
```javascript
// En App.jsx
useReminders();  // Se ejecuta automáticamente
```

**Integración**:
- Usa `appointmentStore.getAppointmentsNeedingReminders()`
- Usa `reminderService.processAllReminders()`
- Actualiza `appointment.reminderSent = true`

---

### 2. **useBranchFilter.js**

**Propósito**: Filtrado de datos por sucursal

**Lógica**:
- Obtiene sucursal actual de `authStore`
- Si es branch_admin, solo ve su sucursal
- Si es super_admin, ve todas
- Filtra automáticamente datos

**Uso**:
```javascript
const { filteredData } = useBranchFilter(allData, 'branchId');
```

---

### 3. **useTheme.js**

**Propósito**: Gestión de tema oscuro/claro

**Lógica**:
- Lee de `backgroundStore`
- Aplica clase dark al document
- Persiste preferencia

---

## 🔧 SERVICES

### 1. **api.js** - API Service Layer (NUEVO ✅)

**Propósito**: Capa de abstracción para JSON Server

**Funciones**:
- `apiRequest()` - Wrapper de fetch
- `createCrudApi()` - Generador de CRUD
- APIs por recurso: `clientsApi`, `barbersApi`, etc.
- Métodos extendidos: `getByBranch()`, `getByDate()`, etc.

**Ver**: [JSON_SERVER_SETUP.md](./JSON_SERVER_SETUP.md)

---

### 2. **demoService.js**

**Propósito**: Generación de datos de demostración

**Funciones**:
- `generateMockAttendance()` - Asistencia de último mes
- `generateMockTransactions()` - Transacciones random
- `generateMockAppointments()` - Citas de demo

---

### 3. **reminderService.js**

**Propósito**: Procesamiento de recordatorios

**Funciones**:
- `processAllReminders()` - Procesar todos los recordatorios
- `sendReminderEmail()` - Enviar email (mock)
- `sendReminderSMS()` - Enviar SMS (mock)

**Lógica**:
- Filtra citas del día siguiente
- Filtra citas sin recordatorio enviado
- Filtra clientes con recordatorios habilitados
- Envía recordatorios (mock por ahora)
- Marca como enviado

---

## 🛠️ UTILS

### 1. **dataLoader.js**

**Propósito**: Carga de datos desde JSON con cache

**Funciones**:
- `loadData()` - Carga data.json completo
- `getDataSection(section)` - Obtener sección específica
- `getDataSections(sections)` - Múltiples secciones
- `clearDataCache()` - Limpiar cache

**Características**:
- Cache en memoria
- Solo carga una vez
- Manejo de errores
- Fallback data

---

### 2. **paymentUtils.js**

**Propósito**: Utilidades de pagos

**Funciones**:
- Formateo de moneda
- Validación de métodos de pago
- Cálculos de descuentos

---

## 🔄 FLUJOS DE DATOS COMPLETOS

### Flujo 1: Login de Usuario

```
┌─────────────────┐
│ LoginForm       │
│ (email/password)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ authStore       │
│ .login()        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ dataLoader      │
│ getDataSection  │
│ ('users')       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ data.json       │
│ users[]         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Validar         │
│ credenciales    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
   ✅        ❌
    │         │
    ▼         ▼
Set user   Return error
Redirect   Show error
Dashboard
```

---

### Flujo 2: Crear Cita

```
┌─────────────────┐
│ AppointmentForm │
│ (datos cita)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Validar datos   │
│ - Cliente       │
│ - Barbero       │
│ - Fecha/Hora    │
│ - Servicios     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Calcular        │
│ - Duración      │
│ - Precio total  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ appointmentStore│
│ .addAppointment()│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ clientStore     │
│ .updateStats()  │
│ (totalVisits++)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ localStorage    │
│ Persistir       │
└─────────────────┘
```

---

### Flujo 3: Sistema de Lealtad

```
┌─────────────────┐
│ Cliente completa│
│ servicio        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ financialStore  │
│ .addTransaction │
│ (type: income)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ loyaltyStore    │
│ .addPointsFor   │
│ Service()       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Calcular puntos │
│ amount * mult   │
│ (loyalty level) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ clientStore     │
│ .updateClient   │
│ Loyalty()       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ pointsTransac   │
│ tions[]         │
│ .push()         │
└─────────────────┘
```

---

### Flujo 4: Recordatorios Automáticos

```
┌─────────────────┐
│ App.jsx         │
│ useReminders()  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Cada hora       │
│ setInterval     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ ¿Es 6 PM?       │
└────────┬────────┘
         │
       ┌─┴─┐
      ❌  ✅
       │   │
       │   ▼
       │ ┌─────────────────┐
       │ │ appointmentStore│
       │ │ .getNeedingRem  │
       │ └────────┬────────┘
       │          │
       │          ▼
       │ ┌─────────────────┐
       │ │ reminderService │
       │ │ .processAll()   │
       │ └────────┬────────┘
       │          │
       │          ▼
       │ ┌─────────────────┐
       │ │ Para cada cita  │
       │ │ - Enviar email  │
       │ │ - Enviar SMS    │
       │ └────────┬────────┘
       │          │
       │          ▼
       │ ┌─────────────────┐
       │ │ appointmentStore│
       │ │ .markReminder   │
       │ │ Sent()          │
       │ └─────────────────┘
       │
       └→ Skip
```

---

## 👥 ROLES Y PERMISOS

### Roles del Sistema

1. **super_admin** - Super Administrador
   - Acceso total
   - Ve todas las sucursales
   - Gestiona branches, admins, configuración global

2. **branch_admin** - Administrador de Sede
   - Acceso limitado a su sucursal
   - Gestiona barberos, clientes, citas de su sede
   - No puede cambiar de sucursal
   - No puede gestionar otras sucursales

3. **reception** - Recepcionista
   - Gestiona citas
   - Gestiona clientes
   - Registra pagos
   - No gestiona barberos
   - No ve finanzas completas

4. **barber** - Barbero
   - Ve solo sus citas
   - Check-in/Check-out
   - Ve su portfolio
   - No crea citas
   - No gestiona clientes

5. **client** - Cliente
   - Ve su historial
   - Crea sus citas
   - Ve sus puntos
   - Canjea recompensas
   - No ve otros clientes

### Matriz de Permisos

| Módulo | super_admin | branch_admin | reception | barber | client |
|--------|-------------|--------------|-----------|--------|--------|
| Dashboard | ✅ Todas sedes | ✅ Su sede | ✅ Su sede | ✅ Personal | ✅ Personal |
| Appointments (Ver) | ✅ Todas | ✅ Su sede | ✅ Su sede | ✅ Propias | ✅ Propias |
| Appointments (Crear) | ✅ | ✅ | ✅ | ❌ | ✅ Self-booking |
| Clients (Ver) | ✅ Todos | ✅ Su sede | ✅ Su sede | ❌ | ❌ |
| Clients (Editar) | ✅ | ✅ | ✅ | ❌ | ❌ |
| Staff (Ver) | ✅ Todos | ✅ Su sede | ❌ | ❌ | ❌ |
| Staff (Editar) | ✅ | ✅ | ❌ | ❌ | ❌ |
| Financial | ✅ Todas | ✅ Su sede | ⚠️ Limitado | ❌ | ❌ |
| Branches | ✅ | ❌ | ❌ | ❌ | ❌ |
| Settings | ✅ | ⚠️ Limitado | ❌ | ❌ | ❌ |
| Portfolio (Ver) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Portfolio (Editar) | ✅ | ✅ | ❌ | ✅ Propio | ❌ |
| Reports | ✅ | ✅ | ❌ | ❌ | ❌ |

### Permisos Detallados

**super_admin**:
```javascript
permissions: ['read', 'write', 'delete', 'manage_all']
```

**branch_admin**:
```javascript
permissions: ['read', 'write', 'delete_own_branch']
```

**reception**:
```javascript
permissions: [
  'read',
  'write_appointments',
  'write_payments',
  'read_portfolio'
]
```

**barber**:
```javascript
permissions: [
  'read_appointments',
  'mark_attendance',
  'take_photos',
  'manage_portfolio'
]
```

**client**:
```javascript
permissions: [
  'read_own',
  'read_portfolio',
  'read_appointments',
  'write_appointments'
]
```

---

## 🗃️ ENTIDADES Y RELACIONES

### Diagrama de Relaciones

```
┌───────────┐
│  Branch   │───┐
└───────────┘   │
      │         │
      │ 1:N     │
      │         │
      ▼         │ 1:N
┌───────────┐   │
│  Barber   │◄──┤
└───────────┘   │
      │         │
      │ 1:N     │
      │         │
      ▼         │
┌───────────┐   │
│Appointment│   │
└───────────┘   │
      │         │
      │ N:1     │
      │         │
      ▼         │ 1:N
┌───────────┐   │
│  Client   │◄──┘
└───────────┘
      │
      │ 1:N
      │
      ▼
┌───────────┐
│  Points   │
│Transaction│
└───────────┘
      │
      │ N:1
      │
      ▼
┌───────────┐
│  Reward   │
└───────────┘
```

### Relaciones Clave

1. **Branch ↔ Barber** (1:N)
   - Una sucursal tiene muchos barberos
   - Un barbero pertenece a una sucursal

2. **Branch ↔ Client** (1:N)
   - Una sucursal tiene muchos clientes (preferredBranch)
   - Un cliente puede tener una sucursal preferida

3. **Barber ↔ Appointment** (1:N)
   - Un barbero tiene muchas citas
   - Una cita pertenece a un barbero

4. **Client ↔ Appointment** (1:N)
   - Un cliente tiene muchas citas
   - Una cita pertenece a un cliente

5. **Appointment ↔ Service** (N:M)
   - Una cita puede tener múltiples servicios
   - Un servicio puede estar en múltiples citas

6. **Client ↔ PointsTransaction** (1:N)
   - Un cliente tiene muchas transacciones de puntos
   - Una transacción pertenece a un cliente

7. **Client ↔ ClientReward** (1:N)
   - Un cliente puede tener múltiples recompensas canjeadas
   - Una recompensa canjeada pertenece a un cliente

8. **Barber ↔ Review** (1:N)
   - Un barbero tiene muchas reseñas
   - Una reseña pertenece a un barbero

9. **Branch ↔ Transaction** (1:N)
   - Una sucursal tiene muchas transacciones
   - Una transacción pertenece a una sucursal

---

## 🚀 PLAN DE MIGRACIÓN A JSON SERVER

### Fase 1: Setup (✅ COMPLETADO)

- [x] Instalar json-server y concurrently
- [x] Crear db.json unificado
- [x] Configurar scripts npm
- [x] Crear API service layer
- [x] Documentar endpoints

### Fase 2: Migración de Stores (EN PROGRESO)

**Orden Recomendado**:

1. **authStore** (Crítico)
   - Migrar login a POST /users?email=X
   - Migrar registro a POST /users
   - Actualizar loadUsers() a GET /users

2. **branchStore** (Dependencia de otros)
   - Migrar CRUD a /branches
   - Mantener lógica de workingHours local

3. **clientStore** (✅ Ejemplo hecho)
   - Ver `clientStore_refactored.js`
   - Migrar todos los métodos CRUD
   - Mantener lógica de analytics local

4. **staffStore** (Barberos)
   - Migrar CRUD a /barbers
   - Migrar attendance a /attendance
   - Mantener lógica de check-in/out local

5. **appointmentStore**
   - Migrar CRUD a /appointments
   - Migrar services a /services
   - Mantener lógica de slots local
   - Mantener branchPricing a /branchPricing

6. **financialStore**
   - Migrar transactions a /transactions
   - Mantener cálculos de métricas local
   - Mantener integración con loyaltyStore

7. **loyaltyStore**
   - Migrar rewards a /loyaltyRewards
   - Migrar pointsTransactions a /pointsTransactions
   - Migrar clientRewards a /clientRewards
   - Mantener lógica de cálculos local

8. **reviewStore**
   - Crear endpoint /reviews
   - Migrar CRUD

### Fase 3: Actualizar Componentes

- Actualizar imports de stores
- Manejar estados de loading
- Manejar errores de API
- Agregar retry logic

### Fase 4: Testing

- Probar cada flujo completo
- Verificar persistencia
- Verificar sincronización
- Testing multi-usuario (abrir 2 tabs)

### Fase 5: Optimizaciones

- Implementar debouncing en búsquedas
- Implementar caching estratégico
- Optimizar queries con params
- Implementar infinite scroll donde sea necesario

---

## 📌 NOTAS IMPORTANTES

### Deuda Técnica Identificada

1. **Routing Manual** (App.jsx:46)
   - No hay React Router
   - Routing con useState
   - No hay URLs reales
   - No funciona botón atrás

2. **Seguridad** (authStore.js:61)
   - Contraseñas en texto plano
   - No hay JWT
   - No hay refresh tokens

3. **Data Loading** (dataLoader.js)
   - Carga todo data.json en memoria
   - No hay lazy loading
   - Cache básico sin invalidación

4. **Persistencia**
   - Todo en localStorage
   - No hay sincronización real
   - No hay conflict resolution

5. **Validación**
   - Validación en frontend solamente
   - No hay schema validation
   - No hay sanitización robusta

### Características Positivas

✅ **Arquitectura limpia** con separación de concerns
✅ **Zustand bien implementado** con persist
✅ **Componentes reutilizables** bien organizados
✅ **Sistema de permisos** robusto
✅ **Multi-tenant** bien pensado
✅ **Sistema de loyalty** completo
✅ **Recordatorios automáticos** funcionales
✅ **Portfolio** con galería
✅ **Reservas públicas** sin login

---

## 🎯 CONCLUSIONES

### Estado Actual

El proyecto es una **aplicación completa de gestión de barbería** con:
- ✅ Sistema multi-sucursal
- ✅ 5 roles con permisos granulares
- ✅ Gestión de citas completa
- ✅ Sistema de lealtad sofisticado
- ✅ Gestión financiera
- ✅ Portfolio de trabajos
- ✅ Reservas públicas
- ✅ Sistema de reviews
- ✅ Recordatorios automáticos

### Listo para JSON Server

La estructura está **LISTA** para migrar a JSON Server porque:

1. **Stores bien separados** - Cada store maneja un dominio
2. **Data estructurada** - JSON ya está en formato API
3. **CRUD claramente definido** - Métodos add/update/delete consistentes
4. **Relaciones mapeadas** - IDs relacionales ya implementados
5. **API Layer creada** - `src/services/api.js` listo para usar

### Siguiente Paso

**Migrar stores uno por uno** usando el patrón de `clientStore_refactored.js`:

1. Reemplazar mocks por llamadas API
2. Mantener lógica de negocio local
3. Agregar manejo de errores
4. Testing incremental

---

**Documento generado por Claude** - Análisis completo del proyecto para implementación de JSON Server
**Fecha**: 07 de Octubre 2025
