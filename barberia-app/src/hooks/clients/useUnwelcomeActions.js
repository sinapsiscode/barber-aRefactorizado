/**
 * Custom Hook para acciones de clientes "No Gratos"
 * Encapsula toda la lógica de SweetAlert2 y llamadas al store
 */

import { useCallback } from 'react';
import Swal from 'sweetalert2';
import { UNWELCOME_MESSAGES, getUnwelcomeMessageText } from '../../constants/clients/clientMessages';
import { exportUnwelcomeClients } from '../../utils/clients/clientExport';

/**
 * Hook para manejar acciones de clientes "No Gratos"
 * @param {Object} clientStoreMethods - Métodos del clientStore
 * @param {Array} unwelcomeClients - Lista de clientes unwelcome
 * @returns {Object} - Handlers para las acciones
 */
export const useUnwelcomeActions = (clientStoreMethods, unwelcomeClients) => {
  const { markAsUnwelcome, removeUnwelcomeStatus } = clientStoreMethods;

  /**
   * Marcar un cliente como "No Grato"
   */
  const handleMarkAsUnwelcome = useCallback(async (clientId, clientName) => {
    try {
      const { value: reason } = await Swal.fire({
        title: UNWELCOME_MESSAGES.mark.title,
        text: getUnwelcomeMessageText.mark(clientName),
        input: 'textarea',
        inputLabel: UNWELCOME_MESSAGES.mark.inputLabel,
        inputPlaceholder: UNWELCOME_MESSAGES.mark.inputPlaceholder,
        inputValidator: (value) => {
          if (!value || value.trim().length < UNWELCOME_MESSAGES.mark.minReasonLength) {
            return UNWELCOME_MESSAGES.mark.validationError;
          }
        },
        showCancelButton: true,
        confirmButtonText: UNWELCOME_MESSAGES.mark.confirmButtonText,
        cancelButtonText: UNWELCOME_MESSAGES.mark.cancelButtonText,
        confirmButtonColor: UNWELCOME_MESSAGES.mark.confirmButtonColor,
        icon: UNWELCOME_MESSAGES.mark.icon
      });

      if (reason) {
        await markAsUnwelcome(clientId, reason.trim());

        await Swal.fire({
          ...UNWELCOME_MESSAGES.success.marked,
          text: getUnwelcomeMessageText.successMarked(clientName)
        });
      }
    } catch (error) {
      console.error('Error al marcar cliente como no grato:', error);
      await Swal.fire({
        ...UNWELCOME_MESSAGES.error.general,
        text: 'No se pudo marcar el cliente como no grato'
      });
    }
  }, [markAsUnwelcome]);

  /**
   * Remover estado "No Grato" de un cliente individual
   */
  const handleRemoveUnwelcome = useCallback(async (clientId, clientName) => {
    try {
      const result = await Swal.fire({
        title: UNWELCOME_MESSAGES.remove.title,
        text: getUnwelcomeMessageText.remove(clientName),
        icon: UNWELCOME_MESSAGES.remove.icon,
        showCancelButton: true,
        confirmButtonText: UNWELCOME_MESSAGES.remove.confirmButtonText,
        cancelButtonText: UNWELCOME_MESSAGES.remove.cancelButtonText,
        confirmButtonColor: UNWELCOME_MESSAGES.remove.confirmButtonColor
      });

      if (result.isConfirmed) {
        await removeUnwelcomeStatus(clientId);

        await Swal.fire({
          ...UNWELCOME_MESSAGES.success.removed,
          text: getUnwelcomeMessageText.successRemoved(clientName)
        });
      }
    } catch (error) {
      console.error('Error al remover estado no grato:', error);
      await Swal.fire({
        ...UNWELCOME_MESSAGES.error.general,
        text: 'No se pudo remover el estado de no grato'
      });
    }
  }, [removeUnwelcomeStatus]);

  /**
   * Rehabilitar TODOS los clientes "No Gratos"
   */
  const handleRehabilitateAll = useCallback(async () => {
    if (unwelcomeClients.length === 0) return;

    try {
      const result = await Swal.fire({
        title: UNWELCOME_MESSAGES.rehabilitateAll.title,
        text: getUnwelcomeMessageText.rehabilitateAll(unwelcomeClients.length),
        icon: UNWELCOME_MESSAGES.rehabilitateAll.icon,
        showCancelButton: true,
        confirmButtonText: getUnwelcomeMessageText.confirmButtonRehabilitate(unwelcomeClients.length),
        cancelButtonText: UNWELCOME_MESSAGES.rehabilitateAll.cancelButtonText,
        confirmButtonColor: UNWELCOME_MESSAGES.rehabilitateAll.confirmButtonColor
      });

      if (result.isConfirmed) {
        // Rehabilitar todos secuencialmente
        for (const client of unwelcomeClients) {
          await removeUnwelcomeStatus(client.id);
        }

        await Swal.fire({
          ...UNWELCOME_MESSAGES.success.rehabilitated,
          text: getUnwelcomeMessageText.successRehabilitated(unwelcomeClients.length)
        });
      }
    } catch (error) {
      console.error('Error al rehabilitar todos los clientes:', error);
      await Swal.fire({
        ...UNWELCOME_MESSAGES.error.general,
        text: 'No se pudieron rehabilitar todos los clientes'
      });
    }
  }, [unwelcomeClients, removeUnwelcomeStatus]);

  /**
   * Rehabilitar solo los clientes seleccionados
   */
  const handleRehabilitateSelected = useCallback(async (selectedClientIds) => {
    if (selectedClientIds.length === 0) return;

    try {
      // Obtener nombres de los clientes seleccionados
      const selectedClientsList = selectedClientIds
        .map(id => unwelcomeClients.find(c => c.id === id))
        .filter(Boolean);

      const clientNames = selectedClientsList
        .map(c => c.name)
        .join(', ');

      const result = await Swal.fire({
        title: UNWELCOME_MESSAGES.rehabilitateSelected.title,
        html: getUnwelcomeMessageText.rehabilitateSelected(clientNames),
        icon: UNWELCOME_MESSAGES.rehabilitateSelected.icon,
        showCancelButton: true,
        confirmButtonText: getUnwelcomeMessageText.confirmButtonRehabilitateSelected(selectedClientIds.length),
        cancelButtonText: UNWELCOME_MESSAGES.rehabilitateSelected.cancelButtonText,
        confirmButtonColor: UNWELCOME_MESSAGES.rehabilitateSelected.confirmButtonColor
      });

      if (result.isConfirmed) {
        // Rehabilitar seleccionados secuencialmente
        for (const clientId of selectedClientIds) {
          await removeUnwelcomeStatus(clientId);
        }

        await Swal.fire({
          ...UNWELCOME_MESSAGES.success.rehabilitated,
          text: getUnwelcomeMessageText.successRehabilitated(selectedClientIds.length)
        });

        return true; // Indica que se debe limpiar la selección
      }

      return false;
    } catch (error) {
      console.error('Error al rehabilitar clientes seleccionados:', error);
      await Swal.fire({
        ...UNWELCOME_MESSAGES.error.general,
        text: 'No se pudieron rehabilitar los clientes seleccionados'
      });
      return false;
    }
  }, [unwelcomeClients, removeUnwelcomeStatus]);

  /**
   * Exportar lista de clientes "No Gratos" a JSON
   */
  const handleExportList = useCallback(async () => {
    try {
      const success = exportUnwelcomeClients(unwelcomeClients);

      if (success) {
        await Swal.fire(UNWELCOME_MESSAGES.success.exported);
      } else {
        throw new Error('Falló la exportación');
      }
    } catch (error) {
      console.error('Error al exportar lista:', error);
      await Swal.fire({
        ...UNWELCOME_MESSAGES.error.general,
        text: 'No se pudo exportar la lista'
      });
    }
  }, [unwelcomeClients]);

  return {
    handleMarkAsUnwelcome,
    handleRemoveUnwelcome,
    handleRehabilitateAll,
    handleRehabilitateSelected,
    handleExportList
  };
};
