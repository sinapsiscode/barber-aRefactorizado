import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiClock, FiCalendar, FiPhone, FiArrowLeft, FiArrowRight, FiUser, FiMail, FiMapPin } from 'react-icons/fi';
import Swal from 'sweetalert2';

const PublicBooking = ({ onBackToLanding }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    correo: '',
    telefono: '',
    distrito: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [otherService, setOtherService] = useState(false);
  const [otherServiceText, setOtherServiceText] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Lista de servicios disponibles
  const availableServices = [
    { id: 1, name: 'Corte con Asesoría', price: 70, duration: 30, icon: '✂️' },
    { id: 2, name: 'Semi Ondulación', price: 155, duration: 45, icon: '🌊' },
    { id: 3, name: 'Platinado', price: 110, duration: 90, icon: '✨', description: '(Decoloración) y S/ 90 (Tinte)' },
    { id: 4, name: 'Rayitos / Mechas', price: 220, duration: 120, icon: '💫' },
    { id: 5, name: 'Botox', price: 120, duration: 60, icon: '💆' },
    { id: 6, name: 'Laceado', price: 130, duration: 90, icon: '💇' },
    { id: 7, name: 'Facial', price: 60, duration: 45, icon: '🧖' }
  ];

  // Lista de distritos
  const distritos = [
    'Ate', 'Barranco', 'Breña', 'Cercado de Lima', 'Chorrillos', 'Comas',
    'El Agustino', 'Independencia', 'Jesús María', 'La Molina', 'La Victoria',
    'Lince', 'Los Olivos', 'Magdalena del Mar', 'Miraflores', 'Pueblo Libre',
    'Puente Piedra', 'Rímac', 'San Borja', 'San Isidro', 'San Juan de Lurigancho',
    'San Juan de Miraflores', 'San Luis', 'San Martín de Porres', 'San Miguel',
    'Santa Anita', 'Santiago de Surco', 'Surquillo', 'Villa El Salvador',
    'Villa María del Triunfo'
  ];

  // Obtener días del mes actual
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDay = new Date(startDate);

    while (currentDay <= lastDay || days.length % 7 !== 0) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  };

  // Formatear mes y año
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric'
    });
  };

  // Formatear fecha seleccionada
  const formatSelectedDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Navegar meses
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Horarios disponibles
  const availableTimes = [
    '10:20 AM',
    '10:40 AM',
    '05:20 PM',
    '06:00 PM',
    '06:20 PM',
    '06:40 PM'
  ];

  // Días de la semana
  const weekDays = ['Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.', 'Dom.'];

  const days = getDaysInMonth(currentDate);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset time selection
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const isDateSelected = (date) => {
    return selectedDate.toDateString() === date.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const handleBooking = () => {
    if (selectedTime) {
      setCurrentStep(2);
    } else {
      Swal.fire('Error', 'Por favor selecciona una hora', 'error');
    }
  };

  const handleServiceToggle = (service) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.id === service.id);
      if (exists) {
        return prev.filter(s => s.id !== service.id);
      }
      return [...prev, service];
    });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.nombre.trim()) errors.nombre = 'Nombre es requerido';
    if (!formData.apellido.trim()) errors.apellido = 'Apellido es requerido';
    if (!formData.dni.trim()) {
      errors.dni = 'DNI es requerido';
    } else if (!/^\d{8}$/.test(formData.dni)) {
      errors.dni = 'DNI debe tener 8 dígitos';
    }
    if (!formData.correo.trim()) {
      errors.correo = 'Correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      errors.correo = 'Correo inválido';
    }
    if (!formData.telefono.trim()) {
      errors.telefono = 'Teléfono es requerido';
    } else if (!/^9\d{8}$/.test(formData.telefono)) {
      errors.telefono = 'Teléfono debe empezar con 9 y tener 9 dígitos';
    }
    if (!formData.distrito) errors.distrito = 'Distrito es requerido';
    if (selectedServices.length === 0 && !otherService) errors.services = 'Selecciona al menos un servicio';
    if (otherService && !otherServiceText.trim()) errors.services = 'Especifica el servicio adicional';
    if (!acceptTerms) errors.terms = 'Debes aceptar los términos y condiciones';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmitBooking = () => {
    if (validateForm()) {
      const total = selectedServices.reduce((sum, service) => sum + service.price, 0);
      const servicesList = [
        ...selectedServices.map(s => s.name),
        ...(otherService && otherServiceText ? [`OTROS: ${otherServiceText}`] : [])
      ].join(', ');

      // Construir el mensaje para WhatsApp
      const whatsappMessage = `*NUEVA RESERVA DE BARBERÍA*\n\n` +
        `👤 *Cliente:* ${formData.nombre} ${formData.apellido}\n` +
        `📱 *DNI:* ${formData.dni}\n` +
        `📧 *Correo:* ${formData.correo}\n` +
        `📞 *Teléfono:* ${formData.telefono}\n` +
        `📍 *Distrito:* ${formData.distrito}\n\n` +
        `📅 *Fecha:* ${formatSelectedDate(selectedDate)}\n` +
        `⏰ *Hora:* ${selectedTime}\n` +
        `✂️ *Servicios:* ${servicesList}\n` +
        `⏱️ *Duración total:* ${getTotalDuration()} minutos\n\n` +
        `💰 *Total a pagar:* S/ ${total}\n` +
        `💵 *Adelanto (50%):* S/ ${total/2}\n\n` +
        `✅ El cliente ha aceptado los términos y condiciones.\n\n` +
        `_Enviado desde el sistema de reservas online_`;

      // Número de WhatsApp (el número que pusiste en el registro)
      const whatsappNumber = '51961170946'; // Número del Perú sin el +

      // Codificar el mensaje para la URL
      const encodedMessage = encodeURIComponent(whatsappMessage);

      // Crear el enlace de WhatsApp
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      Swal.fire({
        title: 'Reserva Confirmada',
        html: `
          <div class="text-left">
            <p><strong>Cliente:</strong> ${formData.nombre} ${formData.apellido}</p>
            <p><strong>Fecha:</strong> ${formatSelectedDate(selectedDate)}</p>
            <p><strong>Hora:</strong> ${selectedTime}</p>
            <p><strong>Servicios:</strong> ${servicesList}</p>
            <p><strong>Total:</strong> S/ ${total}</p>
            <p class="mt-4 text-sm text-gray-600">Recuerda enviar el adelanto del 50% (S/ ${total/2}) por YAPE/PLIN: 916 919 552</p>
            <p class="mt-4 text-center">
              <strong>La información de tu reserva se enviará por WhatsApp</strong>
            </p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Enviar por WhatsApp',
        confirmButtonColor: '#25D366',
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
        cancelButtonColor: '#6B7280'
      }).then((result) => {
        if (result.isConfirmed) {
          // Abrir WhatsApp en una nueva pestaña
          window.open(whatsappUrl, '_blank');

          // Opcionalmente, limpiar el formulario después de enviar
          setTimeout(() => {
            // Resetear el formulario si quieres
            setCurrentStep(1);
            setSelectedServices([]);
            setOtherService(false);
            setOtherServiceText('');
            setAcceptTerms(false);
            setFormData({
              nombre: '',
              apellido: '',
              dni: '',
              correo: '',
              telefono: '',
              distrito: ''
            });
          }, 1000);
        }
      });
    }
  };

  const getTotalPrice = () => {
    return selectedServices.reduce((sum, service) => sum + service.price, 0);
  };

  const getTotalDuration = () => {
    return selectedServices.reduce((sum, service) => sum + service.duration, 0);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full">

        {/* Header con Logo */}
        <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Botón de navegación entre pasos */}
            {currentStep === 2 && (
              <button
                onClick={() => setCurrentStep(1)}
                className="text-blue-600 hover:text-blue-700"
              >
                <FiArrowLeft className="h-5 w-5" />
              </button>
            )}
            {/* Logo El Cirujano */}
            <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">EC</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">BARBERÍA</h1>
              <p className="text-xs text-gray-500 uppercase tracking-wide">BARBER STUDIO</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Indicador de pasos */}
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                1
              </div>
              <div className={`w-12 h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
            </div>

            {onBackToLanding && (
              <button
                onClick={onBackToLanding}
                className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md text-sm"
              >
                ← Volver
              </button>
            )}
          </div>
        </div>

        {/* Contenido Condicional según el paso */}
        {currentStep === 1 ? (
          // Paso 1: Selección de fecha y hora
          <div className="flex flex-col lg:flex-row">

            {/* Panel Izquierdo - Información y Calendario */}
            <div className="lg:w-2/3 p-6">

            {/* Título Principal */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">RESERVA AQUÍ</h2>

              {/* Duración del servicio */}
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <FiClock className="w-4 h-4" />
                <span className="font-medium">{getTotalDuration()} Min</span>
              </div>

              {/* Fecha seleccionada */}
              <div className="flex items-center space-x-2 text-gray-600 mb-4">
                <FiCalendar className="w-4 h-4" />
                <span className="font-medium">{formatSelectedDate(selectedDate)}</span>
              </div>
            </div>

            {/* Información de contacto */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700 leading-relaxed">
                Recuerda que para asegurar tu reserva tienes que enviar un{' '}
                <span className="font-semibold text-blue-600">adelanto del 50% del servicio</span>{' '}
                que deseas realizar dentro de los primeros 30 minutos.{' '}
                <span className="font-semibold">YAPE O PLIN: 916 919 552</span> - Yeison Junior Peralta Chuchon
              </p>
            </div>

            {/* Título del Calendario */}
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Seleccione la Fecha & Hora</h3>

            {/* Navegación del Calendario */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              <h4 className="text-lg font-semibold text-gray-800 capitalize">
                {formatMonthYear(currentDate)}
              </h4>

              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Calendario */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((date, index) => {
                const isSelected = isDateSelected(date);
                const isCurrentMonthDate = isCurrentMonth(date);
                const isToday = date.toDateString() === new Date().toDateString();

                return (
                  <button
                    key={index}
                    onClick={() => handleDateSelect(date)}
                    disabled={!isCurrentMonthDate || date < new Date().setHours(0,0,0,0)}
                    className={`
                      p-3 text-center text-sm rounded-lg transition-all duration-200
                      ${isSelected
                        ? 'bg-blue-500 text-white font-semibold shadow-lg'
                        : isCurrentMonthDate
                          ? 'hover:bg-blue-50 text-gray-700'
                          : 'text-gray-300 cursor-not-allowed'
                      }
                      ${isToday && !isSelected ? 'bg-blue-100 text-blue-600 font-semibold' : ''}
                    `}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel Derecho - Horarios */}
          <div className="lg:w-1/3 bg-gray-50 p-6 border-l">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Horarios Disponibles</h3>

            <div className="space-y-3">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`
                    w-full p-3 rounded-lg text-left transition-all duration-200 border
                    ${selectedTime === time
                      ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }
                  `}
                >
                  <span className="font-medium">{time}</span>
                </button>
              ))}
            </div>

            {/* Botón de Reserva */}
            <div className="mt-8">
              <button
                onClick={handleBooking}
                disabled={!selectedTime}
                className={`
                  w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200
                  ${selectedTime
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                {selectedTime ? 'Confirmar Reserva' : 'Selecciona una hora'}
              </button>
            </div>

            {/* Información de contacto adicional */}
            <div className="mt-6 p-4 bg-white rounded-lg border">
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <FiPhone className="w-4 h-4" />
                <span className="text-sm font-medium">Contacto</span>
              </div>
              <p className="text-sm text-gray-700">
                YAPE/PLIN: <span className="font-semibold">916 919 552</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Yeison Junior Peralta Chuchon
              </p>
            </div>
          </div>
        </div>
        ) : (
          // Paso 2: Formulario de información del cliente
          <div className="p-6">
            <div className="max-w-3xl mx-auto">
              {/* Título del formulario */}
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Introducir información</h2>
                <h3 className="text-xl font-semibold text-gray-700">Ingrese su información</h3>
              </div>

              {/* Información de la reserva */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <FiCalendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Fecha y hora seleccionada:</p>
                      <p className="font-semibold text-gray-800">
                        {formatSelectedDate(selectedDate)} a las {selectedTime}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Duración total:</p>
                    <p className="font-semibold text-gray-800">
                      {getTotalDuration() || 20} Min
                    </p>
                  </div>
                </div>
              </div>

              {/* Formulario */}
              <div className="space-y-6">
                {/* Fila 1: Nombre y Apellido */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => handleFormChange('nombre', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.nombre ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ingrese su nombre"
                    />
                    {formErrors.nombre && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.nombre}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      value={formData.apellido}
                      onChange={(e) => handleFormChange('apellido', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.apellido ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ingrese su apellido"
                    />
                    {formErrors.apellido && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.apellido}</p>
                    )}
                  </div>
                </div>

                {/* Fila 2: DNI y Correo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      DNI *
                    </label>
                    <input
                      type="text"
                      value={formData.dni}
                      onChange={(e) => handleFormChange('dni', e.target.value.replace(/\D/g, '').slice(0, 8))}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.dni ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="DNI"
                      maxLength="8"
                    />
                    {formErrors.dni && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.dni}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      value={formData.correo}
                      onChange={(e) => handleFormChange('correo', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.correo ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="correo@ejemplo.com"
                    />
                    {formErrors.correo && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.correo}</p>
                    )}
                  </div>
                </div>

                {/* Fila 3: Teléfono y Distrito */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 5 3'%3E%3Crect width='5' height='1' fill='%23ef3340'/%3E%3Crect y='2' width='5' height='1' fill='%23ef3340'/%3E%3C/svg%3E" alt="Peru" className="h-4 w-6 mr-2" />
                        +51
                      </span>
                      <input
                        type="tel"
                        value={formData.telefono}
                        onChange={(e) => handleFormChange('telefono', e.target.value.replace(/\D/g, '').slice(0, 9))}
                        className={`w-full px-4 py-2 border rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.telefono ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="987654321"
                        maxLength="9"
                      />
                    </div>
                    {formErrors.telefono && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.telefono}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Distrito *
                    </label>
                    <select
                      value={formData.distrito}
                      onChange={(e) => handleFormChange('distrito', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.distrito ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Seleccione un distrito</option>
                      {distritos.map((distrito) => (
                        <option key={distrito} value={distrito}>
                          {distrito}
                        </option>
                      ))}
                    </select>
                    {formErrors.distrito && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.distrito}</p>
                    )}
                  </div>
                </div>

                {/* Sección de servicios */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Servicios a realizarse
                  </label>
                  <div className="space-y-3 border border-gray-200 rounded-lg p-4">
                    {availableServices.map((service) => (
                      <label
                        key={service.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedServices.some(s => s.id === service.id)}
                            onChange={() => handleServiceToggle(service)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div className="ml-3 flex items-center space-x-2">
                            <span className="text-2xl">{service.icon}</span>
                            <span className="font-medium text-gray-700">
                              {service.name}:
                              {service.description && <span className="text-sm text-gray-500 ml-1">{service.description}</span>}
                            </span>
                            <span className="text-gray-600">S/ {service.price}</span>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{service.duration} min</span>
                      </label>
                    ))}

                    {/* Checkbox OTROS */}
                    <div className="p-3 border border-gray-200 rounded-lg">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={otherService}
                          onChange={(e) => setOtherService(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 font-medium text-gray-700">OTROS</span>
                      </label>
                      {otherService && (
                        <input
                          type="text"
                          value={otherServiceText}
                          onChange={(e) => setOtherServiceText(e.target.value)}
                          placeholder="Especifica el servicio..."
                          className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    </div>
                  </div>
                  {formErrors.services && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.services}</p>
                  )}
                </div>

                {/* Checkbox de Términos y Condiciones */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      He leído y acepto los <span className="font-semibold">Términos y Condiciones</span> y confirmo que deseo recibir contenido de esta empresa utilizando la información de contacto que proporcione.
                    </span>
                  </label>
                  {formErrors.terms && (
                    <p className="mt-2 text-sm text-red-500">{formErrors.terms}</p>
                  )}
                </div>

                {/* Total y botón de envío */}
                <div className="border-t pt-6 mt-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">Total a pagar:</p>
                      <p className="text-sm text-gray-600">Adelanto requerido (50%): S/ {getTotalPrice() / 2}</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">S/ {getTotalPrice()}</p>
                  </div>

                  <button
                    onClick={handleSubmitBooking}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>Programar Reunión</span>
                    <FiArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicBooking;