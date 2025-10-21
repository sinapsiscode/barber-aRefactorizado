import { VALIDATION_RULES, ERROR_MESSAGES, WHATSAPP_CONFIG } from '../../constants/publicBooking';

/**
 * Obtiene los días del mes para mostrar en el calendario
 * @param {Date} date - Fecha del mes a mostrar
 * @returns {Date[]} Array de fechas del mes
 */
export const getDaysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const days = [];
  const currentDay = new Date(startDate);

  while (currentDay <= lastDay || days.length % 7 !== 0) {
    days.push(new Date(currentDay));
    currentDay.setDate(currentDay.getDate() + 1);
  }

  return days;
};

/**
 * Formatea el mes y año para mostrar en el header del calendario
 * @param {Date} date - Fecha a formatear
 * @returns {string} Mes y año formateado (ej: "enero 2024")
 */
export const formatMonthYear = (date) => {
  return date.toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Formatea la fecha seleccionada
 * @param {Date} date - Fecha a formatear
 * @returns {string} Fecha formateada (ej: "lun. 15 ene. 2024")
 */
export const formatSelectedDate = (date) => {
  return date.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Verifica si dos fechas son el mismo día
 * @param {Date} date1
 * @param {Date} date2
 * @returns {boolean}
 */
export const isSameDay = (date1, date2) => {
  return date1.toDateString() === date2.toDateString();
};

/**
 * Verifica si una fecha pertenece al mes actual mostrado
 * @param {Date} date - Fecha a verificar
 * @param {Date} currentDate - Fecha del mes actual
 * @returns {boolean}
 */
export const isCurrentMonth = (date, currentDate) => {
  return date.getMonth() === currentDate.getMonth();
};

/**
 * Verifica si una fecha es hoy
 * @param {Date} date - Fecha a verificar
 * @returns {boolean}
 */
export const isToday = (date) => {
  return date.toDateString() === new Date().toDateString();
};

/**
 * Verifica si una fecha es válida para reservar (no es pasada)
 * @param {Date} date - Fecha a verificar
 * @returns {boolean}
 */
export const isValidBookingDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

/**
 * Valida el formulario de reserva pública
 * @param {Object} formData - Datos del formulario
 * @param {Array} selectedServices - Servicios seleccionados
 * @param {boolean} otherService - Si se seleccionó servicio personalizado
 * @param {string} otherServiceText - Texto del servicio personalizado
 * @param {boolean} acceptTerms - Si se aceptaron los términos
 * @returns {Object} Objeto con errores encontrados
 */
export const validatePublicBookingForm = (formData, selectedServices, otherService, otherServiceText, acceptTerms) => {
  const errors = {};

  // Validar nombre
  if (!formData.nombre.trim()) {
    errors.nombre = ERROR_MESSAGES.nombre;
  }

  // Validar apellido
  if (!formData.apellido.trim()) {
    errors.apellido = ERROR_MESSAGES.apellido;
  }

  // Validar DNI
  if (!formData.dni.trim()) {
    errors.dni = ERROR_MESSAGES.dni;
  } else if (!VALIDATION_RULES.dni.pattern.test(formData.dni)) {
    errors.dni = ERROR_MESSAGES.dniInvalid;
  }

  // Validar correo
  if (!formData.correo.trim()) {
    errors.correo = ERROR_MESSAGES.correo;
  } else if (!VALIDATION_RULES.email.pattern.test(formData.correo)) {
    errors.correo = ERROR_MESSAGES.correoInvalid;
  }

  // Validar teléfono
  if (!formData.telefono.trim()) {
    errors.telefono = ERROR_MESSAGES.telefono;
  } else if (!VALIDATION_RULES.phone.pattern.test(formData.telefono)) {
    errors.telefono = ERROR_MESSAGES.telefonoInvalid;
  }

  // Validar distrito
  if (!formData.distrito) {
    errors.distrito = ERROR_MESSAGES.distrito;
  }

  // Validar servicios
  if (selectedServices.length === 0 && !otherService) {
    errors.services = ERROR_MESSAGES.services;
  }
  if (otherService && !otherServiceText.trim()) {
    errors.services = ERROR_MESSAGES.servicesOther;
  }

  // Validar términos
  if (!acceptTerms) {
    errors.terms = ERROR_MESSAGES.terms;
  }

  return errors;
};

/**
 * Construye el mensaje de WhatsApp para la reserva
 * @param {Object} params - Parámetros del mensaje
 * @returns {string} Mensaje formateado
 */
export const buildWhatsAppMessage = ({
  formData,
  selectedDate,
  selectedTime,
  selectedServices,
  otherService,
  otherServiceText,
  totalDuration,
  totalPrice
}) => {
  const servicesList = [
    ...selectedServices.map(s => s.name),
    ...(otherService && otherServiceText ? [`OTROS: ${otherServiceText}`] : [])
  ].join(', ');

  return `*NUEVA RESERVA DE BARBERÍA*\n\n` +
    `👤 *Cliente:* ${formData.nombre} ${formData.apellido}\n` +
    `📱 *DNI:* ${formData.dni}\n` +
    `📧 *Correo:* ${formData.correo}\n` +
    `📞 *Teléfono:* ${formData.telefono}\n` +
    `📍 *Distrito:* ${formData.distrito}\n\n` +
    `📅 *Fecha:* ${formatSelectedDate(selectedDate)}\n` +
    `⏰ *Hora:* ${selectedTime}\n` +
    `✂️ *Servicios:* ${servicesList}\n` +
    `⏱️ *Duración total:* ${totalDuration} minutos\n\n` +
    `💰 *Total a pagar:* S/ ${totalPrice}\n` +
    `💵 *Adelanto (50%):* S/ ${totalPrice / 2}\n\n` +
    `✅ El cliente ha aceptado los términos y condiciones.\n\n` +
    `_Enviado desde el sistema de reservas online_`;
};

/**
 * Construye la URL de WhatsApp con el mensaje
 * @param {string} message - Mensaje a enviar
 * @returns {string} URL de WhatsApp
 */
export const buildWhatsAppUrl = (message) => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_CONFIG.number}?text=${encodedMessage}`;
};

/**
 * Calcula el precio total de los servicios seleccionados
 * @param {Array} selectedServices - Servicios seleccionados
 * @returns {number} Precio total
 */
export const calculateTotalPrice = (selectedServices) => {
  return selectedServices.reduce((sum, service) => sum + service.price, 0);
};

/**
 * Calcula la duración total de los servicios seleccionados
 * @param {Array} selectedServices - Servicios seleccionados
 * @returns {number} Duración total en minutos
 */
export const calculateTotalDuration = (selectedServices) => {
  return selectedServices.reduce((sum, service) => sum + service.duration, 0);
};
