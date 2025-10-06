import { useState, useEffect } from 'react';
import {
  FiX, FiCalendar, FiClock, FiUser, FiScissors, FiMapPin,
  FiDollarSign, FiUpload, FiCheck, FiInfo, FiImage, FiChevronLeft,
  FiChevronRight, FiEye, FiCamera, FiStar, FiCheckCircle, FiAward, FiBriefcase
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useAppointmentStore, useStaffStore, useBranchStore } from '../../stores';
import { FormInput } from '../common';
import CountryFlag from '../common/CountryFlag';
import { getPaymentMethods } from '../../utils/paymentUtils';
import portfolioData from '../../data/portfolio.json';
import Swal from 'sweetalert2';

const ClientAppointmentForm = ({ client, selectedDate, onClose, onSuccess }) => {
  const { services, createAppointment, generateTimeSlots } = useAppointmentStore();
  const { getActiveBarbers, loadMockStaff, barbers } = useStaffStore();
  const { branches, loadMockBranches } = useBranchStore();
  
  const [formData, setFormData] = useState({
    branchId: '',
    services: [],
    barberId: '',
    date: selectedDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '',
    paymentMethod: 'efectivo',
    voucherImage: null,
    voucherNumber: '',
    notes: ''
  });
  
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Pasos del 1 al 7
  const [previewImage, setPreviewImage] = useState(null);
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [selectedPortfolioImage, setSelectedPortfolioImage] = useState(null);

  // Datos computados
  const selectedBranch = branches.find(b => b.id === parseInt(formData.branchId));
  const branchBarbers = formData.branchId ? getActiveBarbers().filter(b => b.branchId === parseInt(formData.branchId)) : [];
  const selectedBarber = branchBarbers.find(b => b.id === parseInt(formData.barberId));
  const selectedServices = services.filter(s => formData.services.includes(s.id));
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  // Cargar datos iniciales
  useEffect(() => {
    if (!branches || branches.length === 0) {
      loadMockBranches();
    }
    if (!barbers || barbers.length === 0) {
      loadMockStaff();
    }
  }, [branches, barbers, loadMockBranches, loadMockStaff]);

  // Generar slots disponibles cuando se seleccione barbero y fecha
  useEffect(() => {
    if (formData.date && formData.barberId) {
      const slots = generateTimeSlots(new Date(formData.date), parseInt(formData.barberId));
      setAvailableSlots(slots.filter(slot => slot.available));
    }
  }, [formData.date, formData.barberId, generateTimeSlots]);

  // Cargar portafolio cuando se seleccionan servicios
  useEffect(() => {
    if (formData.services.length > 0 && step === 3 && formData.branchId) {
      // Filtrar imágenes de portafolio basadas en los servicios seleccionados y la sede
      const relevantPortfolio = portfolioData.portfolio.filter(item => {
        // Filtrar por sede si está seleccionada
        const matchesBranch = item.branchId === parseInt(formData.branchId);
        // Verificar si algún servicio seleccionado coincide
        const matchesService = item.serviceIds.some(serviceId => 
          formData.services.includes(serviceId)
        );
        return matchesBranch || matchesService;
      });
      
      // Si hay pocas imágenes relevantes, agregar algunas más generales
      let finalPortfolio = relevantPortfolio;
      if (relevantPortfolio.length < 6) {
        const additionalItems = portfolioData.portfolio
          .filter(item => !relevantPortfolio.includes(item))
          .slice(0, 6 - relevantPortfolio.length);
        finalPortfolio = [...relevantPortfolio, ...additionalItems];
      }
      
      // Limitar a 12 imágenes máximo y ordenar por rating
      setPortfolioImages(
        finalPortfolio
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 12)
      );
    }
  }, [formData.services, formData.branchId, step]);

  // Validación por paso
  const isStepValid = (stepNumber) => {
    switch (stepNumber) {
      case 1: return formData.branchId !== '';
      case 2: return formData.services.length > 0;
      case 3: return true; // Portafolio es opcional
      case 4: return formData.barberId !== '';
      case 5: return formData.date !== '' && formData.time !== '';
      case 6: 
        if (formData.paymentMethod === 'efectivo') return true;
        return formData.voucherImage && formData.voucherNumber;
      case 7: return true;
      default: return false;
    }
  };

  const canProceed = () => isStepValid(step);

  const nextStep = () => {
    if (canProceed()) {
      setStep(step + 1);
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Información incompleta',
        text: 'Por favor completa todos los campos requeridos',
        confirmButtonColor: '#ffc000'
      });
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Manejo de archivo de voucher
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Archivo inválido',
          text: 'Por favor selecciona una imagen',
          confirmButtonColor: '#ffc000'
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'Archivo muy grande',
          text: 'La imagen no debe superar los 5MB',
          confirmButtonColor: '#ffc000'
        });
        return;
      }
      
      setFormData({ ...formData, voucherImage: file });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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

  // Indicador de progreso
  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {[
        { num: 1, label: 'Sede', icon: FiMapPin },
        { num: 2, label: 'Servicios', icon: FiScissors },
        { num: 3, label: 'Portafolio', icon: FiCamera },
        { num: 4, label: 'Barbero', icon: FiUser },
        { num: 5, label: 'Horario', icon: FiClock },
        { num: 6, label: 'Pago', icon: FiDollarSign },
        { num: 7, label: 'Confirmar', icon: FiCheckCircle }
      ].map((s, index) => (
        <div key={s.num} className="flex items-center">
          <div className={`flex flex-col items-center ${index > 0 ? 'ml-2' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
              step >= s.num 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              <s.icon className="w-5 h-5" />
            </div>
            <span className={`text-xs mt-1 ${
              step >= s.num ? 'text-primary-600 font-medium' : 'text-gray-500'
            }`}>
              {s.label}
            </span>
          </div>
          {index < 6 && (
            <div className={`h-0.5 w-8 mx-1 ${
              step > s.num ? 'bg-primary-600' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

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

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <StepIndicator />

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
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                  {branchBarbers.map(barber => (
                    <div
                      key={barber.id}
                      onClick={() => setFormData({ ...formData, barberId: barber.id })}
                      className={`p-6 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                        formData.barberId === barber.id
                          ? 'border-primary-600 bg-primary-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {/* Header del barbero */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-16 h-16 mr-4 font-bold text-white rounded-full bg-gradient-to-r from-primary-600 to-primary-500 shadow-lg">
                            {barber.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">{barber.name}</h4>
                            <p className="text-sm text-gray-600 flex items-center mt-1">
                              <FiBriefcase className="w-4 h-4 mr-1" />
                              {barber.experience || 'Barbero profesional'}
                            </p>
                            <div className="flex items-center mt-2">
                              <FiStar className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
                              <span className="text-sm font-medium text-gray-700">{barber.rating || '4.8'}</span>
                              <span className="text-xs text-gray-500 ml-2">({barber.totalServices || 1000}+ servicios)</span>
                            </div>
                          </div>
                        </div>
                        {formData.barberId === barber.id && (
                          <div className="bg-primary-600 rounded-full p-2">
                            <FiCheck className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Descripción */}
                      {barber.description && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 italic">
                            "{barber.description}"
                          </p>
                        </div>
                      )}

                      {/* Especialidades */}
                      <div className="mb-4">
                        <h5 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                          <FiScissors className="w-4 h-4 mr-1" />
                          Especialidades
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {(barber.specialties || ['Corte', 'Barba']).map((specialty, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Logros y experiencia */}
                      {barber.achievements && barber.achievements.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                            <FiAward className="w-4 h-4 mr-1 text-yellow-600" />
                            Logros destacados
                          </h5>
                          <div className="space-y-1">
                            {barber.achievements.slice(0, 3).map((achievement, index) => (
                              <div key={index} className="flex items-start text-xs text-gray-600">
                                <span className="w-1 h-1 bg-primary-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                <span>{achievement}</span>
                              </div>
                            ))}
                            {barber.achievements.length > 3 && (
                              <div className="text-xs text-primary-600 font-medium">
                                +{barber.achievements.length - 3} logros más
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Indicator de selección */}
                      {formData.barberId === barber.id && (
                        <div className="mt-4 p-3 bg-primary-100 rounded-lg">
                          <div className="flex items-center text-sm text-primary-700">
                            <FiCheckCircle className="w-4 h-4 mr-2" />
                            <span className="font-medium">Barbero seleccionado</span>
                          </div>
                        </div>
                      )}
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
        </div>

        {/* Footer con botones de navegación */}
        <div className="sticky bottom-0 flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              step === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            <FiChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </button>

          <div className="text-sm text-gray-600">
            Paso {step} de 7
          </div>

          {step < 7 ? (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                canProceed()
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Siguiente
              <FiChevronRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center px-6 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white rounded-full animate-spin border-t-transparent" />
                  Procesando...
                </>
              ) : (
                <>
                  <FiCheck className="w-4 h-4 mr-2" />
                  Confirmar Reserva
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientAppointmentForm;