import { FiPhone } from 'react-icons/fi';
import { WHATSAPP_CONFIG } from '../../constants/publicBooking';

/**
 * Panel de información de contacto para pago
 */
const ContactInfo = () => {
  return (
    <div className="mt-6 p-4 bg-white rounded-lg border">
      <div className="flex items-center space-x-2 text-gray-600 mb-2">
        <FiPhone className="w-4 h-4" />
        <span className="text-sm font-medium">Contacto</span>
      </div>
      <p className="text-sm text-gray-700">
        YAPE/PLIN: <span className="font-semibold">{WHATSAPP_CONFIG.yapeNumber}</span>
      </p>
      <p className="text-xs text-gray-500 mt-1">
        {WHATSAPP_CONFIG.yapeName}
      </p>
    </div>
  );
};

export default ContactInfo;
