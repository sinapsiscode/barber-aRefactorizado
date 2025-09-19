import { useCallback } from 'react';
import { CONTACT } from '../constants';

/**
 * Hook personalizado para manejar mensajes de WhatsApp
 * Centraliza la lógica de creación de URLs y mensajes
 */
export const useWhatsApp = () => {
  const createWhatsAppUrl = useCallback((message, phone = CONTACT.WHATSAPP.PHONE) => {
    const encodedMessage = encodeURIComponent(message);
    return `${CONTACT.WHATSAPP.BASE_URL}${phone}?text=${encodedMessage}`;
  }, []);

  const sendMessage = useCallback((message, phone = CONTACT.WHATSAPP.PHONE) => {
    const url = createWhatsAppUrl(message, phone);
    window.open(url, '_blank');
  }, [createWhatsAppUrl]);

  const sendReminderMessage = useCallback((clientName, phone = CONTACT.WHATSAPP.PHONE) => {
    const message = CONTACT.WHATSAPP.MESSAGES.REMINDER.replace('{name}', clientName);
    sendMessage(message, phone);
  }, [sendMessage]);

  const sendAppointmentConfirmation = useCallback((clientName, appointmentDetails, phone = CONTACT.WHATSAPP.PHONE) => {
    const message = `Hola ${clientName}! ${CONTACT.WHATSAPP.MESSAGES.APPOINTMENT_CONFIRMATION}: ${appointmentDetails}`;
    sendMessage(message, phone);
  }, [sendMessage]);

  return {
    createWhatsAppUrl,
    sendMessage,
    sendReminderMessage,
    sendAppointmentConfirmation
  };
};