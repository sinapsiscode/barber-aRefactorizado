# 🚀 BACKEND BARBERÍA - REST API con JSON Server

Backend simulado profesional con sistema de autenticación, permisos por rol, y validaciones.

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura](#estructura)
- [API Endpoints](#api-endpoints)
- [Autenticación](#autenticación)
- [Permisos](#permisos)
- [Roles](#roles)
- [Testing](#testing)

---

## ✨ Características

- ✅ **REST API completa** con JSON Server
- 🔐 **Sistema de autenticación** por headers
- 👥 **Sistema de permisos** granular por rol
- 🏢 **Multi-tenant** (sucursales)
- 📊 **Validaciones** de permisos en tiempo real
- 🌱 **Seed de datos** con Faker.js
- 📝 **Logging** con Morgan
- 🔄 **CORS** configurado
- ⏱️ **Delay artificial** para simular latencia de red
- 🛡️ **Manejo de errores** centralizado

---

## 📦 Instalación

### 1. Instalar dependencias

```bash
cd backend
npm install
```

### 2. Generar datos de prueba

```bash
npm run seed
```

Esto generará:
- 20 usuarios (con 5 predefinidos para testing)
- 5 sucursales
- 50 clientes
- 15 barberos
- 8 servicios
- 100 citas
- 80 transacciones
- 4 recompensas

### 3. Iniciar el servidor

```bash
npm start
```

O en modo desarrollo con nodemon:

```bash
npm run dev
```

El servidor estará disponible en: **http://localhost:3001**

---

## 🚀 Uso

### Iniciar servidor y seed en un comando

```bash
npm run seed:dev
```

### Resetear la base de datos

```bash
npm run reset
```

---

## 📁 Estructura

```
backend/
├── db.json                     # Base de datos JSON
├── server.js                   # Servidor principal
├── seed.js                     # Generador de datos
├── package.json                # Dependencias
│
├── middlewares/
│   ├── auth.js                # Autenticación por headers
│   └── permissions.js         # Validación de permisos
│
├── routes/
│   └── custom-routes.js       # Rutas personalizadas (futuro)
│
└── utils/
    ├── permissions-map.js     # Mapeo de permisos por endpoint
    └── response.js            # Helpers de respuesta HTTP
```

---

## 🌐 API Endpoints

### Públicos (sin autenticación)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Health check del servidor |
| POST | `/login` | Login de usuario |
| POST | `/register` | Registro de usuario |
| GET | `/portfolio` | Galería pública (solo GET) |
| GET | `/servicios` | Catálogo de servicios |

### Protegidos (requieren autenticación)

#### Usuarios
| Método | Endpoint | Permiso Requerido |
|--------|----------|-------------------|
| GET | `/usuarios` | `ver_usuarios` |
| GET | `/usuarios/:id` | `ver_usuarios` |
| POST | `/usuarios` | `crear_usuario` |
| PUT/PATCH | `/usuarios/:id` | `editar_usuario` |
| DELETE | `/usuarios/:id` | `eliminar_usuario` |

#### Clientes
| Método | Endpoint | Permiso Requerido |
|--------|----------|-------------------|
| GET | `/clientes` | `ver_clientes` |
| GET | `/clientes/:id` | `ver_clientes` |
| POST | `/clientes` | `crear_cliente` |
| PUT/PATCH | `/clientes/:id` | `editar_cliente` |
| DELETE | `/clientes/:id` | `eliminar_cliente` |

#### Barberos
| Método | Endpoint | Permiso Requerido |
|--------|----------|-------------------|
| GET | `/barberos` | `ver_barberos` |
| GET | `/barberos/:id` | `ver_barberos` |
| POST | `/barberos` | `crear_barbero` |
| PUT/PATCH | `/barberos/:id` | `editar_barbero` |
| DELETE | `/barberos/:id` | `eliminar_barbero` |

#### Citas
| Método | Endpoint | Permiso Requerido |
|--------|----------|-------------------|
| GET | `/citas` | `ver_citas` |
| GET | `/citas/:id` | `ver_citas` |
| POST | `/citas` | `crear_cita` |
| PUT/PATCH | `/citas/:id` | `editar_cita` |
| DELETE | `/citas/:id` | `eliminar_cita` |

#### Sucursales
| Método | Endpoint | Permiso Requerido |
|--------|----------|-------------------|
| GET | `/sucursales` | `ver_sucursales` |
| POST | `/sucursales` | `crear_sucursal` |
| PUT/PATCH | `/sucursales/:id` | `editar_sucursal` |
| DELETE | `/sucursales/:id` | `eliminar_sucursal` |

#### Finanzas
| Método | Endpoint | Permiso Requerido |
|--------|----------|-------------------|
| GET | `/transacciones` | `ver_transacciones` |
| POST | `/transacciones` | `crear_transaccion` |
| PUT/PATCH | `/transacciones/:id` | `editar_transaccion` |
| DELETE | `/transacciones/:id` | `eliminar_transaccion` |

#### Otros recursos
- `/servicios` - Servicios de la barbería
- `/portfolio` - Galería de trabajos
- `/recompensas` - Sistema de loyalty
- `/reviews` - Reseñas de barberos
- `/asistencias` - Control de asistencia

### Rutas Especiales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/roles/:id/permisos` | Obtener permisos de un rol |
| GET | `/modulos/accesibles/:roleId` | Módulos accesibles por rol |
| GET | `/estadisticas` | Estadísticas del dashboard |

---

## 🔐 Autenticación

### Headers Requeridos

Para acceder a endpoints protegidos, debes enviar estos headers:

```
x-role-id: 1        # ID del rol (requerido)
x-user-id: 5        # ID del usuario (opcional)
```

### Ejemplo con fetch

```javascript
fetch('http://localhost:3001/clientes', {
  headers: {
    'Content-Type': 'application/json',
    'x-role-id': '1',      // Super Admin
    'x-user-id': '1'       // Usuario Admin Principal
  }
})
```

### Ejemplo con axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'x-role-id': '1',
    'x-user-id': '1'
  }
});

// Usar
const response = await api.get('/clientes');
```

### Ejemplo con curl

```bash
curl -X GET http://localhost:3001/clientes \
  -H "x-role-id: 1" \
  -H "x-user-id: 1"
```

---

## 🔑 Login y Registro

### Login

**POST** `/login`

```json
{
  "email": "admin@barberia.com",
  "password": "admin123"
}
```

**Respuesta exitosa:**

```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "usuario": {
      "id": 1,
      "nombre": "Admin Principal",
      "email": "admin@barberia.com",
      "rolId": 1,
      "sucursalId": null,
      "activo": true
    },
    "rol": {
      "id": 1,
      "nombre": "Super Administrador",
      "slug": "super_admin",
      "permisos": ["ver_usuarios", "crear_usuario", ...]
    },
    "token": "fake-jwt-token-1"
  }
}
```

### Registro

**POST** `/register`

```json
{
  "nombre": "Juan Pérez",
  "email": "juan@email.com",
  "password": "password123",
  "rolId": 5
}
```

---

## 👥 Roles

### Roles del Sistema

| ID | Slug | Nombre | Descripción |
|----|------|--------|-------------|
| 1 | `super_admin` | Super Administrador | Acceso total |
| 2 | `branch_admin` | Admin de Sede | Administra una sucursal |
| 3 | `reception` | Recepcionista | Gestiona citas y clientes |
| 4 | `barber` | Barbero | Ve sus citas y portfolio |
| 5 | `client` | Cliente | Gestiona sus propias citas |

### Usuarios de Prueba

| Email | Password | Rol |
|-------|----------|-----|
| admin@barberia.com | admin123 | Super Admin |
| admin.lima@barberia.com | admin123 | Branch Admin |
| recepcion@barberia.com | recepcion123 | Recepcionista |
| barbero@barberia.com | barbero123 | Barbero |
| cliente@barberia.com | cliente123 | Cliente |

---

## 🛡️ Permisos

### Lista de Permisos

#### Usuarios
- `ver_usuarios` - Ver lista de usuarios
- `crear_usuario` - Crear nuevo usuario
- `editar_usuario` - Editar usuario
- `eliminar_usuario` - Eliminar usuario

#### Clientes
- `ver_clientes` - Ver lista de clientes
- `crear_cliente` - Crear nuevo cliente
- `editar_cliente` - Editar cliente
- `eliminar_cliente` - Eliminar cliente

#### Barberos/Personal
- `ver_barberos` - Ver personal
- `crear_barbero` - Crear barbero
- `editar_barbero` - Editar barbero
- `eliminar_barbero` - Eliminar barbero

#### Citas
- `ver_citas` - Ver todas las citas
- `ver_citas_propias` - Ver solo citas propias
- `crear_cita` - Crear cita
- `crear_cita_propia` - Crear cita propia
- `editar_cita` - Editar cualquier cita
- `editar_cita_propia` - Editar cita propia
- `eliminar_cita` - Eliminar cita
- `eliminar_cita_propia` - Eliminar cita propia

#### Sucursales
- `ver_sucursales` - Ver sucursales
- `crear_sucursal` - Crear sucursal
- `editar_sucursal` - Editar sucursal
- `eliminar_sucursal` - Eliminar sucursal

#### Finanzas
- `ver_transacciones` - Ver transacciones
- `crear_transaccion` - Registrar transacción
- `editar_transaccion` - Editar transacción
- `eliminar_transaccion` - Eliminar transacción
- `ver_reportes` - Ver reportes financieros

#### Portfolio
- `ver_portfolio` - Ver galería
- `crear_portfolio` - Agregar trabajo
- `editar_portfolio` - Editar trabajo
- `editar_portfolio_propio` - Editar trabajo propio
- `eliminar_portfolio` - Eliminar trabajo

#### Recompensas
- `ver_recompensas` - Ver recompensas
- `crear_recompensa` - Crear recompensa
- `editar_recompensa` - Editar recompensa
- `eliminar_recompensa` - Eliminar recompensa
- `canjear_recompensa` - Canjear recompensa

#### Reviews
- `ver_reviews` - Ver reseñas
- `ver_reviews_propias` - Ver reseñas propias
- `crear_review` - Crear reseña
- `responder_review` - Responder reseña
- `eliminar_review` - Eliminar reseña

#### Sistema
- `gestionar_permisos` - Gestionar permisos
- `gestionar_roles` - Gestionar roles

### Matriz de Permisos por Rol

Ver archivo `db.json` sección `roles` para ver los permisos exactos de cada rol.

---

## 🧪 Testing

### Postman / Insomnia

1. Importa la colección (próximamente)
2. Configura headers `x-role-id` y `x-user-id`
3. Prueba los endpoints

### Ejemplo de prueba con curl

**1. Health Check:**
```bash
curl http://localhost:3001/health
```

**2. Login:**
```bash
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@barberia.com","password":"admin123"}'
```

**3. Obtener clientes (como super admin):**
```bash
curl http://localhost:3001/clientes \
  -H "x-role-id: 1" \
  -H "x-user-id: 1"
```

**4. Intentar crear usuario sin permisos (debería fallar):**
```bash
curl -X POST http://localhost:3001/usuarios \
  -H "Content-Type: application/json" \
  -H "x-role-id: 5" \
  -d '{"nombre":"Test","email":"test@test.com"}'
```

Respuesta esperada: `403 Forbidden`

---

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la carpeta `backend/`:

```env
PORT=3001
DELAY=500
NODE_ENV=development
```

### Cambiar Puerto

```bash
PORT=4000 npm start
```

### Cambiar Delay

```bash
DELAY=1000 npm start
```

---

## 📊 Filtros y Queries de JSON Server

JSON Server soporta queries automáticas:

### Filtros
```
GET /clientes?estado=active
GET /citas?barberoId=1
GET /citas?sucursalId=1&estado=confirmed
```

### Paginación
```
GET /clientes?_page=1&_limit=10
```

### Ordenamiento
```
GET /clientes?_sort=nombre&_order=asc
GET /citas?_sort=fecha&_order=desc
```

### Búsqueda
```
GET /clientes?nombre_like=Juan
GET /clientes?q=search_term
```

### Operadores
```
GET /clientes?puntosLealtad_gte=1000
GET /citas?fecha_gte=2025-01-01&fecha_lte=2025-12-31
```

---

## 🐛 Debugging

### Logs del Servidor

El servidor muestra logs detallados:

```
🔐 [AUTH] Rol: Super Administrador | User ID: 1 | Path: GET /clientes
✅ [PERMS] Permiso concedido: Super Administrador -> GET /clientes
```

### Errores de Permisos

```
❌ [PERMS] Permiso denegado: Cliente intentó POST /usuarios
   Requerido: crear_usuario
   Disponibles: ver_citas_propias, crear_cita_propia, ...
```

---

## 🚨 Respuestas de Error

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Header x-role-id requerido",
  "timestamp": "2025-10-07T..."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "No tienes permisos para realizar esta acción",
  "requiredPermission": "crear_usuario",
  "timestamp": "2025-10-07T..."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Recurso no encontrado",
  "timestamp": "2025-10-07T..."
}
```

---

## 📚 Recursos Adicionales

- [JSON Server Docs](https://github.com/typicode/json-server)
- [Faker.js Docs](https://fakerjs.dev/)
- [Express Middleware](https://expressjs.com/en/guide/using-middleware.html)

---

## 🤝 Contribuir

Para agregar nuevos permisos o módulos, edita:

1. `db.json` - Agregar permiso al rol
2. `utils/permissions-map.js` - Mapear permiso al endpoint
3. `server.js` - Crear ruta custom si es necesario

---

## 📝 Notas

- Este es un backend **simulado** para desarrollo y testing
- En producción, usar un backend real con:
  - JWT tokens
  - Passwords hasheados (bcrypt)
  - Base de datos real (PostgreSQL, MongoDB, etc)
  - Validaciones robustas
  - Rate limiting
  - HTTPS

---

**Creado con ❤️ para Barbería App**
