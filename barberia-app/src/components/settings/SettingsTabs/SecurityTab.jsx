/**
 * Tab de seguridad de la cuenta
 */
const SecurityTab = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Seguridad de la Cuenta
        </h3>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Cambiar Contraseña
            </h4>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Contraseña actual"
                className="input-field"
              />
              <input
                type="password"
                placeholder="Nueva contraseña"
                className="input-field"
              />
              <input
                type="password"
                placeholder="Confirmar nueva contraseña"
                className="input-field"
              />
              <button className="btn-primary">
                Actualizar Contraseña
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Autenticación en Dos Pasos
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Agrega una capa adicional de seguridad a tu cuenta
            </p>
            <button className="btn-secondary">
              Configurar 2FA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
