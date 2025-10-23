/**
 * BACKEND SIMULADO CON JSON SERVER
 *
 * Servidor REST API con:
 * - Autenticación por headers
 * - Sistema de permisos por rol
 * - Validaciones
 * - Logging
 * - CORS configurado
 */

// Cargar variables de entorno desde .env
require('dotenv').config();

const jsonServer = require('json-server');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const { authMiddleware, requireBranchAccess } = require('./middlewares/auth');
const { permissionsMiddleware } = require('./middlewares/permissions');

// Crear servidor
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults({
  logger: false // Deshabilitamos el logger por defecto para usar morgan
});

// Configuración
const PORT = process.env.PORT;
const DELAY = process.env.DELAY;

// ============================================
// MIDDLEWARES GLOBALES
// ============================================

// CORS - Permitir requests desde el frontend (cualquier puerto de localhost)
server.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (como Postman) y cualquier localhost
    if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-role-id', 'x-user-id', 'Authorization', 'Cache-Control', 'Pragma', 'Expires'],
  credentials: true
}));

// Logger HTTP con morgan
server.use(morgan('dev'));

// Middlewares por defecto de json-server
server.use(middlewares);

// Body parser
server.use(jsonServer.bodyParser);

// Delay artificial para simular red real
server.use((req, res, next) => {
  setTimeout(next, DELAY);
});

// ============================================
// RUTAS CUSTOM (ANTES DE JSON-SERVER)
// ============================================

/**
 * Ruta de health check
 */
server.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

/**
 * Ruta de login
 * POST /login
 * Body: { email, password }
 */
server.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email y password son requeridos'
    });
  }

  // Buscar usuario en la BD
  const db = router.db; // Acceso a lowdb
  const usuarios = db.get('usuarios').value();

  const usuario = usuarios.find(u => u.email === email);

  if (!usuario) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }

  if (usuario.password !== password) {
    return res.status(401).json({
      success: false,
      message: 'Contraseña incorrecta'
    });
  }

  // Buscar rol del usuario
  const roles = db.get('roles').value();
  const rol = roles.find(r => r.id === usuario.rolId);

  // Remover password de la respuesta
  const { password: _, ...usuarioSinPassword } = usuario;

  res.json({
    success: true,
    message: 'Login exitoso',
    data: {
      usuario: usuarioSinPassword,
      rol: rol,
      token: `fake-jwt-token-${usuario.id}` // En producción sería un JWT real
    }
  });
});

/**
 * Ruta de registro
 * POST /register
 * Body: { nombre, email, password, rolId }
 */
server.post('/register', (req, res) => {
  const { nombre, email, password, rolId } = req.body;

  // Validaciones básicas
  if (!nombre || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Nombre, email y password son requeridos'
    });
  }

  const db = router.db;
  const usuarios = db.get('usuarios').value();

  // Verificar que el email no exista
  const emailExists = usuarios.find(u => u.email === email);
  if (emailExists) {
    return res.status(409).json({
      success: false,
      message: 'El email ya está registrado'
    });
  }

  // Crear nuevo usuario
  const nuevoUsuario = {
    id: Date.now(),
    nombre,
    email,
    password, // En producción esto debería estar hasheado
    rolId: rolId || 5, // Por defecto cliente
    sucursalId: null,
    activo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Guardar en la BD
  db.get('usuarios').push(nuevoUsuario).write();

  // Buscar rol
  const rol = db.get('roles').find({ id: nuevoUsuario.rolId }).value();

  // Remover password
  const { password: _, ...usuarioSinPassword } = nuevoUsuario;

  res.status(201).json({
    success: true,
    message: 'Usuario registrado exitosamente',
    data: {
      usuario: usuarioSinPassword,
      rol: rol
    }
  });
});

/**
 * Ruta para obtener permisos de un rol
 * GET /roles/:id/permisos
 */
server.get('/roles/:id/permisos', (req, res) => {
  const roleId = parseInt(req.params.id);
  const db = router.db;

  const rol = db.get('roles').find({ id: roleId }).value();

  if (!rol) {
    return res.status(404).json({
      success: false,
      message: 'Rol no encontrado'
    });
  }

  res.json({
    success: true,
    data: {
      rol: rol.nombre,
      permisos: rol.permisos
    }
  });
});

/**
 * Ruta para obtener módulos accesibles por un rol
 * GET /modulos/accesibles/:roleId
 */
server.get('/modulos/accesibles/:roleId', (req, res) => {
  const roleId = parseInt(req.params.roleId);
  const db = router.db;

  const modulos = db.get('modulos').value();
  const modulosAccesibles = modulos.filter(m => m.accesoRoles.includes(roleId));

  res.json({
    success: true,
    data: modulosAccesibles
  });
});

/**
 * Endpoint para estadísticas rápidas (Dashboard)
 * GET /estadisticas
 */
server.get('/estadisticas', authMiddleware, permissionsMiddleware, (req, res) => {
  const db = router.db;

  const totalUsuarios = db.get('usuarios').size().value();
  const totalClientes = db.get('clientes').size().value();
  const totalBarberos = db.get('barberos').size().value();
  const totalCitas = db.get('citas').size().value();
  const totalSucursales = db.get('sucursales').size().value();

  // Filtrar por sucursal si es branch_admin
  let stats = {
    usuarios: totalUsuarios,
    clientes: totalClientes,
    barberos: totalBarberos,
    citas: totalCitas,
    sucursales: totalSucursales
  };

  if (req.auth.roleSlug === 'branch_admin' && req.auth.sucursalId) {
    const sucursalId = req.auth.sucursalId;
    stats = {
      usuarios: totalUsuarios,
      clientes: db.get('clientes').filter({ sucursalId }).size().value(),
      barberos: db.get('barberos').filter({ sucursalId }).size().value(),
      citas: db.get('citas').filter({ sucursalId }).size().value(),
      sucursales: 1
    };
  }

  res.json({
    success: true,
    data: stats
  });
});

/**
 * Endpoint para obtener niveles de lealtad
 * GET /configuracion/nivelesLealtad
 */
server.get('/configuracion/nivelesLealtad', authMiddleware, permissionsMiddleware, (req, res) => {
  const db = router.db;
  const configuracion = db.get('configuracion').value();

  if (!configuracion || !configuracion.nivelesLealtad) {
    return res.status(404).json({
      success: false,
      message: 'Niveles de lealtad no encontrados'
    });
  }

  res.json(configuracion.nivelesLealtad);
});

/**
 * Endpoint para obtener un nivel de lealtad específico
 * GET /configuracion/nivelesLealtad/:id
 */
server.get('/configuracion/nivelesLealtad/:id', authMiddleware, permissionsMiddleware, (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const configuracion = db.get('configuracion').value();

  if (!configuracion || !configuracion.nivelesLealtad) {
    return res.status(404).json({
      success: false,
      message: 'Niveles de lealtad no encontrados'
    });
  }

  const nivel = configuracion.nivelesLealtad.find(n => n.id === id);

  if (!nivel) {
    return res.status(404).json({
      success: false,
      message: 'Nivel de lealtad no encontrado'
    });
  }

  res.json(nivel);
});

/**
 * Endpoint para obtener configuración de puntos
 * GET /configuracion/puntosSettings
 */
server.get('/configuracion/puntosSettings', authMiddleware, permissionsMiddleware, (req, res) => {
  const db = router.db;
  const configuracion = db.get('configuracion').value();

  if (!configuracion || !configuracion.puntosSettings) {
    return res.status(404).json({
      success: false,
      message: 'Configuración de puntos no encontrada'
    });
  }

  res.json(configuracion.puntosSettings);
});

// ============================================
// MIDDLEWARES DE AUTENTICACIÓN Y PERMISOS
// ============================================

// Aplicar autenticación a todas las rutas (excepto públicas)
server.use(authMiddleware);

// Aplicar validación de permisos
server.use(permissionsMiddleware);

// Aplicar validación de sucursal para branch_admin
server.use(requireBranchAccess);

// ============================================
// ROUTER DE JSON-SERVER
// ============================================

// Usar el router de json-server (esto maneja GET, POST, PUT, PATCH, DELETE)
server.use(router);

// ============================================
// MANEJO DE ERRORES
// ============================================

server.use((err, req, res, next) => {
  console.error('❌ [ERROR]', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

server.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║                                                        ║');
  console.log('║     🚀  BACKEND BARBERÍA - JSON SERVER RUNNING  🚀     ║');
  console.log('║                                                        ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`📊 Resources: http://localhost:${PORT}/`);
  console.log(`💚 Health: http://localhost:${PORT}/health`);
  console.log(`🔑 Login: POST http://localhost:${PORT}/login`);
  console.log(`\n⏱️  Delay: ${DELAY}ms (simula latencia de red)`);
  console.log(`\n📁 Database: ${path.join(__dirname, 'db.json')}`);
  console.log('\n🔐 Headers requeridos:');
  console.log('   x-role-id: ID del rol (1=super_admin, 2=branch_admin, etc)');
  console.log('   x-user-id: ID del usuario (opcional)\n');
  console.log('💡 Tip: Usa seed.js para generar datos de prueba');
  console.log('   npm run seed\n');
  console.log('═══════════════════════════════════════════════════════════\n');
});

// Manejo de señales para shutdown graceful
process.on('SIGINT', () => {
  console.log('\n\n🛑 Cerrando servidor...');
  process.exit(0);
});
