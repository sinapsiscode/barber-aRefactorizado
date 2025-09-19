import React, { useState } from 'react';
import { FiUser, FiLock, FiScissors } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { AUTH_LABELS, AUTH_PLACEHOLDERS } from '../../constants/auth';
import AuthInput from './AuthInput';
import DemoCredentials from './DemoCredentials';
import RegisterForm from './RegisterForm';
import { Button } from '../common';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showRegister, setShowRegister] = useState(false);
  const { handleLogin, isLoading, errors, clearFieldError } = useAuth();

  // Si está mostrando registro, renderizar RegisterForm
  if (showRegister) {
    return <RegisterForm onBackToLogin={() => setShowRegister(false)} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(credentials);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      clearFieldError(name);
    }
  };


  const fillDemoCredentials = (email, password) => {
    setCredentials({ email, password });
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
          <div className="text-center mb-10">
            <div className="relative inline-block mb-6">
              <div className="h-24 w-24 bg-gradient-to-br from-[#FFB800] to-[#CC9200] rounded-2xl flex items-center justify-center mx-auto transform rotate-3 shadow-2xl shadow-[#FFB800]/30">
                <FiScissors className="h-12 w-12 text-black transform -rotate-45" />
              </div>
              <div className="absolute -inset-2 bg-[#FFB800]/20 rounded-2xl blur-xl animate-pulse" />
            </div>
            <h2 className="text-4xl font-bold gradient-text mb-2">
              {AUTH_LABELS.LOGIN.TITLE}
            </h2>
            <p className="text-[#B8B8B8] text-sm uppercase tracking-widest">
              {AUTH_LABELS.LOGIN.SUBTITLE}
            </p>
          </div>

          {/* Premium Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <AuthInput
              label={AUTH_LABELS.LOGIN.EMAIL}
              name="email"
              type="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder={AUTH_PLACEHOLDERS.EMAIL}
              icon={FiUser}
              error={errors.email}
              required
            />

            <AuthInput
              label={AUTH_LABELS.LOGIN.PASSWORD}
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder={AUTH_PLACEHOLDERS.PASSWORD}
              icon={FiLock}
              error={errors.password}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              loading={isLoading}
              className="w-full py-4 bg-gradient-to-r from-[#FFB800] to-[#FFA500] text-black font-bold uppercase tracking-wider hover:scale-[1.02] hover:shadow-lg hover:shadow-[#FFB800]/30"
            >
              {isLoading ? AUTH_LABELS.LOGIN.LOADING : AUTH_LABELS.LOGIN.SUBMIT}
            </Button>
          </form>

          {/* Premium Demo Credentials */}
          <DemoCredentials onCredentialSelect={fillDemoCredentials} />

          {/* Premium Footer */}
          <div className="mt-8 text-center space-y-4">
            {/* Opción de registro */}
            <div className="flex items-center justify-center space-x-2 text-sm">
              <span className="text-[#B8B8B8]">{AUTH_LABELS.LOGIN.NO_ACCOUNT}</span>
              <button
                onClick={() => setShowRegister(true)}
                className="text-[#FFB800] hover:text-[#FFA500] font-semibold transition-colors duration-200"
              >
                {AUTH_LABELS.LOGIN.REGISTER_LINK}
              </button>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-xs text-[#808080]">
              <span>© 2024</span>
              <span className="text-[#FFB800]">•</span>
              <span>Barbería Premium</span>
              <span className="text-[#FFB800]">•</span>
              <span>Todos los derechos reservados</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;