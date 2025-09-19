import { FINANCIAL, CALENDAR } from '../constants';

/**
 * Utilidades de formateo centralizadas
 * Evita duplicación de lógica de formateo en todo el proyecto
 */

// ===================================================================
// 💰 FORMATEO DE MONEDA
// ===================================================================
export const formatCurrency = (amount, options = {}) => {
  const {
    symbol = FINANCIAL.CURRENCY.SYMBOL,
    decimals = FINANCIAL.CURRENCY.DECIMAL_PLACES,
    showSymbol = true
  } = options;

  if (typeof amount !== 'number' || isNaN(amount)) {
    return showSymbol ? `${symbol} 0.00` : '0.00';
  }

  const formatted = amount.toFixed(decimals);
  return showSymbol ? `${symbol} ${formatted}` : formatted;
};

// ===================================================================
// 📅 FORMATEO DE FECHAS
// ===================================================================
export const formatDate = (date, format = 'dd/mm/yyyy') => {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const monthName = CALENDAR.MONTHS[d.getMonth()];

  switch (format) {
    case 'dd/mm/yyyy':
      return `${day}/${month}/${year}`;
    case 'mm/dd/yyyy':
      return `${month}/${day}/${year}`;
    case 'yyyy-mm-dd':
      return `${year}-${month}-${day}`;
    case 'long':
      return `${day} de ${monthName} de ${year}`;
    case 'short':
      return `${day} ${monthName.slice(0, 3)}`;
    default:
      return `${day}/${month}/${year}`;
  }
};

export const formatTime = (time) => {
  if (!time) return '';

  // Si ya es una hora formateada (HH:MM), devolverla
  if (typeof time === 'string' && time.includes(':')) {
    return time;
  }

  const d = new Date(time);
  if (isNaN(d.getTime())) return '';

  return d.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

export const formatDateTime = (dateTime, options = {}) => {
  const { dateFormat = 'dd/mm/yyyy', showTime = true } = options;

  if (!dateTime) return '';

  const date = formatDate(dateTime, dateFormat);
  const time = formatTime(dateTime);

  return showTime ? `${date} ${time}` : date;
};

// ===================================================================
// 📞 FORMATEO DE TELÉFONO
// ===================================================================
export const formatPhone = (phone) => {
  if (!phone) return '';

  // Remover caracteres no numéricos excepto +
  const cleaned = phone.replace(/[^\d+]/g, '');

  // Formato peruano: +51 999 999 999
  if (cleaned.startsWith('+51') && cleaned.length === 12) {
    return `+51 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }

  // Formato local: 999 999 999
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }

  return phone;
};

// ===================================================================
// 👤 FORMATEO DE NOMBRES
// ===================================================================
export const formatName = (firstName, lastName = '') => {
  if (!firstName) return '';

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const formattedFirst = capitalize(firstName.trim());
  const formattedLast = lastName ? capitalize(lastName.trim()) : '';

  return formattedLast ? `${formattedFirst} ${formattedLast}` : formattedFirst;
};

export const getInitials = (name) => {
  if (!name) return '?';

  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

// ===================================================================
// 📊 FORMATEO DE NÚMEROS
// ===================================================================
export const formatNumber = (number, decimals = 0) => {
  if (typeof number !== 'number' || isNaN(number)) return '0';

  return number.toLocaleString('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

export const formatPercentage = (value, decimals = 1) => {
  if (typeof value !== 'number' || isNaN(value)) return '0%';

  return `${(value * 100).toFixed(decimals)}%`;
};

// ===================================================================
// 📱 FORMATEO DE TEXTO
// ===================================================================
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;

  return text.slice(0, maxLength) + '...';
};

export const capitalizeWords = (text) => {
  if (!text) return '';

  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const slugify = (text) => {
  if (!text) return '';

  return text
    .toLowerCase()
    .trim()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};