/**
 * Middleware de Autenticación
 *
 * Lee el roleId desde el header 'x-role-id' y busca el rol en la BD
 * En un backend real, aquí se validaría un JWT y se extraería el usuario
 */

const fs = require('fs');
const path = require('path');
const { unauthorizedResponse } = require('../utils/response');
const { isPublicRoute } = require('../utils/permissions-map');

/**
 * Carga los datos de la base de datos
 */
function loadDatabase() {
  try {
    const dbPath = path.join(__dirname, '..', 'db.json');
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading database:', error);
    return { roles: [], usuarios: [] };
  }
}

/**
 * Middleware de autenticación
 */
function authMiddleware(req, res, next) {
  // Saltar autenticación para rutas públicas
  if (isPublicRoute(req.path, req.method)) {
    return next();
  }

  // Leer roleId desde header
  const roleId = req.get('x-role-id');
  const userId = req.get('x-user-id'); // Opcional: para tracking

  // Validar que existe roleId
  if (!roleId) {
    return unauthorizedResponse(
      res,
      'Header x-role-id requerido. Envía el ID del rol del usuario autenticado.'
    );
  }

  // Cargar base de datos
  const db = loadDatabase();

  // Buscar el rol
  const role = db.roles.find(r => r.id === parseInt(roleId));

  if (!role) {
    return unauthorizedResponse(
      res,
      `Rol con ID ${roleId} no encontrado en el sistema`
    );
  }

  // Buscar usuario si se proporcionó userId
  let user = null;
  if (userId) {
    user = db.usuarios.find(u => u.id === parseInt(userId));
  }

  // Adjuntar información de autenticación al request
  req.auth = {
    roleId: role.id,
    roleSlug: role.slug,
    roleName: role.nombre,
    permissions: role.permisos || [],
    userId: userId ? parseInt(userId) : null,
    user: user,
    sucursalId: user?.sucursalId || null
  };

  // Log de autenticación (útil para debugging)
  console.log(`🔐 [AUTH] Rol: ${role.nombre} | User ID: ${userId || 'N/A'} | Path: ${req.method} ${req.path}`);

  next();
}

/**
 * Middleware opcional para requerir autenticación específica de usuario
 * (no solo rol, sino usuario específico)
 */
function requireUser(req, res, next) {
  if (!req.auth || !req.auth.user) {
    return unauthorizedResponse(
      res,
      'Se requiere autenticación de usuario. Envía x-user-id en los headers.'
    );
  }
  next();
}

/**
 * Middleware para verificar que el usuario pertenece a una sucursal específica
 * Útil para branch_admin que solo debe ver su sucursal
 */
function requireBranchAccess(req, res, next) {
  const { roleSlug, sucursalId } = req.auth || {};

  // Super admin puede acceder a todo
  if (roleSlug === 'super_admin') {
    return next();
  }

  // Branch admin debe tener sucursal asignada
  if (roleSlug === 'branch_admin') {
    if (!sucursalId) {
      return unauthorizedResponse(
        res,
        'Tu usuario no tiene una sucursal asignada. Contacta al administrador.'
      );
    }

    // Filtrar por sucursal en queries GET
    if (req.method === 'GET') {
      // Agregar filtro de sucursal si no existe
      if (!req.query.sucursalId) {
        req.query.sucursalId = sucursalId;
      }
    }

    // Validar sucursal en POST/PUT/PATCH
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      if (req.body.sucursalId && req.body.sucursalId !== sucursalId) {
        return unauthorizedResponse(
          res,
          'No puedes crear/editar recursos de otras sucursales'
        );
      }
      // Forzar sucursal del usuario
      req.body.sucursalId = sucursalId;
    }
  }

  next();
}

module.exports = {
  authMiddleware,
  requireUser,
  requireBranchAccess
};
