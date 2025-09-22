import { useState } from 'react';
import { FiShield, FiLock } from 'react-icons/fi';
import { SETTINGS_TEXTS } from '../../../constants/settingsPage';
import { validatePasswordChange } from '../../../utils/settingsHelpers';

const SecurityTab = ({ onPasswordChange, onSetup2FA }) => {
  return (
    <div className="space-y-6">
      <PasswordChangeSection onPasswordChange={onPasswordChange} />
      <TwoFactorSection onSetup2FA={onSetup2FA} />
    </div>
  );
};

const PasswordChangeSection = ({ onPasswordChange }) => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validatePasswordChange(passwords);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onPasswordChange(passwords);
    setPasswords({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <FiLock className="h-6 w-6 text-primary-600 mr-3" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {SETTINGS_TEXTS.CHANGE_PASSWORD}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordField
          label={SETTINGS_TEXTS.CURRENT_PASSWORD}
          name="currentPassword"
          value={passwords.currentPassword}
          onChange={handleInputChange}
          error={errors.currentPassword}
        />

        <PasswordField
          label={SETTINGS_TEXTS.NEW_PASSWORD}
          name="newPassword"
          value={passwords.newPassword}
          onChange={handleInputChange}
          error={errors.newPassword}
        />

        <PasswordField
          label={SETTINGS_TEXTS.CONFIRM_PASSWORD}
          name="confirmPassword"
          value={passwords.confirmPassword}
          onChange={handleInputChange}
          error={errors.confirmPassword}
        />

        <button
          type="submit"
          className="btn-primary"
        >
          {SETTINGS_TEXTS.UPDATE_PASSWORD}
        </button>
      </form>
    </div>
  );
};

const TwoFactorSection = ({ onSetup2FA }) => (
  <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
    <div className="flex items-center mb-4">
      <FiShield className="h-6 w-6 text-primary-600 mr-3" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {SETTINGS_TEXTS.TWO_FACTOR_AUTH}
      </h3>
    </div>

    <p className="text-gray-600 dark:text-gray-400 mb-4">
      {SETTINGS_TEXTS.TWO_FACTOR_DESCRIPTION}
    </p>

    <button
      onClick={onSetup2FA}
      className="btn-secondary"
    >
      {SETTINGS_TEXTS.SETUP_2FA}
    </button>
  </div>
);

const PasswordField = ({ label, name, value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {label}
    </label>
    <input
      type="password"
      name={name}
      value={value}
      onChange={onChange}
      className={`input-field ${error ? 'border-red-500' : ''}`}
      required
    />
    {error && (
      <p className="text-red-500 text-sm mt-1">{error}</p>
    )}
  </div>
);

export default SecurityTab;