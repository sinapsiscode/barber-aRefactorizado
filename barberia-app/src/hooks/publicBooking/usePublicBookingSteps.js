import { useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  formatSelectedDate
} from '../../utils/publicBooking/publicBookingUtils';
import { BOOKING_STEPS } from '../../constants/publicBooking';

/**
 * Hook para manejar la navegación entre pasos del wizard de reservas
 */
export const usePublicBookingSteps = ({
  selectedTime,
  selectedDate,
  selectedServices,
  otherService,
  otherServiceText,
  formData,
  totalDuration,
  totalPrice,
  validateForm,
  resetForm,
  resetServices
}) => {
  const [currentStep, setCurrentStep] = useState(BOOKING_STEPS.CALENDAR);

  /**
   * Avanza al paso del formulario
   */
  const handleProceedToForm = useCallback(() => {
    if (selectedTime) {
      setCurrentStep(BOOKING_STEPS.FORM);
    } else {
      Swal.fire('Error', 'Por favor selecciona una hora', 'error');
    }
  }, [selectedTime]);

  /**
   * Retrocede al paso del calendario
   */
  const handleBackToCalendar = useCallback(() => {
    setCurrentStep(BOOKING_STEPS.CALENDAR);
  }, []);

  /**
   * Envía la reserva por WhatsApp
   */
  const handleSubmitBooking = useCallback(() => {
    if (!validateForm(selectedServices, otherService, otherServiceText)) {
      return;
    }

    // Construir mensaje de WhatsApp
    const whatsappMessage = buildWhatsAppMessage({
      formData,
      selectedDate,
      selectedTime,
      selectedServices,
      otherService,
      otherServiceText,
      totalDuration,
      totalPrice
    });

    // Construir URL de WhatsApp
    const whatsappUrl = buildWhatsAppUrl(whatsappMessage);

    // Lista de servicios para mostrar
    const servicesList = [
      ...selectedServices.map(s => s.name),
      ...(otherService && otherServiceText ? [`OTROS: ${otherServiceText}`] : [])
    ].join(', ');

    // Mostrar confirmación
    Swal.fire({
      title: 'Reserva Confirmada',
      html: `
        <div class="text-left">
          <p><strong>Cliente:</strong> ${formData.nombre} ${formData.apellido}</p>
          <p><strong>Fecha:</strong> ${formatSelectedDate(selectedDate)}</p>
          <p><strong>Hora:</strong> ${selectedTime}</p>
          <p><strong>Servicios:</strong> ${servicesList}</p>
          <p><strong>Total:</strong> S/ ${totalPrice}</p>
          <p class="mt-4 text-sm text-gray-600">Recuerda enviar el adelanto del 50% (S/ ${totalPrice / 2}) por YAPE/PLIN: 916 919 552</p>
          <p class="mt-4 text-center">
            <strong>La información de tu reserva se enviará por WhatsApp</strong>
          </p>
        </div>
      `,
      icon: 'success',
      confirmButtonText: 'Enviar por WhatsApp',
      confirmButtonColor: '#25D366',
      showCancelButton: true,
      cancelButtonText: 'Cerrar',
      cancelButtonColor: '#6B7280'
    }).then((result) => {
      if (result.isConfirmed) {
        // Abrir WhatsApp en una nueva pestaña
        window.open(whatsappUrl, '_blank');

        // Resetear el formulario después de enviar
        setTimeout(() => {
          setCurrentStep(BOOKING_STEPS.CALENDAR);
          resetForm();
          resetServices();
        }, 1000);
      }
    });
  }, [
    validateForm,
    selectedServices,
    otherService,
    otherServiceText,
    formData,
    selectedDate,
    selectedTime,
    totalDuration,
    totalPrice,
    resetForm,
    resetServices
  ]);

  return {
    currentStep,
    handleProceedToForm,
    handleBackToCalendar,
    handleSubmitBooking
  };
};
