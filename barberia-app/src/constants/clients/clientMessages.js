/**
 * Mensajes de SweetAlert2 para acciones de clientes
 */

export const UNWELCOME_MESSAGES = {
  mark: {
    title: '¿Marcar como "No Grato"?',
    inputLabel: 'Motivo (obligatorio)',
    inputPlaceholder: 'Describe el motivo por el cual este cliente es considerado no grato...',
    confirmButtonText: 'Marcar como No Grato',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#dc2626',
    icon: 'warning',
    minReasonLength: 10,
    validationError: 'Debes proporcionar un motivo de al menos 10 caracteres'
  },

  remove: {
    title: '¿Remover estado "No Grato"?',
    icon: 'question',
    confirmButtonText: 'Sí, remover',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#059669'
  },

  rehabilitateAll: {
    title: '¿Rehabilitar todos los clientes?',
    icon: 'question',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#059669'
  },

  rehabilitateSelected: {
    title: '¿Rehabilitar clientes seleccionados?',
    icon: 'question',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#059669'
  },

  success: {
    marked: {
      title: 'Cliente Marcado',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    },
    removed: {
      title: 'Estado Removido',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    },
    rehabilitated: {
      title: 'Clientes Rehabilitados',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    },
    exported: {
      title: 'Lista Exportada',
      text: 'La lista de clientes no gratos ha sido descargada',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    }
  },

  error: {
    general: {
      title: 'Error',
      icon: 'error'
    }
  }
};

/**
 * Función helper para generar texto dinámico
 */
export const getUnwelcomeMessageText = {
  mark: (clientName) =>
    `¿Estás seguro de que quieres marcar a ${clientName} como cliente no grato?`,

  remove: (clientName) =>
    `¿Estás seguro de que quieres remover el estado de "No Grato" de ${clientName}?`,

  rehabilitateAll: (count) =>
    `¿Estás seguro de que quieres remover el estado de "No Grato" de todos los ${count} cliente${count > 1 ? 's' : ''}?`,

  rehabilitateSelected: (clientNames) =>
    `¿Estás seguro de que quieres remover el estado de "No Grato" de los siguientes clientes?<br><br><strong>${clientNames}</strong>`,

  successMarked: (clientName) =>
    `${clientName} ha sido marcado como cliente no grato`,

  successRemoved: (clientName) =>
    `${clientName} ya no es considerado cliente no grato`,

  successRehabilitated: (count) =>
    `${count} cliente${count > 1 ? 's han' : ' ha'} sido rehabilitado${count > 1 ? 's' : ''}`,

  confirmButtonRehabilitate: (count) =>
    `${count > 1 ? 'Sí, rehabilitar todos' : 'Sí, rehabilitar'}`,

  confirmButtonRehabilitateSelected: (count) =>
    `Rehabilitar ${count} cliente${count > 1 ? 's' : ''}`
};
