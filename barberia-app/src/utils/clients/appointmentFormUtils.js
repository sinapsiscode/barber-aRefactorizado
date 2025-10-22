import { PAYMENT_METHODS, WHATSAPP_CONFIG } from '../../constants/appointmentForm';

/**
 * Generar mensaje de WhatsApp para confirmación de cita
 * Versión ultra-simplificada para evitar error 429 de WhatsApp
 */
export const generateWhatsAppMessage = (appointmentData, services, selectedBranch) => {
  const selectedServicesNames = services
    .filter(s => appointmentData.services.includes(s.id))
    .map(s => s.name)
    .join(', ');

  const formatDate = new Date(appointmentData.date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Mensaje ultra-corto sin caracteres especiales problemáticos
  const lines = [
    'RESERVA CONFIRMADA',
    '',
    `Cliente: ${appointmentData.clientName}`,
    `Fecha: ${formatDate}`,
    `Hora: ${appointmentData.time}`,
    `Barbero: ${appointmentData.barberName}`,
    `Sede: ${selectedBranch?.name || ''}`,
    '',
    `Servicio: ${selectedServicesNames}`,
    `Total: S/${appointmentData.totalPrice}`,
    `Duracion: ${appointmentData.duration} min`,
  ];

  // Agregar pago solo si no es efectivo
  if (appointmentData.paymentMethod !== PAYMENT_METHODS.CASH) {
    lines.push(`Pago: ${appointmentData.paymentMethod.toUpperCase()} ${appointmentData.voucherNumber}`);
  }

  // Agregar notas solo si existen y son cortas
  if (appointmentData.notes && appointmentData.notes.length < 50) {
    lines.push(`Nota: ${appointmentData.notes}`);
  }

  return lines.filter(line => line !== undefined).join('\n');
};

/**
 * Generar URL de WhatsApp
 * Limpia caracteres especiales y limita longitud para evitar error 429
 */
export const generateWhatsAppUrl = (message) => {
  // Limpiar el mensaje agresivamente
  const cleanMessage = message
    .replace(/[*]/g, '') // Remover asteriscos (negritas de WhatsApp)
    .replace(/[^\wáéíóúÁÉÍÓÚñÑ\s\n\-\/\:\.\,S]/gi, '') // Solo caracteres alfanuméricos y básicos
    .replace(/\s+/g, ' ') // Normalizar espacios
    .trim()
    .substring(0, 500); // Limitar a 500 caracteres máximo

  // Codificar para URL
  const encodedMessage = encodeURIComponent(cleanMessage);

  return `https://wa.me/${WHATSAPP_CONFIG.PHONE_NUMBER}?text=${encodedMessage}`;
};

/**
 * Filtrar imágenes de portafolio relevantes
 */
export const filterPortfolioImages = (portfolioData, selectedServices, branchId, minImages, maxImages) => {
  // Filtrar imágenes relevantes por servicios y sucursal
  const relevantPortfolio = portfolioData.portfolio.filter(item => {
    const matchesBranch = item.branchId === parseInt(branchId);
    const matchesService = item.serviceIds.some(serviceId =>
      selectedServices.includes(serviceId)
    );
    return matchesBranch || matchesService;
  });

  // Si hay pocas imágenes relevantes, agregar algunas más generales
  let finalPortfolio = relevantPortfolio;
  if (relevantPortfolio.length < minImages) {
    const additionalItems = portfolioData.portfolio
      .filter(item => !relevantPortfolio.includes(item))
      .slice(0, minImages - relevantPortfolio.length);
    finalPortfolio = [...relevantPortfolio, ...additionalItems];
  }

  // Limitar a máximo de imágenes y ordenar por rating
  return finalPortfolio
    .sort((a, b) => b.rating - a.rating)
    .slice(0, maxImages);
};

/**
 * Convertir archivo a base64
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Calcular precio total de servicios seleccionados
 */
export const calculateTotalPrice = (services, selectedServiceIds) => {
  return services
    .filter(s => selectedServiceIds.includes(s.id))
    .reduce((sum, s) => sum + s.price, 0);
};

/**
 * Calcular duración total de servicios seleccionados
 */
export const calculateTotalDuration = (services, selectedServiceIds) => {
  return services
    .filter(s => selectedServiceIds.includes(s.id))
    .reduce((sum, s) => sum + s.duration, 0);
};
