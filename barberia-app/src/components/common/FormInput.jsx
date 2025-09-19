import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FORM_STYLES, cn } from '../../styles/components';

const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  icon: Icon = null,
  error = '',
  required = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={name}
          className={cn(
            FORM_STYLES.label.base,
            isFocused && FORM_STYLES.label.focused,
            required && FORM_STYLES.label.required
          )}
        >
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={`h-5 w-5 transition-colors duration-200 ${
              isFocused ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
            }`} />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            FORM_STYLES.input.base,
            error && FORM_STYLES.input.error,
            Icon && FORM_STYLES.input.withIcon,
            isPassword && FORM_STYLES.input.withPassword
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <FiEyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
            ) : (
              <FiEye className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className={FORM_STYLES.error}>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;