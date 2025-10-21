import {
  FiMapPin, FiScissors, FiCamera, FiUser,
  FiClock, FiDollarSign, FiCheckCircle
} from 'react-icons/fi';

/**
 * Constantes para el formulario de citas de clientes
 */

// Configuración de pasos del formulario
export const FORM_STEPS = [
  { num: 1, label: 'Sede', icon: FiMapPin },
  { num: 2, label: 'Servicios', icon: FiScissors },
  { num: 3, label: 'Portafolio', icon: FiCamera },
  { num: 4, label: 'Barbero', icon: FiUser },
  { num: 5, label: 'Horario', icon: FiClock },
  { num: 6, label: 'Pago', icon: FiDollarSign },
  { num: 7, label: 'Confirmar', icon: FiCheckCircle }
];

export const TOTAL_STEPS = FORM_STEPS.length;

// Configuración de archivos
export const FILE_VALIDATION = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'],
  MAX_SIZE_TEXT: '5MB'
};

// Configuración de portafolio
export const PORTFOLIO_CONFIG = {
  MIN_IMAGES_BEFORE_ADDING_GENERAL: 6,
  MAX_IMAGES: 12
};

// Mensajes de validación
export const VALIDATION_MESSAGES = {
  INCOMPLETE_STEP: {
    title: 'Información incompleta',
    text: 'Por favor completa todos los campos requeridos'
  },
  INVALID_FILE_TYPE: {
    title: 'Archivo inválido',
    text: 'Por favor selecciona una imagen'
  },
  FILE_TOO_LARGE: {
    title: 'Archivo muy grande',
    text: `La imagen no debe superar los ${FILE_VALIDATION.MAX_SIZE_TEXT}`
  },
  ERROR_CREATING: {
    title: 'Error',
    text: 'No se pudo crear la cita. Por favor intenta nuevamente.'
  }
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  CASH_PAYMENT: 'confirmada',
  DIGITAL_PAYMENT: 'registrada y está pendiente de verificación de pago'
};

// Configuración de WhatsApp
export const WHATSAPP_CONFIG = {
  PHONE_NUMBER: '51999999999'
};

// Estados de pago
export const APPOINTMENT_STATUS = {
  CONFIRMED: 'confirmed',
  PENDING_PAYMENT: 'pending_payment'
};

// Métodos de pago
export const PAYMENT_METHODS = {
  CASH: 'efectivo'
};

// Datos iniciales del formulario
export const getInitialFormData = (selectedDate) => ({
  branchId: '',
  services: [],
  barberId: '',
  date: selectedDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  time: '',
  paymentMethod: PAYMENT_METHODS.CASH,
  voucherImage: null,
  voucherNumber: '',
  notes: ''
});
