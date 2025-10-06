/**
 * HOOK PERSONALIZADO PARA RECORDATORIOS
 * 
 * Maneja la lógica de recordatorios automáticos en la aplicación
 * Se ejecuta cada hora para verificar si hay recordatorios pendientes
 */

import { useEffect, useCallback } from 'react';
import { useAppointmentStore, useClientStore } from '../stores';
import { processAllReminders } from '../services/reminderService';

export const useReminders = () => {
  const { appointments, updateAppointment } = useAppointmentStore();
  const { clients } = useClientStore();

  /**
   * Procesa los recordatorios pendientes
   */
  const processReminders = useCallback(async () => {
    try {
      const results = await processAllReminders(appointments, clients, updateAppointment);
      
      if (results.sent > 0) {
        console.log(`✅ Recordatorios procesados:`, {
          enviados: results.sent,
          fallidos: results.failed,
          total: results.processed
        });
        
        // En producción, esto podría enviar métricas a un servicio de monitoreo
        return results;
      }
      
      return results;
    } catch (error) {
      console.error('❌ Error procesando recordatorios:', error);
      return {
        processed: 0,
        sent: 0,
        failed: 1,
        error: error.message
      };
    }
  }, [appointments, clients, updateAppointment]);

  /**
   * Verifica si es hora de enviar recordatorios (6 PM)
   */
  const shouldSendReminders = useCallback(() => {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Solo enviar a las 6 PM (18:00)
    return currentHour === 18;
  }, []);

  /**
   * Ejecuta el procesamiento de recordatorios si es necesario
   */
  const checkAndProcessReminders = useCallback(async () => {
    if (shouldSendReminders()) {
      return await processReminders();
    }
    return null;
  }, [shouldSendReminders, processReminders]);

  /**
   * Effect principal que configura el intervalo de verificación
   */
  useEffect(() => {
    // Verificar recordatorios cada hora
    const intervalId = setInterval(async () => {
      await checkAndProcessReminders();
    }, 60 * 60 * 1000); // 1 hora

    // Verificación inicial (en caso de que la app se abra a las 6 PM)
    const timeoutId = setTimeout(async () => {
      await checkAndProcessReminders();
    }, 1000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [checkAndProcessReminders]);

  // Retornar funciones para uso manual (debugging, testing)
  return {
    processReminders,
    shouldSendReminders,
    checkAndProcessReminders
  };
};