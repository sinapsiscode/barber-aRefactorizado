import React from 'react';
import { FiX, FiClock, FiUpload, FiInfo, FiStar } from 'react-icons/fi';
import { useClientAppointmentForm } from '../../hooks';
import {
  CLIENT_APPOINTMENT_LABELS,
  CLIENT_APPOINTMENT_MESSAGES,
  PORTFOLIO_CONFIG
} from '../../constants';
import { Modal, FormInput } from '../common';
import CountryFlag from '../common/CountryFlag';
import { getPaymentMethods } from '../../utils/paymentUtils';
import { StepIndicator, NavigationFooter, SelectionCard } from './components';

const ClientAppointmentForm = ({ client, selectedDate, onClose, onSuccess }) => {
  const {
    // Estado
    formData,
    step,
    loading,
    previewImage,
    portfolioImages,
    selectedPortfolioImage,
    availableSlots,
    // Datos computados
    selectedBranch,
    branchBarbers,
    selectedBarber,
    selectedServices,
    totalPrice,
    totalDuration,
    // Funciones de navegación
    nextStep,
    prevStep,
    canProceed,
    // Funciones de formulario
    updateFormData,
    toggleService,
    handleFileChange,
    removeVoucherImage,
    handleSubmit,
    // Funciones de estado
    setSelectedPortfolioImage
  } = useClientAppointmentForm(client, selectedDate, onClose, onSuccess);

  // Renderizar paso de selección de sede
  const renderBranchStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-xl font-semibold text-gray-900">
          {CLIENT_APPOINTMENT_LABELS.FORM.STEP_TITLES.BRANCH}
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {branchBarbers.length > 0 && branchBarbers.map(branch => (
            <SelectionCard
              key={branch.id}
              isSelected={formData.branchId === branch.id}
              onClick={() => updateFormData('branchId', branch.id)}
            >
              <div className="flex items-center mb-2">
                <CountryFlag country={branch.country} size={16} />
                <h4 className="ml-2 font-semibold text-gray-900">{branch.name}</h4>
              </div>
              <p className="mb-2 text-sm text-gray-600">{branch.address}</p>
              <div className="flex items-center text-sm text-gray-500">
                <FiClock className="w-4 h-4 mr-1" />
                <span>{branch.openTime} - {branch.closeTime}</span>
              </div>
            </SelectionCard>
          ))}
        </div>
      </div>
    </div>
  );

  // Renderizar paso de selección de servicios
  const renderServicesStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-xl font-semibold text-gray-900">
          {CLIENT_APPOINTMENT_LABELS.FORM.STEP_TITLES.SERVICES}
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          {selectedServices.map(service => (
            <SelectionCard
              key={service.id}
              isSelected={formData.services.includes(service.id)}
              onClick={() => toggleService(service.id)}
            >
              <div>
                <h4 className="font-semibold text-gray-900">{service.name}</h4>
                <p className="text-sm text-gray-600">{service.duration} min</p>
              </div>
              <div className="flex items-center">
                <span className="mr-3 text-lg font-bold text-primary-600">
                  S/{service.price}
                </span>
              </div>
            </SelectionCard>
          ))}
        </div>
        {formData.services.length > 0 && (
          <div className="p-4 mt-4 rounded-lg bg-primary-50">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">
                {CLIENT_APPOINTMENT_MESSAGES.SUMMARY.TOTAL_LABEL}
              </span>
              <div className="text-right">
                <div className="text-xl font-bold text-primary-600">
                  S/{totalPrice}
                </div>
                <div className="text-sm text-gray-600">
                  {CLIENT_APPOINTMENT_MESSAGES.SUMMARY.DURATION_LABEL.replace('{duration}', totalDuration)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Renderizar paso de portafolio
  const renderPortfolioStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900">
          {CLIENT_APPOINTMENT_LABELS.FORM.STEP_TITLES.PORTFOLIO}
        </h3>
        <p className="mb-4 text-gray-600">
          {CLIENT_APPOINTMENT_MESSAGES.PORTFOLIO.DESCRIPTION}
        </p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {portfolioImages.map(image => (
            <div
              key={image.id}
              onClick={() => setSelectedPortfolioImage(image)}
              className="relative overflow-hidden transition-transform rounded-lg cursor-pointer group hover:scale-105"
            >
              <div className="aspect-[3/4] bg-gray-200">
                <img
                  src={image.image}
                  alt={image.title}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.src = `${PORTFOLIO_CONFIG.PLACEHOLDER_URL}${encodeURIComponent(image.style)}`;
                  }}
                />
              </div>
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-full p-3 text-white">
                  <p className="text-sm font-bold">{image.title}</p>
                  <p className="text-xs opacity-90">{image.style}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs">{image.barber}</p>
                    <div className="flex items-center">
                      <FiStar className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{image.rating}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {image.tags?.slice(0, PORTFOLIO_CONFIG.DISPLAY_TAGS).map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-xs bg-white/20 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center mt-6">
          <button
            onClick={() => updateFormData('step', 4)}
            className="text-sm text-gray-500 underline hover:text-gray-700"
          >
            {CLIENT_APPOINTMENT_LABELS.FORM.NAVIGATION.SKIP_STEP}
          </button>
        </div>
      </div>
    </div>
  );


  // Generar mensaje de WhatsApp
  const generateWhatsAppMessage = (appointmentData) => {
    const selectedServicesNames = services
      .filter(s => appointmentData.services.includes(s.id))
      .map(s => s.name)
      .join(', ');

    const formatDate = new Date(appointmentData.date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `🗓️ *NUEVA RESERVA DE CITA*

👤 *Cliente:* ${appointmentData.clientName}
📅 *Fecha:* ${formatDate}
⏰ *Hora:* ${appointmentData.time}
✂️ *Barbero:* ${appointmentData.barberName}
🏢 *Sede:* ${selectedBranch?.name}
📍 *Dirección:* ${selectedBranch?.address}

🎯 *Servicios:*
${selectedServicesNames}

💰 *Total:* S/${appointmentData.totalPrice}
⏱️ *Duración:* ${appointmentData.duration} min

${appointmentData.paymentMethod === 'efectivo' 
  ? '✅ *Pago:* En efectivo al llegar' 
  : `💳 *Pago:* ${appointmentData.paymentMethod.toUpperCase()} - Voucher #${appointmentData.voucherNumber}`
}

${appointmentData.notes ? `📝 *Notas:* ${appointmentData.notes}` : ''}

_Mensaje generado automáticamente por el sistema de reservas_`;
  };

  // Renderizar el contenido del paso actual
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return renderBranchStep();
      case 2:
        return renderServicesStep();
      case 3:
        return renderPortfolioStep();
      // Los demás pasos se implementarían aquí siguiendo el mismo patrón
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={CLIENT_APPOINTMENT_LABELS.FORM.TITLE}
      size="xl"
      className="max-h-[90vh]"
    >
      <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
        <StepIndicator currentStep={step} />
        {renderStepContent()}
      </div>

      <NavigationFooter
        currentStep={step}
        totalSteps={7}
        canProceed={canProceed()}
        onPrevious={prevStep}
        onNext={nextStep}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </Modal>
  );
};

export default ClientAppointmentForm;
