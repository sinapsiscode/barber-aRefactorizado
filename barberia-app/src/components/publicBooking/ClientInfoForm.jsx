import { DISTRITOS } from '../../constants/publicBooking';

/**
 * Formulario de información personal del cliente
 */
const ClientInfoForm = ({ formData, formErrors, onFormChange }) => {
  return (
    <div className="space-y-6">
      {/* Fila 1: Nombre y Apellido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre *
          </label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => onFormChange('nombre', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              formErrors.nombre ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ingrese su nombre"
          />
          {formErrors.nombre && (
            <p className="mt-1 text-sm text-red-500">{formErrors.nombre}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apellido *
          </label>
          <input
            type="text"
            value={formData.apellido}
            onChange={(e) => onFormChange('apellido', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              formErrors.apellido ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ingrese su apellido"
          />
          {formErrors.apellido && (
            <p className="mt-1 text-sm text-red-500">{formErrors.apellido}</p>
          )}
        </div>
      </div>

      {/* Fila 2: DNI y Correo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            DNI *
          </label>
          <input
            type="text"
            value={formData.dni}
            onChange={(e) => onFormChange('dni', e.target.value.replace(/\D/g, '').slice(0, 8))}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              formErrors.dni ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="DNI"
            maxLength="8"
          />
          {formErrors.dni && (
            <p className="mt-1 text-sm text-red-500">{formErrors.dni}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correo electrónico *
          </label>
          <input
            type="email"
            value={formData.correo}
            onChange={(e) => onFormChange('correo', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              formErrors.correo ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="correo@ejemplo.com"
          />
          {formErrors.correo && (
            <p className="mt-1 text-sm text-red-500">{formErrors.correo}</p>
          )}
        </div>
      </div>

      {/* Fila 3: Teléfono y Distrito */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teléfono *
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 5 3'%3E%3Crect width='5' height='1' fill='%23ef3340'/%3E%3Crect y='2' width='5' height='1' fill='%23ef3340'/%3E%3C/svg%3E" alt="Peru" className="h-4 w-6 mr-2" />
              +51
            </span>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => onFormChange('telefono', e.target.value.replace(/\D/g, '').slice(0, 9))}
              className={`w-full px-4 py-2 border rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formErrors.telefono ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="987654321"
              maxLength="9"
            />
          </div>
          {formErrors.telefono && (
            <p className="mt-1 text-sm text-red-500">{formErrors.telefono}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Distrito *
          </label>
          <select
            value={formData.distrito}
            onChange={(e) => onFormChange('distrito', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              formErrors.distrito ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccione un distrito</option>
            {DISTRITOS.map((distrito) => (
              <option key={distrito} value={distrito}>
                {distrito}
              </option>
            ))}
          </select>
          {formErrors.distrito && (
            <p className="mt-1 text-sm text-red-500">{formErrors.distrito}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientInfoForm;
