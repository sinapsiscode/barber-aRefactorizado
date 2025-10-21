import { useState } from 'react';
import { FiUser, FiLock, FiEye, FiEyeOff, FiScissors, FiMail } from 'react-icons/fi';
import { useAuthStore } from '../../stores';
import RegisterForm from './RegisterForm';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login, isLoading } = useAuthStore();

  // Si está mostrando registro, renderizar RegisterForm
  if (showRegister) {
    return <RegisterForm onBackToLogin={() => setShowRegister(false)} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      MySwal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Por favor ingresa tu email y contraseña',
        confirmButtonColor: '#FFB800',
        background: '#1A1A1A',
        color: '#FFFFFF'
      });
      return;
    }

    const result = await login(credentials);
    
    if (result.success) {
      MySwal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: `Hola ${result.user.name}`,
        timer: 2000,
        showConfirmButton: false,
        background: '#1A1A1A',
        color: '#FFFFFF'
      });
    } else {
      MySwal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: result.error,
        confirmButtonColor: '#FFB800',
        background: '#1A1A1A',
        color: '#FFFFFF'
      });
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const demoCredentials = [
    { role: 'Super Admin', email: 'admin@barberia.com', password: 'admin123', icon: '👑' },
    { role: 'Admin Sede Lima', email: 'admin.lima@barberia.com', password: 'admin123', icon: '🏢' },
    { role: 'Recepción', email: 'recepcion@barberia.com', password: 'recepcion123', icon: '📋' },
    { role: 'Barbero', email: 'barbero@barberia.com', password: 'barbero123', icon: '✂️' },
    { role: 'Cliente', email: 'cliente@barberia.com', password: 'cliente123', icon: '👤' }
  ];

  const fillDemoCredentials = (email, password) => {
    setCredentials({ email, password });
  };

  const handleForgotPassword = async () => {
    const { value: email } = await MySwal.fire({
      title: 'Recuperar Contraseña',
      html: `
        <div class="text-left">
          <p class="text-[#B8B8B8] mb-4">Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
        </div>
      `,
      input: 'email',
      inputPlaceholder: 'tu@email.com',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#FFB800',
      cancelButtonColor: '#808080',
      background: '#1A1A1A',
      color: '#FFFFFF',
      inputValidator: (value) => {
        if (!value) {
          return 'Por favor ingresa tu correo electrónico';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Por favor ingresa un correo electrónico válido';
        }
      }
    });

    if (email) {
      // Simular envío de correo (solo frontend)
      await MySwal.fire({
        icon: 'success',
        title: '¡Correo Enviado!',
        html: `
          <div class="text-left">
            <p class="text-[#B8B8B8] mb-2">Se ha enviado un enlace de recuperación a:</p>
            <p class="text-[#FFB800] font-semibold mb-4">${email}</p>
            <p class="text-[#808080] text-sm">Por favor revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.</p>
          </div>
        `,
        confirmButtonColor: '#FFB800',
        background: '#1A1A1A',
        color: '#FFFFFF'
      });
    }
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
            <div className="mb-6">
              <img
                src="/logo.png"
                alt="Awaken World University"
                className="h-40 w-auto mx-auto"
              />
            </div>
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#ffc000' }}>
              AWAKEN WORLD UNIVERSITY
            </h2>
            <p className="text-[#B8B8B8] text-sm uppercase tracking-widest">
              Sistema de Gestión de Barberías
            </p>
          </div>

          {/* Premium Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-[#B8B8B8] mb-2 uppercase tracking-wider">
                Correo Electrónico
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FiUser className={`h-5 w-5 transition-colors duration-200 ${
                    isFocused.email ? 'text-[#FFB800]' : 'text-[#808080]'
                  }`} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={credentials.email}
                  onChange={handleChange}
                  onFocus={() => setIsFocused({ ...isFocused, email: true })}
                  onBlur={() => setIsFocused({ ...isFocused, email: false })}
                  className="w-full pl-10 pr-4 py-3 bg-[#000000] border border-[#FFB800]/20 rounded-lg text-white placeholder-[#808080] transition-all duration-200 focus:border-[#FFB800] focus:shadow-[0_0_0_3px_rgba(255,184,0,0.1)] hover:border-[#FFB800]/30"
                  placeholder="tu@email.com"
                />
                <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent transform transition-transform duration-300 ${
                  isFocused.email ? 'scale-x-100' : 'scale-x-0'
                }`} />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-[#B8B8B8] mb-2 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FiLock className={`h-5 w-5 transition-colors duration-200 ${
                    isFocused.password ? 'text-[#FFB800]' : 'text-[#808080]'
                  }`} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={handleChange}
                  onFocus={() => setIsFocused({ ...isFocused, password: true })}
                  onBlur={() => setIsFocused({ ...isFocused, password: false })}
                  className="w-full pl-10 pr-10 py-3 bg-[#000000] border border-[#FFB800]/20 rounded-lg text-white placeholder-[#808080] transition-all duration-200 focus:border-[#FFB800] focus:shadow-[0_0_0_3px_rgba(255,184,0,0.1)] hover:border-[#FFB800]/30"
                  placeholder="••••••••"
                />
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
                <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent transform transition-transform duration-300 ${
                  isFocused.password ? 'scale-x-100' : 'scale-x-0'
                }`} />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative overflow-hidden group py-4 bg-gradient-to-r from-[#FFB800] to-[#FFA500] text-black font-bold uppercase tracking-wider rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-[#FFB800]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span className="relative z-10 flex items-center justify-center">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                ) : (
                  'Iniciar Sesión'
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFA500] to-[#FFB800] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <button
              onClick={handleForgotPassword}
              className="text-[#B8B8B8] hover:text-[#FFB800] text-sm transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
            >
              <FiMail className="w-4 h-4" />
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Premium Demo Credentials */}
          <div className="mt-8 p-4 bg-[#000000] rounded-xl border border-[#FFB800]/10">
            <h3 className="text-xs font-semibold text-[#B8B8B8] mb-4 uppercase tracking-wider text-center">
              Accesos Rápidos de Demostración
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {demoCredentials.map((demo, index) => (
                <button
                  key={index}
                  onClick={() => fillDemoCredentials(demo.email, demo.password)}
                  className="group flex items-center justify-between p-3 bg-gradient-to-r from-[#1A1A1A] to-[#0A0A0A] rounded-lg border border-[#FFB800]/10 hover:border-[#FFB800]/30 transition-all duration-200 hover:shadow-md hover:shadow-[#FFB800]/10"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{demo.icon}</span>
                    <div className="text-left">
                      <div className="font-semibold text-white text-sm">{demo.role}</div>
                      <div className="text-[#808080] text-xs">{demo.email}</div>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-[#FFB800] text-xs">Usar →</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Premium Footer */}
          <div className="mt-8 text-center space-y-4">
            {/* Opción de registro */}
            <div className="flex items-center justify-center space-x-2 text-sm">
              <span className="text-[#B8B8B8]">¿No tienes cuenta?</span>
              <button
                onClick={() => setShowRegister(true)}
                className="text-[#FFB800] hover:text-[#FFA500] font-semibold transition-colors duration-200"
              >
                Regístrate aquí
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