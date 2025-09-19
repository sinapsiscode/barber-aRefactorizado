import React, { useState } from 'react';
import { FiScissors, FiCheck, FiArrowLeft } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { useAuth } from '../../hooks/useAuth';
import { AUTH_LABELS, AUTH_PLACEHOLDERS, AUTH_MESSAGES, SWEETALERT_CONFIG } from '../../constants/auth';
import AuthInput from './AuthInput';
import TermsAndConditions from './TermsAndConditions';
import { Button } from '../common';

const RegisterForm = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { handleRegister, isLoading, errors, clearFieldError, showAlert } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!termsAccepted) {
      await showAlert('warning', AUTH_MESSAGES.REGISTER.TERMS_REQUIRED, AUTH_MESSAGES.REGISTER.TERMS_REQUIRED_TEXT);
      return;
    }

    const registerData = { ...formData, termsAccepted };
    const result = await handleRegister(registerData);

    if (result.success) {
      onBackToLogin();
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFocus = (field) => {
    clearFieldError(field);
  };

  const handleTermsAccept = () => {
    setTermsAccepted(true);
    Swal.fire({
      icon: 'success',
      title: AUTH_MESSAGES.REGISTER.TERMS_ACCEPTED,
      text: AUTH_MESSAGES.REGISTER.TERMS_ACCEPTED_TEXT,
      ...SWEETALERT_CONFIG.THEME,
      ...SWEETALERT_CONFIG.SUCCESS
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] relative overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#FFB800]/10 rounded-full filter blur-[150px] animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFB800]/10 rounded-full filter blur-[150px] animate-pulse" />
      
      <div className="relative max-w-md w-full space-y-8 p-8">
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] rounded-3xl shadow-2xl shadow-black/50 p-10 border border-[#FFB800]/20 backdrop-blur-xl">
          
          {/* Premium Header */}
          <div className="text-center mb-8">
            <button
              onClick={onBackToLogin}
              className="absolute top-6 left-6 p-2 rounded-full hover:bg-[#FFB800]/10 transition-colors group"
            >
              <FiArrowLeft className="h-5 w-5 text-[#B8B8B8] group-hover:text-[#FFB800]" />
            </button>
            
            <div className="relative inline-block mb-6">
              <div className="h-20 w-20 bg-gradient-to-br from-[#FFB800] to-[#CC9200] rounded-2xl flex items-center justify-center mx-auto transform rotate-3 shadow-2xl shadow-[#FFB800]/30">
                <FiScissors className="h-10 w-10 text-black transform -rotate-45" />
              </div>
              <div className="absolute -inset-2 bg-[#FFB800]/20 rounded-2xl blur-xl animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold gradient-text mb-2">
              {AUTH_LABELS.REGISTER.TITLE}
            </h2>
            <p className="text-[#B8B8B8] text-sm uppercase tracking-widest">
              {AUTH_LABELS.REGISTER.SUBTITLE}
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <AuthInput
              name="name"
              type="text"
              label={AUTH_LABELS.REGISTER.NAME}
              placeholder={AUTH_PLACEHOLDERS.NAME}
              value={formData.name}
              onChange={handleChange}
              onFocus={() => handleFocus('name')}
              error={errors.name}
              icon="user"
            />

            <AuthInput
              name="email"
              type="email"
              label={AUTH_LABELS.REGISTER.EMAIL}
              placeholder={AUTH_PLACEHOLDERS.EMAIL}
              value={formData.email}
              onChange={handleChange}
              onFocus={() => handleFocus('email')}
              error={errors.email}
              icon="mail"
            />

            <AuthInput
              name="phone"
              type="tel"
              label={AUTH_LABELS.REGISTER.PHONE}
              placeholder={AUTH_PLACEHOLDERS.PHONE}
              value={formData.phone}
              onChange={handleChange}
              onFocus={() => handleFocus('phone')}
              error={errors.phone}
              icon="phone"
            />

            <AuthInput
              name="password"
              type="password"
              label={AUTH_LABELS.REGISTER.PASSWORD}
              placeholder={AUTH_PLACEHOLDERS.PASSWORD}
              value={formData.password}
              onChange={handleChange}
              onFocus={() => handleFocus('password')}
              error={errors.password}
              icon="lock"
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            <AuthInput
              name="confirmPassword"
              type="password"
              label={AUTH_LABELS.REGISTER.CONFIRM_PASSWORD}
              placeholder={AUTH_PLACEHOLDERS.CONFIRM_PASSWORD}
              value={formData.confirmPassword}
              onChange={handleChange}
              onFocus={() => handleFocus('confirmPassword')}
              error={errors.confirmPassword}
              icon="lock"
              showPassword={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            {/* Terms and Conditions */}
            <div className="pt-2">
              <div className="flex items-start space-x-3">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="h-4 w-4 text-[#FFB800] focus:ring-[#FFB800] border-[#FFB800]/30 rounded bg-[#000000]"
                  />
                </div>
                <div className="text-xs text-[#B8B8B8] leading-relaxed">
                  Acepto los{' '}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-[#FFB800] hover:text-[#FFA500] underline font-medium"
                  >
                    Términos y Condiciones
                  </button>
                  {' '}y la política de privacidad de Barbería Premium
                  {termsAccepted && (
                    <div className="flex items-center mt-1 text-green-400">
                      <FiCheck className="h-3 w-3 mr-1" />
                      <span className="text-xs">Términos aceptados</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading || !termsAccepted}
              loading={isLoading}
              loadingText={AUTH_LABELS.REGISTER.LOADING}
            >
              {AUTH_LABELS.REGISTER.SUBMIT}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-2 text-xs text-[#808080]">
              <span>{AUTH_LABELS.REGISTER.HAVE_ACCOUNT}</span>
              <button
                onClick={onBackToLogin}
                className="text-[#FFB800] hover:text-[#FFA500] font-medium"
              >
                {AUTH_LABELS.REGISTER.LOGIN_LINK}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Terms Modal */}
      <TermsAndConditions
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={handleTermsAccept}
      />
    </div>
  );
};

export default RegisterForm;