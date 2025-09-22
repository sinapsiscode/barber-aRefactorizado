import { FiCamera } from 'react-icons/fi';
import { SETTINGS_TEXTS } from '../../../constants/settingsPage';
import { formatUserRole, getUserInitial } from '../../../utils/settingsHelpers';

const ProfileTab = ({
  user,
  formData,
  onFormChange
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {SETTINGS_TEXTS.PERSONAL_INFO}
        </h3>

        <UserAvatar user={user} />
        <ProfileForm
          user={user}
          formData={formData}
          onFormChange={onFormChange}
        />
      </div>
    </div>
  );
};

const UserAvatar = ({ user }) => (
  <div className="flex items-center space-x-6 mb-6">
    <div className="relative">
      <div className="h-20 w-20 bg-primary-500 rounded-full flex items-center justify-center">
        <span className="text-white text-2xl font-bold">
          {getUserInitial(user?.name)}
        </span>
      </div>
      <button className="absolute bottom-0 right-0 h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700">
        <FiCamera className="h-4 w-4" />
      </button>
    </div>
    <div>
      <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
        {user?.name}
      </h4>
      <p className="text-gray-600 dark:text-gray-400 capitalize">
        {formatUserRole(user?.role)}
      </p>
    </div>
  </div>
);

const ProfileForm = ({ user, formData, onFormChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <FormField
      label={SETTINGS_TEXTS.FULL_NAME}
      type="text"
      name="name"
      value={formData.name}
      onChange={onFormChange}
      required
    />

    <FormField
      label={SETTINGS_TEXTS.EMAIL}
      type="email"
      name="email"
      value={formData.email}
      onChange={onFormChange}
      required
    />

    <FormField
      label={SETTINGS_TEXTS.PHONE}
      type="tel"
      name="phone"
      value={formData.phone}
      onChange={onFormChange}
      placeholder={SETTINGS_TEXTS.PHONE_PLACEHOLDER}
    />

    {user?.role === 'barber' && (
      <FormField
        label={SETTINGS_TEXTS.SPECIALTY}
        type="text"
        name="specialty"
        value={formData.specialty || ''}
        onChange={onFormChange}
        placeholder={SETTINGS_TEXTS.SPECIALTY_PLACEHOLDER}
      />
    )}
  </div>
);

const FormField = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="input-field"
    />
  </div>
);

export default ProfileTab;