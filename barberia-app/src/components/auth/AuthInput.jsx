import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { AUTH_STYLES } from '../../constants/auth';

const AuthInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  icon: Icon = null,
  error = '',
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
          className="block text-xs font-semibold text-[#B8B8B8] mb-2 uppercase tracking-wider"
        >
          {label}
        </label>
      )}

      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <Icon className={`h-5 w-5 transition-colors duration-200 ${
              isFocused ? 'text-[#FFB800]' : 'text-[#808080]'
            }`} />
          </div>
        )}

        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-3
            ${Icon ? 'pl-10' : ''}
            ${isPassword ? 'pr-10' : ''}
            bg-[#000000]
            border border-[#FFB800]/20
            rounded-lg
            text-white
            placeholder-[#808080]
            transition-all duration-200
            focus:border-[#FFB800]
            focus:shadow-[0_0_0_3px_rgba(255,184,0,0.1)]
            hover:border-[#FFB800]/30
            ${error ? 'border-red-500 focus:border-red-500' : ''}
          `}
          placeholder={placeholder}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <FiEyeOff className="h-5 w-5 text-[#808080] hover:text-[#FFB800] transition-colors" />
            ) : (
              <FiEye className="h-5 w-5 text-[#808080] hover:text-[#FFB800] transition-colors" />
            )}
          </button>
        )}

        {/* Animated underline */}
        <div className={`
          absolute bottom-0 left-0 w-full h-0.5
          bg-gradient-to-r from-transparent via-[#FFB800] to-transparent
          transform transition-transform duration-300
          ${isFocused ? 'scale-x-100' : 'scale-x-0'}
        `} />
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default AuthInput;