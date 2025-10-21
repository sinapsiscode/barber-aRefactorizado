import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiScissors, FiCheck, FiArrowLeft, FiMapPin } from 'react-icons/fi';
import { useAuthStore, useBranchStore } from '../../stores';
import TermsAndConditions from './TermsAndConditions';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const RegisterForm = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    preferredBranch: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({});
  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const { register } = useAuthStore();
  const { branches, loadBranches } = useBranchStore();

  // Cargar sedes al montar el componente
  useEffect(() => {
    if (!branches || branches.length === 0) {
      loadBranches();
    }
  }, [branches, loadBranches]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.preferredBranch) {
      MySwal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Por favor completa todos los campos incluyendo tu sede favorita',
        confirmButtonColor: '#FFB800',
        background: '#1A1A1A',
        color: '#FFFFFF'
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      MySwal.fire({
        icon: 'error',
        title: 'Contraseñas no coinciden',
        text: 'Las contraseñas ingresadas no son iguales',
        confirmButtonColor: '#FFB800',
        background: '#1A1A1A',
        color: '#FFFFFF'
      });
      return;
    }

    if (formData.password.length < 6) {
      MySwal.fire({
        icon: 'warning',
        title: 'Contraseña muy corta',
        text: 'La contraseña debe tener al menos 6 caracteres',
        confirmButtonColor: '#FFB800',
        background: '#1A1A1A',
        color: '#FFFFFF'
      });
      return;
    }

    if (!termsAccepted) {
      MySwal.fire({
        icon: 'warning',
        title: 'Términos y Condiciones',
        text: 'Debes aceptar los términos y condiciones para registrarte',
        confirmButtonColor: '#FFB800',
        background: '#1A1A1A',
        color: '#FFFFFF'
      });
      return;
    }

    setIsRegistering(true);

    try {
      // Simular registro (aquí iría la lógica real)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newUser = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: 'client',
        permissions: ['read_own', 'read_portfolio', 'read_appointments', 'write_appointments'],
        avatar: '',
        preferredBranch: parseInt(formData.preferredBranch),
        termsAcceptedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      // Mostrar éxito
      MySwal.fire({
        icon: 'success',
        title: '¡Registro Exitoso!',
        text: `Bienvenido ${formData.name}. Tu cuenta ha sido creada correctamente.`,
        confirmButtonText: 'Iniciar Sesión',
        confirmButtonColor: '#FFB800',
        background: '#1A1A1A',
        color: '#FFFFFF'
      }).then(() => {
        onBackToLogin();
      });

    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Error en el registro',
        text: 'Ocurrió un error al crear tu cuenta. Por favor intenta nuevamente.',
        confirmButtonColor: '#FFB800',
        background: '#1A1A1A',
        color: '#FFFFFF'
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFocus = (field) => {
    setIsFocused({ ...isFocused, [field]: true });
  };

  const handleBlur = (field) => {
    setIsFocused({ ...isFocused, [field]: false });
  };

  const handleTermsAccept = () => {
    setTermsAccepted(true);
    MySwal.fire({
      icon: 'success',
      title: 'Términos Aceptados',
      text: 'Has aceptado los términos y condiciones correctamente',
      timer: 2000,
      showConfirmButton: false,
      background: '#1A1A1A',
      color: '#FFFFFF'
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
              CREAR CUENTA
            </h2>
            <p className="text-[#B8B8B8] text-sm uppercase tracking-widest">
              Únete a la experiencia premium
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name Field */}
            <div>
              <label className="block text-xs font-semibold text-[#B8B8B8] mb-2 uppercase tracking-wider">
                Nombre Completo
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FiUser className={`h-4 w-4 transition-colors duration-200 ${
                    isFocused.name ? 'text-[#FFB800]' : 'text-[#808080]'
                  }`} />
                </div>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => handleFocus('name')}
                  onBlur={() => handleBlur('name')}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#000000] border border-[#FFB800]/20 rounded-lg text-white placeholder-[#808080] text-sm transition-all duration-200 focus:border-[#FFB800] focus:shadow-[0_0_0_3px_rgba(255,184,0,0.1)] hover:border-[#FFB800]/30"
                  placeholder="Tu nombre completo"
                />
                <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent transform transition-transform duration-300 ${
                  isFocused.name ? 'scale-x-100' : 'scale-x-0'
                }`} />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-[#B8B8B8] mb-2 uppercase tracking-wider">
                Correo Electrónico
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FiMail className={`h-4 w-4 transition-colors duration-200 ${
                    isFocused.email ? 'text-[#FFB800]' : 'text-[#808080]'
                  }`} />
                </div>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus('email')}
                  onBlur={() => handleBlur('email')}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#000000] border border-[#FFB800]/20 rounded-lg text-white placeholder-[#808080] text-sm transition-all duration-200 focus:border-[#FFB800] focus:shadow-[0_0_0_3px_rgba(255,184,0,0.1)] hover:border-[#FFB800]/30"
                  placeholder="tu@email.com"
                />
                <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent transform transition-transform duration-300 ${
                  isFocused.email ? 'scale-x-100' : 'scale-x-0'
                }`} />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-xs font-semibold text-[#B8B8B8] mb-2 uppercase tracking-wider">
                Teléfono
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FiPhone className={`h-4 w-4 transition-colors duration-200 ${
                    isFocused.phone ? 'text-[#FFB800]' : 'text-[#808080]'
                  }`} />
                </div>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  onFocus={() => handleFocus('phone')}
                  onBlur={() => handleBlur('phone')}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#000000] border border-[#FFB800]/20 rounded-lg text-white placeholder-[#808080] text-sm transition-all duration-200 focus:border-[#FFB800] focus:shadow-[0_0_0_3px_rgba(255,184,0,0.1)] hover:border-[#FFB800]/30"
                  placeholder="+51 999 888 777"
                />
                <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent transform transition-transform duration-300 ${
                  isFocused.phone ? 'scale-x-100' : 'scale-x-0'
                }`} />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-[#B8B8B8] mb-2 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FiLock className={`h-4 w-4 transition-colors duration-200 ${
                    isFocused.password ? 'text-[#FFB800]' : 'text-[#808080]'
                  }`} />
                </div>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => handleFocus('password')}
                  onBlur={() => handleBlur('password')}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#000000] border border-[#FFB800]/20 rounded-lg text-white placeholder-[#808080] text-sm transition-all duration-200 focus:border-[#FFB800] focus:shadow-[0_0_0_3px_rgba(255,184,0,0.1)] hover:border-[#FFB800]/30"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FiEyeOff className="h-4 w-4 text-[#808080] hover:text-[#FFB800] transition-colors" />
                  ) : (
                    <FiEye className="h-4 w-4 text-[#808080] hover:text-[#FFB800] transition-colors" />
                  )}
                </button>
                <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent transform transition-transform duration-300 ${
                  isFocused.password ? 'scale-x-100' : 'scale-x-0'
                }`} />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-semibold text-[#B8B8B8] mb-2 uppercase tracking-wider">
                Confirmar Contraseña
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FiLock className={`h-4 w-4 transition-colors duration-200 ${
                    isFocused.confirmPassword ? 'text-[#FFB800]' : 'text-[#808080]'
                  }`} />
                </div>
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => handleFocus('confirmPassword')}
                  onBlur={() => handleBlur('confirmPassword')}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#000000] border border-[#FFB800]/20 rounded-lg text-white placeholder-[#808080] text-sm transition-all duration-200 focus:border-[#FFB800] focus:shadow-[0_0_0_3px_rgba(255,184,0,0.1)] hover:border-[#FFB800]/30"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="h-4 w-4 text-[#808080] hover:text-[#FFB800] transition-colors" />
                  ) : (
                    <FiEye className="h-4 w-4 text-[#808080] hover:text-[#FFB800] transition-colors" />
                  )}
                </button>
                <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent transform transition-transform duration-300 ${
                  isFocused.confirmPassword ? 'scale-x-100' : 'scale-x-0'
                }`} />
              </div>
            </div>

            {/* Preferred Branch Field */}
            <div>
              <label className="block text-xs font-semibold text-[#B8B8B8] mb-2 uppercase tracking-wider">
                Sede Favorita
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FiMapPin className={`h-4 w-4 transition-colors duration-200 ${
                    isFocused.preferredBranch ? 'text-[#FFB800]' : 'text-[#808080]'
                  }`} />
                </div>
                <select
                  name="preferredBranch"
                  value={formData.preferredBranch}
                  onChange={handleChange}
                  onFocus={() => handleFocus('preferredBranch')}
                  onBlur={() => handleBlur('preferredBranch')}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#000000] border border-[#FFB800]/20 rounded-lg text-white text-sm transition-all duration-200 focus:border-[#FFB800] focus:shadow-[0_0_0_3px_rgba(255,184,0,0.1)] hover:border-[#FFB800]/30 appearance-none"
                >
                  <option value="" className="bg-[#1A1A1A] text-[#808080]">
                    Selecciona tu sede favorita
                  </option>
                  {branches?.map((branch) => (
                    <option key={branch.id} value={branch.id} className="bg-[#1A1A1A] text-white">
                      {branch.name} - {branch.city}
                    </option>
                  ))}
                </select>
                <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent transform transition-transform duration-300 ${
                  isFocused.preferredBranch ? 'scale-x-100' : 'scale-x-0'
                }`} />
              </div>
            </div>

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

            <button
              type="submit"
              disabled={isRegistering || !termsAccepted}
              className="w-full relative overflow-hidden group py-3 bg-gradient-to-r from-[#FFB800] to-[#FFA500] text-black font-bold uppercase tracking-wider rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-[#FFB800]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
            >
              <span className="relative z-10 flex items-center justify-center">
                {isRegistering ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Creando Cuenta...
                  </>
                ) : (
                  'Crear Cuenta'
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFA500] to-[#FFB800] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-2 text-xs text-[#808080]">
              <span>¿Ya tienes cuenta?</span>
              <button
                onClick={onBackToLogin}
                className="text-[#FFB800] hover:text-[#FFA500] font-medium"
              >
                Iniciar Sesión
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