/**
 * Middleware de Permisos
 *
 * Verifica que el usuario tenga los permisos necesarios para ejecutar una operación
 */

const { forbiddenResponse } = require('../utils/response');
const { getRequiredPermission, isPublicRoute } = require('../utils/permissions-map');

/**
 * Middleware principal de permisos
 */
function permissionsMiddleware(req, res, next) {
  // Saltar validación para OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    return next();
  }

  // Saltar validación para rutas públicas
  if (isPublicRoute(req.path, req.method)) {
    return next();
  }

  // Verificar que existe información de autenticación
  if (!req.auth) {
    return forbiddenResponse(
      res,
      'No se encontró información de autenticación. El middleware de auth debe ejecutarse primero.'
    );
  }

  // Extraer el recurso del path
  // Ejemplo: /usuarios/123 -> usuarios
  // Ejemplo: /clientes?search=juan -> clientes
  const pathParts = req.path.split('/').filter(p => p);
  const resource = pathParts[0];

  // Obtener permiso requerido
  const requiredPermission = getRequiredPermission(resource, req.method);

  // Si no hay permiso mapeado, permitir (recursos no protegidos)
  if (!requiredPermission) {
    console.log(`⚠️  [PERMS] Recurso '${resource}' no tiene permisos mapeados. Permitiendo acceso.`);
    return next();
  }

  // EXCEPCIÓN: Permitir a clientes y barberos acceder a sus propios datos
  // El middleware requireBranchAccess se encargará de filtrar automáticamente
  const { roleSlug, userId } = req.auth;

  if (req.method === 'GET') {
    // Clientes pueden ver su propia info de clientes
    if (roleSlug === 'client' && resource === 'clientes') {
      console.log(`✅ [PERMS] Permiso especial: Cliente accediendo a su propia info`);
      return next();
    }

    // Barberos pueden ver clientes y barberos (filtrado por backend)
    if (roleSlug === 'barber' && (resource === 'clientes' || resource === 'barberos')) {
      console.log(`✅ [PERMS] Permiso especial: Barbero accediendo a info filtrada`);
      return next();
    }
  }

  // Verificar permiso normal
  const hasPermission = req.auth.permissions.includes(requiredPermission);

  if (!hasPermission) {
    console.log(`❌ [PERMS] Permiso denegado: ${req.auth.roleName} intentó ${req.method} ${req.path}`);
    console.log(`   Requerido: ${requiredPermission}`);
    console.log(`   Disponibles: ${req.auth.permissions.join(', ')}`);

    return forbiddenResponse(
      res,
      `No tienes permisos para realizar esta acción. Rol actual: ${req.auth.roleName}`,
      requiredPermission
    );
  }

  // Log de éxito
  console.log(`✅ [PERMS] Permiso concedido: ${req.auth.roleName} -> ${req.method} ${req.path}`);

  next();
}

/**
 * Middleware para verificar un permiso específico
 * Útil para rutas custom
 */
function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.auth) {
      return forbiddenResponse(res, 'No autenticado');
    }

    if (!req.auth.permissions.includes(permission)) {
      return forbiddenResponse(
        res,
        `Requiere permiso: ${permission}`,
        permission
      );
    }

    next();
  };
}

/**
 * Middleware para verificar múltiples permisos (requiere AL MENOS UNO)
 */
function requireAnyPermission(permissions) {
  return (req, res, next) => {
    if (!req.auth) {
      return forbiddenResponse(res, 'No autenticado');
    }

    const hasAny = permissions.some(p => req.auth.permissions.includes(p));

    if (!hasAny) {
      return forbiddenResponse(
        res,
        `Requiere al menos uno de estos permisos: ${permissions.join(', ')}`,
        permissions
      );
    }

    next();
  };
}

/**
 * Middleware para verificar que el usuario solo acceda a sus propios recursos
 * Útil para clientes y barberos
 */
function requireOwnResource(resourceIdField = 'id') {
  return (req, res, next) => {
    const { userId, roleSlug } = req.auth;

    // Super admin y branch admin pueden acceder a todo
    if (['super_admin', 'branch_admin', 'reception'].includes(roleSlug)) {
      return next();
    }

    // Para cliente y barbero, verificar que el recurso les pertenece
    const resourceId = req.params[resourceIdField] || req.params.id;

    // Si no hay resourceId en la URL (ej: GET /citas), filtrar por userId en query
    if (!resourceId && req.method === 'GET') {
      // Agregar filtro automático
      if (roleSlug === 'client') {
        req.query.clienteId = userId;
      } else if (roleSlug === 'barber') {
        req.query.barberoId = userId;
      }
      return next();
    }

    // Si hay resourceId, verificar ownership
    // Esto requeriría consultar la BD, por simplicidad aquí solo verificamos userId
    if (parseInt(resourceId) !== userId) {
      return forbiddenResponse(
        res,
        'Solo puedes acceder a tus propios recursos'
      );
    }

    next();
  };
}

/**
 * Middleware para limitar acciones en recursos propios vs ajenos
 * Ejemplo: Un barbero puede editar su propio portfolio pero no el de otros
 */
function requireOwnershipOrPermission(ownerField, permission) {
  return (req, res, next) => {
    const { userId, permissions } = req.auth;

    // Si tiene el permiso general, permitir
    if (permissions.includes(permission)) {
      return next();
    }

    // Si no tiene permiso general, verificar que es el dueño
    const ownerId = req.body[ownerField] || req.params[ownerField];

    if (parseInt(ownerId) !== userId) {
      return forbiddenResponse(
        res,
        'Solo puedes editar tus propios recursos o necesitas el permiso: ' + permission,
        permission
      );
    }

    next();
  };
}

module.exports = {
  permissionsMiddleware,
  requirePermission,
  requireAnyPermission,
  requireOwnResource,
  requireOwnershipOrPermission
};
