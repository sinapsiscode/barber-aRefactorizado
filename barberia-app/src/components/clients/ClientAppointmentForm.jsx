import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useAppointmentStore } from '../../stores';
import { useAppointmentForm } from '../../hooks/clients/useAppointmentForm';
import { useFileUpload } from '../../hooks/clients/useFileUpload';
import { usePortfolioModal } from '../../hooks/clients/usePortfolioModal';
import { StepIndicator, StepNavigation } from './AppointmentForm';
import {
  BranchSelection,
  ServiceSelection,
  PortfolioGallery,
  BarberSelection,
  SchedulePicker,
  PaymentMethod,
  AppointmentSummary
} from './AppointmentForm/steps';
import { VALIDATION_MESSAGES, SUCCESS_MESSAGES, APPOINTMENT_STATUS } from '../../constants/appointmentForm';
import { generateWhatsAppMessage, generateWhatsAppUrl } from '../../utils/clients/appointmentFormUtils';
import Swal from 'sweetalert2';

/**
 * Formulario de reserva de citas para clientes
 * Refactorizado en componentes modulares
 */
const ClientAppointmentForm = ({ client, selectedDate, onClose, onSuccess }) => {
  const { createAppointment, services } = useAppointmentStore();
  const [loading, setLoading] = useState(false);

  // Hooks custom
  const {
    formData,
    step,
    availableSlots,
    portfolioImages,
    selectedBranch,
    branchBarbers,
    selectedBarber,
    selectedServices,
    totalPrice,
    totalDuration,
    branches,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    canProceed
  } = useAppointmentForm(selectedDate);

  const {
    previewImage,
    uploadedFile,
    handleFileChange,
    clearFile
  } = useFileUpload();

  const {
    selectedPortfolioImage,
    openPortfolioImage,
    closePortfolioImage
  } = usePortfolioModal();

  // Manejadores de eventos por paso
  const handleBranchSelect = (branchId) => {
    updateFormData({ branchId, barberId: '', time: '' });
  };

  const handleServiceToggle = (serviceId) => {
    const isSelected = formData.services.includes(serviceId);
    updateFormData({
      services: isSelected
        ? formData.services.filter(id => id !== serviceId)
        : [...formData.services, serviceId]
    });
  };

  const handleBarberSelect = (barberId) => {
    updateFormData({ barberId, time: '' });
  };

  const handleDateChange = (date) => {
    updateFormData({ date, time: '' });
  };

  const handleTimeChange = (time) => {
    updateFormData({ time });
  };

  const handlePaymentMethodChange = (paymentMethod) => {
    updateFormData({ paymentMethod });
  };

  const handleVoucherNumberChange = (voucherNumber) => {
    updateFormData({ voucherNumber });
  };

  const handleNotesChange = (notes) => {
    updateFormData({ notes });
  };

  const handleFileUpload = (e) => {
    handleFileChange(e, (file, base64) => {
      updateFormData({ voucherImage: file });
    });
  };

  const handleClearVoucher = () => {
    clearFile();
    updateFormData({ voucherImage: null });
  };

  // Navegación entre pasos
  const handleNextStep = () => {
    const success = nextStep();
    if (!success) {
      Swal.fire({
        icon: 'warning',
        title: VALIDATION_MESSAGES.INCOMPLETE_STEP.title,
        text: VALIDATION_MESSAGES.INCOMPLETE_STEP.text,
        confirmButtonColor: '#ffc000'
      });
    }
  };

  // Envío del formulario
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const appointmentData = {
        clientId: client.id,
        clientName: client.name,
        barberId: parseInt(formData.barberId),
        barberName: selectedBarber?.name,
        branchId: parseInt(formData.branchId),
        date: formData.date,
        time: formData.time,
        services: formData.services,
        totalPrice,
        duration: totalDuration,
        status: formData.paymentMethod === 'efectivo'
          ? APPOINTMENT_STATUS.CONFIRMED
          : APPOINTMENT_STATUS.PENDING_PAYMENT,
        paymentMethod: formData.paymentMethod,
        voucherImage: previewImage,
        voucherNumber: formData.voucherNumber,
        notes: formData.notes
      };

      await createAppointment(appointmentData);

      // Generar mensaje y URL de WhatsApp
      const message = generateWhatsAppMessage(appointmentData, services, selectedBranch);
      const whatsappUrl = generateWhatsAppUrl(message);

      const paymentStatus = formData.paymentMethod === 'efectivo'
        ? SUCCESS_MESSAGES.CASH_PAYMENT
        : SUCCESS_MESSAGES.DIGITAL_PAYMENT;

      await Swal.fire({
        icon: 'success',
        title: '¡Cita Reservada!',
        html: `
          <p>Tu cita ha sido ${paymentStatus}.</p>
          <a href="${whatsappUrl}" target="_blank" class="inline-flex items-center px-4 py-2 mt-4 text-white bg-green-500 rounded-lg hover:bg-green-600">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Enviar por WhatsApp
          </a>
        `,
        confirmButtonColor: '#ffc000',
        confirmButtonText: 'Entendido'
      });

      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error('Error al crear cita:', error);
      Swal.fire({
        icon: 'error',
        title: VALIDATION_MESSAGES.ERROR_CREATING.title,
        text: VALIDATION_MESSAGES.ERROR_CREATING.text,
        confirmButtonColor: '#ffc000'
      });
    } finally {
      setLoading(false);
    }
  };

  // Renderizar el paso actual
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <BranchSelection
            branches={branches}
            selectedBranchId={formData.branchId}
            onSelectBranch={handleBranchSelect}
          />
        );
      case 2:
        return (
          <ServiceSelection
            services={services}
            selectedServices={formData.services}
            totalPrice={totalPrice}
            totalDuration={totalDuration}
            onToggleService={handleServiceToggle}
          />
        );
      case 3:
        return (
          <PortfolioGallery
            portfolioImages={portfolioImages}
            onSelectImage={openPortfolioImage}
            onSkip={() => goToStep(4)}
          />
        );
      case 4:
        return (
          <BarberSelection
            barbers={branchBarbers}
            selectedBarberId={formData.barberId}
            onSelectBarber={handleBarberSelect}
          />
        );
      case 5:
        return (
          <SchedulePicker
            date={formData.date}
            time={formData.time}
            availableSlots={availableSlots}
            onDateChange={handleDateChange}
            onTimeChange={handleTimeChange}
          />
        );
      case 6:
        return (
          <PaymentMethod
            selectedMethod={formData.paymentMethod}
            voucherNumber={formData.voucherNumber}
            voucherImage={formData.voucherImage}
            previewImage={previewImage}
            country={selectedBranch?.country}
            onMethodChange={handlePaymentMethodChange}
            onVoucherNumberChange={handleVoucherNumberChange}
            onFileChange={handleFileUpload}
            onClearFile={handleClearVoucher}
          />
        );
      case 7:
        return (
          <AppointmentSummary
            selectedBranch={selectedBranch}
            selectedBarber={selectedBarber}
            selectedServices={selectedServices}
            date={formData.date}
            time={formData.time}
            totalPrice={totalPrice}
            totalDuration={totalDuration}
            paymentMethod={formData.paymentMethod}
            voucherNumber={formData.voucherNumber}
            notes={formData.notes}
            onNotesChange={handleNotesChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              Reservar Cita
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-white transition-colors rounded-lg hover:bg-white/20"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <StepIndicator currentStep={step} />
          {renderStep()}
        </div>

        {/* Footer con navegación */}
        <StepNavigation
          step={step}
          canProceed={canProceed()}
          loading={loading}
          onPrevious={prevStep}
          onNext={handleNextStep}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ClientAppointmentForm;
