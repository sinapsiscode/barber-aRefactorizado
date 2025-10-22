import { usePublicCalendar } from '../hooks/publicBooking/usePublicCalendar';
import { useServiceSelection } from '../hooks/publicBooking/useServiceSelection';
import { usePublicBookingForm } from '../hooks/publicBooking/usePublicBookingForm';
import { usePublicBookingSteps } from '../hooks/publicBooking/usePublicBookingSteps';
import { usePublicData } from '../hooks/publicBooking/usePublicData';
import PublicBookingHeader from '../components/publicBooking/PublicBookingHeader';
import PublicCalendarStep from '../components/publicBooking/PublicCalendarStep';
import PublicFormStep from '../components/publicBooking/PublicFormStep';
import { BOOKING_STEPS } from '../constants/publicBooking';

/**
 * Página de Reservas Públicas Refactorizada
 * Reducido de 736 líneas a ~80 líneas
 *
 * Wizard de 2 pasos:
 * 1. Selección de fecha y hora
 * 2. Formulario de información del cliente y servicios
 *
 * ✅ FIXED: Carga de barberos para reservas públicas
 */
const PublicBooking = ({ onBackToLanding }) => {
  // Hook para cargar datos públicos (barberos y sucursales)
  const { barbers, branches, isLoading: loadingPublicData } = usePublicData();
  // Hook de calendario (navegación, selección de fecha/hora)
  const {
    currentDate,
    selectedDate,
    selectedTime,
    days,
    navigateMonth,
    handleDateSelect,
    handleTimeSelect,
    isDateSelected,
    isCurrentMonth
  } = usePublicCalendar();

  // Hook de selección de servicios
  const {
    selectedServices,
    otherService,
    otherServiceText,
    totalPrice,
    totalDuration,
    handleServiceToggle,
    toggleOtherService,
    updateOtherServiceText,
    resetServices
  } = useServiceSelection();

  // Hook de formulario
  const {
    formData,
    formErrors,
    acceptTerms,
    handleFormChange,
    handleAcceptTermsChange,
    validateForm,
    resetForm
  } = usePublicBookingForm();

  // Hook de navegación entre pasos y envío
  const {
    currentStep,
    handleProceedToForm,
    handleBackToCalendar,
    handleSubmitBooking
  } = usePublicBookingSteps({
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
  });

  // Mostrar loading mientras se cargan los datos públicos
  if (loadingPublicData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Cargando información...</p>
            <p className="text-sm text-gray-500">Obteniendo barberos y sucursales disponibles</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full">
        {/* Header con Logo e Indicador de Pasos */}
        <PublicBookingHeader
          currentStep={currentStep}
          onBackToCalendar={handleBackToCalendar}
          onBackToLanding={onBackToLanding}
        />

        {/* Contenido Condicional según el paso */}
        {currentStep === BOOKING_STEPS.CALENDAR ? (
          /* Paso 1: Selección de fecha y hora */
          <PublicCalendarStep
            currentDate={currentDate}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            days={days}
            totalDuration={totalDuration}
            onNavigateMonth={navigateMonth}
            onDateSelect={handleDateSelect}
            onTimeSelect={handleTimeSelect}
            onProceed={handleProceedToForm}
            isDateSelected={isDateSelected}
            isCurrentMonth={isCurrentMonth}
          />
        ) : (
          /* Paso 2: Formulario de información del cliente */
          <PublicFormStep
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            totalDuration={totalDuration}
            totalPrice={totalPrice}
            formData={formData}
            formErrors={formErrors}
            selectedServices={selectedServices}
            otherService={otherService}
            otherServiceText={otherServiceText}
            acceptTerms={acceptTerms}
            onFormChange={handleFormChange}
            onServiceToggle={handleServiceToggle}
            onOtherServiceToggle={toggleOtherService}
            onOtherServiceTextChange={updateOtherServiceText}
            onAcceptTermsChange={handleAcceptTermsChange}
            onSubmit={handleSubmitBooking}
          />
        )}
      </div>
    </div>
  );
};

export default PublicBooking;
