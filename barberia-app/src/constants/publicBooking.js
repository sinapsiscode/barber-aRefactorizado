/**
 * Constantes para la página de reservas públicas
 */

/**
 * Lista de servicios disponibles para reservas públicas
 */
export const AVAILABLE_SERVICES = [
  { id: 1, name: 'Corte con Asesoría', price: 70, duration: 30, icon: '✂️' },
  { id: 2, name: 'Semi Ondulación', price: 155, duration: 45, icon: '🌊' },
  { id: 3, name: 'Platinado', price: 110, duration: 90, icon: '✨', description: '(Decoloración) y S/ 90 (Tinte)' },
  { id: 4, name: 'Rayitos / Mechas', price: 220, duration: 120, icon: '💫' },
  { id: 5, name: 'Botox', price: 120, duration: 60, icon: '💆' },
  { id: 6, name: 'Laceado', price: 130, duration: 90, icon: '💇' },
  { id: 7, name: 'Facial', price: 60, duration: 45, icon: '🧖' }
];

/**
 * Lista de distritos de Lima
 */
export const DISTRITOS = [
  'Ate', 'Barranco', 'Breña', 'Cercado de Lima', 'Chorrillos', 'Comas',
  'El Agustino', 'Independencia', 'Jesús María', 'La Molina', 'La Victoria',
  'Lince', 'Los Olivos', 'Magdalena del Mar', 'Miraflores', 'Pueblo Libre',
  'Puente Piedra', 'Rímac', 'San Borja', 'San Isidro', 'San Juan de Lurigancho',
  'San Juan de Miraflores', 'San Luis', 'San Martín de Porres', 'San Miguel',
  'Santa Anita', 'Santiago de Surco', 'Surquillo', 'Villa El Salvador',
  'Villa María del Triunfo'
];

/**
 * Horarios disponibles para reservas
 */
export const AVAILABLE_TIMES = [
  '10:20 AM',
  '10:40 AM',
  '05:20 PM',
  '06:00 PM',
  '06:20 PM',
  '06:40 PM'
];

/**
 * Días de la semana abreviados
 */
export const WEEK_DAYS = ['Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.', 'Dom.'];

/**
 * Configuración de WhatsApp
 */
export const WHATSAPP_CONFIG = {
  number: '51961170946', // Número del Perú sin el +
  yapeNumber: '916 919 552',
  yapeName: 'Yeison Junior Peralta Chuchon'
};

/**
 * Reglas de validación
 */
export const VALIDATION_RULES = {
  dni: {
    pattern: /^\d{8}$/,
    message: 'DNI debe tener 8 dígitos'
  },
  email: {
    pattern: /\S+@\S+\.\S+/,
    message: 'Correo inválido'
  },
  phone: {
    pattern: /^9\d{8}$/,
    message: 'Teléfono debe empezar con 9 y tener 9 dígitos'
  }
};

/**
 * Mensajes de error del formulario
 */
export const ERROR_MESSAGES = {
  nombre: 'Nombre es requerido',
  apellido: 'Apellido es requerido',
  dni: 'DNI es requerido',
  dniInvalid: 'DNI debe tener 8 dígitos',
  correo: 'Correo es requerido',
  correoInvalid: 'Correo inválido',
  telefono: 'Teléfono es requerido',
  telefonoInvalid: 'Teléfono debe empezar con 9 y tener 9 dígitos',
  distrito: 'Distrito es requerido',
  services: 'Selecciona al menos un servicio',
  servicesOther: 'Especifica el servicio adicional',
  terms: 'Debes aceptar los términos y condiciones'
};

/**
 * Configuración de pasos del wizard
 */
export const BOOKING_STEPS = {
  CALENDAR: 1,
  FORM: 2
};

/**
 * Duración por defecto del servicio (si no hay servicios seleccionados)
 */
export const DEFAULT_DURATION = 20;

/**
 * Información de pago
 */
export const PAYMENT_INFO = {
  advancePercentage: 50,
  yapeNumber: '916 919 552',
  yapeName: 'Yeison Junior Peralta Chuchon',
  timeLimit: 30 // minutos para enviar el adelanto
};
