# 🚀 GUÍA RÁPIDA DE INICIO - BARBERÍA APP

**Migración Completada**: ✅ Todas las funciones usando JSON Server

---

## ⚡ INICIO RÁPIDO (3 pasos)

### 1️⃣ Iniciar Backend

```bash
cd backend
npm run dev
```

**Verás**:
```
🚀  BACKEND BARBERÍA - JSON SERVER RUNNING  🚀
📡 Server: http://localhost:4341
💚 Health: http://localhost:4341/health
🔑 Login: POST http://localhost:4341/login
```

**Test rápido**: Abre http://localhost:4341/health en tu navegador
- Si ves JSON con status: "OK" → ✅ Backend funcionando

---

### 2️⃣ Iniciar Frontend

```bash
cd barberia-app
npm run dev
```

**Verás**:
```
  VITE ready in X ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

**Abre**: http://localhost:5173

---

### 3️⃣ Login de Prueba

**Usuario Super Admin**:
- Email: `admin@barberia.com`
- Password: `admin123`

**Usuario Branch Admin**:
- Email: `branch1@barberia.com`
- Password: `branch123`

**Usuario Cliente**:
- Email: `juan.perez@email.com`
- Password: `cliente123`

---

## 🔍 VERIFICACIÓN RÁPIDA

### Backend está funcionando si:
✅ `http://localhost:4341/health` responde con JSON
✅ `http://localhost:4341/clientes` requiere headers (401 sin auth)
✅ Ves logs en la consola del backend

### Frontend está conectado si:
✅ Login funciona y redirige al dashboard
✅ Dashboard muestra métricas (no "0" en todo)
✅ Puedes navegar a Clientes y ver lista
✅ Consola del navegador no muestra errores de API

---

## 🛠️ COMANDOS ÚTILES

### Backend

```bash
# Iniciar en modo desarrollo (con hot reload)
npm run dev

# Regenerar datos de prueba
npm run seed

# Regenerar datos e iniciar
npm run seed:dev

# Solo iniciar (sin hot reload)
npm start
```

### Frontend

```bash
# Iniciar en modo desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linter
npm run lint
```

---

## 📊 FLUJOS DE PRUEBA

### Flujo 1: Login y Dashboard
1. Abrir http://localhost:5173
2. Login con admin@barberia.com / admin123
3. ✅ Deberías ver dashboard con métricas
4. ✅ Sidebar con todos los módulos

### Flujo 2: Crear Cliente
1. Click en "Clientes" en sidebar
2. Click "Agregar Cliente"
3. Llenar formulario
4. ✅ Cliente creado aparece en lista
5. ✅ Ver en backend: http://localhost:4341/clientes

### Flujo 3: Crear Cita
1. Click en "Citas"
2. Click "Nueva Cita"
3. Seleccionar:
   - Cliente
   - Barbero
   - Fecha y hora
   - Servicios
4. ✅ Cita creada
5. ✅ Ver en backend: http://localhost:4341/citas

### Flujo 4: Sistema de Lealtad (Automático)
1. Ir a "Finanzas"
2. Click "Nueva Transacción"
3. Crear transacción:
   - Tipo: Ingreso
   - Categoría: Servicios
   - Monto: 50
   - **Cliente**: Seleccionar un cliente
4. ✅ Transacción creada
5. Ir a "Clientes" → Ver perfil del cliente
6. ✅ Cliente tiene 50 puntos nuevos
7. ✅ Ver en backend: http://localhost:4341/transaccionesPuntos

---

## 🔧 TROUBLESHOOTING

### Backend no inicia
**Error**: `Cannot find module 'json-server'`
```bash
cd backend
npm install
npm run dev
```

### Frontend no conecta a backend
**Error**: `fetch failed` or `Network error`

1. Verificar que backend esté corriendo en puerto 4341
2. Verificar archivo `.env` en barberia-app:
   ```
   VITE_API_URL=http://localhost:4341
   ```

### Login falla
**Error**: `Usuario no encontrado`

1. Regenerar datos:
   ```bash
   cd backend
   npm run seed
   npm run dev
   ```

### No hay datos en el frontend
**Error**: Listas vacías en todos lados

1. Abrir consola del navegador (F12)
2. Buscar errores en Network tab
3. Verificar que requests a API estén OK (200)
4. Si siguen vacías, regenerar datos:
   ```bash
   cd backend
   npm run seed
   ```

### CORS Error
**Error**: `blocked by CORS policy`

- ✅ Ya está configurado en backend/server.js
- Verificar que estás usando `http://localhost:5173` (no otra URL)

---

## 📁 ESTRUCTURA DEL PROYECTO

```
barber-aRefactorizado/
├── backend/                    # Backend JSON Server
│   ├── server.js              # ✅ Servidor principal
│   ├── db.json                # ✅ Base de datos
│   ├── seed.js                # ✅ Generador de datos
│   ├── middlewares/           # ✅ Auth y permisos
│   └── package.json
│
├── barberia-app/              # Frontend React
│   ├── src/
│   │   ├── stores/            # ✅ Zustand stores (MIGRADOS)
│   │   ├── services/
│   │   │   └── api.js         # ✅ API Layer (JSON Server)
│   │   ├── pages/             # ✅ Páginas principales
│   │   ├── components/        # ✅ Componentes UI
│   │   └── App.jsx            # ✅ Punto de entrada
│   └── package.json
│
├── MIGRATION_COMPLETE.md      # ✅ Resumen técnico completo
└── QUICK_START.md             # ✅ Esta guía
```

---

## 🎯 PRÓXIMOS PASOS

### Para Desarrollo
1. Personalizar datos en `backend/seed.js`
2. Agregar más validaciones en formularios
3. Mejorar UX/UI según feedback
4. Agregar más reportes y gráficos

### Para Producción (Backend Real)
1. **Migrar de JSON Server a Express + PostgreSQL/MongoDB**
2. **Implementar JWT** con refresh tokens
3. **Hash de contraseñas** con bcrypt
4. **Validación de esquemas** con Zod
5. **Rate limiting** y seguridad
6. **Deploy** en Vercel/Netlify (frontend) + Railway/Render (backend)

---

## 📞 SOPORTE

### Logs útiles

**Backend**:
```bash
# Ver logs del backend
cd backend
npm run dev
# Aparecen en consola: requests, errores, autenticación
```

**Frontend**:
- Abrir DevTools (F12)
- Tab "Console": Ver logs de JavaScript
- Tab "Network": Ver requests HTTP

### Archivos de configuración

**Backend**:
- `backend/.env` - Variables de entorno (puerto, etc)
- `backend/db.json` - Base de datos (editable manualmente)

**Frontend**:
- `barberia-app/.env` - URL del backend
- `barberia-app/src/config/api.config.js` - Config de API

---

## ✅ CHECKLIST PRE-PRESENTACIÓN

- [ ] Backend corriendo sin errores
- [ ] Frontend corriendo sin errores
- [ ] Login funciona con usuario de prueba
- [ ] Dashboard muestra métricas reales
- [ ] Puedo crear un cliente nuevo
- [ ] Puedo crear una cita nueva
- [ ] Sistema de puntos funciona (crear transacción → puntos automáticos)
- [ ] No hay errores en consola del navegador
- [ ] No hay errores en terminal del backend

---

## 🎉 ¡LISTO!

Tu aplicación está **100% funcional** con JSON Server.

**Features disponibles**:
- ✅ Login con roles y permisos
- ✅ Gestión de clientes
- ✅ Gestión de personal (barberos)
- ✅ Gestión de citas
- ✅ Sistema de lealtad (puntos automáticos)
- ✅ Gestión financiera
- ✅ Sucursales multi-sede
- ✅ Asistencia de personal
- ✅ Sistema de reviews
- ✅ Portfolio de trabajos
- ✅ Reservas públicas

**Para más detalles técnicos**: Ver `MIGRATION_COMPLETE.md`

---

**Creado**: 9 de Octubre 2025
**Versión**: 1.0.0
**Estado**: ✅ PRODUCCIÓN (Prueba)
