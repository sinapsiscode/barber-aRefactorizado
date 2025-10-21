import { useState } from 'react';
import {
  FiCalendar,
  FiMapPin,
  FiInstagram,
  FiArrowRight
} from 'react-icons/fi';
import {
  FaWhatsapp,
  FaTiktok
} from 'react-icons/fa';

const LandingPage = ({ onNavigateToLogin, onNavigateToBooking }) => {
  const [hoveredButton, setHoveredButton] = useState(null);

  const handleReserveClick = () => {
    if (onNavigateToBooking) {
      onNavigateToBooking();
    } else if (onNavigateToLogin) {
      onNavigateToLogin();
    }
  };

  const handleMapClick = () => {
    window.open('https://maps.google.com/?q=Jr. General José María Cordova 2388', '_blank');
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/51999888777?text=Hola! Quiero reservar una cita', '_blank');
  };

  const handleInstagramClick = () => {
    window.open('https://instagram.com/elcirujano_barbershop', '_blank');
  };

  const handleTikTokClick = () => {
    window.open('https://tiktok.com/@elcirujano_barbershop', '_blank');
  };

  const actionButtons = [
    {
      id: 'reserve',
      icon: FiCalendar,
      text: 'Reserva Aquí',
      subtext: 'Calendario',
      onClick: handleReserveClick,
      bgColor: 'from-[#4A90E2] to-[#357ABD]',
      hoverColor: 'from-[#357ABD] to-[#2E6BA8]'
    },
    {
      id: 'map',
      icon: FiMapPin,
      text: 'Mapa',
      subtext: 'Jr. General José María Cordova 2388',
      onClick: handleMapClick,
      bgColor: 'from-[#2C2C2C] to-[#1A1A1A]',
      hoverColor: 'from-[#1A1A1A] to-[#000000]'
    },
    {
      id: 'whatsapp',
      icon: FaWhatsapp,
      text: 'WhatsApp',
      subtext: 'Escríbenos para tu cita',
      onClick: handleWhatsAppClick,
      bgColor: 'from-[#25D366] to-[#1EAA4F]',
      hoverColor: 'from-[#1EAA4F] to-[#128C3A]'
    },
    {
      id: 'instagram',
      icon: FiInstagram,
      text: 'Instagram',
      subtext: '@elcirujano_barbershop',
      onClick: handleInstagramClick,
      bgColor: 'from-[#E4405F] to-[#C73650]',
      hoverColor: 'from-[#C73650] to-[#A02C43]'
    },
    {
      id: 'tiktok',
      icon: FaTiktok,
      text: 'TikTok',
      subtext: '@elcirujano_barbershop',
      onClick: handleTikTokClick,
      bgColor: 'from-[#000000] to-[#2C2C2C]',
      hoverColor: 'from-[#2C2C2C] to-[#1A1A1A]'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0A0A0A]">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{
          backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080">
              <defs>
                <pattern id="barberTools" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse" opacity="0.1">
                  <rect width="200" height="200" fill="#1A1A1A"/>
                  <circle cx="50" cy="50" r="3" fill="#FFB800" opacity="0.3"/>
                  <rect x="90" y="30" width="2" height="40" fill="#FFB800" opacity="0.2"/>
                  <circle cx="150" cy="80" r="2" fill="#FFB800" opacity="0.3"/>
                  <rect x="120" y="120" width="30" height="2" fill="#FFB800" opacity="0.2"/>
                  <circle cx="30" cy="150" r="2.5" fill="#FFB800" opacity="0.3"/>
                  <rect x="160" y="160" width="2" height="25" fill="#FFB800" opacity="0.2"/>
                </pattern>
              </defs>
              <rect width="1920" height="1080" fill="url(#barberTools)"/>
            </svg>
          `)}')`
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A]/90 via-[#1A1A1A]/85 to-[#0A0A0A]/95" />

      {/* Animated Background Elements - responsive positioning */}
      <div className="absolute top-10 left-5 sm:top-20 sm:left-20 w-40 h-40 sm:w-64 sm:h-64 bg-[#FFB800]/5 rounded-full filter blur-[80px] sm:blur-[120px] animate-pulse" />
      <div className="absolute bottom-10 right-5 sm:bottom-20 sm:right-20 w-48 h-48 sm:w-80 sm:h-80 bg-[#FFB800]/3 rounded-full filter blur-[100px] sm:blur-[150px] animate-pulse" />
      <div className="absolute top-1/2 left-1/4 w-20 h-20 sm:w-32 sm:h-32 bg-[#FFB800]/10 rounded-full filter blur-[60px] sm:blur-[80px] animate-bounce" style={{ animationDuration: '3s' }} />

      {/* Login Button - responsive positioning and sizing */}
      <div className="absolute z-20 bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2">
        <button
          onClick={onNavigateToLogin}
          className="flex items-center space-x-1.5 sm:space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#FFB800] to-[#CC9200] text-black text-sm sm:text-base font-semibold rounded-lg hover:from-[#CC9200] to-[#B8820A] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#FFB800]/30"
        >
          <span className="whitespace-nowrap">Descubre el ambiente</span>
          <FiArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Main Content - responsive padding */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-3 sm:px-4 md:px-6 py-6 sm:py-8">

        {/* Logo Section - responsive spacing */}
        <div className="mb-8 sm:mb-10 md:mb-12 text-center">
          {/* Main Logo - responsive sizing */}
          <div className="mb-6 sm:mb-8">
            <img
              src="/logo.png"
              alt="Awaken World University"
              className="h-32 sm:h-40 md:h-48 w-auto mx-auto"
            />
          </div>

          {/* Brand Name - responsive text */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2" style={{ color: '#ffc000' }}>
            AWAKEN WORLD UNIVERSITY
          </h1>
          <div className="text-xs sm:text-sm md:text-base lg:text-lg text-[#B8B8B8] uppercase tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] mb-2 px-2">
            Sistema de Gestión de Barberías
          </div>
          <div className="text-xs sm:text-sm text-[#808080] italic px-2">
            Excelencia en gestión y servicio
          </div>

          {/* Instagram Handle - responsive spacing and sizing */}
          <div className="mt-4 sm:mt-5 md:mt-6 text-[#FFB800] text-base sm:text-lg font-medium">
            @yeison.rich19
          </div>
        </div>

        {/* Action Buttons - responsive container and spacing */}
        <div className="w-full max-w-md space-y-3 sm:space-y-4 px-2 sm:px-0">
          {actionButtons.map((button, index) => {
            const Icon = button.icon;
            const isHovered = hoveredButton === button.id;

            return (
              <button
                key={button.id}
                onClick={button.onClick}
                onMouseEnter={() => setHoveredButton(button.id)}
                onMouseLeave={() => setHoveredButton(null)}
                className={`w-full relative overflow-hidden group py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl border border-white/10 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl backdrop-blur-sm ${
                  isHovered ? 'shadow-2xl' : 'shadow-lg'
                }`}
                style={{
                  background: `linear-gradient(135deg, ${isHovered ? button.hoverColor.split(' ').join(', ') : button.bgColor.split(' ').join(', ')})`
                }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 transform -skew-x-12 bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:animate-pulse" />
                </div>

                {/* Content - responsive spacing */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm transition-transform duration-300 flex-shrink-0 ${
                      isHovered ? 'scale-110' : ''
                    }`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="text-left min-w-0 flex-1">
                      <div className="text-base sm:text-lg font-semibold text-white">
                        {button.text}
                      </div>
                      <div className="text-xs sm:text-sm text-white/70 truncate">
                        {button.subtext}
                      </div>
                    </div>
                  </div>

                  <FiArrowRight className={`h-4 w-4 sm:h-5 sm:w-5 text-white/80 transition-transform duration-300 flex-shrink-0 ml-2 ${
                    isHovered ? 'translate-x-1' : ''
                  }`} />
                </div>

                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 transform transition-transform duration-700 ${
                  isHovered ? 'translate-x-full' : '-translate-x-full'
                }`} />
              </button>
            );
          })}
        </div>

        {/* Footer - responsive spacing and sizing */}
        <div className="mt-8 sm:mt-10 md:mt-12 text-center px-2">
          <div className="text-[#808080] text-xs sm:text-sm mb-1.5 sm:mb-2">
            Experiencia premium en cada corte
          </div>
          <div className="text-[#606060] text-[10px] sm:text-xs">
            © 2024 Barbería Barber Studio
          </div>
        </div>
      </div>

      {/* Floating Elements - hide on very small screens for cleaner mobile view */}
      <div className="hidden sm:block absolute top-1/4 right-1/4 w-2 h-2 bg-[#FFB800] rounded-full animate-ping" />
      <div className="hidden sm:block absolute bottom-1/3 left-1/3 w-1 h-1 bg-[#FFB800] rounded-full animate-pulse" />
      <div className="hidden sm:block absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-[#FFB800] rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
    </div>
  );
};

export default LandingPage;