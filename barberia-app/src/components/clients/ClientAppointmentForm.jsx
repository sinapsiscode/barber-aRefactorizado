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

  // Enviar formulario
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
        status: formData.paymentMethod === 'efectivo' ? 'confirmed' : 'pending_payment',
        paymentMethod: formData.paymentMethod,
        voucherImage: previewImage,
        voucherNumber: formData.voucherNumber,
        notes: formData.notes
      };

      await createAppointment(appointmentData);
      
      // Generar mensaje de WhatsApp
      const message = generateWhatsAppMessage(appointmentData);
      const whatsappUrl = `https://wa.me/51999999999?text=${encodeURIComponent(message)}`;
      
      await Swal.fire({
        icon: 'success',
        title: '¡Cita Reservada!',
        html: `
          <p>Tu cita ha sido ${formData.paymentMethod === 'efectivo' ? 'confirmada' : 'registrada y está pendiente de verificación de pago'}.</p>
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
        title: 'Error',
        text: 'No se pudo crear la cita. Por favor intenta nuevamente.',
        confirmButtonColor: '#ffc000'
      });
    } finally {
      setLoading(false);
    }
  };

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

          {/* PASO 1: SELECCIÓN DE SEDE */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Selecciona tu sede preferida
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {branches.map(branch => (
                    <div
                      key={branch.id}
                      onClick={() => setFormData({ ...formData, branchId: branch.id })}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.branchId === branch.id
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <CountryFlag country={branch.country} size={16} />
                            <h4 className="ml-2 font-semibold text-gray-900">{branch.name}</h4>
                          </div>
                          <p className="mb-2 text-sm text-gray-600">{branch.address}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <FiClock className="w-4 h-4 mr-1" />
                            <span>{branch.openTime} - {branch.closeTime}</span>
                          </div>
                        </div>
                        {formData.branchId === branch.id && (
                          <FiCheck className="w-5 h-5 text-primary-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PASO 2: SELECCIÓN DE SERVICIOS */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  ¿Qué servicios necesitas?
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {services.map(service => (
                    <div
                      key={service.id}
                      onClick={() => {
                        const isSelected = formData.services.includes(service.id);
                        setFormData({
                          ...formData,
                          services: isSelected
                            ? formData.services.filter(id => id !== service.id)
                            : [...formData.services, service.id]
                        });
                      }}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.services.includes(service.id)
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{service.name}</h4>
                          <p className="text-sm text-gray-600">{service.duration} min</p>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-3 text-lg font-bold text-primary-600">
                            S/{service.price}
                          </span>
                          {formData.services.includes(service.id) && (
                            <FiCheck className="w-5 h-5 text-primary-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {formData.services.length > 0 && (
                  <div className="p-4 mt-4 rounded-lg bg-primary-50">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Total:</span>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary-600">
                          S/{totalPrice}
                        </div>
                        <div className="text-sm text-gray-600">
                          Duración: {totalDuration} min
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PASO 3: PORTAFOLIO */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Explora nuestros trabajos
                </h3>
                <p className="mb-4 text-gray-600">
                  Mira algunos ejemplos de los estilos que realizamos
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
                            e.target.src = `https://via.placeholder.com/400x500/f3f4f6/9ca3af?text=${encodeURIComponent(image.style)}`;
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
                            {image.tags?.slice(0, 2).map((tag, idx) => (
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
                    onClick={() => setStep(4)}
                    className="text-sm text-gray-500 underline hover:text-gray-700"
                  >
                    Saltar este paso
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PASO 4: SELECCIÓN DE BARBERO */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Elige tu barbero
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {branchBarbers.map(barber => (
                    <div
                      key={barber.id}
                      onClick={() => setFormData({ ...formData, barberId: barber.id })}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.barberId === barber.id
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-12 h-12 mr-3 font-bold text-white rounded-full bg-primary-600">
                            {barber.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{barber.name}</h4>
                            <p className="text-sm text-gray-600">{barber.specialty}</p>
                            <div className="flex items-center mt-1">
                              <FiStar className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
                              <span className="text-sm text-gray-600">{barber.rating || '4.8'}</span>
                            </div>
                          </div>
                        </div>
                        {formData.barberId === barber.id && (
                          <FiCheck className="w-5 h-5 text-primary-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PASO 5: SELECCIÓN DE HORARIO */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Selecciona fecha y hora
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Fecha
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Hora disponible
                    </label>
                    <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                      {availableSlots.map(slot => (
                        <button
                          key={slot.time}
                          onClick={() => setFormData({ ...formData, time: slot.time })}
                          className={`px-3 py-2 text-sm rounded-lg transition-all ${
                            formData.time === slot.time
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                    {availableSlots.length === 0 && formData.date && formData.barberId && (
                      <p className="mt-2 text-sm text-red-600">
                        No hay horarios disponibles para esta fecha
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PASO 6: MÉTODO DE PAGO */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Método de pago
                </h3>
                <div className="space-y-4">
                  {getPaymentMethods(selectedBranch?.country).map(method => (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.paymentMethod === method.id
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-4 h-4 text-primary-600"
                      />
                      <div className="flex items-center ml-3">
                        {method.icon && (
                          <img src={method.icon} alt={method.name} className="w-8 h-8 mr-3" />
                        )}
                        <span className="font-medium">{method.name}</span>
                      </div>
                    </label>
                  ))}
                </div>

                {formData.paymentMethod !== 'efectivo' && (
                  <div className="p-4 mt-6 space-y-4 rounded-lg bg-gray-50">
                    <h4 className="font-medium text-gray-900">Información del pago</h4>
                    <FormInput
                      label="Número de operación"
                      value={formData.voucherNumber}
                      onChange={(e) => setFormData({ ...formData, voucherNumber: e.target.value })}
                      placeholder="Ej: 123456789"
                      required
                    />
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Subir voucher de pago
                      </label>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg cursor-pointer bg-primary-600 hover:bg-primary-700">
                          <FiUpload className="w-4 h-4 mr-2" />
                          Seleccionar imagen
                          <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                          />
                        </label>
                        {previewImage && (
                          <div className="relative">
                            <img
                              src={previewImage}
                              alt="Voucher"
                              className="object-cover w-20 h-20 rounded-lg"
                            />
                            <button
                              onClick={() => {
                                setPreviewImage(null);
                                setFormData({ ...formData, voucherImage: null });
                              }}
                              className="absolute -top-2 -right-2 p-1 text-white bg-red-500 rounded-full"
                            >
                              <FiX className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PASO 7: RESUMEN Y CONFIRMACIÓN */}
          {step === 7 && (
            <div className="space-y-6">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Resumen de tu reserva
              </h3>
              
              <div className="p-6 space-y-4 rounded-lg bg-gray-50">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-600">Sede</p>
                    <p className="font-semibold text-gray-900">{selectedBranch?.name}</p>
                    <p className="text-sm text-gray-600">{selectedBranch?.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Barbero</p>
                    <p className="font-semibold text-gray-900">{selectedBarber?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(formData.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Hora</p>
                    <p className="font-semibold text-gray-900">{formData.time}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="mb-2 text-sm text-gray-600">Servicios seleccionados</p>
                  {selectedServices.map(service => (
                    <div key={service.id} className="flex items-center justify-between py-1">
                      <span className="text-gray-900">{service.name}</span>
                      <span className="font-semibold">S/{service.price}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total a pagar</p>
                      <p className="text-xs text-gray-500">Duración estimada: {totalDuration} min</p>
                    </div>
                    <p className="text-2xl font-bold text-primary-600">S/{totalPrice}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">Método de pago</p>
                  <p className="font-semibold text-gray-900">
                    {formData.paymentMethod === 'efectivo' ? 'Efectivo (pagar en tienda)' : formData.paymentMethod.toUpperCase()}
                  </p>
                  {formData.voucherNumber && (
                    <p className="text-sm text-gray-600">Voucher: #{formData.voucherNumber}</p>
                  )}
                </div>

                {formData.notes && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">Notas adicionales</p>
                    <p className="text-gray-900">{formData.notes}</p>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-lg bg-yellow-50">
                <div className="flex items-start">
                  <FiInfo className="w-5 h-5 mt-0.5 text-yellow-600 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      {formData.paymentMethod === 'efectivo' 
                        ? 'Tu cita quedará confirmada automáticamente. Recuerda llegar 10 minutos antes.'
                        : 'Tu cita quedará pendiente hasta que verifiquemos tu pago. Te notificaremos cuando esté confirmada.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">
                    Notas adicionales (opcional)
                  </span>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Alguna preferencia o indicación especial..."
                  />
                </label>
              </div>
            </div>
          )}
  );

export default ClientAppointmentForm;