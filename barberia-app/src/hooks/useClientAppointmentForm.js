// ===================================================================
// 📅 HOOK DE FORMULARIO DE CITAS PARA CLIENTES - REFACTORIZADO
// ===================================================================
// Hook personalizado para manejar la lógica compleja del formulario de citas

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useAppointmentStore, useStaffStore, useBranchStore } from '../stores';
import portfolioData from '../data/portfolio.json';
import {
  CLIENT_APPOINTMENT_VALIDATION,
  CLIENT_APPOINTMENT_MESSAGES,
  WHATSAPP_CONFIG,
  PORTFOLIO_CONFIG
} from '../constants/clientAppointments';
import { SWEETALERT_CONFIG } from '../constants/auth';

export const useClientAppointmentForm = (client, selectedDate, onClose, onSuccess) => {
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
  const [step, setStep] = useState(1);
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
      loadPortfolioImages();
    }
  }, [formData.services, formData.branchId, step]);

  const loadPortfolioImages = () => {
    // Filtrar imágenes de portafolio basadas en los servicios seleccionados y la sede
    const relevantPortfolio = portfolioData.portfolio.filter(item => {
      const matchesBranch = item.branchId === parseInt(formData.branchId);
      const matchesService = item.serviceIds.some(serviceId =>
        formData.services.includes(serviceId)
      );
      return matchesBranch || matchesService;
    });

    // Si hay pocas imágenes relevantes, agregar algunas más generales
    let finalPortfolio = relevantPortfolio;
    if (relevantPortfolio.length < PORTFOLIO_CONFIG.MIN_IMAGES) {
      const additionalItems = portfolioData.portfolio
        .filter(item => !relevantPortfolio.includes(item))
        .slice(0, PORTFOLIO_CONFIG.MIN_IMAGES - relevantPortfolio.length);
      finalPortfolio = [...relevantPortfolio, ...additionalItems];
    }

    // Limitar a 12 imágenes máximo y ordenar por rating
    setPortfolioImages(
      finalPortfolio
        .sort((a, b) => b.rating - a.rating)
        .slice(0, PORTFOLIO_CONFIG.MAX_IMAGES)
    );
  };

  // Validación por paso
  const isStepValid = (stepNumber) => {
    const validationKey = Object.keys(CLIENT_APPOINTMENT_VALIDATION.STEPS)[stepNumber - 1];
    const validator = CLIENT_APPOINTMENT_VALIDATION.STEPS[validationKey];
    return validator ? validator(formData) : false;
  };

  const canProceed = () => isStepValid(step);

  const showAlert = async (type, title, text, options = {}) => {
    const config = {
      icon: type,
      title,
      text,
      ...SWEETALERT_CONFIG.THEME,
      ...options
    };

    return await Swal.fire(config);
  };

  const nextStep = () => {
    if (canProceed()) {
      setStep(step + 1);
    } else {
      showAlert(
        'warning',
        CLIENT_APPOINTMENT_MESSAGES.WARNING.TITLE,
        CLIENT_APPOINTMENT_MESSAGES.WARNING.INCOMPLETE_FIELDS
      );
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Manejo de archivo de voucher
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith(CLIENT_APPOINTMENT_VALIDATION.FILE.ALLOWED_TYPES[0])) {
      showAlert('error', CLIENT_APPOINTMENT_MESSAGES.ERROR.TITLE, CLIENT_APPOINTMENT_MESSAGES.ERROR.INVALID_FILE);
      return;
    }

    if (file.size > CLIENT_APPOINTMENT_VALIDATION.FILE.MAX_SIZE) {
      showAlert('error', CLIENT_APPOINTMENT_MESSAGES.ERROR.TITLE, CLIENT_APPOINTMENT_MESSAGES.ERROR.FILE_TOO_LARGE);
      return;
    }

    setFormData({ ...formData, voucherImage: file });

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeVoucherImage = () => {
    setPreviewImage(null);
    setFormData({ ...formData, voucherImage: null });
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

    const paymentInfo = appointmentData.paymentMethod === 'efectivo'
      ? '✅ *Pago:* En efectivo al llegar'
      : `💳 *Pago:* ${appointmentData.paymentMethod.toUpperCase()} - Voucher #${appointmentData.voucherNumber}`;

    const notes = appointmentData.notes ? `📝 *Notas:* ${appointmentData.notes}` : '';

    return WHATSAPP_CONFIG.MESSAGE_TEMPLATE
      .replace('{clientName}', appointmentData.clientName)
      .replace('{date}', formatDate)
      .replace('{time}', appointmentData.time)
      .replace('{barberName}', appointmentData.barberName)
      .replace('{branchName}', selectedBranch?.name)
      .replace('{branchAddress}', selectedBranch?.address)
      .replace('{services}', selectedServicesNames)
      .replace('{totalPrice}', appointmentData.totalPrice)
      .replace('{duration}', appointmentData.duration)
      .replace('{paymentInfo}', paymentInfo)
      .replace('{notes}', notes);
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
      const whatsappUrl = `${WHATSAPP_CONFIG.BASE_URL}${WHATSAPP_CONFIG.PHONE}?text=${encodeURIComponent(message)}`;

      const successMessage = formData.paymentMethod === 'efectivo'
        ? CLIENT_APPOINTMENT_MESSAGES.SUCCESS.CONFIRMED
        : CLIENT_APPOINTMENT_MESSAGES.SUCCESS.PENDING_PAYMENT;

      await showAlert('success', CLIENT_APPOINTMENT_MESSAGES.SUCCESS.TITLE, '', {
        html: `
          <p>${successMessage}</p>
          <a href="${whatsappUrl}" target="_blank" class="inline-flex items-center px-4 py-2 mt-4 text-white bg-green-500 rounded-lg hover:bg-green-600">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            ${CLIENT_APPOINTMENT_MESSAGES.SUCCESS.WHATSAPP_BUTTON}
          </a>
        `,
        confirmButtonText: 'Entendido'
      });

      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error('Error al crear cita:', error);
      showAlert('error', CLIENT_APPOINTMENT_MESSAGES.ERROR.TITLE, CLIENT_APPOINTMENT_MESSAGES.ERROR.GENERAL);
    } finally {
      setLoading(false);
    }
  };

  // Funciones de actualización de formulario
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleService = (serviceId) => {
    const isSelected = formData.services.includes(serviceId);
    updateFormData('services', isSelected
      ? formData.services.filter(id => id !== serviceId)
      : [...formData.services, serviceId]
    );
  };

  return {
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
    setSelectedPortfolioImage,
    isStepValid
  };
};