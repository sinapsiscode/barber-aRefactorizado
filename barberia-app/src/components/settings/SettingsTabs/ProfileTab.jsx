import { FiCamera, FiMapPin } from 'react-icons/fi';

/**
 * Tab de configuración de perfil
 */
const ProfileTab = ({
  user,
  formData,
  avatarPreview,
  branches,
  onFormDataChange,
  onAvatarUpload
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Información Personal
        </h3>

        <div className="flex items-center space-x-6 mb-6">
          <div className="relative">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="h-20 w-20 rounded-full object-cover border-2 border-primary-300"
              />
            ) : (
              <div className="h-20 w-20 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 cursor-pointer transition-colors"
            >
              <FiCamera className="h-4 w-4" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={onAvatarUpload}
              className="hidden"
            />
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
              {user?.name}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 capitalize">
              {user?.role?.replace('_', ' ')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onFormDataChange({ name: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onFormDataChange({ email: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => onFormDataChange({ phone: e.target.value })}
              className="input-field"
              placeholder="+51 999 999 999"
            />
          </div>

          {user?.role === 'client' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FiMapPin className="inline h-4 w-4 mr-1" />
                Sede Favorita
              </label>
              <select
                value={formData.preferredBranch}
                onChange={(e) => onFormDataChange({ preferredBranch: parseInt(e.target.value) })}
                className="input-field"
              >
                <option value="">Selecciona tu sede favorita</option>
                {branches?.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} - {branch.city}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Esta será tu sede preferida para reservar citas
              </p>
            </div>
          )}

          {user?.role === 'barber' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Especialidad
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Corte clásico, Diseños, Barba..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
