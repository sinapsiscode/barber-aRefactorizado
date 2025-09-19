# 🔧 COMPONENTES - TODOs DE REFACTOR

## 🚨 ARCHIVOS CON DEUDA TÉCNICA

### **NotificationService.jsx**
```javascript
// TODO REFACTOR: Este NO debería ser un componente
// - Mover a src/services/notificationService.js
// - Usar custom hook useNotifications()
// - Implementar toast library proper (react-hot-toast)
```

### **DataTable.jsx** 
```javascript
// TODO REFACTOR: Mejorar funcionalidad
// - Agregar TypeScript interfaces
// - Implementar sorting y filtering real
// - Mejorar performance con virtualization
// - Agregar tests unitarios
```

### **FormInput.jsx**
```javascript
// TODO REFACTOR: Validación y tipos
// - Agregar validación integrada (react-hook-form)
// - TypeScript props interface
// - Error handling mejorado
// - Accessibility improvements
```

### **MetricCard.jsx**
```javascript
// TODO REFACTOR: Flexibilidad
// - Agregar más variantes de diseño
// - Iconos dinámicos
// - Animaciones de números (countup)
// - Loading states
```

## 📁 ESTRUCTURA ACTUAL PROBLEMÁTICA

```
src/components/common/
├── DataTable.jsx        ← ✅ OK
├── EmptyState.jsx       ← ✅ OK
├── FormInput.jsx        ← ⚠️ Necesita validación
├── Header.jsx          ← ⚠️ Props drilling
├── Layout.jsx          ← ⚠️ Props drilling
├── LoadingSpinner.jsx  ← ✅ OK
├── MetricCard.jsx      ← ⚠️ Poco flexible
├── NotificationService.jsx ← ❌ NO es componente
├── Sidebar.jsx         ← ⚠️ Props drilling
└── index.js           ← ❌ Export desorganizado
```

## 📁 ESTRUCTURA IDEAL FUTURA

```
src/
├── components/
│   ├── ui/                    # Componentes base
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Card/
│   │   └── Table/
│   ├── layout/               # Layout components
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   └── Layout/
│   └── feature/              # Componentes por feature
│       ├── appointments/
│       ├── clients/
│       └── financial/
├── services/                 # Lógica de negocio
│   ├── notificationService.js
│   ├── authService.js
│   └── dataService.js
├── hooks/                    # Custom hooks
│   ├── useNotifications.js
│   ├── useAuth.js
│   └── useLocalStorage.js
└── types/                    # TypeScript types
    ├── components.ts
    ├── api.ts
    └── common.ts
```

## 🎯 PRIORIDADES

### **CRÍTICO (Hacer después del release):**
1. Mover NotificationService a service
2. Implementar React Router (elimina props drilling)
3. Agregar TypeScript a componentes críticos

### **ALTO:**
4. Mejorar FormInput con validación
5. Reorganizar estructura de carpetas
6. Crear custom hooks

### **MEDIO:**
7. Mejorar MetricCard flexibilidad
8. DataTable performance
9. Accessibility improvements

### **BAJO:**
10. Animaciones y micro-interacciones
11. Tema customizable avanzado
12. Storybook para documentación