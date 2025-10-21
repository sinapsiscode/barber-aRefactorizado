import { PAYMENT_METHODS, WHATSAPP_CONFIG } from '../../constants/appointmentForm';

/**
 * Generar mensaje de WhatsApp para confirmación de cita
 */
export const generateWhatsAppMessage = (appointmentData, services, selectedBranch) => {
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

${appointmentData.paymentMethod === PAYMENT_METHODS.CASH
    ? '✅ *Pago:* En efectivo al llegar'
    : `💳 *Pago:* ${appointmentData.paymentMethod.toUpperCase()} - Voucher #${appointmentData.voucherNumber}`
  }

${appointmentData.notes ? `📝 *Notas:* ${appointmentData.notes}` : ''}

_Mensaje generado automáticamente por el sistema de reservas_`;
};

/**
 * Generar URL de WhatsApp
 */
export const generateWhatsAppUrl = (message) => {
  return `https://wa.me/${WHATSAPP_CONFIG.PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
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
