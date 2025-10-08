/**
 * Utilidades para respuestas HTTP estandarizadas
 */

/**
 * Respuesta de éxito
 */
function successResponse(res, data, message = 'Operación exitosa', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
}

/**
 * Respuesta de error
 */
function errorResponse(res, message = 'Error en la operación', statusCode = 500, errors = null) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  });
}

/**
 * Error de autenticación
 */
function unauthorizedResponse(res, message = 'No autenticado') {
  return errorResponse(res, message, 401);
}

/**
 * Error de permisos
 */
function forbiddenResponse(res, message = 'No tienes permisos para realizar esta acción', requiredPermission = null) {
  return res.status(403).json({
    success: false,
    message,
    requiredPermission,
    timestamp: new Date().toISOString()
  });
}

/**
 * Recurso no encontrado
 */
function notFoundResponse(res, resource = 'Recurso') {
  return errorResponse(res, `${resource} no encontrado`, 404);
}

/**
 * Error de validación
 */
function validationErrorResponse(res, errors) {
  return errorResponse(res, 'Error de validación', 422, errors);
}

/**
 * Respuesta de creación exitosa
 */
function createdResponse(res, data, message = 'Recurso creado exitosamente') {
  return successResponse(res, data, message, 201);
}

/**
 * Respuesta sin contenido (para DELETE exitoso)
 */
function noContentResponse(res) {
  return res.status(204).send();
}

module.exports = {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  validationErrorResponse,
  createdResponse,
  noContentResponse
};
