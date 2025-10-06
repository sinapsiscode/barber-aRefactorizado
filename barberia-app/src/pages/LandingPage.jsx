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

      {/* Animated Background Elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-[#FFB800]/5 rounded-full filter blur-[120px] animate-pulse" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#FFB800]/3 rounded-full filter blur-[150px] animate-pulse" />
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-[#FFB800]/10 rounded-full filter blur-[80px] animate-bounce" style={{ animationDuration: '3s' }} />

      {/* Login Button */}
      <div className="absolute z-20 bottom-6 left-1/2 transform -translate-x-1/2">
        <button
          onClick={onNavigateToLogin}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#FFB800] to-[#CC9200] text-black font-semibold rounded-lg hover:from-[#CC9200] to-[#B8820A] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#FFB800]/30"
        >
          <span>Descubre el ambiente</span>
          <FiArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">

        {/* Logo Section */}
        <div className="mb-12 text-center">
          {/* Main Logo */}
          <div className="relative inline-block mb-6">
            <div className="h-32 w-32 bg-gradient-to-br from-[#FFB800] to-[#CC9200] rounded-full flex items-center justify-center mx-auto transform rotate-3 shadow-2xl shadow-[#FFB800]/50">
              <div className="text-4xl font-bold text-black">EC</div>
            </div>
            <div className="absolute -inset-4 bg-[#FFB800]/20 rounded-full blur-xl animate-pulse" />
          </div>

          {/* Brand Name */}
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] to-[#FFA500] mb-4">
            BARBER STUDIO
          </h1>
          <div className="text-lg md:text-xl text-[#B8B8B8] uppercase tracking-[0.3em] mb-2">
            BARBER STUDIO
          </div>
          <div className="text-sm text-[#808080] italic">
            Maestros del arte del corte
          </div>

          {/* Instagram Handle */}
          <div className="mt-6 text-[#FFB800] text-lg font-medium">
            @yeison.rich19
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-md space-y-4">
          {actionButtons.map((button, index) => {
            const Icon = button.icon;
            const isHovered = hoveredButton === button.id;

            return (
              <button
                key={button.id}
                onClick={button.onClick}
                onMouseEnter={() => setHoveredButton(button.id)}
                onMouseLeave={() => setHoveredButton(null)}
                className={`w-full relative overflow-hidden group py-4 px-6 rounded-2xl border border-white/10 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl backdrop-blur-sm ${
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

                {/* Content */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-white/10 backdrop-blur-sm transition-transform duration-300 ${
                      isHovered ? 'scale-110' : ''
                    }`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-semibold text-white">
                        {button.text}
                      </div>
                      <div className="text-sm text-white/70">
                        {button.subtext}
                      </div>
                    </div>
                  </div>

                  <FiArrowRight className={`h-5 w-5 text-white/80 transition-transform duration-300 ${
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

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="text-[#808080] text-sm mb-2">
            Experiencia premium en cada corte
          </div>
          <div className="text-[#606060] text-xs">
            © 2024 Barbería Barber Studio
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-[#FFB800] rounded-full animate-ping" />
      <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-[#FFB800] rounded-full animate-pulse" />
      <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-[#FFB800] rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
    </div>
  );
};

export default LandingPage;