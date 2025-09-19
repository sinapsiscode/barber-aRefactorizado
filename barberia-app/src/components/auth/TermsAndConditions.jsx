import { useState } from 'react';
import { FiX, FiFileText, FiShield, FiUsers, FiClock, FiDollarSign, FiInfo } from 'react-icons/fi';

const TermsAndConditions = ({ isOpen, onClose, onAccept }) => {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    if (accepted) {
      onAccept();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
              <FiFileText className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Términos y Condiciones
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Política de uso del sistema de barbería
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <FiX className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
          <div className="prose dark:prose-invert max-w-none">
            
            {/* Introducción */}
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FiUsers className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                Bienvenido a Barbería Premium
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Al registrarte y utilizar nuestro sistema de gestión de citas, aceptas cumplir con los siguientes términos y condiciones. 
                Estos términos establecen los derechos y responsabilidades tanto del cliente como de nuestra barbería.
              </p>
            </section>

            {/* Servicios */}
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                1. Servicios Ofrecidos
              </h3>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>• Cortes de cabello profesionales y diseños personalizados</p>
                <p>• Afeitado y arreglo de barba con técnicas tradicionales</p>
                <p>• Tratamientos capilares y cuidado del cuero cabelludo</p>
                <p>• Servicios premium con productos de alta calidad</p>
                <p>• Sistema de citas online con confirmación automática</p>
              </div>
            </section>

            {/* Reservas y Citas */}
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FiClock className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                2. Política de Reservas y Citas
              </h3>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 mb-4">
                <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Importante:</h4>
                <div className="space-y-2 text-amber-700 dark:text-amber-300 text-sm">
                  <p>• Las citas deben confirmarse al menos 2 horas antes</p>
                  <p>• Cancelaciones gratuitas hasta 4 horas antes de la cita</p>
                  <p>• No-show sin aviso previo puede resultar en penalización</p>
                  <p>• Llegadas con más de 15 minutos de retraso pueden ser reprogramadas</p>
                </div>
              </div>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p><strong>Reserva:</strong> Puedes agendar citas a través de nuestra plataforma online las 24 horas</p>
                <p><strong>Confirmación:</strong> Recibirás notificaciones por SMS/email para confirmar tu cita</p>
                <p><strong>Modificación:</strong> Puedes reprogramar tus citas hasta 4 horas antes del servicio</p>
                <p><strong>Lista de espera:</strong> Disponible para fechas ocupadas con notificación automática</p>
              </div>
            </section>

            {/* Pagos */}
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FiDollarSign className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                3. Política de Pagos
              </h3>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>• <strong>Métodos de pago:</strong> Efectivo, tarjetas de crédito/débito, transferencias digitales</p>
                <p>• <strong>Precios:</strong> Pueden variar por sede, consulta precios actualizados en la app</p>
                <p>• <strong>Promociones:</strong> Sujetas a términos específicos y disponibilidad</p>
                <p>• <strong>Reembolsos:</strong> Solo en casos de cancelación de servicio por parte de la barbería</p>
              </div>
            </section>

            {/* Privacidad */}
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FiShield className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                4. Privacidad y Datos Personales
              </h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Protección de Datos:</h4>
                <div className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
                  <p>• Tus datos se utilizan únicamente para gestionar tus citas y mejorar nuestros servicios</p>
                  <p>• No compartimos información personal con terceros sin tu consentimiento</p>
                  <p>• Puedes solicitar la eliminación de tus datos en cualquier momento</p>
                  <p>• Implementamos medidas de seguridad para proteger tu información</p>
                </div>
              </div>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p><strong>Información recopilada:</strong> Nombre, teléfono, email, historial de servicios</p>
                <p><strong>Uso de datos:</strong> Gestión de citas, comunicaciones, mejora del servicio</p>
                <p><strong>Retención:</strong> Mantenemos tus datos mientras uses nuestros servicios</p>
                <p><strong>Derechos:</strong> Acceso, rectificación, eliminación y portabilidad de tus datos</p>
              </div>
            </section>

            {/* Responsabilidades */}
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                5. Responsabilidades del Cliente
              </h3>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>• Proporcionar información de contacto exacta y actualizada</p>
                <p>• Llegar puntual a las citas programadas</p>
                <p>• Informar sobre alergias o condiciones médicas relevantes</p>
                <p>• Tratar al personal con respeto y cortesía</p>
                <p>• Seguir las recomendaciones de cuidado post-servicio</p>
              </div>
            </section>

            {/* Limitación de responsabilidad */}
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                6. Limitación de Responsabilidad
              </h3>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>• Los servicios se realizan por profesionales calificados</p>
                <p>• No nos hacemos responsables por reacciones alérgicas no informadas previamente</p>
                <p>• Las imágenes de antes/después pueden usarse para promoción (con consentimiento)</p>
                <p>• Cualquier reclamo debe reportarse dentro de 24 horas del servicio</p>
              </div>
            </section>

            {/* Modificaciones */}
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                7. Modificaciones de Términos
              </h3>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones 
                entrarán en vigencia inmediatamente después de su publicación en la plataforma.</p>
                <p>Te notificaremos sobre cambios significativos a través de email o notificaciones en la aplicación.</p>
              </div>
            </section>

          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-start space-x-3 mb-4">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
            />
            <label htmlFor="acceptTerms" className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              He leído y acepto los términos y condiciones de uso del sistema de Barbería Premium. 
              Entiendo las políticas de reservas, pagos y privacidad establecidas.
            </label>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleAccept}
              disabled={!accepted}
              className={`px-6 py-2 rounded-lg transition-colors ${
                accepted
                  ? 'bg-primary-600 hover:bg-primary-700 text-white'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              Aceptar y Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;