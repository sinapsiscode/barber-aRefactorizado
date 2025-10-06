/**
 * UTILIDADES PARA MÉTODOS DE PAGO
 * 
 * Contiene funciones helper para manejar la visualización
 * y formato de los métodos de pago en toda la aplicación
 */

/**
 * Obtiene el nombre legible de un método de pago
 * @param {string} method - ID del método de pago
 * @returns {string} Nombre legible del método
 */
export const getPaymentMethodName = (method) => {
  const methods = {
    'efectivo': 'Efectivo',
    'yape': 'Yape',
    'plin': 'Plin', 
    'transferencia': 'Transferencia Bancaria'
  };
  return methods[method] || method || 'No especificado';
};

/**
 * Obtiene la configuración completa de los métodos de pago
 * Incluye nombres, números, colores, imágenes y detalles específicos
 * @returns {Array} Lista de métodos de pago disponibles
 */
export const getPaymentMethods = () => {
  return [
    { 
      id: 'efectivo', 
      name: 'Efectivo', 
      description: 'Pago directo en la barbería',
      color: 'green',
      image: null,
      icon: '💵',
      details: {
        type: 'cash',
        instructions: 'Realiza el pago directamente en la barbería el día de tu cita.',
        note: 'No es necesario realizar pago previo. Puedes pagar al finalizar el servicio.'
      }
    },
    { 
      id: 'yape', 
      name: 'Yape', 
      description: 'Transferencia con Yape',
      number: '999 888 777', 
      color: 'purple',
      image: '/yape.png',
      details: {
        type: 'digital',
        phone: '999 888 777',
        name: 'Barbería Michael',
        qr: '/yape-qr.png', // Placeholder para QR
        instructions: 'Escanea el código QR o transfiere al número 999 888 777',
        note: 'Sube el comprobante de pago después de realizar la transferencia'
      }
    },
    { 
      id: 'plin', 
      name: 'Plin', 
      description: 'Transferencia con Plin',
      number: '999 888 777', 
      color: 'teal',
      image: '/plin.png',
      details: {
        type: 'digital',
        phone: '999 888 777',
        name: 'Barbería Michael',
        qr: '/plin-qr.png', // Placeholder para QR
        instructions: 'Escanea el código QR o transfiere al número 999 888 777',
        note: 'Sube el comprobante de pago después de realizar la transferencia'
      }
    },
    { 
      id: 'transferencia', 
      name: 'Transferencia Bancaria', 
      description: 'Transferencia a cuenta bancaria',
      number: 'BCP: 123-456789-0-12', 
      color: 'blue',
      image: null,
      icon: '🏦',
      details: {
        type: 'bank',
        bank: 'Banco de Crédito del Perú (BCP)',
        accountNumber: '123-456789-0-12',
        accountType: 'Cuenta Corriente',
        holder: 'Barbería Michael S.A.C.',
        ruc: '20123456789',
        instructions: 'Realiza la transferencia a la cuenta indicada',
        note: 'Sube el comprobante de transferencia después de realizar el pago'
      }
    }
  ];
};

/**
 * Obtiene la imagen de un método de pago específico
 * @param {string} method - ID del método de pago
 * @returns {string|null} URL de la imagen o null
 */
export const getPaymentMethodImage = (method) => {
  const paymentMethod = getPaymentMethods().find(m => m.id === method);
  return paymentMethod?.image || null;
};