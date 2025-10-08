# 📚 Ejemplos de Uso del Backend

## 🚀 Inicio Rápido

### 1. Instalar y Generar Datos

```bash
cd backend
npm install
npm run seed
npm start
```

Servidor corriendo en: **http://localhost:3001**

---

## 🔑 Autenticación

### Login

```javascript
// JavaScript/Fetch
const response = await fetch('http://localhost:3001/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@barberia.com',
    password: 'admin123'
  })
});

const data = await response.json();
console.log(data.data.usuario);
console.log(data.data.rol);
```

```bash
# cURL
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@barberia.com","password":"admin123"}'
```

---

## 👥 Obtener Datos con Permisos

### Como Super Admin (puede ver todo)

```javascript
const response = await fetch('http://localhost:3001/clientes', {
  headers: {
    'x-role-id': '1',  // Super Admin
    'x-user-id': '1'
  }
});

const clientes = await response.json();
```

### Como Recepcionista (permisos limitados)

```javascript
// ✅ Puede ver clientes
const clientes = await fetch('http://localhost:3001/clientes', {
  headers: { 'x-role-id': '3' }  // Recepcionista
});

// ❌ NO puede crear barberos
const response = await fetch('http://localhost:3001/barberos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-role-id': '3'
  },
  body: JSON.stringify({ nombre: 'Nuevo Barbero' })
});
// Respuesta: 403 Forbidden
```

---

## 📊 CRUD Completo con Axios

### Setup

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'x-role-id': '1',  // Super Admin
    'x-user-id': '1'
  }
});
```

### Obtener Todos los Clientes

```javascript
const response = await api.get('/clientes');
console.log(response.data); // Array de clientes
```

### Obtener Cliente por ID

```javascript
const response = await api.get('/clientes/1');
console.log(response.data); // Cliente con id=1
```

### Crear Cliente

```javascript
const nuevoCliente = {
  nombre: 'Pedro García',
  email: 'pedro@email.com',
  telefono: '+51 999 888 777',
  sucursalPreferida: 1,
  estado: 'active'
};

const response = await api.post('/clientes', nuevoCliente);
console.log(response.data); // Cliente creado con ID
```

### Actualizar Cliente

```javascript
const updates = {
  telefono: '+51 999 888 999',
  puntosLealtad: 150
};

const response = await api.patch('/clientes/1', updates);
console.log(response.data); // Cliente actualizado
```

### Eliminar Cliente

```javascript
await api.delete('/clientes/1');
// 204 No Content
```

---

## 🔍 Filtros y Búsquedas

### Filtrar por Campo

```javascript
// Clientes activos
const activos = await api.get('/clientes?estado=active');

// Clientes de sucursal 1
const sucursal1 = await api.get('/clientes?sucursalPreferida=1');

// Citas de barbero 2
const citas = await api.get('/citas?barberoId=2');
```

### Búsqueda por Nombre

```javascript
// Buscar clientes con "Juan" en el nombre
const resultados = await api.get('/clientes?nombre_like=Juan');
```

### Búsqueda General

```javascript
// Buscar en todos los campos
const resultados = await api.get('/clientes?q=garcia');
```

### Múltiples Filtros

```javascript
// Citas confirmadas de barbero 1 en sucursal 2
const citas = await api.get('/citas', {
  params: {
    barberoId: 1,
    sucursalId: 2,
    estado: 'confirmed'
  }
});
```

---

## 📄 Paginación

```javascript
// Página 1, 10 items por página
const page1 = await api.get('/clientes?_page=1&_limit=10');

// Página 2
const page2 = await api.get('/clientes?_page=2&_limit=10');

// Headers de paginación
console.log(page1.headers['x-total-count']); // Total de items
console.log(page1.headers['link']); // Links de navegación
```

---

## 🔢 Ordenamiento

```javascript
// Ordenar por nombre ascendente
const asc = await api.get('/clientes?_sort=nombre&_order=asc');

// Ordenar por puntos descendente
const desc = await api.get('/clientes?_sort=puntosLealtad&_order=desc');

// Múltiples ordenamientos
const multi = await api.get('/clientes?_sort=sucursalPreferida,nombre&_order=asc,asc');
```

---

## 🔢 Operadores de Comparación

```javascript
// Clientes con más de 1000 puntos
const vip = await api.get('/clientes?puntosLealtad_gte=1000');

// Clientes con menos de 100 puntos
const nuevos = await api.get('/clientes?puntosLealtad_lte=100');

// Citas en un rango de fechas
const enero = await api.get('/citas', {
  params: {
    fecha_gte: '2025-01-01',
    fecha_lte: '2025-01-31'
  }
});
```

---

## 🎯 Rutas Especiales

### Obtener Permisos de un Rol

```javascript
const permisos = await api.get('/roles/1/permisos');
console.log(permisos.data.permisos);
// ['ver_usuarios', 'crear_usuario', ...]
```

### Módulos Accesibles por Rol

```javascript
const modulos = await api.get('/modulos/accesibles/3');
console.log(modulos.data);
// [{ id: 1, nombre: 'Dashboard', ... }, ...]
```

### Estadísticas del Dashboard

```javascript
const stats = await api.get('/estadisticas', {
  headers: {
    'x-role-id': '1',
    'x-user-id': '1'
  }
});

console.log(stats.data);
// { usuarios: 20, clientes: 50, barberos: 15, ... }
```

---

## 🏢 Restricciones por Sucursal (Branch Admin)

```javascript
// Branch Admin con sucursalId = 2
const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'x-role-id': '2',  // branch_admin
    'x-user-id': '2'   // Usuario con sucursalId: 2
  }
});

// ✅ Ver solo clientes de su sucursal
const clientes = await api.get('/clientes');
// Automáticamente filtrado por sucursalId: 2

// ❌ NO puede crear barberos en otra sucursal
const response = await api.post('/barberos', {
  nombre: 'Nuevo Barbero',
  sucursalId: 1  // Otra sucursal
});
// Error: No puedes crear recursos de otras sucursales
```

---

## 🔐 Testing de Permisos

### Intentar Acción sin Permiso

```javascript
// Cliente intenta crear un usuario (no tiene permiso)
const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'x-role-id': '5',  // Cliente
    'x-user-id': '5'
  }
});

try {
  await api.post('/usuarios', {
    nombre: 'Test',
    email: 'test@test.com'
  });
} catch (error) {
  console.error(error.response.status); // 403
  console.error(error.response.data);
  // {
  //   success: false,
  //   message: 'No tienes permisos...',
  //   requiredPermission: 'crear_usuario'
  // }
}
```

---

## 🧪 Testing Completo con Jest

```javascript
import axios from 'axios';

describe('API Backend', () => {
  const api = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
      'x-role-id': '1',
      'x-user-id': '1'
    }
  });

  it('debería hacer login exitoso', async () => {
    const response = await axios.post('http://localhost:3001/login', {
      email: 'admin@barberia.com',
      password: 'admin123'
    });

    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(response.data.data.usuario).toBeDefined();
  });

  it('debería obtener clientes', async () => {
    const response = await api.get('/clientes');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  it('debería crear un cliente', async () => {
    const nuevoCliente = {
      nombre: 'Test Cliente',
      email: 'test@test.com',
      telefono: '+51 999 888 777'
    };

    const response = await api.post('/clientes', nuevoCliente);
    expect(response.status).toBe(201);
    expect(response.data.nombre).toBe(nuevoCliente.nombre);
  });

  it('debería denegar permisos a cliente', async () => {
    const apiCliente = axios.create({
      baseURL: 'http://localhost:3001',
      headers: { 'x-role-id': '5' }
    });

    try {
      await apiCliente.post('/usuarios', { nombre: 'Test' });
      fail('Debería haber lanzado error 403');
    } catch (error) {
      expect(error.response.status).toBe(403);
    }
  });
});
```

---

## 📱 Integración con React

### Custom Hook para API

```javascript
// hooks/useApi.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export function useApi(endpoint, roleId = 1, userId = 1) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001${endpoint}`,
          {
            headers: {
              'x-role-id': roleId,
              'x-user-id': userId
            }
          }
        );
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, roleId, userId]);

  return { data, loading, error };
}

// Uso en componente
function ClientesList() {
  const { data: clientes, loading, error } = useApi('/clientes', 1, 1);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {clientes.map(cliente => (
        <li key={cliente.id}>{cliente.nombre}</li>
      ))}
    </ul>
  );
}
```

---

## 💡 Tips y Buenas Prácticas

### 1. Crear instancia de axios por rol

```javascript
// utils/api.js
import axios from 'axios';

export function createApiClient(roleId, userId) {
  return axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
      'x-role-id': roleId,
      'x-user-id': userId
    }
  });
}

// Uso
const adminApi = createApiClient(1, 1);
const clientApi = createApiClient(5, 10);
```

### 2. Interceptor para manejo de errores

```javascript
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 403) {
      console.error('Sin permisos:', error.response.data);
      // Redirigir o mostrar mensaje
    }
    return Promise.reject(error);
  }
);
```

### 3. Caché local con React Query

```javascript
import { useQuery } from '@tanstack/react-query';

function useClientes() {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: () => api.get('/clientes').then(r => r.data),
    staleTime: 5 * 60 * 1000 // 5 minutos
  });
}
```

---

**¡Listo para empezar a desarrollar con el backend!** 🚀
